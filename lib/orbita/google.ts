import { createHash, createSign } from "node:crypto";
import { calendarId, googleCredentialKind } from "./config";

/**
 * Minimal Google Calendar client over fetch (no googleapis dependency).
 * Scopes: calendar.freebusy (read free/busy only — never event titles) and
 * calendar.events (insert the booking). Server-only.
 *
 * Auth, in order of preference:
 *  1. OAuth refresh token of Wesley's account (GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN).
 *     Required for a personal @gmail.com calendar: only a real user can invite
 *     attendees and create Meet links.
 *  2. Service account (GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY), with
 *     GOOGLE_IMPERSONATE_USER for Workspace domain-wide delegation. Without
 *     delegation a service account can read free/busy of a shared calendar but
 *     cannot send invitations.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://www.googleapis.com/calendar/v3";
const SCOPES = "https://www.googleapis.com/auth/calendar.freebusy https://www.googleapis.com/auth/calendar.events";

let cached: { token: string; exp: number } | null = null;

export class GoogleApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function tokenRequest(body: URLSearchParams) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!res.ok) throw new GoogleApiError(res.status, `token exchange failed (${res.status})`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: json.access_token, exp: Date.now() + (json.expires_in - 60) * 1000 };
  return json.access_token;
}

export async function getAccessToken(): Promise<string> {
  if (cached && cached.exp > Date.now()) return cached.token;
  const kind = googleCredentialKind();
  if (kind === "oauth") {
    return tokenRequest(
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      }),
    );
  }
  if (kind === "service_account") {
    const now = Math.floor(Date.now() / 1000);
    const claims: Record<string, unknown> = {
      iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      scope: SCOPES,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    };
    if (process.env.GOOGLE_IMPERSONATE_USER) claims.sub = process.env.GOOGLE_IMPERSONATE_USER;
    const unsigned = `${b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64url(JSON.stringify(claims))}`;
    const key = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");
    const signature = createSign("RSA-SHA256").update(unsigned).sign(key);
    return tokenRequest(
      new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${unsigned}.${b64url(signature)}`,
      }),
    );
  }
  throw new GoogleApiError(500, "Google credentials not configured");
}

async function api<T>(path: string, init: RequestInit & { query?: Record<string, string> } = {}): Promise<T> {
  const token = await getAccessToken();
  const qs = init.query ? `?${new URLSearchParams(init.query)}` : "";
  const res = await fetch(`${API}${path}${qs}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...(init.headers ?? {}) },
    cache: "no-store",
    signal: init.signal ?? AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new GoogleApiError(res.status, `Google Calendar ${path} failed (${res.status})`);
  return (await res.json()) as T;
}

/** Busy intervals of the configured calendar (free/busy only — no titles, no attendees). */
export async function freeBusy(timeMin: Date, timeMax: Date, timeZone: string) {
  const id = calendarId();
  const json = await api<{ calendars: Record<string, { busy?: Array<{ start: string; end: string }>; errors?: unknown[] }> }>(
    "/freeBusy",
    {
      method: "POST",
      body: JSON.stringify({ timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(), timeZone, items: [{ id }] }),
    },
  );
  const cal = json.calendars?.[id];
  if (!cal || (cal.errors && cal.errors.length)) throw new GoogleApiError(502, "free/busy returned errors for the calendar");
  return (cal.busy ?? []).map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
}

export interface CalendarEvent {
  id: string;
  status?: string;
  htmlLink?: string;
  hangoutLink?: string;
  conferenceData?: { entryPoints?: Array<{ entryPointType: string; uri: string }>; createRequest?: { status?: { statusCode: string } } };
}

/**
 * Deterministic event id → idempotent insert (same visitor + same slot never
 * books twice). Google ids allow base32hex chars (0-9, a-v); hex is a subset.
 */
export function bookingEventId(email: string, startIso: string) {
  return `orb${createHash("sha256").update(`${email.toLowerCase()}|${new Date(startIso).toISOString()}|${calendarId()}`).digest("hex").slice(0, 40)}`;
}

export function meetLinkOf(ev: CalendarEvent): string | null {
  return ev.hangoutLink ?? ev.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ?? null;
}

export async function getEvent(eventId: string) {
  return api<CalendarEvent>(`/calendars/${encodeURIComponent(calendarId())}/events/${eventId}`, { method: "GET" });
}

/** events.insert with conferenceDataVersion=1; 409 (same id) returns the existing event. */
export async function insertEvent(body: Record<string, unknown> & { id: string }, sendUpdates: "all" | "none") {
  try {
    return await api<CalendarEvent>(`/calendars/${encodeURIComponent(calendarId())}/events`, {
      method: "POST",
      query: { conferenceDataVersion: "1", sendUpdates },
      body: JSON.stringify(body),
    });
  } catch (e) {
    if (e instanceof GoogleApiError && e.status === 409) return getEvent(body.id);
    throw e;
  }
}
