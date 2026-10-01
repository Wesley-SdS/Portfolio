import { book, SlotTakenError } from "@/lib/orbita/booking";
import { RATE_LIMITS } from "@/lib/orbita/config";
import { jsonError, NO_STORE, readJson } from "@/lib/orbita/http";
import { clientIp, rateLimit } from "@/lib/orbita/rate-limit";
import { bookRequestSchema, flattenIssues } from "@/lib/orbita/schemas";

/**
 * POST /api/orbita/book — explicit visitor submit from the contact card.
 *   { intent: "book", start, name, email, consent: true, summary?, locale, website: "" }
 *   { intent: "callback", name, email, consent: true, summary?, locale, website: "" }
 * ORBITA_BOOKING_MODE=auto → event with the visitor as attendee + Google Meet, invite sent.
 * ORBITA_BOOKING_MODE=aprovacao → tentative hold on Wesley's calendar + e-mail to Wesley (Resend).
 * No Google credentials → demo response (`mode: "demo"`), nothing is written.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rl = rateLimit(`book:${clientIp(req.headers)}`, RATE_LIMITS.bookPerHour, 3_600_000);
  if (!rl.ok) return jsonError(429, { error: "rate_limited", retryAfter: rl.retryAfter });

  const body = await readJson(req, 8_000);
  if (!body.ok) return jsonError(400, { error: "invalid" });
  const parsed = bookRequestSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(400, { error: "invalid", issues: flattenIssues(parsed.error) });

  try {
    const result = await book(parsed.data);
    return Response.json(result, { headers: NO_STORE });
  } catch (e) {
    if (e instanceof SlotTakenError) return jsonError(409, { error: "slot_taken" });
    console.error("[orbita] booking failed", e instanceof Error ? e.message : e);
    return jsonError(503, { error: "unavailable" });
  }
}
