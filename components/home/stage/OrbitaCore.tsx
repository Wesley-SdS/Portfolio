"use client";

import { useEffect, useRef, useState } from "react";
import { LiveOrb } from "@/components/orbita/LiveOrb";
import type { OrbMode } from "@/components/orbita/presence-orb";

export type OrbitaCoreState = "idle" | "listening" | "thinking" | "attention" | "success";

/** Phase of the 6s mechanism loop → state of the core (same timeline as cb-of-type/-dots/-card/-insight). */
function phaseToState(p: number): OrbitaCoreState {
  if (p < 0.005) return "idle";
  if (p < 0.22) return "listening"; // the request is being typed
  if (p < 0.4) return "thinking"; // dots: the model drafts a proposal
  if (p < 0.57) return "attention"; // approval card: waiting for the owner's decision
  if (p < 0.93) return "success"; // approved by voice
  return "idle";
}

/**
 * Live Órbita core floating over chapter 01 of the stage. It follows the CSS mechanism loop of its
 * chapter (reads the progress of the `.ob-bubble` animation), so request → proposal → approval and the
 * core stay in step — including Pause, hover-hold and "not yet seen" (a paused loop keeps its state).
 * Reduced motion / no Web Animations API: the core stays in its idle still frame.
 */
export function OrbitaCore({ labels }: { labels: Record<OrbitaCoreState, string> }) {
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<OrbitaCoreState>("idle");

  useEffect(() => {
    const el = root.current;
    const ch = el?.closest(".ch");
    const probe = ch?.querySelector<HTMLElement>(".ob-bubble");
    if (!ch || !probe || typeof probe.getAnimations !== "function") return;
    let last: OrbitaCoreState = "idle";
    const tick = () => {
      let next: OrbitaCoreState = "idle";
      if (ch.classList.contains("is-active")) {
        const anim = probe.getAnimations()[0];
        if (anim) {
          const p = anim.effect?.getComputedTiming().progress;
          next = anim.playState === "paused" ? last : typeof p === "number" ? phaseToState(p) : "idle";
        }
      }
      if (next !== last) {
        last = next;
        setState(next);
      }
    };
    const id = window.setInterval(tick, 140);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="oc-core" ref={root} aria-hidden="true">
      <LiveOrb mode={state as OrbMode} tone="dark" interactive={false} labels={false} className="oc-canvas" />
      <span className={`oc-state is-${state}`}>
        <i />
        {labels[state]}
      </span>
    </div>
  );
}
