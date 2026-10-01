import { defineRouting } from "next-intl/routing";

/**
 * Routing config only (no navigation helpers) so the Edge middleware bundle stays small.
 * Components import the locale-aware Link/usePathname/useRouter from "@/i18n/routing".
 */
export const routing = defineRouting({
  locales: ["pt", "es", "en"],
  defaultLocale: "pt",
  // pt at "/", es and en prefixed ("/es", "/en")
  localePrefix: "as-needed",
});
