import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionIndexBarProps = {
  /** "02" — rendered in --accent-ink */
  index: string;
  /** "Serviços" — rendered as " — Serviços" in --ink-3 */
  label: string;
  /** right-aligned meta line (mono, --ink-3) */
  meta?: ReactNode;
  /** on a --mat band the hairline uses --line-strong */
  onMat?: boolean;
  className?: string;
};

/**
 * <SectionIndexBar> — the numbered bar that opens every section except the hero
 * (finalSpec §4.2): 1px top hairline, "02 — Serviços" left, meta right.
 * It is not a heading; the section's H2 follows ~32px below.
 *
 * @example <SectionIndexBar index="02" label={t("indexLabel")} meta={t("indexMeta")} />
 */
export function SectionIndexBar({ index, label, meta, onMat = false, className }: SectionIndexBarProps) {
  return (
    <div className={cn("ixbar", onMat && "on-mat", className)}>
      <p className="eb">
        <span style={{ color: "var(--accent-ink)" }}>{index}</span> — {label}
      </p>
      {meta ? <p className="meta hidden text-right md:block">{meta}</p> : null}
    </div>
  );
}
