"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Cover mini stage (v2 §9.1 / v3 §11.1): `.stage.on-stage.is-intro` with the pointer
 * tilt (6.8 move/leave: --mx/--my in −1..1 on the section, read by .tilt/.par/.light)
 * and the 700ms `is-rest` settle. Also scales the 740×680 stack to its box (--k) when the
 * cover is stacked (< 1280px). Mouse only; reduced motion → no tilt (CSS kills the rest).
 */
export function TiltStage({
  light,
  labelledBy,
  className,
  children,
}: {
  light: string;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const raf = useRef(0);
  const restT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduced = useRef(false);
  const [rest, setRest] = useState(false);

  useEffect(() => {
    try {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduced.current = false;
    }
    const el = ref.current;
    const box = el?.querySelector<HTMLElement>(".cs-stackbox");
    if (!el || !box || typeof ResizeObserver === "undefined") return;
    const fit = () => {
      const k = Math.min(1, box.clientWidth / 740);
      box.style.setProperty("--k", k.toFixed(4));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => {
      ro.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
      clearTimeout(restT.current);
    };
  }, []);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced.current || e.pointerType !== "mouse" || raf.current) return;
    const el = e.currentTarget;
    const cx = e.clientX;
    const cy = e.clientY;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const mx = Math.max(-1, Math.min(1, ((cx - r.left) / r.width) * 2 - 1));
      const my = Math.max(-1, Math.min(1, ((cy - r.top) / r.height) * 2 - 1));
      el.style.setProperty("--mx", mx.toFixed(3));
      el.style.setProperty("--my", my.toFixed(3));
    });
  };

  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
    setRest(true);
    clearTimeout(restT.current);
    restT.current = setTimeout(() => setRest(false), 700);
  };

  return (
    <section
      ref={ref}
      aria-labelledby={labelledBy}
      className={cn("stage on-stage is-intro cs-cover", rest && "is-rest", className)}
      style={{ ["--L" as string]: light } as CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </section>
  );
}
