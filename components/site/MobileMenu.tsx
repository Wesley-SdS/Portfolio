"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { NAV_ITEMS } from "@/src/content/site";
import { buttonClass } from "@/components/ui-v3/Button";
import { HomeAnchorLink } from "./HomeAnchorLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { OrbitaTrigger } from "./OrbitaTrigger";

/**
 * Mobile menu (< 1120px): ghost "Menu" → full-screen sheet (Radix Dialog:
 * focus trap, Esc, scroll lock). Links close the sheet; "Falar com a Órbita"
 * closes it and opens the chat via the bridge. (finalSpec §4.1, v3spec §6.1)
 */
export function MobileMenu() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className="btn btn-g hdr-mobile -mr-3" aria-label={t("nav.openMenu")}>
          {t("common.actions.menu")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content className="sheet" aria-describedby={undefined}>
          <Dialog.Title className="sr">{t("nav.menuTitle")}</Dialog.Title>
          <div className="flex h-14 flex-none items-center justify-between">
            <HomeAnchorLink anchor="home" className="wordmark" onClick={close}>
              Wesley Santos
            </HomeAnchorLink>
            <Dialog.Close asChild>
              <button type="button" className="btn btn-g -mr-3">
                <X width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
                {t("common.actions.close")}
              </button>
            </Dialog.Close>
          </div>
          <nav aria-label={t("nav.aria")} className="mt-9">
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.key} className="sl" style={{ ["--i" as string]: i }}>
                  <HomeAnchorLink anchor={item.anchor} className="sheet-link" onClick={close}>
                    <span className="ey">{item.num}</span>
                    <span className="sl-t">{t(`nav.${item.key}`)}</span>
                  </HomeAnchorLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-3 border-t border-line pt-5">
            <div className="mb-2 flex items-center justify-between">
              <LocaleSwitcher />
              <ThemeToggle withText className="-mr-3" />
            </div>
            <HomeAnchorLink anchor="cotacao" className={buttonClass("primary", "md", false, "w-full")} onClick={close}>
              {t("common.actions.requestQuote")}{" "}
              <span className="arr" aria-hidden="true">
                →
              </span>
            </HomeAnchorLink>
            <OrbitaTrigger source="menu" variant="secondary" withOrb className="w-full" onBeforeOpen={close}>
              {t("common.actions.talkToOrbita")}
            </OrbitaTrigger>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
