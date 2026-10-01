"use client";

import type { ReactNode } from "react";
import { requestQuotePrefill } from "@/components/quote/quote-bridge";
import type { QuotePrefill } from "@/components/quote/prefill";

/**
 * "Solicitar orçamento →" on a model card: a real `#cotacao` link that, with JS,
 * pre-selects the engagement model in every mounted QuoteForm (docs/REDESIGN.md §10.1)
 * and scrolls/focuses the form. Without JS it is a plain anchor jump.
 */
export function QuoteModelLink({
  engagement,
  className,
  children,
}: {
  engagement: NonNullable<QuotePrefill["engagement"]>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#cotacao"
      className={className}
      onClick={(e) => {
        if (!document.getElementById("cotacao")) return; // let the browser handle it
        e.preventDefault();
        requestQuotePrefill({ engagement });
      }}
    >
      {children}
    </a>
  );
}
