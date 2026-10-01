import { z } from "zod";

/**
 * Quote request contract (v3spec §7.3) — production endpoint `POST /api/quote`
 * (to be built by the quote agent; reuse the Resend sender of app/api/contact).
 * The engagement + solution enums equal orbitmind-platform's `quote_requests`
 * enums; `budget` is new (OWNER-FLAG v3spec §13 E.27–28).
 *
 * Validation messages are MESSAGE KEYS (e.g. "quote.errors.name"); translate
 * them with `t(issue.message)` using the root translator.
 */

export const QUOTE_ENGAGEMENTS = ["continuous", "project", "consulting", "unsure"] as const;
export const QUOTE_SOLUTIONS = [
  "web_platform",
  "mobile_app",
  "ai_agents",
  "whatsapp_bots",
  "integrations",
  "legacy_evolution",
  "other",
] as const;
export const QUOTE_STARTS = ["zero", "existing", "prototype"] as const;
export const QUOTE_DEADLINES = ["asap", "1_3_months", "no_date"] as const;
export const QUOTE_BUDGETS = ["discuss_on_call", "has_budget", "estimating"] as const;

export type QuoteEngagement = (typeof QUOTE_ENGAGEMENTS)[number];
export type QuoteSolution = (typeof QUOTE_SOLUTIONS)[number];
export type QuoteStart = (typeof QUOTE_STARTS)[number];
export type QuoteDeadline = (typeof QUOTE_DEADLINES)[number];
export type QuoteBudget = (typeof QUOTE_BUDGETS)[number];

/** Steps of the QuoteForm (titles: quote.steps.s<n>.title). */
export const QUOTE_STEP_COUNT = 5;

export const quoteSchema = z
  .object({
    engagement: z.enum(QUOTE_ENGAGEMENTS, { message: "quote.steps.s1.error" }),
    solutions: z.array(z.enum(QUOTE_SOLUTIONS)).min(1, "quote.steps.s2.error"),
    other: z.string().max(200).optional(),
    description: z.string().trim().min(20, "quote.steps.s3.error").max(4000),
    start: z.enum(QUOTE_STARTS),
    link: z.string().url("quote.errors.link").optional().or(z.literal("")),
    deadline: z.enum(QUOTE_DEADLINES, { message: "quote.steps.s4.error" }),
    budget: z.enum(QUOTE_BUDGETS).default("discuss_on_call"),
    name: z.string().trim().min(2, "quote.errors.name").max(120),
    company: z.string().trim().max(120).optional(),
    email: z.string().trim().email("quote.errors.email"),
    whatsapp: z.string().trim().max(40).optional(),
    consent: z.literal(true, { message: "quote.errors.consent" }),
    /** honeypot — must stay empty */
    website: z.string().max(0).optional().default(""),
    locale: z.enum(["pt", "en", "es"]),
    source: z.enum(["site", "orbita"]).default("site"),
    /** project slug when the visitor came from "Quero algo assim" */
    ref: z.string().max(40).optional(),
  })
  .refine((v) => !v.solutions.includes("other") || (v.other ?? "").trim().length > 0, {
    path: ["other"],
    message: "quote.steps.s2.otherError",
  });

export type QuotePayload = z.infer<typeof quoteSchema>;

