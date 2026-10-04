import type { CSSProperties, ReactNode } from "react";
import { OrbitaMark } from "@/components/orbita/OrbitaMark";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui-v3/Reveal";
import { SmartLink } from "@/components/ui-v3/SmartLink";
import { StatusTag } from "@/components/ui-v3/StatusTag";
import { CASES, type CaseConfig } from "@/src/content/cases";
import { LIGHT_RGB, caseLinkFor } from "@/src/content/projects";
import type { Locale } from "@/src/content/types";
import { ChannelsSplit, renderBlock } from "./CaseBlocks";
import { CaseCover } from "./CaseCover";
import { CaseToc, type TocItem } from "./CaseToc";
import { OrbitaButton } from "./OrbitaButton";

const TINT: Record<string, string> = {
  orbita: "var(--t-orbita)",
  orbitmind: "var(--t-orbitmind)",
  nex: "var(--t-nex)",
  orbitfinance: "var(--t-orbitfinance)",
  vibecoding: "var(--t-vibecoding)",
  vektus: "var(--t-vektus)",
};

/**
 * Reusable case-study template (v3 §11 / v2 §9): cover mini stage → meta band →
 * body (sticky TOC cols 1–3 + sections cols 5–12, full-width breakouts) →
 * "Próximo estudo de caso" → contact band. Content: src/content/cases.ts + messages `<cfg.ns>`.
 */
export async function CasePage({ cfg, locale }: { cfg: CaseConfig; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: cfg.ns });
  const tc = await getTranslations({ locale, namespace: "caseCommon" });
  const tg = await getTranslations({ locale });
  const ctx = { cfg, t, tc, tg, locale };

  const toc: TocItem[] = cfg.sections.map((s, i) => ({
    id: s.id,
    num: String(i + 1).padStart(2, "0"),
    label: t(`toc.${s.key}`),
  }));
  const hasScreens = cfg.sections.some((s) => s.blocks.some((b) => b.type === "gallery"));
  const next = CASES[cfg.next];
  const tn = await getTranslations({ locale, namespace: next.ns });

  const metaItems = ["role", "period", "status", "code"] as const;

  return (
    <article
      className="cs"
      data-case={cfg.slug}
      style={{ ["--L" as string]: LIGHT_RGB[cfg.light], ["--T" as string]: TINT[cfg.light] } as CSSProperties}
    >
      <CaseCover cfg={cfg} t={t} tc={tc} tg={tg} locale={locale} hasScreens={hasScreens} />

      {/* META BAND */}
      <section aria-label={tc("metaAria")} className="sec cs-metaband">
        <div className="inner">
          <p className="rv cs-lead" style={{ ["--base" as string]: "200ms", ["--i" as string]: 0, ["--stagger" as string]: "60ms" } as CSSProperties}>
            {t("lead")}
          </p>
          <dl className="cs-metagrid">
            {metaItems.map((k, i) => (
              <div key={k} className="rv" style={{ ["--base" as string]: "200ms", ["--i" as string]: i + 1, ["--stagger" as string]: "60ms" } as CSSProperties}>
                <dt className="eb">{t(`metaGrid.${k}.label`)}</dt>
                <dd>
                  {k === "status" ? (
                    <StatusTag status={cfg.status} bare>
                      {t(`metaGrid.${k}.value`)}
                    </StatusTag>
                  ) : k === "code" && cfg.github ? (
                    <a href={cfg.github} target="_blank" rel="noopener noreferrer" className="qlnk ext">
                      {t(`metaGrid.${k}.value`)}{" "}
                      <span className="arr" aria-hidden="true">
                        ↗
                      </span>
                      <span className="sr">{tg("common.opensInNewTab")}</span>
                    </a>
                  ) : (
                    t(`metaGrid.${k}.value`)
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="rv cs-stackline" style={{ ["--base" as string]: "200ms", ["--i" as string]: 5, ["--stagger" as string]: "60ms" } as CSSProperties}>
            <span className="eb">{tc("stackLabel")}</span>
            <span>{t("stack")}</span>
          </p>
        </div>
      </section>

      {/* BODY */}
      <div className="sec cs-bodywrap">
        <div className="inner cs-grid">
          <aside className="cs-aside">
            <CaseToc items={toc} label={tc("tocTitle")} />
          </aside>
          <div className="cs-content">
            {cfg.sections.map((s, si) => {
              const title = t.has(`sections.${s.key}.title`) ? t(`sections.${s.key}.title`) : t(`toc.${s.key}`);
              const heading: ReactNode = (
                <div className="cs-sec-head">
                  <span className="eb cs-sec-num">{toc[si].num}</span>
                  <h2 id={`h-${s.id}`} className="cs-h2">
                    {title}
                  </h2>
                </div>
              );
              const split = s.blocks.find((b) => b.type === "channels");
              return (
                <Reveal key={s.id} as="section" id={s.id} aria-labelledby={`h-${s.id}`} className="cs-sec" rootMargin="0px 0px -8% 0px" threshold={0.05}>
                  {split && split.type === "channels" ? (
                    <ChannelsSplit block={split} heading={heading} ctx={ctx} />
                  ) : (
                    <>
                      {heading}
                      {s.blocks.map((b, bi) => renderBlock(b, bi, ctx))}
                    </>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      {/* NEXT CASE */}
      <nav aria-label={tc("nextCase")} className="sec cs-next">
        <div className="inner cs-next-grid">
          <span className="eb">{tc("nextCase")}</span>
          <SmartLink href={caseLinkFor(next.slug)} className="lnk cs-next-link">
            {tn("h1")}{" "}
            <span className="arr" aria-hidden="true">
              →
            </span>
          </SmartLink>
        </div>
      </nav>

      {/* END — contact band */}
      <section aria-labelledby="h-cta" className="sec cs-end">
        <div className="inner">
          <div className="cs-end-card">
            <div className="cs-end-text">
              <h2 id="h-cta" className="cs-end-h2">
                {t("end.h2")}
              </h2>
              <p className="cs-end-lead">{t("end.lead")}</p>
            </div>
            <div className="cs-end-ctas">
              <SmartLink href="/#cotacao" className="btn btn-p">
                {tg("common.actions.requestQuote")}{" "}
                <span className="arr" aria-hidden="true">
                  →
                </span>
              </SmartLink>
              <OrbitaButton className="btn btn-s cs-orb-btn">
                <OrbitaMark size={22} className="btn-mark" />
                {tg("common.actions.talkToOrbita")}
              </OrbitaButton>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
