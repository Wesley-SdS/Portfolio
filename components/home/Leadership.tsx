import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CropImage, Reveal, TextLink } from "@/components/ui-v3";
import { ABOUT } from "@/src/content/about";
import { COMPANIES, DEFAULT_OPEN_COMPANY, type Company } from "@/src/content/leadership";
import { ANCHORS, SITE } from "@/src/content/site";
import { asLocale, formatPeriod, formatYears } from "@/src/content/format";
import type { Period } from "@/src/content/types";
import { CompanyAccordion } from "./leadership/CompanyAccordion";

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/**
 * 03 Sobre & experiência (#experience, with #about on the bio column).
 * Server component in <Reveal>. Left (sticky at ≥1024): index label, portrait, H2, bio, LinkedIn.
 * Right: the career timeline — a single-open accordion (client leaf) on a vertical line with one
 * node per entry (period · role / company · plus); each entry opens to the CV's summary, role
 * ladder (when there was a promotion), bullets and stack. Below: the stack grid and education.
 * Facts come from the owner's CV (src/content/leadership.ts, src/content/about.ts).
 */
export function Leadership() {
  const t = useTranslations("leadership");
  const tc = useTranslations("common");
  const locale = asLocale(useLocale());

  const period = (c: Company, p: Period) => (c.yearsOnly ? formatYears(p, locale) : formatPeriod(p, locale));

  const header = (c: Company) => (
    <>
      <span className="xi-per">{c.span ? period(c, c.span) : t(`companies.${c.id}.period`)}</span>
      <span className="xi-id">
        <span className="xi-role">{t(`companies.${c.id}.role`)}</span>
        <span className="xi-co">
          {t(`companies.${c.id}.name`)} · {t(`companies.${c.id}.mode`)}
          {c.current ? (
            <span className="xi-cur">
              <span className="dot" aria-hidden="true" />
              {tc("status.current")}
            </span>
          ) : null}
        </span>
      </span>
    </>
  );

  const body = (c: Company) => (
    <>
      <p className="xi-p">{t(`companies.${c.id}.paragraph`)}</p>
      {c.roles.length ? (
        <ol className="xi-lad">
          {c.roles.map((r) => (
            <li key={r.id}>
              <span className={`node${r.promoted ? " promo" : ""}`} aria-hidden="true" />
              <b>
                {t(`companies.${c.id}.roles.${r.id}.title`)} · {period(c, r.period)}
              </b>
              <span>{t(`companies.${c.id}.roles.${r.id}.text`)}</span>
            </li>
          ))}
        </ol>
      ) : null}
      <ul className="xi-list">
        {(t.raw(`companies.${c.id}.bullets`) as string[]).map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <p className="xi-stack">{t(`companies.${c.id}.stack`)}</p>
      {c.link ? (
        <p className="xi-link">
          <TextLink variant="quiet" href={c.link.href}>
            {c.link.label}
          </TextLink>
        </p>
      ) : null}
    </>
  );

  const items = COMPANIES.map((c) => ({
    id: c.id,
    label: `${t(`companies.${c.id}.role`)} — ${t(`companies.${c.id}.name`)}`,
    header: header(c),
    body: body(c),
  }));

  return (
    <Reveal as="section" id={ANCHORS.experience} className="sec home-exp" aria-labelledby="h-exp">
      <div className="inner">
        <div className="xp">
          <div id={ANCHORS.about} className="xp-l">
            <p className="eb rv" style={v({ "--base": "80ms" })}>
              <span className="xp-ix">{t("index")}</span> — {t("indexLabel")}
            </p>
            <div className="xp-ph rv" style={v({ "--base": "140ms" })}>
              <CropImage crop={ABOUT.portrait} renderWidth={160} />
            </div>
            <h2 id="h-exp" className="h2 xp-h2">
              <span className="mask">
                <span style={v({ "--base": "200ms" })}>{t("h2")}</span>
              </span>
            </h2>
            <p className="lead xp-bio rv" style={v({ "--base": "320ms" })}>
              {t("bio")}
            </p>
            <p className="meta rv" style={v({ "--base": "400ms" })}>
              {t("meta")}
            </p>
            <p className="xp-li rv" style={v({ "--base": "460ms" })}>
              <TextLink variant="quiet" href={SITE.linkedin}>
                {t("linkedin")}
              </TextLink>
            </p>
          </div>

          <div className="xp-r rv" style={v({ "--base": "260ms" })}>
            <span className="xp-tl" aria-hidden="true">
              <i />
            </span>
            <CompanyAccordion items={items} defaultOpen={DEFAULT_OPEN_COMPANY} />
          </div>
        </div>

        <div className="xp-stack">
          <div className="xp-stack-h">
            <h3 className="eb">{t("stackTitle")}</h3>
            <p className="meta">{t("stackLead")}</p>
          </div>
          <div className="xp-stack-g" style={v({ "--base": "120ms", "--stagger": "50ms" })}>
            {ABOUT.stack.map((g, i) => (
              <div key={g.id} className="xp-stack-c rv" data-spot="" style={v({ "--i": i })}>
                <p className="xp-stack-m">
                  <b>{g.proof}</b>
                  <span>{t(`stackMeta.${g.id}`)}</span>
                </p>
                <h4>{t(`stack.${g.id}`)}</h4>
                <ul>
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="xp-edu">
            <h3 className="eb">{t("educationTitle")}</h3>
            <ul>
              {(t.raw("education") as string[]).map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
