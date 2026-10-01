/** @jest-environment node */
import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

/**
 * Live chat loop with a mocked Anthropic SDK: tool round-trip → NDJSON events
 * (tool line, UI card, text, done), request shape (model, thinking, tools, cache).
 */

type Call = Record<string, any>;
const calls: Call[] = [];
const script: Array<{ text?: string; message: Record<string, unknown> }> = [];

jest.mock("@anthropic-ai/sdk", () => {
  class APIError extends Error {
    status = 500;
  }
  class RateLimitError extends APIError {}
  class APIConnectionError extends APIError {}
  class AuthenticationError extends APIError {}
  class Anthropic {
    static APIError = APIError;
    static RateLimitError = RateLimitError;
    static APIConnectionError = APIConnectionError;
    static AuthenticationError = AuthenticationError;
    beta = {
      messages: {
        stream: (params: Call) => {
          calls.push(JSON.parse(JSON.stringify(params)));
          const step = script.shift()!;
          let onText: ((d: string) => void) | null = null;
          return {
            on(ev: string, cb: (d: string) => void) {
              if (ev === "text") onText = cb;
              return this;
            },
            async finalMessage() {
              if (step.text) onText?.(step.text);
              return step.message;
            },
          };
        },
      },
    };
  }
  return { __esModule: true, default: Anthropic };
});

const { POST } = require("../../app/api/orbita/chat/route") as typeof import("../../app/api/orbita/chat/route");

const saved = process.env.ANTHROPIC_API_KEY;
beforeAll(() => {
  process.env.ANTHROPIC_API_KEY = "test-key";
});
afterAll(() => {
  if (saved === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = saved;
});

async function readEvents(res: Response) {
  const text = await res.text();
  return text
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

describe("POST /api/orbita/chat (mocked Claude)", () => {
  it("runs a tool round-trip and streams tool line, slot picker, text and done", async () => {
    script.push(
      {
        text: "Vou ver a agenda.",
        message: {
          stop_reason: "tool_use",
          content: [
            { type: "text", text: "Vou ver a agenda." },
            { type: "tool_use", id: "toolu_1", name: "get_free_slots", input: {} },
          ],
        },
      },
      { text: "Escolha um horário:\n>> Outro dia | Prefiro e-mail", message: { stop_reason: "end_turn", content: [{ type: "text", text: "Escolha um horário:" }] } },
    );
    const res = await POST(
      new Request("http://x/api/orbita/chat", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "10.9.9.9" },
        body: JSON.stringify({ messages: [{ role: "user", content: "Quero marcar uma conversa" }], locale: "pt" }),
      }),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/x-ndjson");
    const events = await readEvents(res);
    const types = events.map((e) => (e.type === "tool" ? `tool:${e.status}` : e.type === "ui" ? `ui:${e.ui.kind}` : e.type));
    expect(types).toEqual(["text", "tool:running", "tool:done", "ui:slots", "text", "done"]);
    expect(events[1]).toMatchObject({ tool: "calendar" });
    expect(events[3].ui.data.mode).toBe("demo");

    // request shape
    expect(calls).toHaveLength(2);
    const first = calls[0];
    expect(first.model).toBe("claude-opus-5");
    expect(first.thinking).toEqual({ type: "adaptive" });
    expect(first.output_config).toEqual({ effort: "low" });
    expect(first.fallbacks).toBe("default");
    expect(first.betas).toEqual(["server-side-fallback-2026-07-01"]);
    expect(first.system[0].cache_control).toEqual({ type: "ephemeral" });
    expect(first.system[0].text).toContain("VISITOR MODE");
    expect(first.system[0].text).toContain("NexBot");
    expect(first.tools.map((t: Call) => t.name)).toEqual(["search_portfolio", "get_free_slots", "book_call", "handoff_to_quote"]);
    // second call carries the assistant tool_use turn and the tool_result
    const second = calls[1].messages;
    expect(second[1].role).toBe("assistant");
    expect(second[2].content[0]).toMatchObject({ type: "tool_result", tool_use_id: "toolu_1" });
  });

  it("maps a refusal to an error event", async () => {
    script.push({ message: { stop_reason: "refusal", content: [] } });
    const res = await POST(
      new Request("http://x/api/orbita/chat", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "10.9.9.8" },
        body: JSON.stringify({ messages: [{ role: "user", content: "..." }] }),
      }),
    );
    const events = await readEvents(res);
    expect(events).toEqual([{ type: "error", code: "refused" }, { type: "done" }]);
  });
});
