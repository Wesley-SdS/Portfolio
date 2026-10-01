/**
 * Sliding-window rate limiter, in memory. Best effort: on serverless each instance
 * keeps its own window, so this caps bursts per instance, not globally. For a hard
 * global cap put the routes behind Vercel Firewall rules or swap this for a KV store
 * (same interface).
 */

const buckets = new Map<string, number[]>();
const MAX_KEYS = 5000;

export interface RateResult {
  ok: boolean;
  /** seconds until the next request is allowed (0 when ok) */
  retryAfter: number;
}

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateResult {
  const since = now - windowMs;
  const hits = (buckets.get(key) ?? []).filter((t) => t > since);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000)) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > MAX_KEYS) prune(now);
  return { ok: true, retryAfter: 0 };
}

/** Check several windows at once (e.g. per minute AND per hour); records one hit in each. */
export function rateLimitAll(key: string, rules: Array<{ limit: number; windowMs: number }>, now = Date.now()): RateResult {
  for (const r of rules) {
    const since = now - r.windowMs;
    const hits = (buckets.get(`${key}:${r.windowMs}`) ?? []).filter((t) => t > since);
    if (hits.length >= r.limit) return { ok: false, retryAfter: Math.max(1, Math.ceil((hits[0] + r.windowMs - now) / 1000)) };
  }
  for (const r of rules) rateLimit(`${key}:${r.windowMs}`, Number.MAX_SAFE_INTEGER, r.windowMs, now);
  return { ok: true, retryAfter: 0 };
}

function prune(now: number) {
  for (const [k, v] of buckets) {
    if (!v.length || v[v.length - 1] < now - 3_600_000) buckets.delete(k);
  }
}

/** Test helper. */
export function resetRateLimits() {
  buckets.clear();
}

/** Client IP from the proxy headers Vercel/Next set (falls back to a shared bucket). */
export function clientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim().slice(0, 64) || "unknown";
  return headers.get("x-real-ip")?.trim().slice(0, 64) || "unknown";
}
