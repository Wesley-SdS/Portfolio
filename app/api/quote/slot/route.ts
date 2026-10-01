import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createRateLimiter, handleSlotPreference } from "../lib";

/**
 * POST /api/quote/slot — QuoteForm step 6 fallback while the Órbita calendar runs in
 * demo mode (docs/REDESIGN.md §10.3): e-mails Wesley the visitor's preferred time
 * (reply-to = visitor). Body { start, end, name, email, company?, locale, ref?, website:"" }.
 * Same env and rate-limit rules as /api/quote.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const apiKey = process.env.RESEND_API_KEY;
  const resend = apiKey ? new Resend(apiKey) : null;
  const result = await handleSlotPreference(raw, request.headers, {
    env: {
      RESEND_API_KEY: apiKey,
      CONTACT_EMAIL: process.env.CONTACT_EMAIL,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
      NODE_ENV: process.env.NODE_ENV,
    },
    limiter,
    send: async (args) => {
      if (!resend) return { error: new Error("resend not configured") };
      const { error } = await resend.emails.send(args);
      return { error: error ?? undefined };
    },
  });
  return NextResponse.json(result.body, { status: result.status, headers: result.headers });
}
