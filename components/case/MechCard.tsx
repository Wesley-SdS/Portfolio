"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small stage card (560×280, static light) hosting one mechanism loop (`.loop` + of-* classes,
 * the stage-01 loupe recipe). Pause toggle (aria-pressed); hover also pauses (.obst:hover).
 * Reduced motion: CSS shows the end frame, the toggle is hidden.
 */
export function MechCard({
  light,
  header,
  pause,
  play,
  caption,
  children,
}: {
  light: string;
  header: string;
  pause: string;
  play: string;
  caption: { title: string; text: string };
  children: ReactNode;
}) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    try {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <figure className="cs-mech">
      <div
        className={cn("stage on-stage obst cs-mech-card", paused && "is-paused")}
        style={{ ["--L" as string]: light } as CSSProperties}
      >
        <div className="light is-on" style={{ ["--horizon" as string]: "316px" } as CSSProperties} />
        <div className="vignette" />
        <div className="ch is-active">
          <div className="shot sm ob cs-mech-shot">
            <div className="cs-mech-head">{header}</div>
            <div className="loop cs-mech-body">{children}</div>
          </div>
        </div>
        {!reduced ? (
          <button
            type="button"
            className="btn btn-g btn-icon cs-mech-pause"
            aria-pressed={paused}
            aria-label={paused ? play : pause}
            onClick={() => setPaused((p) => !p)}
          >
            <span className={cn("ic", paused && "is-off")}>
              <Pause width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className={cn("ic", !paused && "is-off")}>
              <Play width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </button>
        ) : null}
      </div>
      <figcaption className="cs-mech-cap">
        <span className="cs-mech-cap-t">{caption.title}</span>
        <span>{caption.text}</span>
      </figcaption>
    </figure>
  );
}
