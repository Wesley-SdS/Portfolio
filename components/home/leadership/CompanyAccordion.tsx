"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CompanyItem {
  id: string;
  /** header content (period, role, company) — rendered inside the <button> */
  header: ReactNode;
  /** body content (server-rendered) */
  body: ReactNode;
  /** accessible name of the region */
  label: string;
}

/**
 * Single-open career timeline: each entry is `<h3><button aria-expanded aria-controls>` with a
 * node on the vertical line (filled with the accent while open) and a body on `.acc`
 * (grid-rows 0fr → 1fr) whose content turns `visibility:hidden` after closing, so it leaves the tab order.
 */
export function CompanyAccordion({ items, defaultOpen }: { items: CompanyItem[]; defaultOpen: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen);

  return (
    <div className="xi-box">
      {items.map((it) => {
        const isOpen = open === it.id;
        const btnId = `xi-btn-${it.id}`;
        const panelId = `xi-${it.id}`;
        return (
          <div key={it.id} className={cn("xi", isOpen && "is-open")}>
            <h3 className="xi-h3">
              <button
                id={btnId}
                type="button"
                className="xi-b"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen((cur) => (cur === it.id ? null : it.id))}
              >
                {it.header}
                <span className="xi-pm" aria-hidden="true" />
              </button>
            </h3>
            <div id={panelId} className="acc" role="region" aria-labelledby={btnId}>
              <div>
                <div className="xi-m">{it.body}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
