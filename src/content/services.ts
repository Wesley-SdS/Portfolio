import { ANCHORS, ROUTES } from "./site";

/**
 * Engagement models + solution types (v3spec §5.6, §9.2, §9.3).
 * The ids are the production enums of the quote payload (§7.3) — keep them
 * 1:1 with `QuoteEngagement` / `QuoteSolution` in ./quote.ts.
 *
 * Copy:
 *   services.models.<id>.{title, oneLiner, items[5], how, ideal}
 *   hire.comparison.models.<id>.{oneLiner, ideal, how, cadence, deliverables, investment}
 *   services.solutions.<id>.{title, desc, stack, proofs.<proofKey>}
 */

export const ENGAGEMENT_MODELS = [
  { id: "techlead", num: "01", hireAnchor: "lideranca", cta: "call" },
  { id: "continuous", num: "02", hireAnchor: "continuo", cta: "quote" },
  { id: "project", num: "03", hireAnchor: "projeto", cta: "quote" },
  { id: "consulting", num: "04", hireAnchor: "consultoria", cta: "quote" },
] as const;

export type EngagementModelId = (typeof ENGAGEMENT_MODELS)[number]["id"];
/** models whose CTA prefills the quote form (the tech-lead model books a call instead) */
export type QuoteEngagementId = Exclude<EngagementModelId, "techlead">;

/** A "Prova:" link. Label: services.solutions.<solution>.proofs.<key>. */
export interface SolutionProof {
  key: string;
  href: string;
}

/**
 * "O que eu construo": twelve capabilities, each mapped to the quote enum (`quote`) so a card can
 * prefill the form. Proofs come from the repo audit of 2026-09-30 (Adaflow, the OrbitMind pipeline,
 * Órbita, Vektus, Suíte Nex, the WhatsApp workspace, the Revoluna shift platform).
 */
export const SOLUTIONS: { id: string; quote: "web_platform" | "mobile_app" | "ai_agents" | "whatsapp_bots" | "integrations" | "legacy_evolution"; proofs: SolutionProof[] }[] = [
  {
    id: "web_platform",
    quote: "web_platform",
    proofs: [
      { key: "adaflow", href: `#${ANCHORS.allProducts}` },
      { key: "plantoes", href: `#${ANCHORS.allProducts}` },
      { key: "orbitaExpo", href: ROUTES.project("orbita") },
    ],
  },
  {
    id: "ai_agents",
    quote: "ai_agents",
    proofs: [
      { key: "orbita", href: ROUTES.project("orbita") },
      { key: "adaflow", href: `#${ANCHORS.allProducts}` },
      { key: "orbitmind", href: ROUTES.project("orbitmind") },
    ],
  },
  {
    id: "rag",
    quote: "ai_agents",
    proofs: [
      { key: "vektus", href: ROUTES.project("vektus") },
      { key: "orbitaRag", href: ROUTES.project("orbita") },
      { key: "adaflowOcr", href: `#${ANCHORS.allProducts}` },
    ],
  },
  {
    id: "workflows",
    quote: "integrations",
    proofs: [
      { key: "adaflowNodes", href: `#${ANCHORS.allProducts}` },
      { key: "kestra", href: `#${ANCHORS.experience}` },
    ],
  },
  {
    id: "whatsapp_bots",
    quote: "whatsapp_bots",
    proofs: [
      { key: "nex", href: ROUTES.project("nex") },
      { key: "waworkspace", href: `#${ANCHORS.allProducts}` },
      { key: "orbitfinance", href: ROUTES.project("orbitfinance") },
    ],
  },
  {
    id: "integrations",
    quote: "integrations",
    proofs: [
      { key: "adaflowConnectors", href: `#${ANCHORS.allProducts}` },
      { key: "orbitmind", href: ROUTES.project("orbitmind") },
    ],
  },
  {
    id: "security",
    quote: "web_platform",
    proofs: [
      { key: "adaflowSecurity", href: `#${ANCHORS.allProducts}` },
      { key: "orbitaCrypto", href: ROUTES.project("orbita") },
    ],
  },
  {
    id: "finops",
    quote: "web_platform",
    proofs: [
      { key: "adaflowCredits", href: `#${ANCHORS.allProducts}` },
      { key: "orbitaSpend", href: ROUTES.project("orbita") },
    ],
  },
  {
    id: "pipeline",
    quote: "ai_agents",
    proofs: [{ key: "orbitpipeline", href: `#${ANCHORS.allProducts}` }],
  },
  {
    id: "quality",
    quote: "legacy_evolution",
    proofs: [
      { key: "adaflowTests", href: `#${ANCHORS.allProducts}` },
      { key: "nexTests", href: ROUTES.project("nex") },
    ],
  },
  {
    id: "voice",
    quote: "ai_agents",
    proofs: [
      { key: "orbitaVoice", href: ROUTES.project("orbita") },
      { key: "adaflowVoice", href: `#${ANCHORS.allProducts}` },
    ],
  },
  {
    id: "legacy_evolution",
    quote: "legacy_evolution",
    proofs: [
      { key: "plantoes", href: `#${ANCHORS.allProducts}` },
      { key: "mg", href: `#${ANCHORS.experience}` },
    ],
  },
];

/** Hire page comparison rows (label: hire.comparison.rows.<row>). */
export const COMPARISON_ROWS = ["oneLiner", "ideal", "includes", "how", "cadence", "deliverables", "investment"] as const;
