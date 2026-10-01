/** Quote request flow (v3spec §7) — owner: quote agent. Contracts: docs/REDESIGN.md §10. */
export { QuoteForm } from "./QuoteForm";
export type { QuoteFormProps } from "./QuoteForm";
export { requestQuotePrefill, QUOTE_PREFILL_EVENT, QUOTE_ANCHOR } from "./quote-bridge";
export type { QuotePrefill } from "./prefill";
export { CopyEmailButton } from "./CopyEmailButton";
