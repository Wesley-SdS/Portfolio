import { z } from "zod";
import { CHAT_LIMITS } from "./config";

/**
 * Input validation for the public Órbita routes. Everything a visitor sends is
 * untrusted: sizes are capped, control characters stripped, roles restricted.
 */

const LOCALES = ["pt", "en", "es"] as const;

/** Remove control chars (keep \n and \t), collapse runs of blank lines. */
export function sanitizeText(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g, "").replace(/\n{3,}/g, "\n\n");
}

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .transform(sanitizeText)
    .pipe(z.string().trim().min(1).max(CHAT_LIMITS.maxMessageChars)),
});

export const chatRequestSchema = z
  .object({
    messages: z.array(messageSchema).min(1).max(CHAT_LIMITS.maxMessages),
    locale: z.enum(LOCALES).default("pt"),
  })
  .superRefine((v, ctx) => {
    const total = v.messages.reduce((n, m) => n + m.content.length, 0);
    if (total > CHAT_LIMITS.maxTotalChars) ctx.addIssue({ code: "custom", path: ["messages"], message: "too_long" });
    if (v.messages[0]?.role !== "user") {
      ctx.addIssue({ code: "custom", path: ["messages", 0], message: "must_start_with_user" });
    }
    if (v.messages[v.messages.length - 1]?.role !== "user") {
      ctx.addIssue({ code: "custom", path: ["messages"], message: "last_must_be_user" });
    }
  });

export type ChatRequest = z.infer<typeof chatRequestSchema>;

const name = z.string().transform(sanitizeText).pipe(z.string().trim().min(2, "name").max(120, "name"));
const email = z.string().trim().max(200, "email").pipe(z.email("email"));
const summary = z.string().transform(sanitizeText).pipe(z.string().trim().max(1500)).optional();
/** honeypot: real visitors never fill it */
const website = z.string().max(0, "bot").optional();

/**
 * Booking body. Two callers (docs/REDESIGN.md §10.3):
 *  - the Órbita contact card: { intent, start, name, email, consent: true, summary?, locale, source: "orbita" }
 *  - QuoteForm step 6: { start, end, name, email, company?, locale, source: "quote", ref? } — consent was already
 *    given in the quote form, and `intent` defaults to "book".
 */
const bookBase = {
  name,
  email,
  summary,
  company: z.string().transform(sanitizeText).pipe(z.string().trim().max(120)).optional(),
  ref: z.string().max(40).optional(),
  source: z.enum(["orbita", "quote"]).default("orbita"),
  locale: z.enum(LOCALES).default("pt"),
  website,
};
const needsConsent = (v: { source: string; consent?: boolean }, ctx: z.RefinementCtx) => {
  if (v.source !== "quote" && v.consent !== true) ctx.addIssue({ code: "custom", path: ["consent"], message: "consent" });
};

export const bookRequestSchema = z.preprocess(
  (raw) => (raw && typeof raw === "object" && !("intent" in raw) ? { ...raw, intent: "book" } : raw),
  z.discriminatedUnion("intent", [
    z
      .object({
        intent: z.literal("book"),
        start: z.iso.datetime({ offset: true, message: "start" }),
        end: z.iso.datetime({ offset: true }).optional(),
        consent: z.boolean().optional(),
        ...bookBase,
      })
      .superRefine(needsConsent),
    z
      .object({ intent: z.literal("callback"), consent: z.boolean().optional(), ...bookBase })
      .superRefine(needsConsent),
  ]),
);

export type BookRequest = z.infer<typeof bookRequestSchema>;

export const slotsQuerySchema = z.object({
  source: z.enum(["orbita", "quote"]).default("orbita"),
  days: z.coerce.number().int().min(1).max(10).default(3),
  /** default: 6 for the chat grid (2 rows × 3), 8 for the QuoteForm picker */
  perDay: z.coerce.number().int().min(1).max(12).optional(),
});

/** Zod issues → flat, client-friendly list. */
export function flattenIssues(error: z.ZodError) {
  return error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
}

/* ---------- tool inputs (validated before any tool runs) ---------- */

export const searchPortfolioInput = z.object({
  query: z.string().max(120).optional(),
  category: z.enum(["ai", "messaging", "fintech", "custom"]).optional(),
});

export const getFreeSlotsInput = z.object({}).passthrough();

export const bookCallInput = z.object({
  start: z.string().max(40),
  name: z.string().max(120).optional(),
  email: z.string().max(200).optional(),
  summary: z.string().max(800).optional(),
});

export const handoffInput = z.object({
  engagement: z.enum(["techlead", "continuous", "project", "consulting", "unsure"]).optional(),
  solutions: z
    .array(z.enum(["web_platform", "mobile_app", "ai_agents", "whatsapp_bots", "integrations", "legacy_evolution", "other"]))
    .max(7)
    .optional(),
  deadline: z.enum(["asap", "1_3_months", "no_date"]).optional(),
  description: z.string().max(800).optional(),
});
