import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui-v3";
import { OrbitaTrigger } from "@/components/site/OrbitaTrigger";
import { PROCESS_STEPS } from "@/src/content/process";
import { ANCHORS } from "@/src/content/site";

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/**
 * Processo: "Como um trabalho acontece" (#processo) — v3spec §5.7, §6.4.
 * Server component in <Reveal>. Four steps on a ladder line: horizontal
 * (.draw-x through the node centres) at ≥1024, vertical (.draw-y segments)
 * below. Nodes .pop with a 120ms stagger; the last node is filled --accent.
 * Then the "Método AI-native" strip with a "Falar com a Órbita" trigger.
 */
export function Process() {
  const t = useTranslations("process");
  const tc = useTranslations("common");

  return (
    <Reveal as="section" id={ANCHORS.process} className="sec home-proc" aria-labelledby="h-processo">
      <div className="inner">
        <div className="proc-head">
          <h3 id="h-processo" className="h3s">
            {t("title")}
          </h3>
          <p className="meta">{t("meta")}</p>
        </div>

        <ol className="proc-steps" style={v({ "--base": "300ms", "--stagger": "120ms" })}>
          <li aria-hidden="true" className="proc-hline draw-x" style={v({ "--base": "300ms" })} />
          {PROCESS_STEPS.map((s, i) => (
            <li key={s.id} className="proc-step">
              <span className={`pnode pop${s.filled ? " fill" : ""}`} aria-hidden="true" style={v({ "--i": i })} />
              {i < PROCESS_STEPS.length - 1 ? (
                <span className="proc-vseg draw-y" aria-hidden="true" style={v({ "--base": `${300 + i * 120}ms` })} />
              ) : null}
              <div className="proc-txt">
                <p className="eb proc-num">{s.num}</p>
                <h4 className="proc-t">{t(`steps.${s.id}.title`)}</h4>
                <p className="proc-x">{t(`steps.${s.id}.text`)}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="proc-note tx">
          <div className="proc-note-txt">
            <p className="eb">{t("method.eyebrow")}</p>
            <p className="proc-note-p">{t("method.text")}</p>
          </div>
          <OrbitaTrigger source="process" size="sm" className="proc-note-btn">
            {tc("actions.talkToOrbita")}
          </OrbitaTrigger>
        </div>
      </div>
    </Reveal>
  );
}
