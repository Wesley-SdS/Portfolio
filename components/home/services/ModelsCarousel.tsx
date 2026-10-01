"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ModelsCarouselProps {
  /** accessible name of the group ("Formas de contratação") */
  ariaLabel: string;
  /** one label per card for the dots ("1 de 3: Desenvolvimento contínuo") */
  dotLabels: string[];
  /** rendered at the start of the dots row (mobile only) — the hire link */
  footerStart?: ReactNode;
  /** the model cards (server-rendered <article>s) */
  children: ReactNode;
}

/**
 * Engagement model cards: a native scroll-snap swipe track below 1024px
 * (v3/Mobile: 350-wide cards, 3 dot buttons with 44px hit targets) and a plain
 * 3-column grid at ≥1024 (the dots hide). The dots follow the scroll position;
 * clicking one scrolls to its card (instant under reduced motion).
 */
export function ModelsCarousel({ ariaLabel, dotLabels, footerStart, children }: ModelsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const raf = useRef(0);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track) return;
      const cards = Array.from(track.children) as HTMLElement[];
      if (!cards.length) return;
      const left = track.scrollLeft;
      let best = 0;
      let bestD = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - track.offsetLeft - left);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const go = (i: number) => {
    const track = trackRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (!track || !card) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: reduced ? "auto" : "smooth" });
    setActive(i);
  };

  return (
    <div className="mdc" role="group" aria-label={ariaLabel}>
      <div ref={trackRef} className="md-track" data-active={active} onScroll={onScroll}>
        {children}
      </div>
      <div className="md-foot">
        {footerStart}
        <div className="md-dots">
          {dotLabels.map((label, i) => (
            <button
              key={label}
              type="button"
              className="cdot"
              aria-label={label}
              aria-current={active === i ? "true" : undefined}
              onClick={() => go(i)}
            >
              <i className={cn(active === i && "is-on")} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
