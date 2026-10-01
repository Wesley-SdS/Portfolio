/**
 * @jest-environment node
 */
import { describe, it, expect, jest } from "@jest/globals";
import { buildOwnerEmail, createRateLimiter, escapeHtml, handleQuote, handleSlotPreference, type QuoteDeps, type SendArgs } from "../app/api/quote/lib";
import { quoteSchema } from "../src/content/quote";

const base = {
  engagement: "project",
  solutions: ["ai_agents", "other"],
  other: "<b>ERP</b>",
  description: 'Queremos um agente <script>alert("x")</script> para a clínica.',
  start: "zero",
  link: "https://exemplo.com.br/?a=1&b=2",
  deadline: "asap",
  budget: "discuss_on_call",
  name: "Ana <img src=x onerror=alert(1)>",
  company: "Clínica & Cia",
  email: "ana@clinicaexemplo.com.br",
  consent: true,
  website: "",
  locale: "pt",
  source: "site",
};

const headers = (ip = "203.0.113.7") => new Headers({ "x-forwarded-for": `${ip}, 10.0.0.1` });
const silent = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };

function deps(over: Partial<QuoteDeps> = {}, env: QuoteDeps["env"] = {}) {
  const sent: SendArgs[] = [];
  const d: QuoteDeps = {
    env: { RESEND_API_KEY: "re_test", NODE_ENV: "production", ...env },
    limiter: createRateLimiter({ limit: 5, windowMs: 60_000 }),
    send: async (a) => {
      sent.push(a);
      return {};
    },
    log: silent,
    ...over,
  };
  return { d, sent };
}

describe("POST /api/quote core", () => {
  it("sends the owner e-mail with reply-to = visitor and escapes every user value", async () => {
    const { d, sent } = deps();
    const res = await handleQuote(JSON.stringify(base), headers(), d);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, delivered: true, confirmation: false });
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe("wesleysantos.0095@gmail.com");
    expect(sent[0].from).toBe("onboarding@resend.dev");
    expect(sent[0].replyTo).toBe(base.email);
    expect(sent[0].html).not.toContain("<script>");
    expect(sent[0].html).not.toContain("<img src=x");
    expect(sent[0].html).not.toContain("<b>ERP</b>");
    expect(sent[0].html).toContain("&lt;script&gt;");
    expect(sent[0].html).toContain("Clínica &amp; Cia");
    expect(sent[0].subject).not.toMatch(/[\r\n]/);
  });

  it("sends the visitor confirmation only from a verified sender", async () => {
    const { d, sent } = deps({}, { RESEND_FROM_EMAIL: "orcamento@wesley-santos.dev", CONTACT_EMAIL: "me@x.dev" });
    const res = await handleQuote(JSON.stringify({ ...base, locale: "en" }), headers(), d);
    expect(res.body).toMatchObject({ ok: true, confirmation: true });
    expect(sent).toHaveLength(2);
    expect(sent[0].to).toBe("me@x.dev");
    expect(sent[1].to).toBe(base.email);
    expect(sent[1].subject).toBe("I received your quote request");
    expect(sent[1].html).not.toContain("<script>");
  });

  it("returns 400 with message-key issues for an invalid payload", async () => {
    const { d, sent } = deps();
    const res = await handleQuote(JSON.stringify({ ...base, email: "nope", consent: false }), headers(), d);
    expect(res.status).toBe(400);
    const issues = res.body.issues as { path: string[]; message: string }[];
    expect(issues.map((i) => i.message)).toEqual(expect.arrayContaining(["quote.errors.email", "quote.errors.consent"]));
    expect(sent).toHaveLength(0);
    expect((await handleQuote("{not json", headers(), d)).status).toBe(400);
  });

  it("silently drops a filled honeypot", async () => {
    const { d, sent } = deps();
    const res = await handleQuote(JSON.stringify({ ...base, website: "http://spam.example" }), headers(), d);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(sent).toHaveLength(0);
  });

  it("rate-limits per IP (5 per window) with Retry-After", async () => {
    const { d } = deps();
    for (let i = 0; i < 5; i++) expect((await handleQuote(JSON.stringify(base), headers("198.51.100.1"), d)).status).toBe(200);
    const limited = await handleQuote(JSON.stringify(base), headers("198.51.100.1"), d);
    expect(limited.status).toBe(429);
    expect(Number(limited.headers?.["Retry-After"])).toBeGreaterThan(0);
    expect((await handleQuote(JSON.stringify(base), headers("198.51.100.2"), d)).status).toBe(200);
  });

  it("503 in production without RESEND_API_KEY, logged 200 in development", async () => {
    const prod = deps({}, { RESEND_API_KEY: "" });
    expect((await handleQuote(JSON.stringify(base), headers(), prod.d)).status).toBe(503);
    const dev = deps({}, { RESEND_API_KEY: "", NODE_ENV: "development" });
    const res = await handleQuote(JSON.stringify(base), headers(), dev.d);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true, delivered: false });
  });

  it("502 when Resend reports an error", async () => {
    const { d } = deps({ send: async () => ({ error: { message: "boom" } }) });
    expect((await handleQuote(JSON.stringify(base), headers(), d)).status).toBe(502);
  });
});

describe("POST /api/quote/slot core", () => {
  const slot = { start: "2099-10-01T13:00:00.000Z", end: "2099-10-01T13:30:00.000Z", name: "Ana <b>", email: "ana@x.com", locale: "pt", website: "" };
  it("e-mails Wesley the preferred time with reply-to = visitor (escaped)", async () => {
    const { d, sent } = deps();
    const res = await handleSlotPreference(JSON.stringify(slot), headers(), d);
    expect(res.status).toBe(200);
    expect(sent[0].replyTo).toBe("ana@x.com");
    expect(sent[0].subject).toContain("Horário preferido");
    expect(sent[0].html).not.toContain("Ana <b>");
  });
  it("rejects past or malformed slots", async () => {
    const { d } = deps();
    expect((await handleSlotPreference(JSON.stringify({ ...slot, start: "2001-01-01T10:00:00.000Z" }), headers(), d)).status).toBe(400);
    expect((await handleSlotPreference(JSON.stringify({ ...slot, start: "amanhã" }), headers(), d)).status).toBe(400);
  });
});

describe("helpers", () => {
  it("escapeHtml covers the dangerous characters", () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&\``)).toBe("&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&#96;");
  });
  it("owner e-mail keeps line breaks and labels enums in Portuguese", () => {
    const p = quoteSchema.parse({ ...base, description: "linha 1\nlinha 2 com texto suficiente" });
    const mail = buildOwnerEmail(p);
    expect(mail.html).toContain("linha 1<br>linha 2");
    expect(mail.html).toContain("Projeto específico");
    expect(mail.text).toContain("Solução: Agentes de IA, Outro (<b>ERP</b>)");
  });
});
