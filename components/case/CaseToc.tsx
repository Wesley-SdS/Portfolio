"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; num: string; label: string };

/**
 * Sticky "Nesta página" (v2 §9.3): 44px rows, 2px --accent bar that glides to the active
 * row (320ms --ease-standard). Active = the last section whose top passed 35% of the
 * viewport; a click sets it immediately and the anchor scrolls (smooth unless reduced).
 */
export function CaseToc({ items, label }: { items: TocItem[]; label: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let current = 0;
      items.forEach((it, i) => {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      // bottom of the page: last item
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        const lastEl = document.getElementById(items[items.length - 1].id);
        if (lastEl && lastEl.getBoundingClientRect().top < window.innerHeight) current = items.length - 1;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items]);

  return (
    <nav aria-label={label} className="cs-toc">
      <ol className="cs-toc-list">
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cn("toc-a", i === active && "is-cur")}
              aria-current={i === active ? "location" : undefined}
              onClick={() => setActive(i)}
            >
              <span className="eb">{it.num}</span>
              <span className="ui">{it.label}</span>
            </a>
          </li>
        ))}
        <li aria-hidden="true" className="toc-bar" style={{ transform: `translateY(${active * 44}px)` } as CSSProperties} />
      </ol>
    </nav>
  );
}
