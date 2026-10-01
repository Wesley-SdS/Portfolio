import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Reveal, SmartLink } from "@/components/ui-v3";
import { NUMBERS } from "@/src/content/projects";
import { asLocale, formatNumber } from "@/src/content/format";

const TICKS = Array.from({ length: 114 }, (_, i) => i);
const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/**
 * "O que isso entrega" (numbers strip) — four business-facing proofs, each with a unit visual and
 * a one-line reading of what the number means for a product or a company:
 * connectors (integrations ready), time to merge (delivery speed), clients served (scale),
 * automated tests (safe change). Server component inside <Reveal>: counters stay on frame 0 until the
 * strip scrolls into view; reduced motion shows end frames. Facts: src/content/projects.ts NUMBERS.
 */
export function Numbers() {
  const t = useTranslations("numbers");
  const locale = asLocale(useLocale());
  const [connectors, merge, clients, tests] = NUMBERS;

  const mergeH = formatNumber(merge.metric.value ?? 0, locale, 1);
  const testsFull = formatNumber(tests.metric.value ?? 0, locale);

  return (
    <Reveal as="section" className="sec home-nums" aria-labelledby="h-numeros" style={v({ "--base": "400ms" })}>
      <div className="inner">
        <div className="nums-head">
          <h2 id="h-numeros" className="eb">
            {t("title")}
          </h2>
          <p className="meta nums-lead">{t("lead")}</p>
        </div>
        <div className="nums-grid" style={v({ "--stagger-metric": "120ms" })}>
          {/* 114 conectores */}
          <div className="nc">
            <p className="nnum">
              <span className="cnt run" aria-hidden="true" style={v({ "--to": connectors.metric.value ?? 0, "--i": 0 })} />
              <span className="sr">{formatNumber(connectors.metric.value ?? 0, locale)}</span>
            </p>
            <div className="nvis" aria-hidden="true">
              <span className="tks">
                <span className="tk-row">
                  {TICKS.map((i) => (
                    <i key={i} />
                  ))}
                </span>
                <span className="tk-row on" style={v({ "--stagger": "7ms" })}>
                  {TICKS.map((i) => (
                    <i key={i} className="rv-fade" style={v({ "--i": i })} />
                  ))}
                </span>
              </span>
            </div>
            <p className="nlab">{t("cells.connectors.label")}</p>
            <p className="nwhy">{t("cells.connectors.why")}</p>
            <SmartLink className="nsrc" href={connectors.href}>
              {t("cells.connectors.source")} <span aria-hidden="true">→</span>
            </SmartLink>
          </div>

          {/* 0,5 h até o merge */}
          <div className="nc">
            <p className="nnum">
              <span className="rv" aria-hidden="true" style={v({ "--base": "520ms" })}>
                {mergeH}
              </span>
              <span className="nnum-rest" aria-hidden="true">
                {" " + t("cells.merge.unit")}
              </span>
              <span className="sr">
                {mergeH} {t("cells.merge.unit")}
              </span>
            </p>
            <div className="nvis" aria-hidden="true">
              <span className="flow">
                <span className="flow-line">
                  <i className="draw-x" style={v({ "--base": "500ms" })} />
                </span>
                {merge.steps.map((s, i) => (
                  <span key={s} className="flow-node pop" style={v({ "--base": "520ms", "--i": i })}>
                    <i className={i === merge.steps.length - 1 ? "is-end" : undefined} />
                    <b>{t(`cells.merge.steps.${s}`)}</b>
                  </span>
                ))}
              </span>
            </div>
            <p className="nlab">{t("cells.merge.label")}</p>
            <p className="nwhy">{t("cells.merge.why")}</p>
            <SmartLink className="nsrc" href={merge.href}>
              {t("cells.merge.source")} <span aria-hidden="true">→</span>
            </SmartLink>
          </div>

          {/* 600+ clientes */}
          <div className="nc">
            <p className="nnum">
              <span className="cnt run" aria-hidden="true" style={v({ "--to": clients.metric.value ?? 0, "--i": 2 })} />
              <span aria-hidden="true">+</span>
              <span className="sr">{formatNumber(clients.metric.value ?? 0, locale)}+</span>
            </p>
            <div className="nvis" aria-hidden="true">
              <span className="geo">
                {clients.regions.map((r, i) => (
                  <span key={r} className="geo-i pop" style={v({ "--base": "560ms", "--i": i })}>
                    <i />
                    {t(`cells.clients.regions.${r}`)}
                  </span>
                ))}
              </span>
            </div>
            <p className="nlab">{t("cells.clients.label")}</p>
            <p className="nwhy">{t("cells.clients.why")}</p>
            <SmartLink className="nsrc" href={clients.href}>
              {t("cells.clients.source")} <span aria-hidden="true">→</span>
            </SmartLink>
          </div>

          {/* 25.937 testes */}
          <div className="nc">
            <p className="nnum rv" style={v({ "--base": "600ms" })}>
              {testsFull}
            </p>
            <div className="nvis" aria-hidden="true">
              <span className="split">
                <span className="split-bar">
                  <i className="draw-x" style={v({ width: "100%", background: "var(--ink)", "--base": "640ms" })} />
                </span>
                <span className="ncap">{t("cells.tests.split", { suites: formatNumber(tests.suites, locale) })}</span>
              </span>
            </div>
            <p className="nlab">{t("cells.tests.label")}</p>
            <p className="nwhy">{t("cells.tests.why", { suites: formatNumber(tests.suites, locale) })}</p>
            <SmartLink className="nsrc" href={tests.href}>
              {t("cells.tests.source")} <span aria-hidden="true">→</span>
            </SmartLink>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
