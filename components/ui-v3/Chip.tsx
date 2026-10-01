import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & {
  /** toggled state → aria-pressed; active = --accent fill with --on-accent text */
  pressed?: boolean;
  /** count after the label (mono 12, --ink-3) */
  count?: number | string;
  children: ReactNode;
};

/**
 * <Chip> — filter / quick-reply chip (36px tall inside a 44px hit area).
 * Use `pressed` for toggles (filters, quote step 2); omit it for one-shot
 * quick replies (Órbita chat) — then no aria-pressed is rendered.
 *
 * @example <Chip pressed={cat === "ai"} count={5} onClick={() => setCat("ai")}>IA & Agentes</Chip>
 */
export function Chip({ pressed, count, className, children, type, ...rest }: ChipProps) {
  return (
    <button type={type ?? "button"} className={cn("chip", className)} aria-pressed={pressed === undefined ? undefined : pressed} {...rest}>
      {children}
      {count !== undefined ? <span className="cc">{count}</span> : null}
    </button>
  );
}
