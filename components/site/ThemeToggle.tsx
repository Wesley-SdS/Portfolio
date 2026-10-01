"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Theme toggle (round 40×40 that turns on hover, sun/moon crossfade). Icons are driven by the
 * <html data-theme> attribute in CSS (.ic-sun/.ic-moon), so SSR never flashes
 * the wrong icon; the label resolves after mount.
 * `withText` renders "Escuro"/"Claro" next to the icon (mobile menu).
 */
export function ThemeToggle({ withText = false, className, tabIndex }: { withText?: boolean; className?: string; tabIndex?: number }) {
  const t = useTranslations("common.theme");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  const label = mounted ? (dark ? t("toLight") : t("toDark")) : t("label");

  return (
    <button
      type="button"
      className={cn(withText ? "btn btn-g gap-2" : "tbtn", className)}
      aria-label={label}
      title={label}
      tabIndex={tabIndex}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <span className="relative inline-block h-[18px] w-[18px]" aria-hidden="true">
        <Sun className="ic ic-sun" width={18} height={18} strokeWidth={1.5} />
        <Moon className="ic ic-moon" width={18} height={18} strokeWidth={1.5} />
      </span>
      {withText ? <span aria-hidden="true">{mounted ? (dark ? t("dark") : t("light")) : t("label")}</span> : null}
    </button>
  );
}
