import { DEMO_SLOTS } from "../../src/content/orbita";

/**
 * Booking client (docs/REDESIGN.md §10.3) — GET /api/orbita/slots and
 * POST /api/orbita/book are implemented by the Órbita agent. Everything here
 * is shape-checked so a missing/half-built backend degrades gracefully.
 */

export type BookingMode = "auto" | "aprovacao" | "demo";
export interface Slot {
  start: string;
  end: string;
}
export interface SlotsResult {
  mode: BookingMode;
  slots: Slot[];
}
export type BookResult = { status: "confirmed"; meetUrl?: string } | { status: "pending" } | { status: "taken" };

export const BOOKING_TZ = "America/Sao_Paulo";
const MODES: BookingMode[] = ["auto", "aprovacao", "demo"];

function isSlot(v: unknown): v is Slot {
  if (!v || typeof v !== "object") return false;
  const s = v as Record<string, unknown>;
  return typeof s.start === "string" && typeof s.end === "string" && !Number.isNaN(Date.parse(s.start)) && !Number.isNaN(Date.parse(s.end));
}

/**
 * Validate an /api/orbita/slots body. Accepts the implemented shape
 * `{ mode: "live"|"demo", days: [{ date, slots: [{start,end}] }] }` (lib/orbita/protocol.ts)
 * and the flat `{ mode, slots: [...] }` form; throws on an unusable body.
 */
export function parseSlotsResponse(body: unknown): SlotsResult {
  if (!body || typeof body !== "object") throw new Error("slots: bad body");
  const b = body as Record<string, unknown>;
  const mode: BookingMode = b.mode === "aprovacao" ? "aprovacao" : b.mode === "live" || b.mode === "auto" ? "auto" : "demo";
  const slots: Slot[] = [];
  if (Array.isArray(b.days)) {
    for (const d of b.days) {
      const daySlots = d && typeof d === "object" ? (d as Record<string, unknown>).slots : null;
      if (Array.isArray(daySlots)) slots.push(...daySlots.filter(isSlot));
    }
  }
  if (!slots.length && Array.isArray(b.slots)) slots.push(...b.slots.filter(isSlot));
  const seen = new Set<number>();
  const unique = slots.filter((s) => {
    const k = Date.parse(s.start);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  unique.sort((a, c) => Date.parse(a.start) - Date.parse(c.start));
  return { mode, slots: unique };
}

/** Demo slots from src/content/orbita (development fallback only). São Paulo is UTC−3, no DST. */
export function demoSlots(): SlotsResult {
  const slots: Slot[] = [];
  for (const d of DEMO_SLOTS) {
    for (const t of d.times) {
      const start = new Date(`${d.date}T${t}:00-03:00`);
      slots.push({ start: start.toISOString(), end: new Date(start.getTime() + 30 * 60000).toISOString() });
    }
  }
  return { mode: "demo", slots };
}

export async function fetchSlots(signal?: AbortSignal): Promise<SlotsResult> {
  try {
    const res = await fetch("/api/orbita/slots?days=3&perDay=8", { signal, headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`slots: HTTP ${res.status}`);
    return parseSlotsResponse(await res.json());
  } catch (err) {
    if ((err as Error)?.name === "AbortError") throw err;
    if (process.env.NODE_ENV === "development") {
      console.warn("[quote] /api/orbita/slots unavailable — using DEMO_SLOTS (development only)", err);
      return demoSlots();
    }
    throw err;
  }
}

/** POST /api/orbita/book (lib/orbita/protocol.ts BookResponse). 409 → "taken". */
export async function bookSlot(body: { start: string; name: string; email: string; summary?: string; locale: string }): Promise<BookResult> {
  const res = await fetch("/api/orbita/book", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ intent: "book", consent: true, website: "", ...body }),
  });
  if (res.status === 409) return { status: "taken" };
  if (!res.ok) throw new Error(`book: HTTP ${res.status}`);
  const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  const demo = data?.mode === "demo";
  if (data?.status === "confirmed" && !demo) {
    const link = typeof data.meetLink === "string" ? data.meetLink : typeof data.meetUrl === "string" ? data.meetUrl : undefined;
    return { status: "confirmed", meetUrl: link && /^https:\/\//.test(link) ? link : undefined };
  }
  // demo bookings write nothing: never present them as confirmed
  if (data?.status === "confirmed" || data?.status === "pending") return { status: "pending" };
  throw new Error("book: bad body");
}

/** POST /api/quote/slot — e-mails Wesley the preferred time (used when the calendar runs in demo mode). */
export async function sendSlotPreference(body: { start: string; end: string; name: string; email: string; company?: string; locale: string; ref?: string }) {
  const res = await fetch("/api/quote/slot", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ ...body, website: "" }),
  });
  const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  if (!res.ok || !data?.ok) throw new Error(`slot preference: HTTP ${res.status}`);
}

/* ---------- formatting (São Paulo wall time, visitor locale) ---------- */

const INTL: Record<string, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };
const intl = (locale: string) => INTL[locale] ?? "pt-BR";
const cap = (s: string) => (s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s);
const stripDot = (s: string) => s.replace(/\.$/, "");

export function dayKey(iso: string) {
  // en-CA gives YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: BOOKING_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
}

export function formatTime(iso: string, locale: string) {
  return new Intl.DateTimeFormat(intl(locale), { timeZone: BOOKING_TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));
}

function weekdayShort(d: Date, locale: string) {
  return cap(stripDot(new Intl.DateTimeFormat(intl(locale), { timeZone: BOOKING_TZ, weekday: "short" }).format(d)));
}

/** "Qua 30/09" · "Wed 09/30" · "Mié 30/09" */
export function formatDayTab(iso: string, locale: string) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat(intl(locale), { timeZone: BOOKING_TZ, day: "2-digit", month: "2-digit" }).format(d);
  return `${weekdayShort(d, locale)} ${date}`;
}

/** "Quarta-feira, 30 de setembro" (slot aria-label) */
export function formatDayLong(iso: string, locale: string) {
  return cap(new Intl.DateTimeFormat(intl(locale), { timeZone: BOOKING_TZ, weekday: "long", day: "numeric", month: "long" }).format(new Date(iso)));
}

/** "Qui, 01 de outubro" (booking card "Quando") */
export function formatDayMedium(iso: string, locale: string) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat(intl(locale), { timeZone: BOOKING_TZ, day: "2-digit", month: "long" }).format(d);
  return `${weekdayShort(d, locale)}, ${date}`;
}

/** "Qui, 01/10" (waiting card) */
export function formatDayShortComma(iso: string, locale: string) {
  return formatDayTab(iso, locale).replace(" ", ", ");
}

export interface SlotDay {
  key: string;
  tab: string;
  long: string;
  slots: Slot[];
}

/** Group by São Paulo calendar day; first `maxDays` days, up to `maxPerDay` slots each. */
export function groupSlots(slots: Slot[], locale: string, maxDays = 3, maxPerDay = 8): SlotDay[] {
  const days: SlotDay[] = [];
  for (const s of slots) {
    const key = dayKey(s.start);
    let day = days.find((d) => d.key === key);
    if (!day) {
      if (days.length >= maxDays) continue;
      day = { key, tab: formatDayTab(s.start, locale), long: formatDayLong(s.start, locale), slots: [] };
      days.push(day);
    }
    if (day.slots.length < maxPerDay) day.slots.push(s);
  }
  return days;
}

/* ---------- .ics (Adicionar ao calendário) ---------- */

const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

export function buildIcs(opts: { slot: Slot; title: string; description: string; url?: string; uid?: string }) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wesley Santos//Casebook//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${opts.uid ?? `${icsDate(opts.slot.start)}-quote@wesley-santos.dev`}`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(opts.slot.start)}`,
    `DTEND:${icsDate(opts.slot.end)}`,
    `SUMMARY:${icsText(opts.title)}`,
    `DESCRIPTION:${icsText(opts.url ? `${opts.description}\n${opts.url}` : opts.description)}`,
    ...(opts.url ? [`URL:${opts.url}`, `LOCATION:${icsText(opts.url)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function downloadIcs(content: string, filename = "conversa-wesley-santos.ics") {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
