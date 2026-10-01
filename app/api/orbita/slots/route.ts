import { presentedSlots } from "@/lib/orbita/calendar";
import { RATE_LIMITS } from "@/lib/orbita/config";
import { jsonError, NO_STORE } from "@/lib/orbita/http";
import { clientIp, rateLimit } from "@/lib/orbita/rate-limit";
import { flattenIssues, slotsQuerySchema } from "@/lib/orbita/schemas";

/**
 * GET /api/orbita/slots?source=orbita|quote&days=3&perDay=6 → SlotsPayload (lib/orbita/protocol.ts,
 * docs/REDESIGN.md §10.3: { mode: "auto"|"aprovacao"|"demo", timeZone, slotMinutes, days }).
 * Free 30-min slots from Google free/busy within business hours; without Google
 * credentials returns realistic demo data flagged `mode: "demo"`.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const rl = rateLimit(`slots:${clientIp(req.headers)}`, RATE_LIMITS.slotsPerMinute, 60_000);
  if (!rl.ok) return jsonError(429, { error: "rate_limited", retryAfter: rl.retryAfter });

  const url = new URL(req.url);
  const q = slotsQuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!q.success) return jsonError(400, { error: "invalid", issues: flattenIssues(q.error) });

  try {
    const data = await presentedSlots(q.data.days, q.data.perDay ?? (q.data.source === "quote" ? 8 : 6));
    return Response.json(data, { headers: NO_STORE });
  } catch (e) {
    console.error("[orbita] slots failed", e instanceof Error ? e.message : e);
    return jsonError(503, { error: "unavailable" });
  }
}
