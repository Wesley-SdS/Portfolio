/**
 * Date labels for the booking recipes (v3spec §8.4), locale-aware via Intl.
 * pt: "Qui 01/10" · "Quinta-feira, 1 de outubro" · "Quinta" · "Qui, 01 de outubro".
 */

const INTL: Record<string, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };
const cap = (s: string) => (s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s);
const cleanWeekday = (s: string) => s.replace(/\.$/, "").replace(/\.,/, ",");

export function intlLocale(locale: string) {
  return INTL[locale] ?? locale;
}

function fmt(locale: string, timeZone: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(intlLocale(locale), { timeZone, ...opts });
}

/** "Qui 01/10" (day tab) */
export function dayTab(iso: string, locale: string, timeZone: string) {
  const d = new Date(iso);
  const wd = cleanWeekday(fmt(locale, timeZone, { weekday: "short" }).format(d));
  const dm = fmt(locale, timeZone, { day: "2-digit", month: "2-digit" }).format(d);
  return `${cap(wd)} ${dm}`;
}

/** "Quinta-feira, 1 de outubro" (slot aria) */
export function dayLong(iso: string, locale: string, timeZone: string) {
  return cap(fmt(locale, timeZone, { weekday: "long", day: "numeric", month: "long" }).format(new Date(iso)));
}

/** "Quinta" (picked bubble; pt drops "-feira") */
export function dayPicked(iso: string, locale: string, timeZone: string) {
  const wd = fmt(locale, timeZone, { weekday: "long" }).format(new Date(iso));
  return cap(locale === "pt" ? wd.replace(/-feira$/, "") : wd);
}

/** "01/10" */
export function dayMonth(iso: string, locale: string, timeZone: string) {
  return fmt(locale, timeZone, { day: "2-digit", month: "2-digit" }).format(new Date(iso));
}

/** "10:00" */
export function hm(iso: string, locale: string, timeZone: string) {
  return fmt(locale, timeZone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));
}

/** "Qui, 01 de outubro" (booking card) */
export function dayCard(iso: string, locale: string, timeZone: string) {
  const d = new Date(iso);
  const wd = cleanWeekday(fmt(locale, timeZone, { weekday: "short" }).format(d));
  const rest = fmt(locale, timeZone, { day: "2-digit", month: "long" }).format(d);
  return `${cap(wd)}, ${rest}`;
}
