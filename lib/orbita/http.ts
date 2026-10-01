import type { ApiError } from "./protocol";

/** JSON response helpers shared by the Órbita routes (no caching, no transcript logging). */

export const NO_STORE = { "cache-control": "no-store" } as const;

export function jsonError(status: number, body: Omit<ApiError, "ok">, extra: Record<string, string> = {}) {
  const headers: Record<string, string> = { ...NO_STORE, ...extra };
  if (body.retryAfter) headers["retry-after"] = String(body.retryAfter);
  return Response.json({ ok: false, ...body } satisfies ApiError, { status, headers });
}

/** Parse a JSON body with a byte cap (public endpoints). */
export async function readJson(req: Request, maxBytes: number): Promise<{ ok: true; data: unknown } | { ok: false }> {
  const len = Number(req.headers.get("content-length") ?? "0");
  if (len > maxBytes) return { ok: false };
  try {
    const text = await req.text();
    if (text.length > maxBytes) return { ok: false };
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false };
  }
}
