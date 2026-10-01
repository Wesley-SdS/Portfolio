import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { NAV_ITEMS, ROUTES, SITE } from "@/src/content/site";
import { ClockLine } from "@/components/ui-v3/Clock";
import { Github, Icon, Linkedin, Mail, Orbit } from "@/components/ui-v3/Icon";
import { HomeAnchorLink } from "./HomeAnchorLink";
import { LocaleSwitcher } from "./LocaleSwitcher";

/**
 * Site footer (finalSpec §4.12 + v3spec §5.12), id="footer".
 * Row 1: wordmark + description + clock · NAVEGAÇÃO (5 items) · LINKS
 * (GitHub, LinkedIn, OrbitMind, E-mail) · PT·EN·ES + "Voltar ao topo".
 * Row 2: © year + Privacidade (/privacidade) + colophon (+ short SHA when VERCEL_GIT_COMMIT_SHA exists).
 */
export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

  return (
    <footer id="footer" className="tx overflow-hidden border-t border-line pb-8 pt-8">
      <div className="wrap">
        <div className="g12 gap-y-8">
          <div className="col-span-4 flex flex-col items-start gap-3 md:col-span-8 lg:col-span-5">
            <HomeAnchorLink anchor="home" className="wordmark">
              Wesley Santos
            </HomeAnchorLink>
            <p className="small m-0 max-w-[44ch] text-[15px] leading-[22px]">{t("footer.description")}</p>
            <ClockLine />
          </div>
          <nav aria-label={t("nav.footerAria")} className="col-span-2 flex flex-col gap-3 md:col-span-2 lg:col-start-7">
            <p className="eb">{t("footer.navTitle")}</p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 leading-5">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <HomeAnchorLink anchor={item.anchor} className="flink">
                    {t(`nav.${item.key}`)}
                  </HomeAnchorLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-2 flex flex-col gap-3 md:col-span-2">
            <p className="eb">{t("footer.linksTitle")}</p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 leading-5">
              <li>
                <a className="flink flink-i" href={SITE.github} target="_blank" rel="noopener noreferrer">
                  <Icon icon={Github} size={16} />
                  {t("common.links.github")} ↗
                </a>
              </li>
              <li>
                <a className="flink flink-i" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
                  <Icon icon={Linkedin} size={16} />
                  {t("common.links.linkedin")} ↗
                </a>
              </li>
              <li>
                <a className="flink flink-i" href={SITE.orbitmindUrl} title={SITE.orbitmindUrlTitle}>
                  <Icon icon={Orbit} size={16} />
                  {t("common.links.orbitmind")} ↗
                </a>
              </li>
              <li>
                <a className="flink flink-i" href={`mailto:${SITE.email}`}>
                  <Icon icon={Mail} size={16} />
                  {t("common.links.email")}
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-4 flex flex-col items-start gap-4 md:col-span-4 lg:col-span-2">
            <LocaleSwitcher ariaLabel={t("footer.langAria")} />
            <HomeAnchorLink anchor="home" className="qlnk top-lnk ui">
              {t("common.actions.backToTop")}{" "}
              <span className="up" aria-hidden="true">
                ↑
              </span>
            </HomeAnchorLink>
          </div>
        </div>
        <div className="mt-7 flex flex-col justify-between gap-2 border-t border-line pt-4 font-mono text-[12px] leading-4 text-ink-3 md:flex-row md:items-center">
          <p className="m-0">
            {t("footer.copyright", { year })}
            {" · "}
            <Link className="inline-block py-1 text-ink-2 underline underline-offset-4 transition-colors hover:text-ink" href={ROUTES.privacy}>
              {t("footer.privacy")}
            </Link>
          </p>
          <p className="m-0">
            {t("footer.colophon")}
            {sha ? ` · rev. ${sha}` : ""}
          </p>
        </div>
        {/* closing wordmark: outlined, fills on hover (decorative — the name is already in the footer) */}
        <p className="ft-wm" aria-hidden="true">
          Wesley Santos
        </p>
      </div>
    </footer>
  );
}
