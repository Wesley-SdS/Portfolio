/**
 * "Como um trabalho acontece" (v3spec §5.7, reused on /contratar §9.4).
 * Copy: process.steps.<id>.{title, text}; process.method.{eyebrow, text}.
 * The last node is filled with --accent (`filled: true`).
 */
export const PROCESS_STEPS = [
  { id: "call", num: "01", filled: false },
  { id: "proposal", num: "02", filled: false },
  { id: "build", num: "03", filled: false },
  { id: "delivery", num: "04", filled: true },
] as const;

/** /contratar "Como uso IA no desenvolvimento" meta rows — copy: hire.aiMethod.rows.<id>. */
export const AI_METHOD_ROWS = ["tests", "ownership", "observability", "lgpd"] as const;

/** /contratar FAQ — copy: hire.faq.items.<id>.{q, a}. Single-open, default 0. */
export const FAQ_ITEMS = ["price", "firstCall", "who", "nda", "code", "remote"] as const;
