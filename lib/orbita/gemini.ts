import { runTool, toolLineFor, TOOLS } from "./tools";
import type { ChatLocale, OrbitaStreamEvent } from "./protocol";

/**
 * Gemini engine for the visitor chat (Google AI Studio key, GEMINI_API_KEY). Same contract as the
 * Claude path in app/api/orbita/chat/route.ts: same system prompt, same four tools, same NDJSON
 * events. Talks to the REST API directly (streamGenerateContent, SSE), so no extra dependency.
 */

export const DEFAULT_GEMINI_MODEL = "gemini-flash-latest";
const API = "https://generativelanguage.googleapis.com/v1beta/models";

type Part = {
  text?: string;
  thought?: boolean;
  functionCall?: { name: string; args?: Record<string, unknown>; id?: string };
  functionResponse?: { name: string; response: Record<string, unknown>; id?: string };
  thoughtSignature?: string;
};
type Content = { role: "user" | "model"; parts: Part[] };

export class GeminiError extends Error {
  constructor(readonly status: number) {
    super(`gemini ${status}`);
  }
}

/** JSON Schema → the OpenAPI subset Gemini accepts (no additionalProperties). */
function toGeminiSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(toGeminiSchema);
  if (!schema || typeof schema !== "object") return schema;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(schema)) {
    if (k === "additionalProperties" || k === "$schema") continue;
    out[k] = toGeminiSchema(v);
  }
  // an object with no properties must be declared without "properties" for some Gemini models
  if (out.type === "object" && out.properties && Object.keys(out.properties as object).length === 0) delete out.properties;
  return out;
}

const FUNCTIONS = TOOLS.map((t) => ({
  name: t.name,
  description: t.description,
  ...(t.input_schema.properties && Object.keys(t.input_schema.properties).length
    ? { parameters: toGeminiSchema(t.input_schema) }
    : {}),
}));

export function geminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export async function runGemini(opts: {
  apiKey: string;
  system: string[];
  history: { role: "user" | "assistant"; content: string }[];
  locale: ChatLocale;
  maxToolRounds: number;
  maxTokens: number;
  signal: AbortSignal;
  send: (ev: OrbitaStreamEvent) => void;
}): Promise<void> {
  const contents: Content[] = [];
  for (const m of opts.history) {
    const role = m.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];
    if (last && last.role === role && last.parts.length === 1 && last.parts[0].text !== undefined) last.parts[0].text += `\n\n${m.content}`;
    else contents.push({ role, parts: [{ text: m.content }] });
  }

  for (let round = 0; round < opts.maxToolRounds; round++) {
    const res = await fetch(`${API}/${encodeURIComponent(geminiModel())}:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": opts.apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: opts.system.map((text) => ({ text })) },
        contents,
        tools: [{ functionDeclarations: FUNCTIONS }],
        generationConfig: { maxOutputTokens: opts.maxTokens, temperature: 0.6 },
      }),
      signal: opts.signal,
    });
    if (!res.ok || !res.body) throw new GeminiError(res.status);

    // read the SSE stream; text streams to the visitor, every part is kept verbatim for the next turn
    const parts: Part[] = [];
    let finish = "";
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line.startsWith("data:")) continue;
        let chunk: { candidates?: { content?: { parts?: Part[] }; finishReason?: string }[]; promptFeedback?: { blockReason?: string } };
        try {
          chunk = JSON.parse(line.slice(5));
        } catch {
          continue;
        }
        if (chunk.promptFeedback?.blockReason) finish = "SAFETY";
        const cand = chunk.candidates?.[0];
        if (cand?.finishReason) finish = cand.finishReason;
        for (const p of cand?.content?.parts ?? []) {
          parts.push(p);
          if (p.text && !p.thought) opts.send({ type: "text", delta: p.text });
        }
      }
    }

    if (["SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST", "SPII"].includes(finish)) {
      opts.send({ type: "error", code: "refused" });
      return;
    }
    const calls = parts.filter((p) => p.functionCall);
    if (!calls.length || finish === "MAX_TOKENS") return;

    contents.push({ role: "model", parts });
    const responses: Part[] = [];
    for (const c of calls) {
      const call = c.functionCall!;
      const id = call.id ?? `${call.name}-${round}-${responses.length}`;
      const line = toolLineFor(call.name);
      if (line) opts.send({ type: "tool", id, tool: line, status: "running" });
      const o = await runTool(call.name, call.args ?? {}, opts.locale);
      const shown = o.line ?? line;
      if (shown) opts.send({ type: "tool", id, tool: shown, status: o.isError ? "error" : "done" });
      if (o.ui) opts.send({ type: "ui", ui: o.ui });
      let response: Record<string, unknown>;
      try {
        const parsed = JSON.parse(o.content);
        response = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : { result: parsed };
      } catch {
        response = { result: o.content };
      }
      if (o.isError) response = { error: response };
      responses.push({ functionResponse: { name: call.name, response, ...(call.id ? { id: call.id } : {}) } });
    }
    contents.push({ role: "user", parts: responses });
  }
}
