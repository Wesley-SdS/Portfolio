"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { NAV_ITEMS, type NavKey } from "@/src/content/site";
import { HomeAnchorLink } from "./HomeAnchorLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { OrbitaTrigger } from "./OrbitaTrigger";

/** Which nav item is active for non-home routes. */
function routeActive(pathname: string): NavKey | null {
  if (pathname.startsWith("/contratar")) return "services";
  if (pathname.startsWith("/projetos")) return "products";
  return null;
}

/**
 * Sticky site header (translucent, blurred): planet wordmark · 5 plain links whose accent
 * underline grows on hover and stays on the section in view · PT·EN·ES · round theme button ·
 * pill "Falar com a Órbita" (opens the chat). Mobile (<1120px): wordmark + ghost "Menu"
 * (MobileMenu sheet). Never hides.
 */
export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<NavKey | null>(routeActive(pathname));

  // active section (home only)
  useEffect(() => {
    if (!isHome) {
      setActive(routeActive(pathname));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let current: NavKey | null = null;
      let top = -Infinity;
      // the section whose top most recently crossed the line (DOM order is not assumed)
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.anchor);
        if (!el) continue;
        const y = el.getBoundingClientRect().top;
        if (y <= line && y > top) {
          top = y;
          current = item.key;
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [isHome, pathname]);

  return (
    <header className="site-header tx">
      {/* reading progress (CSS scroll timeline; stays empty where unsupported or with reduced motion) */}
      <span className="hdr-prog" aria-hidden="true" />
      <div className="wrap flex h-full items-center justify-between">
        <HomeAnchorLink anchor="home" className="wordmark wm-orbit">
          <span className="wm-planet" aria-hidden="true" />
          Wesley Santos
        </HomeAnchorLink>

        <nav aria-label={t("nav.aria")} className="hdr-desktop h-full items-center">
          <ul className="m-0 flex list-none items-center gap-7 p-0">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <HomeAnchorLink anchor={item.anchor} className="nv" aria-current={active === item.key ? (isHome ? "true" : "page") : undefined}>
                  {t(`nav.${item.key}`)}
                </HomeAnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hdr-desktop items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <span className="hdr-sep" aria-hidden="true" />
          <OrbitaTrigger source="header" variant="primary" size="sm" className="hdr-cta">
            {t("common.actions.talkToOrbita")}
          </OrbitaTrigger>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
