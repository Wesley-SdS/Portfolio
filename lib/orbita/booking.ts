import { bookingMode, calendarLive, notifyConfig, scheduleConfig } from "./config";
import { allFreeSlots } from "./calendar";
import { bookingEventId, getEvent, insertEvent, meetLinkOf } from "./google";
import { sendLeadMail } from "./notify";
import { isBookable } from "./slots";
import type { BookRequest } from "./schemas";
import type { BookResponse } from "./protocol";

/**
 * Booking service — the ONLY code path that writes to Wesley's calendar.
 * It runs on an explicit visitor submit (Órbita contact card with consent, or
 * QuoteForm step 6 after the quote consent) via POST /api/orbita/book; the model
 * can only *propose* a slot (book_call shows the confirmation card). Safe by
 * construction: fixed calendar, fixed duration, slot re-validated against
 * free/busy right before insert, idempotent event id.
 *
 * Without Google credentials (demo), nothing is written to any calendar:
 *  - RESEND configured → a real request: Wesley is e-mailed, answer `pending`.
 *  - QuoteForm (source "quote") → `pending` (docs/REDESIGN.md §10.3).
 *  - Órbita chat without any backend (local dev) → the scripted §8.3 result
 *    (`confirmed` in auto mode, `pending` in aprovacao), flagged `mode: "demo"`.
 */

export class SlotTakenError extends Error {
  constructor() {
    super("slot_taken");
  }
}

function formatWhen(startIso: string, endIso: string) {
  const { timeZone } = scheduleConfig();
  const day = new Intl.DateTimeFormat("pt-BR", { timeZone, weekday: "long", day: "2-digit", month: "long" }).format(new Date(startIso));
  const hm = new Intl.DateTimeFormat("pt-BR", { timeZone, hour: "2-digit", minute: "2-digit" });
  return `${day} · ${hm.format(new Date(startIso))}–${hm.format(new Date(endIso))} (${timeZone})`;
}

function leadSummary(req: BookRequest) {
  return [
    req.source === "quote" ? "Origem: formulário de orçamento" : "Origem: Órbita (chat do site)",
    req.company ? `Empresa: ${req.company}` : "",
    req.ref ? `Referência: ${req.ref}` : "",
    req.summary ?? "",
  ]
    .filter(Boolean)
    .join("\n");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function book(req: BookRequest): Promise<BookResponse> {
  const summary = leadSummary(req);
  if (req.intent === "callback") {
    if (!notifyConfig().resendKey) return { ok: true, mode: "demo", intent: "callback", status: "received", email: req.email };
    await sendLeadMail({ kind: "callback", name: req.name, email: req.email, summary, locale: req.locale });
    return { ok: true, mode: "live", intent: "callback", status: "received", email: req.email };
  }

  const cfg = scheduleConfig();
  const mode = bookingMode();
  const startMs = Date.parse(req.start);

  if (!calendarLive()) {
    if (startMs < Date.now()) throw new SlotTakenError();
    const start = new Date(startMs).toISOString();
    const end = new Date(startMs + cfg.slotMinutes * 60_000).toISOString();
    let notified = false;
    if (notifyConfig().resendKey) {
      await sendLeadMail({ kind: "request", name: req.name, email: req.email, when: formatWhen(start, end), summary, locale: req.locale });
      notified = true;
    }
    const pending = notified || req.source === "quote" || mode === "aprovacao";
    return { ok: true, mode: "demo", intent: "book", status: pending ? "pending" : "confirmed", start, end, meetLink: null, email: req.email };
  }

  const { days } = await allFreeSlots();
  const slot = isBookable(req.start, days);
  if (!slot) throw new SlotTakenError();

  const id = bookingEventId(req.email, slot.start);
  const when = formatWhen(slot.start, slot.end);
  const description = [
    "Conversa inicial de 30 minutos marcada pela Órbita (assistente de IA do site).",
    `Visitante: ${req.name} <${req.email}>`,
    `\n${summary}`,
  ].join("\n");
  const times = {
    start: { dateTime: slot.start, timeZone: cfg.timeZone },
    end: { dateTime: slot.end, timeZone: cfg.timeZone },
  };
  const conferenceData = { createRequest: { requestId: id, conferenceSolutionKey: { type: "hangoutsMeet" } } };

  if (mode === "aprovacao") {
    await insertEvent(
      {
        id,
        status: "tentative",
        summary: `[Pendente] Conversa com ${req.name} (Órbita)`,
        description: `${description}\n\nMODO APROVAÇÃO: adicione ${req.email} como convidado para confirmar, ou apague este bloqueio.`,
        ...times,
        conferenceData,
        transparency: "opaque",
      },
      "none",
    );
    try {
      await sendLeadMail({ kind: "pending", name: req.name, email: req.email, when, summary, locale: req.locale });
    } catch (e) {
      console.error("[orbita] pending notification failed", e instanceof Error ? e.message : e);
    }
    return { ok: true, mode: "live", intent: "book", status: "pending", start: slot.start, end: slot.end, meetLink: null, eventId: id, email: req.email };
  }

  let ev = await insertEvent(
    {
      id,
      summary: `Conversa com ${req.name} · Wesley Santos`,
      description,
      ...times,
      attendees: [{ email: req.email, displayName: req.name }],
      conferenceData,
      guestsCanInviteOthers: false,
      guestsCanModify: false,
      transparency: "opaque",
    },
    "all",
  );
  if (!meetLinkOf(ev)) {
    await sleep(1200);
    ev = await getEvent(id).catch(() => ev);
  }
  const meetLink = meetLinkOf(ev);
  try {
    await sendLeadMail({ kind: "booked", name: req.name, email: req.email, when, meetLink, summary, locale: req.locale });
  } catch (e) {
    console.error("[orbita] booking notification failed", e instanceof Error ? e.message : e);
  }
  return {
    ok: true,
    mode: "live",
    intent: "book",
    status: "confirmed",
    start: slot.start,
    end: slot.end,
    meetLink,
    ...(meetLink ? { meetUrl: meetLink } : {}),
    eventId: ev.id ?? id,
    email: req.email,
  };
}
