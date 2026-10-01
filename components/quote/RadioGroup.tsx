"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RadioGroupProps<V extends string> = {
  options: readonly V[];
  value: V | null;
  onChange: (v: V) => void;
  renderOption: (v: V, checked: boolean) => ReactNode;
  optionClassName: string | ((v: V, checked: boolean) => string);
  className?: string;
  labelledBy?: string;
  describedBy?: string;
  invalid?: boolean;
  /** vertical lists move with ↑/↓, rows with ←/→ — both work either way */
  style?: React.CSSProperties;
};

/**
 * Roving-tabindex radiogroup of real <button role="radio"> (QuoteForm option
 * cards, segmented control, pills, investment rows). ←/→/↑/↓ move + select,
 * Home/End jump, Space/Enter select. One tab stop per group.
 */
export function RadioGroup<V extends string>({
  options,
  value,
  onChange,
  renderOption,
  optionClassName,
  className,
  labelledBy,
  describedBy,
  invalid,
  style,
}: RadioGroupProps<V>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = value ? options.indexOf(value) : -1;
  const tabStop = current >= 0 ? current : 0;

  const move = (i: number) => {
    const n = (i + options.length) % options.length;
    onChange(options[n]);
    refs.current[n]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = refs.current.findIndex((el) => el === document.activeElement);
    if (i < 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(i + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(0);
    } else if (e.key === "End") {
      e.preventDefault();
      move(options.length - 1);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={className}
      style={style}
      onKeyDown={onKeyDown}
    >
      {options.map((v, i) => {
        const checked = value === v;
        return (
          <button
            key={v}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={i === tabStop ? 0 : -1}
            className={cn(typeof optionClassName === "function" ? optionClassName(v, checked) : optionClassName)}
            style={{ ["--i" as string]: i }}
            onClick={() => onChange(v)}
          >
            {renderOption(v, checked)}
          </button>
        );
      })}
    </div>
  );
}
