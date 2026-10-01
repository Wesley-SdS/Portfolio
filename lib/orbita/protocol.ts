/**
 * Wire contract between the Órbita widget (components/orbita/*) and its routes
 * (app/api/orbita/*). Types only + constants — safe to import on the client.
 *
 * POST /api/orbita/chat streams NDJSON: one `OrbitaStreamEvent` per line.
 */

import type { SlotDay } from "./slots";

export type Mode = "live" | "demo";
export type ToolLineId = "portfolio" | "calendar" | "invite" | "request";
export type ChatLocale = "pt" | "en" | "es";

/**
 * GET /api/orbita/slots (docs/REDESIGN.md §10.3). `mode` = the booking mode when the
 * calendar is live ("auto" | "aprovacao"), or "demo" without Google credentials.
 * `days` = free slots grouped by local day (the QuoteForm flattens them; no flat list is sent,
 * so clients that merge `days` and `slots` never see duplicates).
 */
export interface SlotsPayload {
  mode: "auto" | "aprovacao" | "demo";
  timeZone: string;
  slotMinutes: number;
  days: SlotDay[];
}

export interface QuotePrefill {
  engagement?: "continuous" | "project" | "consulting" | "unsure";
  solutions?: Array<"web_platform" | "mobile_app" | "ai_agents" | "whatsapp_bots" | "integrations" | "legacy_evolution" | "other">;
  deadline?: "asap" | "1_3_months" | "no_date";
  description?: string;
}

export type OrbitaUi =
  | { kind: "projects"; slugs: string[] }
  | { kind: "slots"; data: SlotsPayload }
  | { kind: "contact"; start: string | null; name?: string; email?: string; summary?: string }
  | { kind: "quote"; prefill: QuotePrefill };

export type ChatErrorCode = "rate_limited" | "invalid" | "unavailable" | "refused" | "server";

export type OrbitaStreamEvent =
  | { type: "text"; delta: string }
  | { type: "tool"; id: string; tool: ToolLineId; status: "running" | "done" | "error" }
  | { type: "ui"; ui: OrbitaUi }
  | { type: "done" }
  | { type: "error"; code: ChatErrorCode; retryAfter?: number };

export interface OrbitaStatus {
  chat: Mode;
  calendar: Mode;
  bookingMode: "auto" | "aprovacao";
  timeZone: string;
  slotMinutes: number;
}

export interface BookResponse {
  ok: true;
  mode: Mode;
  intent: "book" | "callback";
  /** confirmed = invite sent (auto) · pending = hold + request to Wesley (aprovacao) · received = callback lead */
  status: "confirmed" | "pending" | "received";
  start?: string;
  end?: string;
  meetLink?: string | null;
  /** §10.3 aliases for the QuoteForm */
  meetUrl?: string;
  eventId?: string;
  email: string;
}

export interface ApiError {
  ok: false;
  error: "invalid" | "rate_limited" | "slot_taken" | "unavailable" | "server";
  issues?: Array<{ path: string; message: string }>;
  retryAfter?: number;
}

/** Optional quick replies: the model may end a message with ">> A | B | C". */
export const CHIPS_MARKER = ">>";

/**
 * Split a streamed assistant text into display text and quick-reply chips.
 * While streaming, anything from a line starting with ">>" is hidden.
 */
export function splitChips(text: string): { body: string; chips: string[] } {
  const idx = text.search(/(^|\n)\s*>>/);
  if (idx === -1) return { body: text.trimEnd(), chips: [] };
  const body = text.slice(0, idx).trimEnd();
  const line = text.slice(idx).replace(/^\s*>>/, "").trim();
  const chips = line
    .split("|")
    .map((c) => c.replace(/^[\s>]+/, "").trim())
    .filter((c) => c.length > 0 && c.length <= 60)
    .slice(0, 3);
  return { body, chips };
}

/**
 * Window event dispatched on "Detalhar orçamento" with the full QuotePrefill + source "orbita"
 * (the QuoteForm listens; docs/REDESIGN.md §10.1). The widget also calls requestQuotePrefill()
 * for the scroll + focus behaviour.
 */
export const QUOTE_PREFILL_EVENT = "orbita:quote-prefill";
