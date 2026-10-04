import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";
import { Link } from "@/i18n/routing";
import { NAV_ITEMS, ROUTES, SITE } from "@/src/content/site";
import { ClockLine } from "@/components/ui-v3/Clock";
import { StatusTag } from "@/components/ui-v3/StatusTag";
import { Github, Icon, Linkedin, Mail, Orbit } from "@/components/ui-v3/Icon";
import { HomeAnchorLink } from "./HomeAnchorLink";
import { LocaleSwitcher } from "./LocaleSwitcher";

/**
 * Site footer (id="footer"): brand + one line + live status/clock on the left; the page nav as quiet
 * links and the profiles as round icon buttons on the right; a thin bar with ©, privacy, colophon,
 * language and a round "back to top"; the outlined wordmark closes the page (fills on hover).
 */
export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

  const socials = [
    { href: SITE.github, label: t("common.links.github"), icon: Github, ext: true },
    { href: SITE.linkedin, label: t("common.links.linkedin"), icon: Linkedin, ext: true },
    { href: SITE.orbitmindUrl, label: t("common.links.orbitmind"), icon: Orbit, ext: false },
    { href: `mailto:${SITE.email}`, label: t("common.links.email"), icon: Mail, ext: false },
  ];

  return (
    <footer id="footer" className="ft tx">
      <div className="wrap">
        <div className="ft-top">
          <div className="ft-brand">
            <HomeAnchorLink anchor="home" className="wordmark wm-orbit">
              <span className="wm-planet" aria-hidden="true" />
              Wesley Santos
            </HomeAnchorLink>
            <p className="ft-desc">{t("footer.description")}</p>
            <div className="ft-live">
              <StatusTag status="available" bare ping="loop" pingDelay="1400ms" className="ft-avail" />
              <span className="ft-dot" aria-hidden="true" />
              <ClockLine as="span" />
            </div>
          </div>

          <div className="ft-cols">
            <nav aria-label={t("nav.footerAria")} className="ft-col">
              <p className="ft-h">{t("footer.navTitle")}</p>
              <ul>
                {NAV_ITEMS.map((item) => (
                  <li key={item.key}>
                    <HomeAnchorLink anchor={item.anchor} className="ft-a">
                      {t(`nav.${item.key}`)}
                    </HomeAnchorLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="ft-col">
              <p className="ft-h">{t("footer.linksTitle")}</p>
              <ul className="ft-social">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      className="ft-ic"
                      href={s.href}
                      {...(s.ext ? { target: "_blank", rel: "noopener noreferrer" } : null)}
                      title={s.label}
                      aria-label={s.ext ? `${s.label} ${t("common.opensInNewTab")}` : s.label}
                    >
                      <Icon icon={s.icon} size={17} />
                    </a>
                  </li>
                ))}
              </ul>
              <a className="ft-mail" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </div>
          </div>
        </div>

        <div className="ft-bar">
          <p className="ft-meta">
            {t("footer.copyright", { year })}
            <span aria-hidden="true"> · </span>
            <Link className="ft-a ft-priv" href={ROUTES.privacy}>
              {t("footer.privacy")}
            </Link>
          </p>
          <p className="ft-meta ft-colo">
            {t("footer.colophon")}
            {sha ? ` · rev. ${sha}` : ""}
          </p>
          <div className="ft-bar-r">
            <LocaleSwitcher ariaLabel={t("footer.langAria")} />
            <HomeAnchorLink anchor="home" className="ft-top-btn" aria-label={t("common.actions.backToTop")} title={t("common.actions.backToTop")}>
              <ArrowUp width={16} height={16} strokeWidth={1.6} aria-hidden="true" />
            </HomeAnchorLink>
          </div>
        </div>

        {/* closing wordmark: outlined, fills on hover (decorative; the name is already in the footer) */}
        <p className="ft-wm" aria-hidden="true">
          Wesley Santos
        </p>
      </div>
    </footer>
  );
}
