import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { statusShape } from "@/src/content/format";
import type { Status, StatusShape } from "@/src/content/types";

export type StatusTagProps = {
  /** content status → shape + word (common.status.<status>) */
  status?: Status;
  /** explicit shape when not using `status`: ring (em andamento/beta) · ok (concluído/disponível) · current (atual) */
  shape?: StatusShape;
  /** override the word (always keep a word — status is never colour-only) */
  children?: ReactNode;
  /** md = 24px (default) · sm = 22px (index rows) */
  size?: "md" | "sm";
  /** ping ring on the dot: loop (hero "Disponível", 4000ms period) or once ("Atual" rows) */
  ping?: "loop" | "once" | false;
  /** delay before the first ping, e.g. "900ms" */
  pingDelay?: string;
  /** use stage colours (on the dark ProjectStage) */
  onStage?: boolean;
  /** render only the dot + word without the bordered tag (e.g. channels "● Disponível") */
  bare?: boolean;
  className?: string;
};

const COLOR: Record<StatusShape, { paper: string; stage: string }> = {
  ring: { paper: "var(--accent)", stage: "var(--stage-accent)" },
  ok: { paper: "var(--ok)", stage: "var(--stage-ok)" },
  current: { paper: "var(--accent)", stage: "var(--stage-accent)" },
};

/**
 * <StatusTag> — the status marker (finalSpec §4.4): 8px glyph + UPPERCASE mono word.
 * ring = 2px accent ring ("Em desenvolvimento", "Beta"); ok = filled --ok
 * ("Concluído", "MVP concluído", "Disponível"); current = filled --accent ("Atual").
 *
 * @example <StatusTag status="inDevelopment" />
 * @example <StatusTag status="available" ping="loop" pingDelay="900ms" />
 * @example <StatusTag shape="current" ping="once">Atual</StatusTag>
 */
export function StatusTag({
  status,
  shape,
  children,
  size = "md",
  ping = false,
  pingDelay,
  onStage = false,
  bare = false,
  className,
}: StatusTagProps) {
  const t = useTranslations("common.status");
  const s: StatusShape = shape ?? (status ? statusShape(status) : "ok");
  const label = children ?? (status ? t(status) : null);
  const dot = (
    <span
      className={cn("dot", s === "ring" && "dot-ring", ping === "loop" && "ping", ping === "once" && "ping-once")}
      aria-hidden="true"
      style={{
        color: onStage ? COLOR[s].stage : COLOR[s].paper,
        ...(pingDelay ? { ["--ping-delay" as string]: pingDelay } : null),
      }}
    />
  );
  if (bare) {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        {dot}
        {label}
      </span>
    );
  }
  return (
    <span className={cn("tag", size === "sm" && "tag-s", className)}>
      {dot}
      {label}
    </span>
  );
}
