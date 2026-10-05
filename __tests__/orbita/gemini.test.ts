/** @jest-environment node */
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { runGemini } from "../../lib/orbita/gemini";
import type { OrbitaStreamEvent } from "../../lib/orbita/protocol";

/** One SSE response body from a list of Gemini chunks. */
function sse(chunks: unknown[]): Response {
  const body = chunks.map((c) => `data: ${JSON.stringify(c)}\n\n`).join("");
  return new Response(body, { status: 200, headers: { "content-type": "text/event-stream" } });
}

const realFetch = global.fetch;
afterEach(() => {
  global.fetch = realFetch;
});

describe("runGemini", () => {
  it("streams text, runs a tool call and sends its result back with the model's parts verbatim", async () => {
    const calls: { url: string; body: { contents: { role: string; parts: Record<string, unknown>[] }[] } }[] = [];
    const replies = [
      sse([
        { candidates: [{ content: { role: "model", parts: [{ functionCall: { name: "search_portfolio", args: { query: "rag" } }, thoughtSignature: "sig-1" }] } }] },
      ]),
      sse([
        { candidates: [{ content: { role: "model", parts: [{ text: "Achei " }] } }] },
        { candidates: [{ content: { role: "model", parts: [{ text: "o Vektus." }] }, finishReason: "STOP" }] },
      ]),
    ];
    global.fetch = jest.fn(async (url: string | URL | Request, init?: RequestInit) => {
      calls.push({ url: String(url), body: JSON.parse(String(init?.body)) });
      return replies.shift()!;
    }) as typeof fetch;

    const events: OrbitaStreamEvent[] = [];
    await runGemini({
      apiKey: "test-key",
      system: ["system"],
      history: [{ role: "user", content: "vocês fazem RAG?" }],
      locale: "pt",
      maxToolRounds: 4,
      maxTokens: 1000,
      signal: new AbortController().signal,
      send: (ev) => events.push(ev),
    });

    expect(calls).toHaveLength(2);
    expect(calls[0].url).toContain(":streamGenerateContent?alt=sse");
    // the second request carries the model turn (with its thought signature) and the function response
    const second = calls[1].body.contents;
    expect(second[1]).toMatchObject({ role: "model", parts: [{ thoughtSignature: "sig-1" }] });
    expect(second[2].role).toBe("user");
    expect(second[2].parts[0]).toHaveProperty("functionResponse.name", "search_portfolio");

    expect(events.filter((e) => e.type === "tool").map((e) => (e as { status: string }).status)).toEqual(["running", "done"]);
    expect(events.some((e) => e.type === "ui")).toBe(true);
    expect(events.filter((e) => e.type === "text").map((e) => (e as { delta: string }).delta).join("")).toBe("Achei o Vektus.");
  });

  it("reports a refusal when Gemini blocks the answer", async () => {
    global.fetch = jest.fn(async () => sse([{ candidates: [{ finishReason: "SAFETY" }] }])) as typeof fetch;
    const events: OrbitaStreamEvent[] = [];
    await runGemini({
      apiKey: "k",
      system: ["s"],
      history: [{ role: "user", content: "oi" }],
      locale: "pt",
      maxToolRounds: 2,
      maxTokens: 100,
      signal: new AbortController().signal,
      send: (ev) => events.push(ev),
    });
    expect(events).toEqual([{ type: "error", code: "refused" }]);
  });
});
