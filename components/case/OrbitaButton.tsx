"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { openOrbita } from "@/components/site/orbita-bridge";
import { ORBITA_PANEL_ID } from "@/src/content/orbita";

/**
 * "Falar com a Órbita" on the case pages — any look (qlnk on the stage, .btn-p / .btn-s on paper).
 * Opens the widget through the documented bridge contract:
 * `openOrbita({ source: "case", returnFocus })` (components/site/orbita-bridge.ts).
 */
export function OrbitaButton({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(className)}
      style={style}
      aria-haspopup="dialog"
      aria-controls={ORBITA_PANEL_ID}
      onClick={(e) => openOrbita({ source: "case", returnFocus: e.currentTarget })}
    >
      {children}
    </button>
  );
}
