import { parseHm } from "./time";
import type { ScheduleConfig } from "./slots";

/**
 * Órbita server configuration — every knob is an env var (documented in
 * .env.example and docs/REDESIGN.md §10). Server-only: never import from a
 * client component (it reads secrets' presence, not their values, but still).
 */

export type BookingMode = "auto" | "aprovacao";
export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

/** Default Claude model (claude-api skill: latest capable model). Override with ORBITA_MODEL. */
export const DEFAULT_MODEL = "claude-opus-5";

function int(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/** "1,2,3,4,5" or "1-5" → [1,2,3,4,5] (0 = Sunday). */
export function parseWorkDays(raw: string | undefined): number[] {
  if (!raw || !raw.trim()) return [1, 2, 3, 4, 5];
  const out = new Set<number>();
  for (const part of raw.split(",")) {
    const p = part.trim();
    const range = /^(\d)\s*-\s*(\d)$/.exec(p);
    if (range) {
      for (let d = Number(range[1]); d <= Number(range[2]); d++) out.add(d % 7);
    } else if (/^\d$/.test(p)) out.add(Number(p) % 7);
  }
  return out.size ? [...out].sort() : [1, 2, 3, 4, 5];
}

/** "09:00-12:00,13:30-18:00" → [[540,720],[810,1080]]. */
export function parseWorkWindows(raw: string | undefined): Array<[number, number]> {
  const src = raw && raw.trim() ? raw : "09:00-18:00";
  const windows: Array<[number, number]> = [];
  for (const part of src.split(",")) {
    const [a, b] = part.split("-");
    if (!a || !b) continue;
    try {
      const s = parseHm(a);
      const e = parseHm(b);
      if (e > s) windows.push([s, e]);
    } catch {
      /* ignore malformed window */
    }
  }
  return windows.length ? windows.sort((x, y) => x[0] - y[0]) : [[540, 1080]];
}

export function scheduleConfig(): ScheduleConfig {
  return {
    timeZone: process.env.ORBITA_TIMEZONE?.trim() || "America/Sao_Paulo",
    workDays: parseWorkDays(process.env.ORBITA_WORK_DAYS),
    workWindows: parseWorkWindows(process.env.ORBITA_WORK_HOURS),
    slotMinutes: int("ORBITA_SLOT_MINUTES", 30, 15, 120),
    lookaheadDays: int("ORBITA_LOOKAHEAD_DAYS", 10, 1, 60),
    minNoticeHours: int("ORBITA_MIN_NOTICE_HOURS", 24, 0, 24 * 14),
    bufferMinutes: int("ORBITA_BUFFER_MINUTES", 0, 0, 120),
  };
}

export function bookingMode(): BookingMode {
  return process.env.ORBITA_BOOKING_MODE?.trim().toLowerCase() === "aprovacao" ? "aprovacao" : "auto";
}

export function calendarId(): string {
  return process.env.WESLEY_CALENDAR_ID?.trim() || "primary";
}

/** Google credentials: OAuth refresh token (recommended for a personal account) or service account. */
export function googleCredentialKind(): "oauth" | "service_account" | null {
  const e = process.env;
  if (e.GOOGLE_CLIENT_ID && e.GOOGLE_CLIENT_SECRET && e.GOOGLE_REFRESH_TOKEN) return "oauth";
  if (e.GOOGLE_SERVICE_ACCOUNT_EMAIL && e.GOOGLE_PRIVATE_KEY) return "service_account";
  return null;
}

/** Calendar is live only with credentials AND an explicit calendar id. */
export function calendarLive(): boolean {
  return googleCredentialKind() !== null && Boolean(process.env.WESLEY_CALENDAR_ID?.trim());
}

export function chatLive(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

export function modelConfig() {
  const model = process.env.ORBITA_MODEL?.trim() || DEFAULT_MODEL;
  const effortRaw = process.env.ORBITA_EFFORT?.trim().toLowerCase();
  const effort: Effort = (["low", "medium", "high", "xhigh", "max"] as const).includes(effortRaw as Effort)
    ? (effortRaw as Effort)
    : "low";
  // Server-side refusal fallback ("default" routing) on the models that support it;
  // disable with ORBITA_FALLBACKS=off (e.g. behind a proxy that rejects the beta).
  const fallbacks = process.env.ORBITA_FALLBACKS?.trim().toLowerCase() !== "off" && /^claude-(opus-5|fable-5)/.test(model);
  // Adaptive thinking + output_config.effort exist on the 4.6+ generation (Opus 5/5.5, Sonnet 5,
  // Opus/Sonnet 4.6+). Haiku 4.5 and older models reject them (400), so they are omitted there.
  // Cost trade-off (per 1M tokens in/out): Opus 5 $5/$25 · Sonnet 5 $2/$10 · Haiku 4.5 $1/$5.
  const reasoning = !/haiku|claude-3|-4-5|-4-1|-4-0|-4-2025/.test(model);
  return {
    model,
    effort,
    reasoning,
    maxTokens: int("ORBITA_MAX_TOKENS", 8000, 1024, 64000),
    fallbacks,
    maxToolRounds: 4,
  };
}

export function notifyConfig() {
  return {
    resendKey: process.env.RESEND_API_KEY?.trim() || null,
    to: process.env.ORBITA_NOTIFY_EMAIL?.trim() || process.env.CONTACT_EMAIL?.trim() || "wesleysantos.0095@gmail.com",
    from: process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev",
  };
}

/** Input limits for the public chat endpoint (prompt-injection / cost hardening). */
export const CHAT_LIMITS = {
  maxMessages: 24,
  maxMessageChars: 1500,
  maxTotalChars: 16000,
} as const;

/** Per-IP rate limits (best effort, in-memory per server instance). */
export const RATE_LIMITS = {
  chatPerMinute: int("ORBITA_RATE_CHAT_PER_MIN", 8, 1, 120),
  chatPerHour: int("ORBITA_RATE_CHAT_PER_HOUR", 60, 1, 2000),
  slotsPerMinute: 20,
  bookPerHour: 6,
} as const;
