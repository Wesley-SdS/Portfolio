import { routing } from "./routing";

/** <html lang> / hreflang per locale. */
export const HTML_LANG: Record<string, string> = { pt: "pt-BR", en: "en", es: "es" };

/** Path for a locale under localePrefix "as-needed" (pt has no prefix). */
export function localePath(locale: string, path = "/") {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale ? clean || "/" : `/${locale}${clean}`;
}

/** hreflang alternates for a path, for Next metadata `alternates.languages`. */
export function languageAlternates(path = "/") {
  return {
    "pt-BR": localePath("pt", path),
    en: localePath("en", path),
    es: localePath("es", path),
    "x-default": localePath("pt", path),
  };
}
