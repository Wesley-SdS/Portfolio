import { z } from "zod";
import { quoteSchema, type QuotePayload } from "../../../src/content/quote";
import pt from "../../../messages/pt.json";
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";

/**
 * POST /api/quote — framework-free core (unit-tested in __tests__/quote-route.test.ts).
 * Contract: docs/REDESIGN.md §10.2. route.ts wires it to Next + Resend.
 */

/* ---------------- html escaping ---------------- */

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" };
export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"'`]/g, (c) => ESC[c]);
}
/** escape + keep line breaks */
const escMultiline = (v: unknown) => escapeHtml(v).replace(/\r?\n/g, "<br>");
/** header-safe single line (subjects) */
const oneLine = (v: unknown, max = 120) => String(v ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

/* ---------------- rate limit (in memory, per instance) ---------------- */

export interface RateLimiter {
  check(key: string, now?: number): { ok: true } | { ok: false; retryAfter: number };
}

export function createRateLimiter({ limit = 5, windowMs = 10 * 60_000, maxKeys = 5000 } = {}): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    check(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return { ok: false, retryAfter: Math.max(1, Math.ceil((windowMs - (now - recent[0])) / 1000)) };
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > maxKeys) {
        // drop the oldest keys (Map keeps insertion order)
        for (const k of hits.keys()) {
          hits.delete(k);
          if (hits.size <= maxKeys * 0.9) break;
        }
      }
      return { ok: true };
    },
  };
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim() || "unknown";
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/* ---------------- messages ---------------- */

type Dict = Record<string, unknown>;
const MESSAGES: Record<string, Dict> = { pt, en, es };

export function msg(locale: string, key: string, vars: Record<string, string> = {}): string {
  const dict = MESSAGES[locale] ?? MESSAGES.pt;
  const raw = key.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Dict)[k] : undefined), dict);
  const str = typeof raw === "string" ? raw : key;
  return str.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? vars[k] : `{${k}}`));
}

function labels(p: QuotePayload, locale: string) {
  const L = (k: string) => msg(locale, k);
  return {
    engagement: L(`quote.steps.s1.options.${p.engagement}.title`),
    solutions: p.solutions
      .map((s) => (s === "other" && p.other?.trim() ? `${L("quote.steps.s2.options.other")} (${p.other.trim()})` : L(`quote.steps.s2.options.${s}`)))
      .join(", "),
    start: L(`quote.steps.s3.starts.${p.start}`),
    deadline: L(`quote.steps.s4.deadlines.${p.deadline}`),
    budget: L(`quote.steps.s4.budgets.${p.budget}`),
  };
}

/* ---------------- e-mails ---------------- */

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const row = (label: string, valueHtml: string) =>
  `<tr><td style="padding:6px 16px 6px 0;vertical-align:top;color:#6B665C;font:500 12px/18px ui-monospace,Menlo,monospace;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;vertical-align:top;color:#16150F;font:400 15px/22px -apple-system,Segoe UI,Roboto,Arial,sans-serif">${valueHtml}</td></tr>`;

const shell = (title: string, body: string) =>
  `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head><body style="margin:0;padding:24px;background:#F7F6F3;color:#16150F"><div style="max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #E0DDD5;border-radius:12px;padding:32px">${body}</div></body></html>`;

/** E-mail to Wesley (Portuguese; every user value escaped). */
export function buildOwnerEmail(p: QuotePayload, meta: { ip?: string; siteUrl?: string } = {}): EmailContent {
  const l = labels(p, "pt");
  const subject = oneLine(`Orçamento: ${l.engagement} · ${p.name}${p.company ? ` (${p.company})` : ""}`, 160);
  const link = p.link ? `<a href="${escapeHtml(p.link)}" style="color:#B93A0A">${escapeHtml(p.link)}</a>` : "—";
  const mail = `<a href="mailto:${escapeHtml(p.email)}" style="color:#B93A0A">${escapeHtml(p.email)}</a>`;
  const rows = [
    row("Nome", escapeHtml(p.name)),
    row("E-mail", mail),
    row("Empresa", escapeHtml(p.company || "—")),
    row("WhatsApp", escapeHtml(p.whatsapp || "—")),
    row("Formato", escapeHtml(l.engagement)),
    row("Solução", escapeHtml(l.solutions)),
    row("Ponto de partida", escapeHtml(l.start)),
    row("Prazo", escapeHtml(l.deadline)),
    row("Investimento", escapeHtml(l.budget)),
    row("Link", link),
    row("Idioma", escapeHtml(p.locale)),
    row("Origem", escapeHtml(p.source + (p.ref ? ` · ref: ${p.ref}` : ""))),
  ].join("");
  const html = shell(
    subject,
    `<p style="margin:0 0 4px;font:500 12px/16px ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#6B665C">Nova solicitação de orçamento</p>
<h1 style="margin:0 0 24px;font:700 24px/30px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#16150F">${escapeHtml(p.name)}${p.company ? ` · ${escapeHtml(p.company)}` : ""}</h1>
<table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%">${rows}</table>
<p style="margin:24px 0 8px;font:500 12px/16px ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#6B665C">Descrição</p>
<div style="padding:16px;background:#ECEAE4;border-radius:10px;font:400 15px/24px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#16150F">${escMultiline(p.description)}</div>
<p style="margin:24px 0 0;font:400 13px/20px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#6B665C">Responda este e-mail para falar direto com ${escapeHtml(p.name)} (reply-to).${meta.siteUrl ? ` Enviado por ${escapeHtml(meta.siteUrl)}.` : ""}${meta.ip ? ` IP: ${escapeHtml(meta.ip)}.` : ""}</p>`,
  );
  const text = [
    "Nova solicitação de orçamento",
    "",
    `Nome: ${p.name}`,
    `E-mail: ${p.email}`,
    `Empresa: ${p.company || "—"}`,
    `WhatsApp: ${p.whatsapp || "—"}`,
    `Formato: ${l.engagement}`,
    `Solução: ${l.solutions}`,
    `Ponto de partida: ${l.start}`,
    `Prazo: ${l.deadline}`,
    `Investimento: ${l.budget}`,
    `Link: ${p.link || "—"}`,
    `Idioma: ${p.locale} · Origem: ${p.source}${p.ref ? ` · ref: ${p.ref}` : ""}`,
    "",
    "Descrição:",
    p.description,
  ].join("\n");
  return { subject, html, text };
}

/** Confirmation to the visitor, in their locale. */
export function buildVisitorEmail(p: QuotePayload, meta: { siteUrl: string }): EmailContent {
  const loc = p.locale;
  const l = labels(p, loc);
  const first = p.name.trim().split(/\s+/)[0] ?? p.name;
  const subject = msg(loc, "quote.email.subject");
  const rows = [
    row(msg(loc, "quote.success.summary.engagement"), escapeHtml(l.engagement)),
    row(msg(loc, "quote.success.summary.solutions"), escapeHtml(l.solutions)),
    row(msg(loc, "quote.success.summary.deadline"), escapeHtml(l.deadline)),
    row(msg(loc, "quote.success.summary.budget"), escapeHtml(l.budget)),
  ].join("");
  const site = meta.siteUrl.replace(/^https?:\/\//, "");
  const html = shell(
    subject,
    `<p style="margin:0 0 16px;font:400 16px/26px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#16150F">${escapeHtml(msg(loc, "quote.email.greeting", { name: first }))}</p>
<p style="margin:0 0 24px;font:400 16px/26px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#4E4A42">${escapeHtml(msg(loc, "quote.email.intro"))}</p>
<p style="margin:0 0 8px;font:500 12px/16px ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#6B665C">${escapeHtml(msg(loc, "quote.email.summaryTitle"))}</p>
<table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%">${rows}</table>
<div style="margin-top:16px;padding:16px;background:#ECEAE4;border-radius:10px;font:400 15px/24px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#16150F">${escMultiline(p.description)}</div>
<p style="margin:24px 0 0;font:600 15px/22px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#16150F">Wesley Santos</p>
<p style="margin:16px 0 0;font:400 12px/18px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#6B665C">${escapeHtml(msg(loc, "quote.email.footer", { site }))}</p>`,
  );
  const text = [
    msg(loc, "quote.email.greeting", { name: first }),
    "",
    msg(loc, "quote.email.intro"),
    "",
    `${msg(loc, "quote.success.summary.engagement")}: ${l.engagement}`,
    `${msg(loc, "quote.success.summary.solutions")}: ${l.solutions}`,
    `${msg(loc, "quote.success.summary.deadline")}: ${l.deadline}`,
    `${msg(loc, "quote.success.summary.budget")}: ${l.budget}`,
    "",
    p.description,
    "",
    "Wesley Santos",
    "",
    msg(loc, "quote.email.footer", { site }),
  ].join("\n");
  return { subject, html, text };
}

/* ---------------- handler ---------------- */

export interface SendArgs {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}

export interface QuoteDeps {
  env: {
    RESEND_API_KEY?: string;
    CONTACT_EMAIL?: string;
    RESEND_FROM_EMAIL?: string;
    QUOTE_CONFIRMATION_EMAIL?: string;
    NODE_ENV?: string;
    NEXT_PUBLIC_SITE_URL?: string;
  };
  /** returns an error when delivery failed */
  send: (args: SendArgs) => Promise<{ error?: unknown }>;
  limiter: RateLimiter;
  log?: Pick<Console, "info" | "warn" | "error">;
  now?: number;
}

export interface QuoteResult {
  status: number;
  body: Record<string, unknown>;
  headers?: Record<string, string>;
}

export const DEFAULT_TO = "wesleysantos.0095@gmail.com";
export const DEFAULT_FROM = "onboarding@resend.dev";
const MAX_BODY = 20_000;

export async function handleQuote(rawBody: string, headers: Headers, deps: QuoteDeps): Promise<QuoteResult> {
  const log = deps.log ?? console;
  const ip = clientIp(headers);

  if (rawBody.length > MAX_BODY) return { status: 413, body: { ok: false, error: "too_large" } };

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { ok: false, error: "invalid_json" } };
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { status: 400, body: { ok: false, error: "invalid_json" } };
  }

  const limited = deps.limiter.check(ip, deps.now);
  if (!limited.ok) {
    return { status: 429, body: { ok: false, error: "rate_limited" }, headers: { "Retry-After": String(limited.retryAfter) } };
  }

  // honeypot: bots fill "website" — answer like a success and drop it
  const website = (body as Record<string, unknown>).website;
  if (typeof website === "string" && website.trim() !== "") {
    log.warn?.("[quote] honeypot filled — dropped", { ip });
    return { status: 200, body: { ok: true, delivered: false, confirmation: false } };
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "invalid",
        issues: parsed.error.issues.map((i) => ({ path: i.path.map(String), message: i.message })),
      },
    };
  }
  const payload = parsed.data;
  const { env } = deps;
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://wesley-santos.dev";

  if (!env.RESEND_API_KEY) {
    if (env.NODE_ENV === "production") {
      log.error?.("[quote] RESEND_API_KEY is not set — cannot deliver quote requests");
      return { status: 503, body: { ok: false, error: "email_not_configured" } };
    }
    log.info?.("[quote] RESEND_API_KEY not set (development) — payload not e-mailed:", JSON.stringify(payload, null, 2));
    return { status: 200, body: { ok: true, delivered: false, confirmation: false } };
  }

  const from = env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const to = env.CONTACT_EMAIL || DEFAULT_TO;
  const owner = buildOwnerEmail(payload, { ip, siteUrl });

  try {
    const { error } = await deps.send({ from, to, replyTo: payload.email, ...owner });
    if (error) {
      log.error?.("[quote] Resend error (owner e-mail):", error);
      return { status: 502, body: { ok: false, error: "send_failed" } };
    }
  } catch (err) {
    log.error?.("[quote] Resend threw (owner e-mail):", err);
    return { status: 502, body: { ok: false, error: "send_failed" } };
  }

  // visitor confirmation — only from a verified domain (onboarding@resend.dev can only reach the account owner)
  let confirmation = false;
  if (env.RESEND_FROM_EMAIL && env.QUOTE_CONFIRMATION_EMAIL !== "off") {
    try {
      const visitor = buildVisitorEmail(payload, { siteUrl });
      const { error } = await deps.send({ from, to: payload.email, replyTo: to, ...visitor });
      if (error) log.warn?.("[quote] confirmation e-mail failed:", error);
      else confirmation = true;
    } catch (err) {
      log.warn?.("[quote] confirmation e-mail threw:", err);
    }
  }

  return { status: 200, body: { ok: true, delivered: true, confirmation } };
}

/* ---------------- POST /api/quote/slot (preferred time while the calendar runs in demo mode) ---------------- */

export const slotPreferenceSchema = z.object({
  start: z.iso.datetime({ offset: true }),
  end: z.iso.datetime({ offset: true }),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  company: z.string().trim().max(120).optional(),
  locale: z.enum(["pt", "en", "es"]).default("pt"),
  ref: z.string().max(40).optional(),
  website: z.string().max(0).optional(),
});

export async function handleSlotPreference(rawBody: string, headers: Headers, deps: QuoteDeps): Promise<QuoteResult> {
  const log = deps.log ?? console;
  const ip = clientIp(headers);
  if (rawBody.length > 4_000) return { status: 413, body: { ok: false, error: "too_large" } };
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { ok: false, error: "invalid_json" } };
  }
  const limited = deps.limiter.check(ip, deps.now);
  if (!limited.ok) return { status: 429, body: { ok: false, error: "rate_limited" }, headers: { "Retry-After": String(limited.retryAfter) } };
  const website = body && typeof body === "object" ? (body as Record<string, unknown>).website : undefined;
  if (typeof website === "string" && website.trim() !== "") return { status: 200, body: { ok: true, delivered: false } };

  const parsed = slotPreferenceSchema.safeParse(body);
  if (!parsed.success) return { status: 400, body: { ok: false, error: "invalid" } };
  const p = parsed.data;
  const start = new Date(p.start);
  if (Number.isNaN(start.getTime()) || start.getTime() < (deps.now ?? Date.now()) - 60_000) {
    return { status: 400, body: { ok: false, error: "invalid" } };
  }
  const { env } = deps;
  if (!env.RESEND_API_KEY) {
    if (env.NODE_ENV === "production") return { status: 503, body: { ok: false, error: "email_not_configured" } };
    log.info?.("[quote/slot] RESEND_API_KEY not set (development) — preference not e-mailed:", JSON.stringify(p));
    return { status: 200, body: { ok: true, delivered: false } };
  }
  const when = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(start);
  const subject = oneLine(`Horário preferido: ${p.name} · ${when} (Brasília)`, 160);
  const html = shell(
    subject,
    `<p style="margin:0 0 4px;font:500 12px/16px ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#6B665C">Horário preferido para a conversa</p>
<h1 style="margin:0 0 16px;font:700 24px/30px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#16150F">${escapeHtml(when)} (Brasília) · 30 min</h1>
<table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%">${[
      row("Nome", escapeHtml(p.name)),
      row("E-mail", `<a href="mailto:${escapeHtml(p.email)}" style="color:#B93A0A">${escapeHtml(p.email)}</a>`),
      row("Empresa", escapeHtml(p.company || "—")),
      row("Início (UTC)", escapeHtml(p.start)),
      row("Origem", escapeHtml(`quote${p.ref ? ` · ref: ${p.ref}` : ""} · ${p.locale}`)),
    ].join("")}</table>
<p style="margin:24px 0 0;font:400 13px/20px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#6B665C">A agenda online está em modo demonstração: confirme o horário respondendo este e-mail (reply-to = visitante).</p>`,
  );
  const text = `Horário preferido: ${when} (Brasília) · 30 min\nNome: ${p.name}\nE-mail: ${p.email}\nEmpresa: ${p.company || "—"}\nInício (UTC): ${p.start}`;
  try {
    const { error } = await deps.send({
      from: env.RESEND_FROM_EMAIL || DEFAULT_FROM,
      to: env.CONTACT_EMAIL || DEFAULT_TO,
      replyTo: p.email,
      subject,
      html,
      text,
    });
    if (error) {
      log.error?.("[quote/slot] Resend error:", error);
      return { status: 502, body: { ok: false, error: "send_failed" } };
    }
  } catch (err) {
    log.error?.("[quote/slot] Resend threw:", err);
    return { status: 502, body: { ok: false, error: "send_failed" } };
  }
  return { status: 200, body: { ok: true, delivered: true } };
}
