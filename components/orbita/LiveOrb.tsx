"use client";

import { useEffect, useRef } from "react";
import type { OrbMode } from "./presence-orb";
import { Nucleo, type NucleoInstance, type NucleoOptions } from "./motor-webgl";

export type LiveOrbProps = {
  /** one of the ten states of the Órbita core */
  mode?: OrbMode;
  /** auto follows the page theme; "dark" for always-dark surfaces (the stage) */
  tone?: NucleoOptions["tone"];
  /** pointer tilt + click pulse (default true) */
  interactive?: boolean;
  /** kept for the Canvas 2D fallback's read-outs; the WebGL core has none */
  labels?: boolean;
  /** 0.15–1: the product's "intensidade" setting (default .85) */
  intensity?: number;
  /** change this value to fire one expansive pulse */
  pulseKey?: number | string;
  /** accessible name; decorative (aria-hidden) when omitted */
  label?: string;
  className?: string;
};

/**
 * <LiveOrb> — the real Órbita core: the product's WebGL "neural-organic" presence
 * (components/orbita/motor-webgl.js, ported verbatim from the Órbita repo), with the product's own
 * Canvas 2D fallback. Sized by CSS (the canvas follows its box); pauses off-screen and when the
 * tab is hidden; a single still frame under prefers-reduced-motion; repaints on theme change.
 *
 * @example <LiveOrb mode="thinking" className="ho-orb" />
 */
export function LiveOrb({ mode = "idle", tone = "auto", interactive = true, intensity = 0.85, pulseKey, label, className }: LiveOrbProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const orb = useRef<NucleoInstance | null>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const o = new Nucleo(canvas, { tone, interactive });
    o.intensity = intensity;
    o.setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    o.setState(modeRef.current);
    orb.current = o;

    // theme changes must repaint even when motion is reduced (single still frame)
    let mo: MutationObserver | null = null;
    if (tone === "auto" && typeof MutationObserver !== "undefined") {
      mo = new MutationObserver(() => o.invalidate());
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }
    return () => {
      mo?.disconnect();
      o.destruir();
      orb.current = null;
    };
  }, [tone, interactive, intensity]);

  useEffect(() => {
    orb.current?.setState(mode);
  }, [mode]);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    orb.current?.energize();
  }, [pulseKey]);

  return <canvas ref={ref} className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
