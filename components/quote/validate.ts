import {
  quoteSchema,
  type QuoteBudget,
  type QuoteDeadline,
  type QuoteEngagement,
  type QuotePayload,
  type QuoteSolution,
  type QuoteStart,
} from "../../src/content/quote";
import type { ProjectSlug } from "../../src/content/types";

/**
 * Per-step validation for the QuoteForm, driven by the shared `quoteSchema`
 * (src/content/quote.ts) so the client and POST /api/quote agree.
 * Error values are MESSAGE KEYS (e.g. "quote.errors.email").
 */

export type QuoteLocale = "pt" | "en" | "es";

export interface QuoteValues {
  engagement: QuoteEngagement | null;
  solutions: QuoteSolution[];
  other: string;
  description: string;
  start: QuoteStart;
  link: string;
  deadline: QuoteDeadline | null;
  budget: QuoteBudget;
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  consent: boolean;
  ref?: ProjectSlug;
}

export const EMPTY_VALUES: QuoteValues = {
  engagement: null,
  solutions: [],
  other: "",
  description: "",
  start: "zero",
  link: "",
  deadline: null,
  budget: "discuss_on_call",
  name: "",
  company: "",
  email: "",
  whatsapp: "",
  consent: false,
};

export type QuoteField = keyof QuotePayload;
export type FormStep = 1 | 2 | 3 | 4 | 5;

/** Which payload fields each step owns (errors are filtered by this map). */
export const STEP_FIELDS: Record<FormStep, QuoteField[]> = {
  1: ["engagement"],
  2: ["solutions", "other"],
  3: ["description", "start", "link"],
  4: ["deadline", "budget"],
  5: ["name", "company", "email", "whatsapp", "consent"],
};

export type StepErrors = Partial<Record<QuoteField, string>>;

/** "exemplo.com.br" → "https://exemplo.com.br"; blank stays blank. */
export function normalizeLink(raw: string) {
  const v = raw.trim();
  if (!v) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) return v;
  return `https://${v}`;
}

const opt = (v: string) => {
  const t = v.trim();
  return t ? t : undefined;
};

/** Build the §7.3 payload from the form values (never throws). */
export function buildPayload(
  v: QuoteValues,
  meta: { locale: QuoteLocale; source?: "site" | "orbita"; website?: string },
): Record<string, unknown> {
  return {
    engagement: v.engagement ?? undefined,
    solutions: v.solutions,
    other: v.solutions.includes("other") ? opt(v.other) ?? "" : undefined,
    description: v.description.trim(),
    start: v.start,
    link: normalizeLink(v.link) || undefined,
    deadline: v.deadline ?? undefined,
    budget: v.budget,
    name: v.name.trim(),
    company: opt(v.company),
    email: v.email.trim(),
    whatsapp: opt(v.whatsapp),
    consent: v.consent,
    website: meta.website ?? "",
    locale: meta.locale,
    source: meta.source ?? "site",
    ref: v.ref,
  };
}

/** All schema issues keyed by top-level field (first message wins). */
export function collectErrors(payload: Record<string, unknown>): StepErrors {
  const res = quoteSchema.safeParse(payload);
  const errors: StepErrors = {};
  if (!res.success) {
    for (const issue of res.error.issues) {
      const key = issue.path[0] as QuoteField | undefined;
      if (key && !errors[key]) errors[key] = issue.message;
    }
  }
  // object-level refine may be skipped when other fields fail — check "other" explicitly
  const sols = payload.solutions as string[] | undefined;
  if (!errors.other && sols?.includes("other") && !String(payload.other ?? "").trim()) {
    errors.other = "quote.steps.s2.otherError";
  }
  return errors;
}

/** Errors that belong to `step` only (empty object = step is valid). */
export function validateStep(step: FormStep, v: QuoteValues, locale: QuoteLocale = "pt"): StepErrors {
  const all = collectErrors(buildPayload(v, { locale }));
  const out: StepErrors = {};
  for (const f of STEP_FIELDS[step]) if (all[f]) out[f] = all[f];
  return out;
}

/** First step (1–5) that has an error, or null when the whole payload is valid. */
export function firstInvalidStep(errors: StepErrors): FormStep | null {
  for (const s of [1, 2, 3, 4, 5] as FormStep[]) {
    if (STEP_FIELDS[s].some((f) => errors[f])) return s;
  }
  return null;
}

/** First name for the success title ("Ana Ribeiro" → "Ana"). */
export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? "";
}
