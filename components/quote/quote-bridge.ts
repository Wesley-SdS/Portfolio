"use client";

import { sanitizePrefill, type QuotePrefill } from "./prefill";

/**
 * Same-page prefill bridge (docs/REDESIGN.md §10.1). Any "Quero algo assim" /
 * "Quero este formato" control that stays on the page calls
 * `requestQuotePrefill({ ref: "orbitmind" })`; every mounted QuoteForm applies it.
 */
export const QUOTE_PREFILL_EVENT = "quote:prefill";
/** Dispatched by the Órbita chat ("Detalhar orçamento"; lib/orbita/protocol.ts) — the QuoteForm listens too. */
export const ORBITA_QUOTE_PREFILL_EVENT = "orbita:quote-prefill";
export const QUOTE_ANCHOR = "cotacao";

export function requestQuotePrefill(detail: QuotePrefill, opts: { scroll?: boolean } = {}) {
  if (typeof window === "undefined") return;
  const clean = sanitizePrefill(detail);
  window.dispatchEvent(new CustomEvent<QuotePrefill>(QUOTE_PREFILL_EVENT, { detail: clean }));
  if (opts.scroll === false) return;
  const target = document.getElementById(QUOTE_ANCHOR);
  if (!target) return;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  // move focus to the form heading once the scroll settles (keyboard + SR users land on the form)
  window.setTimeout(() => {
    const heading = target.querySelector<HTMLElement>("[data-quote-title]");
    heading?.focus({ preventScroll: true });
  }, reduced ? 0 : 450);
}
