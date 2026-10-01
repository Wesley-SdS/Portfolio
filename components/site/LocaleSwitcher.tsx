"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, routing, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LANG_ATTR: Record<string, string> = { pt: "pt-BR", en: "en", es: "es" };

/**
 * PT·EN·ES segmented control (32px pill, active segment = --ink fill).
 * Links to the same page in the other locale via next-intl navigation.
 */
export function LocaleSwitcher({ ariaLabel, className, tabIndex }: { ariaLabel?: string; className?: string; tabIndex?: number }) {
  const t = useTranslations("common.language");
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <nav className={cn("seg-ctl", className)} aria-label={ariaLabel ?? t("label")}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={LANG_ATTR[l]}
          hrefLang={LANG_ATTR[l]}
          aria-current={l === locale ? "page" : undefined}
          title={t(`${l}Name` as "ptName" | "enName" | "esName")}
          tabIndex={tabIndex}
        >
          {t(l as "pt" | "en" | "es")}
        </Link>
      ))}
    </nav>
  );
}
