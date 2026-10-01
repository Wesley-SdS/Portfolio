import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createRateLimiter, handleQuote } from "./lib";

/**
 * POST /api/quote — QuoteForm intake (v3spec §7.3; contract docs/REDESIGN.md §10.2).
 * zod validation (shared quoteSchema) · honeypot · 5 req / 10 min / IP (in memory,
 * per server instance) · Resend e-mail to Wesley with reply-to = visitor ·
 * optional confirmation to the visitor. Env: RESEND_API_KEY, CONTACT_EMAIL,
 * RESEND_FROM_EMAIL, QUOTE_CONFIRMATION_EMAIL ("off" disables), NEXT_PUBLIC_SITE_URL.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const apiKey = process.env.RESEND_API_KEY;
  // instantiated per request so builds without RESEND_API_KEY never crash at import time
  const resend = apiKey ? new Resend(apiKey) : null;

  const result = await handleQuote(raw, request.headers, {
    env: {
      RESEND_API_KEY: apiKey,
      CONTACT_EMAIL: process.env.CONTACT_EMAIL,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
      QUOTE_CONFIRMATION_EMAIL: process.env.QUOTE_CONFIRMATION_EMAIL,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
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
