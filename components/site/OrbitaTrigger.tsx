"use client";

import type { ReactNode } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui-v3/Button";
import { Orb } from "@/components/ui-v3/Orb";
import { ORBITA_PANEL_ID } from "@/src/content/orbita";
import { openOrbita, type OrbitaAsk, type OrbitaSource } from "./orbita-bridge";

export type OrbitaTriggerProps = {
  children: ReactNode;
  source: OrbitaSource;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** show the 24px orb avatar before the label (hero, menu) */
  withOrb?: boolean;
  className?: string;
  /** runs before opening (e.g. close the mobile menu) */
  onBeforeOpen?: () => void;
  /** first message sent for the visitor once the chat opens (e.g. the "book a call" chip) */
  ask?: OrbitaAsk;
};

/**
 * <OrbitaTrigger> — any "Falar com a Órbita" button. Server components can
 * render it; it dispatches the bridge event (components/site/orbita-bridge.ts).
 *
 * @example <OrbitaTrigger source="hero" variant="secondary" withOrb>{t("common.actions.talkToOrbita")}</OrbitaTrigger>
 */
export function OrbitaTrigger({ children, source, variant = "secondary", size = "md", withOrb = false, className, onBeforeOpen, ask }: OrbitaTriggerProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      style={withOrb ? { paddingLeft: 12 } : undefined}
      aria-haspopup="dialog"
      aria-controls={ORBITA_PANEL_ID}
      onClick={(e) => {
        onBeforeOpen?.();
        openOrbita({ source, returnFocus: e.currentTarget, ask });
      }}
    >
      {withOrb ? <Orb size={24} /> : null}
      {children}
    </Button>
  );
}
