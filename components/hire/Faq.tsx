"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { FAQ_ITEMS } from "@/src/content/process";

/** /contratar FAQ (v3spec §9.6): single-open accordion (v2 .acc/.plus), first row open. */
export function Faq() {
  const t = useTranslations("hire.faq.items");
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq-box">
      {FAQ_ITEMS.map((id, i) => {
        const isOpen = open === i;
        return (
          <div key={id} className={cn("faq", isOpen && "is-open")}>
            <h3 className="faq-h">
              <button
                type="button"
                className="fq"
                id={`faq-b-${id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-p-${id}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{t(`${id}.q`)}</span>
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </button>
            </h3>
            <div className="acc" id={`faq-p-${id}`} role="region" aria-labelledby={`faq-b-${id}`} inert={!isOpen}>
              <div>
                <p className="fa">{t(`${id}.a`)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
