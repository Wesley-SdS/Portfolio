"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { LiveOrb } from "@/components/orbita/LiveOrb";
import { goToStageChapter } from "@/components/home/stage/stage-bridge";

export type HeroSatellite = {
  slug: string;
  /** chapter name shown on the satellite */
  label: string;
  /** zero-based stage chapter index */
  index: number;
  /** orbit: 1 inner · 2 middle · 3 outer */
  ring: 1 | 2 | 3;
  /** position on the orbit, degrees clockwise from the top */
  deg: number;
  /** product light, "r g b" */
  light: string;
};

const cssVars = (v: Record<string, string | number>) => v as CSSProperties;

/**
 * Hero orbit system: the live Órbita core in the middle and the stage products as satellites
 * on three orbits. Each satellite is a plain `#projects` link that also selects its chapter
 * on the stage (stage-bridge). Drawn on a 760×760 canvas scaled to the column (`--k`).
 * Hovering or focusing a satellite pauses the orbits; reduced motion shows them still.
 * Also feeds the pointer position to the hero aura (`--mx/--my` on the section).
 */
export function HeroOrbit({ satellites, navLabel, orbLabel }: { satellites: HeroSatellite[]; navLabel: string; orbLabel: string }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = box.current?.closest<HTMLElement>(".home-hero");
    if (!section) return;
    let fine = false;
    let reduced = false;
    try {
      fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      /* defaults */
    }
    if (!fine || reduced) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = section.getBoundingClientRect();
        section.style.setProperty("--mx", `${Math.round(x - r.left)}px`);
        section.style.setProperty("--my", `${Math.round(y - r.top)}px`);
      });
    };
    section.addEventListener("pointermove", move);
    return () => {
      section.removeEventListener("pointermove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const ring = (n: 1 | 2 | 3) => (
    <div className={`ho-ring ho-r${n}`}>
      {satellites
        .filter((s) => s.ring === n)
        .map((s) => (
          <div key={s.slug} className="ho-pos" style={cssVars({ "--deg": `${s.deg}deg` })}>
            <div className="ho-anch">
              <div className="ho-cnt">
                <a className="ho-sat" href="#projects" style={cssVars({ "--L": s.light })} onClick={() => goToStageChapter(s.index)}>
                  <i aria-hidden="true" />
                  <span>{s.label}</span>
                </a>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="ho-box rv-fade" ref={box} style={cssVars({ "--base": "200ms" })}>
      <div className="ho-cv">
        <span className="ho-core" aria-hidden="true" />
        <nav aria-label={navLabel}>
          {ring(3)}
          {ring(2)}
          {ring(1)}
        </nav>
        <LiveOrb className="ho-orb" label={orbLabel} labels={false} />
      </div>
    </div>
  );
}
