"use client";

import { useEffect } from "react";

/**
 * Pointer spotlight — mounted once in the locale layout. Any element with `data-spot` gets the pointer
 * position as `--sx/--sy` (px, relative to itself) while the pointer is over it; the glow itself is CSS
 * (`[data-spot]::after` in app/styles/sections/orbit.css). Fine pointers only, never with reduced motion.
 * One delegated listener, written in rAF — no per-card handlers, so server components can opt in.
 */
export function PointerFx() {
  useEffect(() => {
    let ok = false;
    try {
      ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      ok = false;
    }
    if (!ok) return;
    let raf = 0;
    let target: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    const move = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-spot]") ?? null;
      if (!el) return;
      target = el;
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!target) return;
        const r = target.getBoundingClientRect();
        target.style.setProperty("--sx", `${Math.round(x - r.left)}px`);
        target.style.setProperty("--sy", `${Math.round(y - r.top)}px`);
      });
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => {
      document.removeEventListener("pointermove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
