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

/** Tried in order when a model is overloaded (503) or out of quota (429); the lite model is the safety net. */
export const GEMINI_FALLBACK_MODEL = "gemini-flash-lite-latest";
function modelChain(): string[] {
  return [...new Set([geminiModel(), GEMINI_FALLBACK_MODEL])];
}

const retryable = (status: number) => status === 503 || status === 429;
/** Backoff before each retry of a model that is already pinned for this request. */
const RETRY_MS = [700, 1800];

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => (clearTimeout(t), reject(signal.reason)), { once: true });
  });
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

  const initial = contents.map((c) => ({ ...c, parts: [...c.parts] }));
  // a restart on the fallback model replays tool calls already shown; never show them twice
  const shownUi = new Set<string>();
  const shownTools = new Set<string>();

  // the model that answered first stays for the whole request (thought signatures are model-bound)
  let models = modelChain();
  for (let round = 0; round < opts.maxToolRounds; round++) {
    const body = JSON.stringify({
      systemInstruction: { parts: opts.system.map((text) => ({ text })) },
      contents,
      tools: [{ functionDeclarations: FUNCTIONS }],
      generationConfig: { maxOutputTokens: opts.maxTokens, temperature: 0.6 },
    });
    let res: Response | null = null;
    for (const model of models) {
      // first round tries each model once; once pinned, the model gets a couple of patient retries
      const attempts = models.length === 1 ? 1 + RETRY_MS.length : 1;
      for (let a = 0; a < attempts; a++) {
        if (a) await wait(RETRY_MS[a - 1], opts.signal);
        res = await fetch(`${API}/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
          method: "POST",
          headers: { "content-type": "application/json", "x-goog-api-key": opts.apiKey },
          body,
          signal: opts.signal,
        });
        if (res.ok || !retryable(res.status)) break;
      }
      if (res?.ok) {
        models = [model];
        break;
      }
      if (res && !retryable(res.status)) break;
    }
    if (res && !res.ok && retryable(res.status) && round > 0 && models[0] !== GEMINI_FALLBACK_MODEL) {
      // the pinned model went down after a tool round: its thought signatures can't go to another
      // model, so the fallback answers the visitor's message from the start
      contents.splice(0, contents.length, ...initial.map((c) => ({ ...c, parts: [...c.parts] })));
      models = [GEMINI_FALLBACK_MODEL];
      round = -1;
      continue;
    }
    if (!res || !res.ok || !res.body) throw new GeminiError(res?.status ?? 0);

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
      const toolKey = `${call.name}:${JSON.stringify(call.args ?? {})}`;
      const replay = shownTools.has(toolKey);
      const line = toolLineFor(call.name);
      if (line && !replay) opts.send({ type: "tool", id, tool: line, status: "running" });
      const o = await runTool(call.name, call.args ?? {}, opts.locale);
      const shown = o.line ?? line;
      if (shown && !replay) opts.send({ type: "tool", id, tool: shown, status: o.isError ? "error" : "done" });
      shownTools.add(toolKey);
      const uiKey = o.ui ? JSON.stringify(o.ui) : "";
      if (o.ui && !shownUi.has(uiKey)) opts.send({ type: "ui", ui: o.ui });
      if (o.ui) shownUi.add(uiKey);
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
