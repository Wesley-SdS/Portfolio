"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ENGAGEMENT_MODELS, COMPARISON_ROWS } from "@/src/content/services";
import { requestQuotePrefill } from "@/components/quote/quote-bridge";
import { OrbitaTrigger } from "@/components/site/OrbitaTrigger";

/**
 * /contratar #modelos comparison (v3spec §9.2): label column + 4 model columns (the tech-lead column books a call).
 * Desktop: hovering/focusing a model column tints its cells (--surface, 120ms)
 * and draws the accent bar. <1024px: a 3-way switch shows one model column at a
 * time (ids #continuo/#projeto/#consultoria select it). "Quero este formato"
 * prefills the QuoteForm engagement (docs/REDESIGN.md §10.1).
 */
export function Comparison() {
  const t = useTranslations();
  const [hot, setHot] = useState<number | null>(null);
  const [mobile, setMobile] = useState(0);

  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.slice(1);
      const i = ENGAGEMENT_MODELS.findIndex((m) => m.hireAnchor === h);
      if (i >= 0) setMobile(i);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const cellCls = (i: number, extra?: string) => cn("cmp-mc", `cmp-m${i}`, hot === i && "is-hot", mobile === i && "is-mob", extra);
  const enter = (i: number) => () => setHot(i);

  const want = (e: MouseEvent<HTMLAnchorElement>, i: number) => {
    const m = ENGAGEMENT_MODELS[i];
    if (m.cta !== "quote") return;
    e.preventDefault();
    requestQuotePrefill({ engagement: m.id });
    history.replaceState(null, "", "#cotacao");
  };

  return (
    <div className="cmp-wrap">
      <div className="cmp-switch" role="group" aria-label={t("hire.comparison.pickAria")}>
        {ENGAGEMENT_MODELS.map((m, i) => (
          <button key={m.id} type="button" className="chip" aria-pressed={mobile === i} onClick={() => setMobile(i)}>
            {t(`hire.jump.${m.id}`)}
          </button>
        ))}
      </div>

      <table className="cmp" onMouseLeave={() => setHot(null)}>
        <caption className="sr">{t("hire.comparison.caption")}</caption>
        <colgroup>
          <col className="cmp-col-l" />
          {ENGAGEMENT_MODELS.map((m, i) => (
            <col key={m.id} className={cn("cmp-col", `cmp-m${i}`, mobile === i && "is-mob")} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="cmp-lc cmp-hint">
              {t("hire.comparison.hint")}
            </th>
            {ENGAGEMENT_MODELS.map((m, i) => (
              <th key={m.id} scope="col" id={m.hireAnchor} className={cellCls(i, "cmp-mh")} onMouseEnter={enter(i)}>
                <span className="grow-bar" aria-hidden="true" />
                <span className="eb cmp-num">{m.num}</span>
                <span className="cmp-mt">{t(`services.models.${m.id}.title`)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row) => (
            <tr key={row}>
              <th scope="row" className="cmp-lc">
                {t(`hire.comparison.rows.${row}`)}
              </th>
              {ENGAGEMENT_MODELS.map((m, i) => (
                <td
                  key={m.id}
                  className={cellCls(i, row === "oneLiner" ? "cmp-frase" : row === "investment" ? "cmp-price" : undefined)}
                  onMouseEnter={enter(i)}
                >
                  {row === "includes" ? (
                    <ul className="cmp-inc">
                      {(t.raw(`services.models.${m.id}.items`) as string[]).map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  ) : (
                    t(`hire.comparison.models.${m.id}.${row}`)
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row" className="cmp-lc">
              <span className="sr">{t("hire.comparison.action")}</span>
            </th>
            {ENGAGEMENT_MODELS.map((m, i) => (
              <td key={m.id} className={cellCls(i, "cmp-last")} onMouseEnter={enter(i)}>
                {m.cta === "call" ? (
                  <OrbitaTrigger source="hire" variant="primary" size="sm" ask={{ chip: "bookCall" }} className="cmp-call">
                    {t("common.actions.bookCall")}
                  </OrbitaTrigger>
                ) : (
                <a
                  className="btn btn-p btn-sm"
                  href="#cotacao"
                  onFocus={enter(i)}
                  onBlur={() => setHot(null)}
                  onClick={(e) => want(e, i)}
                  aria-label={t("hire.comparison.ctaAria", { model: t(`services.models.${m.id}.title`) })}
                >
                  {t("hire.comparison.cta")}
                  <span className="arr" aria-hidden="true">
                    →
                  </span>
                </a>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
