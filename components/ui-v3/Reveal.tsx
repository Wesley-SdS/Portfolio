"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

export type RevealProps = HTMLAttributes<HTMLElement> & {
  /** element to render (default "div"); e.g. "section", "ul", "article" */
  as?: "div" | "section" | "article" | "ul" | "ol" | "li" | "span" | "header" | "footer" | "aside" | "figure";
  /** IntersectionObserver rootMargin — default reveals slightly before the fold */
  rootMargin?: string;
  /** visible fraction to trigger (default 0: a section taller than the viewport must still reveal) */
  threshold?: number;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * <Reveal> — production gate for the artboards' "play at load" reveals.
 * Renders `data-inview="false"` until the element scrolls into view, then
 * "true" (once). globals.css §7 pauses every `.rv/.rv-fade/.rv-r/.mask>span/
 * .draw-x/.draw-y/.pop/.wipe/.clip-x/.cnt.run/.status-in` inside the scope while
 * it is "false" — only when <html class="js"> — so no-JS and reduced-motion
 * visitors always see the final state.
 *
 * Put `--base` (section delay) on this element or on children, as in the artboards.
 * Do NOT wrap above-the-fold content (the hero plays at load).
 *
 * @example
 * <Reveal as="section" id="servicos" className="sec" style={{ ["--base" as string]: "200ms" }}>
 *   <h2 className="h2"><span className="mask"><span>Como posso ajudar</span></span></h2>
 * </Reveal>
 */
export function Reveal({ as = "div", rootMargin = "0px 0px -12% 0px", threshold = 0, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin, threshold]);

  return createElement(as, { ref, "data-inview": inView ? "true" : "false", ...rest }, children);
}
