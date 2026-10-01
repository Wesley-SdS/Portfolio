import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Reveal, SectionIndexBar, SmartLink, TextLink } from "@/components/ui-v3";
import { ENGAGEMENT_MODELS, SOLUTIONS } from "@/src/content/services";
import { ANCHORS, ROUTES } from "@/src/content/site";
import { OrbitaTrigger } from "@/components/site/OrbitaTrigger";
import { ModelsCarousel } from "./services/ModelsCarousel";
import { QuoteModelLink } from "./services/QuoteModelLink";

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/**
 * 02 Serviços: "Como posso ajudar" (#servicos) — v3spec §5.6, §6.4.
 * Server component in <Reveal>. The four engagement models (tech lead · continuous · project · consulting) are a grid
 * at ≥1024 and a swipe track with dots below (ModelsCarousel, the only client
 * leaf besides the prefill links). "O que eu construo" lists 12 capabilities (each mapped to a quote
 * solution id) with a one-line outcome, stack and proof links.
 */
export function Services() {
  const t = useTranslations("services");
  const tc = useTranslations("common");

  const hireLink = (
    <TextLink href={ROUTES.hire} className="svc-hire">
      {t("hireLink")}
    </TextLink>
  );

  return (
    <Reveal as="section" id={ANCHORS.services} className="sec home-svc" aria-labelledby="h-servicos">
      <div className="inner">
        <SectionIndexBar index={t("index")} label={t("indexLabel")} meta={t("indexMeta")} />
        <div className="svc-h2row">
          <h2 id="h-servicos" className="h2">
            <span className="mask">
              <span style={v({ "--base": "200ms" })}>{t("h2")}</span>
            </span>
          </h2>
          <span className="svc-hire-d">{hireLink}</span>
        </div>
        <p className="lead svc-lead rv" style={v({ "--base": "320ms" })}>
          {t("lead")}
        </p>

        <div className="svc-models" style={v({ "--base": "400ms", "--stagger": "90ms" })}>
          <ModelsCarousel
            ariaLabel={t("carouselAria")}
            dotLabels={ENGAGEMENT_MODELS.map((m, i) =>
              t("slideLabel", { n: i + 1, total: ENGAGEMENT_MODELS.length, title: t(`models.${m.id}.title`) }),
            )}
            footerStart={<span className="svc-hire-m">{hireLink}</span>}
          >
            {ENGAGEMENT_MODELS.map((m, i) => (
              <article key={m.id} className="mcard hov rv" data-spot="" style={v({ "--i": i })} aria-labelledby={`mc-${m.id}`}>
                <span className="grow-bar" aria-hidden="true" />
                <div className="mc-head">
                  <p className="eb mc-num">{m.num}</p>
                  <h3 id={`mc-${m.id}`} className="h3s">
                    {t(`models.${m.id}.title`)}
                  </h3>
                </div>
                <p className="mc-one">{t(`models.${m.id}.oneLiner`)}</p>
                <p className="eb mc-lab">{t("includes")}</p>
                <ul className="dl-list">
                  {(t.raw(`models.${m.id}.items`) as string[]).map((item) => (
                    <li key={item}>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mc-meta">
                  <p>
                    <span className="eb">{t("howItWorks")}</span>
                    <span className="mc-val">{t(`models.${m.id}.how`)}</span>
                  </p>
                  <p>
                    <span className="eb">{t("idealFor")}</span>
                    <span className="mc-val">{t(`models.${m.id}.ideal`)}</span>
                  </p>
                </div>
                <div className="mc-foot">
                  <span className="mc-inv">{m.cta === "call" ? t("models.techlead.terms") : tc("investmentOnRequest")}</span>
                  {m.cta === "call" ? (
                    <OrbitaTrigger source="hire" variant="ghost" size="sm" className="mc-cta mc-call" ask={{ chip: "bookCall" }}>
                      {tc("actions.bookCall")}
                      <span className="arr" aria-hidden="true">
                        →
                      </span>
                    </OrbitaTrigger>
                  ) : (
                    <QuoteModelLink engagement={m.id} className="qlnk ui mc-cta">
                      {tc("actions.requestQuote")}
                      <span className="sr"> — {t(`models.${m.id}.title`)}</span>{" "}
                      <span className="arr" aria-hidden="true">
                        →
                      </span>
                    </QuoteModelLink>
                  )}
                </div>
              </article>
            ))}
          </ModelsCarousel>
        </div>

        {/* O que eu construo */}
        <div className="svc-build">
          <div className="svc-build-h">
            <h3 className="h3s svc-build-t">{t("buildTitle")}</h3>
            <p className="lead svc-build-l">{t("buildLead")}</p>
          </div>
          <ul className="sol-grid" style={v({ "--base": "200ms", "--stagger": "50ms" })}>
            {SOLUTIONS.map((s, i) => (
              <li key={s.id} className="rv" style={v({ "--i": i % 6 })}>
                <article className="sol" data-solution={s.quote} data-spot="">
                  <span className="sol-n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="sol-t">{t(`solutions.${s.id}.title`)}</h4>
                  <p className="sol-d">{t(`solutions.${s.id}.desc`)}</p>
                  <p className="sol-s">{t(`solutions.${s.id}.stack`)}</p>
                  <p className="sol-p">
                    <span className="sol-pr">{tc("proof")}</span>{" "}
                    {s.proofs.map((p, j) => (
                      <span key={p.key}>
                        {j > 0 ? " · " : null}
                        <SmartLink className="qlnk" href={p.href}>
                          {t(`solutions.${s.id}.proofs.${p.key}`)}
                        </SmartLink>
                      </span>
                    ))}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
