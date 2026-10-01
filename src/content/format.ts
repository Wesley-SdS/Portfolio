import type { Locale, Metric, Period, Status, StatusShape, YearMonth } from "./types";

/**
 * Locale-aware formatters for content values. Pure functions (safe on the
 * server and the client). Month abbreviations follow the specs ("Set", "Out").
 */

const MONTHS: Record<Locale, readonly string[]> = {
  pt: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
};

const PRESENT: Record<Locale, string> = { pt: "atual", en: "present", es: "actual" };

const SEP: Record<Locale, { group: string; decimal: string }> = {
  pt: { group: ".", decimal: "," },
  es: { group: ".", decimal: "," },
  en: { group: ",", decimal: "." },
};

export function asLocale(value: string): Locale {
  return value === "en" || value === "es" ? value : "pt";
}

export function formatMonth(ym: YearMonth, locale: Locale): string {
  return `${MONTHS[locale][ym.m - 1]} ${ym.y}`;
}

/**
 * "Jul – Set 2026" (same year collapses), "Dez 2024 – Jan 2025",
 * "Set 2025 – atual", "Dez 2025" (start === end).
 * Uses an en dash with spaces, as in the specs.
 */
export function formatPeriod(period: Period, locale: Locale): string {
  const { start, end } = period;
  const months = MONTHS[locale];
  if (end === "present") return `${formatMonth(start, locale)} – ${PRESENT[locale]}`;
  if (start.y === end.y && start.m === end.m) return formatMonth(start, locale);
  if (start.y === end.y) return `${months[start.m - 1]} – ${months[end.m - 1]} ${end.y}`;
  return `${formatMonth(start, locale)} – ${formatMonth(end, locale)}`;
}

/** Years only, for entries whose source gives no months: "2015 – 2023", "2026 – atual", "2019". */
export function formatYears(period: Period, locale: Locale): string {
  const { start, end } = period;
  if (end === "present") return `${start.y} – ${PRESENT[locale]}`;
  return start.y === end.y ? `${start.y}` : `${start.y} – ${end.y}`;
}

/** Thousands with an explicit separator (pt/es "1.258", en "1,258"); decimals with "," or ".". */
export function formatNumber(value: number, locale: Locale, decimals = 0): string {
  const { group, decimal } = SEP[locale];
  const fixed = Math.abs(value).toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, group);
  return `${value < 0 ? "−" : ""}${grouped}${frac ? decimal + frac : ""}`;
}

/** Full metric text for static rendering / screen readers ("~1.800", "86,7%", "10+"). */
export function formatMetric(metric: Metric, locale: Locale): string {
  const core =
    metric.word ?? (metric.value !== undefined ? formatNumber(metric.value, locale, metric.decimals ?? 0) : "");
  return `${metric.prefix ?? ""}${core}${metric.suffix ?? ""}`;
}

/**
 * Split a decimal metric for the counter recipe: the integer part animates
 * (.cnt --to) and the rest is a static suffix ("86" + ",7%").
 */
export function splitMetric(metric: Metric, locale: Locale): { to: number; rest: string } {
  const value = metric.value ?? 0;
  const to = Math.trunc(value);
  const full = formatNumber(value, locale, metric.decimals ?? 0);
  const intText = formatNumber(to, locale, 0);
  return { to, rest: `${full.slice(intText.length)}${metric.suffix ?? ""}` };
}

export function statusShape(status: Status): StatusShape {
  switch (status) {
    case "inDevelopment":
    case "beta":
      return "ring";
    case "current":
      return "current";
    default:
      return "ok";
  }
}
