import Anthropic from "@anthropic-ai/sdk";
import { bookingMode, calendarLive, chatLive, chatProvider, modelConfig, RATE_LIMITS, scheduleConfig } from "@/lib/orbita/config";
import { GeminiError, runGemini } from "@/lib/orbita/gemini";
import { clientIp, rateLimitAll } from "@/lib/orbita/rate-limit";
import { chatRequestSchema, flattenIssues } from "@/lib/orbita/schemas";
import { jsonError, NO_STORE, readJson } from "@/lib/orbita/http";
import { dateBlock, systemPrompt } from "@/lib/orbita/prompt";
import { runTool, toolLineFor, TOOLS } from "@/lib/orbita/tools";
import type { OrbitaStatus, OrbitaStreamEvent } from "@/lib/orbita/protocol";

/**
 * Órbita visitor chat — POST streams NDJSON (lib/orbita/protocol.ts).
 * GET returns which parts are live vs demo so the widget can pick its engine.
 *
 * Privacy: the transcript lives only in this request (sent by the browser each
 * turn). Nothing is written to disk, DB or logs; only error metadata is logged.
 * Retention placeholder: "[RETENÇÃO]" in orbita.composer.hint (owner flag, v3spec §13).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  const cfg = scheduleConfig();
  const status: OrbitaStatus = {
    chat: chatLive() ? "live" : "demo",
    calendar: calendarLive() ? "live" : "demo",
    bookingMode: bookingMode(),
    timeZone: cfg.timeZone,
    slotMinutes: cfg.slotMinutes,
  };
  return Response.json(status, { headers: NO_STORE });
}

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  const rl = rateLimitAll(`chat:${ip}`, [
    { limit: RATE_LIMITS.chatPerMinute, windowMs: 60_000 },
    { limit: RATE_LIMITS.chatPerHour, windowMs: 3_600_000 },
  ]);
  if (!rl.ok) return jsonError(429, { error: "rate_limited", retryAfter: rl.retryAfter });

  const body = await readJson(req, 64_000);
  if (!body.ok) return jsonError(400, { error: "invalid" });
  const parsed = chatRequestSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(400, { error: "invalid", issues: flattenIssues(parsed.error) });

  // DEMO FALLBACK: no API key → the widget runs the scripted conversation client-side.
  if (!chatLive()) return jsonError(503, { error: "unavailable" }, { "x-orbita-mode": "demo" });

  const { locale, messages: history } = parsed.data;
  const cfg = modelConfig();
  const tz = scheduleConfig().timeZone;

  if (chatProvider() === "gemini") {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (ev: OrbitaStreamEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(ev)}\n`));
        try {
          await runGemini({
            apiKey: process.env.GEMINI_API_KEY!.trim(),
            system: [systemPrompt(locale), dateBlock(new Date(), tz)],
            history,
            locale,
            maxToolRounds: cfg.maxToolRounds,
            maxTokens: cfg.maxTokens,
            signal: req.signal,
            send,
          });
          send({ type: "done" });
        } catch (err) {
          if (!req.signal.aborted) {
            const status = err instanceof GeminiError ? err.status : 0;
            console.error("[orbita] gemini failed", status || (err instanceof Error ? err.message : "unknown"));
            send({ type: "error", code: [401, 403, 429, 503].includes(status) ? "unavailable" : "server" });
          }
        } finally {
          try {
            controller.close();
          } catch {
            /* already closed */
          }
        }
      },
    });
    return new Response(stream, {
      headers: { "content-type": "application/x-ndjson; charset=utf-8", ...NO_STORE, "x-accel-buffering": "no" },
    });
  }

  const client = new Anthropic({ maxRetries: 2, timeout: 55_000 });

  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const m of history) {
    const last = messages[messages.length - 1];
    if (last && last.role === m.role && typeof last.content === "string") last.content = `${last.content}\n\n${m.content}`;
    else messages.push({ role: m.role, content: m.content });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (ev: OrbitaStreamEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(ev)}\n`));
      let jsonRetries = 0;
      try {
        for (let round = 0; round < cfg.maxToolRounds; round++) {
          const s = client.beta.messages.stream(
            {
              model: cfg.model,
              max_tokens: cfg.maxTokens,
              system: [
                { type: "text", text: systemPrompt(locale), cache_control: { type: "ephemeral" } },
                { type: "text", text: dateBlock(new Date(), tz) },
              ],
              tools: TOOLS,
              messages,
              ...(cfg.reasoning ? { thinking: { type: "adaptive" as const }, output_config: { effort: cfg.effort } } : {}),
              ...(cfg.fallbacks ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
            },
            { signal: req.signal },
          );
          s.on("text", (delta) => send({ type: "text", delta }));

          let message: Anthropic.Beta.BetaMessage;
          try {
            message = await s.finalMessage();
            jsonRetries = 0;
          } catch (err) {
            // eager_input_streaming: an unparseable tool input rejects here — re-issue once.
            if (err instanceof Anthropic.APIError || req.signal.aborted || jsonRetries++ >= 1) throw err;
            round--;
            continue;
          }

          if (message.stop_reason === "refusal") {
            send({ type: "error", code: "refused" });
            break;
          }
          const toolUses = message.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
          if (!toolUses.length) break;
          if (message.stop_reason === "max_tokens") break; // truncated tool input — never run it

          messages.push({ role: "assistant", content: message.content });
          const lines = toolUses.map((t) => ({ t, line: toolLineFor(t.name) }));
          for (const { t, line } of lines) if (line) send({ type: "tool", id: t.id, tool: line, status: "running" });
          const outcomes = await Promise.all(toolUses.map((t) => runTool(t.name, t.input, locale)));
          const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
          outcomes.forEach((o, i) => {
            const t = toolUses[i];
            const line = o.line ?? lines[i].line;
            if (line) send({ type: "tool", id: t.id, tool: line, status: o.isError ? "error" : "done" });
            if (o.ui) send({ type: "ui", ui: o.ui });
            results.push({ type: "tool_result", tool_use_id: t.id, content: o.content, ...(o.isError ? { is_error: true } : {}) });
          });
          messages.push({ role: "user", content: results });
        }
        send({ type: "done" });
      } catch (err) {
        if (!req.signal.aborted) {
          if (err instanceof Anthropic.RateLimitError || err instanceof Anthropic.APIConnectionError || err instanceof Anthropic.AuthenticationError) {
            console.error("[orbita] upstream unavailable:", err.constructor.name);
            send({ type: "error", code: "unavailable" });
          } else if (err instanceof Anthropic.APIError) {
            console.error("[orbita] API error", err.status);
            send({ type: "error", code: "server" });
          } else {
            console.error("[orbita] chat failed", err instanceof Error ? err.message : "unknown");
            send({ type: "error", code: "server" });
          }
        }
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "application/x-ndjson; charset=utf-8", ...NO_STORE, "x-accel-buffering": "no" },
  });
}
