import {
  QUOTE_DEADLINES,
  QUOTE_ENGAGEMENTS,
  QUOTE_SOLUTIONS,
  type QuoteDeadline,
  type QuoteEngagement,
  type QuoteSolution,
} from "../../src/content/quote";
import { PROJECTS } from "../../src/content/projects";
import type { ProjectSlug } from "../../src/content/types";

/**
 * Quote prefill contract (docs/REDESIGN.md §10.1).
 *   URL:  ?tipo=<ProjectSlug>  ?formato=<QuoteEngagement>  ?solucao=<QuoteSolution>[,…]  (+ #cotacao)
 *   Same page: requestQuotePrefill(detail) from ./quote-bridge
 * Pure helpers only (unit-tested in __tests__/quote-prefill.test.ts).
 */
export interface QuotePrefill {
  /** project slug from "Quero algo assim" → payload `ref` */
  ref?: ProjectSlug;
  engagement?: QuoteEngagement;
  solutions?: QuoteSolution[];
  /** from the Órbita chat's "Detalhar orçamento" (event orbita:quote-prefill) */
  deadline?: QuoteDeadline;
  /** used only when the visitor has not typed a description yet */
  description?: string;
  /** "orbita" when the chat handed the visitor over → payload `source` */
  source?: "site" | "orbita";
}

/** Solutions pre-selected when the visitor came from a given project. */
export const REF_SOLUTIONS: Partial<Record<ProjectSlug, QuoteSolution[]>> = {
  orbita: ["ai_agents", "mobile_app"],
  orbitmind: ["ai_agents", "web_platform"],
  nex: ["whatsapp_bots", "ai_agents"],
  nexbot: ["whatsapp_bots", "ai_agents"],
  nexconnect: ["whatsapp_bots", "integrations"],
  orbitfinance: ["whatsapp_bots"],
  vibecoding: ["ai_agents", "web_platform"],
  vektus: ["ai_agents"],
  influencerai: ["ai_agents"],
  fsjpii: ["web_platform"],
  "love-startup": ["web_platform"],
  ecommerce: ["web_platform"],
};

export function isProjectSlug(v: unknown): v is ProjectSlug {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(PROJECTS, v);
}

export function isEngagement(v: unknown): v is QuoteEngagement {
  return typeof v === "string" && (QUOTE_ENGAGEMENTS as readonly string[]).includes(v);
}

export function isSolution(v: unknown): v is QuoteSolution {
  return typeof v === "string" && (QUOTE_SOLUTIONS as readonly string[]).includes(v);
}

/** Drop unknown values; derive solutions from `ref` when none are given. */
export function sanitizePrefill(
  input: { ref?: unknown; engagement?: unknown; solutions?: unknown; deadline?: unknown; description?: unknown; source?: unknown } | null | undefined,
): QuotePrefill {
  if (!input) return {};
  const out: QuotePrefill = {};
  if (isProjectSlug(input.ref)) out.ref = input.ref;
  if (isEngagement(input.engagement)) out.engagement = input.engagement;
  if (typeof input.deadline === "string" && (QUOTE_DEADLINES as readonly string[]).includes(input.deadline)) {
    out.deadline = input.deadline as QuoteDeadline;
  }
  if (typeof input.description === "string" && input.description.trim()) out.description = input.description.trim().slice(0, 4000);
  if (input.source === "orbita" || input.source === "site") out.source = input.source;
  const sols = Array.isArray(input.solutions) ? input.solutions.filter(isSolution) : [];
  const unique = Array.from(new Set(sols));
  if (unique.length) out.solutions = unique;
  else if (out.ref && REF_SOLUTIONS[out.ref]) out.solutions = [...REF_SOLUTIONS[out.ref]!];
  return out;
}

/** Read the prefill from a query string ("?tipo=orbitmind&formato=project"). */
export function prefillFromSearch(search: string): QuotePrefill {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const solucao = q.get("solucao");
  return sanitizePrefill({
    ref: q.get("tipo") ?? undefined,
    engagement: q.get("formato") ?? undefined,
    solutions: solucao ? solucao.split(",").map((s) => s.trim()) : undefined,
  });
}

export function hasPrefill(p: QuotePrefill) {
  return Boolean(p.ref || p.engagement || p.deadline || p.description || (p.solutions && p.solutions.length));
}
