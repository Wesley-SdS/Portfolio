import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { formatMetric, splitMetric } from "@/src/content/format";
import type { Locale, Metric } from "@/src/content/types";

export type MetricValueProps = {
  metric: Metric;
  locale: Locale;
  /**
   * run   → `.cnt.run` counters play on load/reveal (paper sections, inside <Reveal>)
   * stage → `.cnt` without `run` (the stage's `.ch.is-active .cnt` rule drives it); words get `.e-word`
   * none  → static text
   */
  animate?: "run" | "stage" | "none";
  /** stagger index (--i) */
  index?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * <MetricValue> — renders a content Metric with the v2 counter recipe:
 *   count/short: <span class="cnt run" style="--to:86" aria-hidden/>",7%"<span class="sr">86,7%</span>
 *   word:        mask-revealed static text (pt/es "1.258", en "1,258")
 * Screen readers always get the full formatted value once.
 *
 * @example <MetricValue metric={m} locale={locale} index={i} />
 */
export function MetricValue({ metric, locale, animate = "run", index = 0, className, style }: MetricValueProps) {
  const full = formatMetric(metric, locale);
  const vars = { ["--i" as string]: index, ...style } as CSSProperties;

  if (metric.kind === "word" || animate === "none") {
    if (animate === "none") return <span className={className}>{full}</span>;
    return (
      <span className={cn(animate === "stage" ? "e-word" : "mask", "inline-block align-bottom", className)} style={vars}>
        <span>{full}</span>
      </span>
    );
  }

  const { to, rest } = splitMetric(metric, locale);
  return (
    <span className={cn("inline-flex items-baseline", className)} style={style}>
      {metric.prefix ? <span aria-hidden="true">{metric.prefix}</span> : null}
      <span
        className={cn("cnt", animate === "run" && "run", metric.kind === "short" && "short")}
        aria-hidden="true"
        style={{ ["--to" as string]: to, ["--i" as string]: index } as CSSProperties}
      />
      {rest ? <span aria-hidden="true">{rest}</span> : null}
      <span className="sr">{full}</span>
    </span>
  );
}
