import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Calendar, Icon } from "@/components/ui-v3/Icon";
import { Reveal } from "@/components/ui-v3/Reveal";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { OrbitaTrigger } from "@/components/site/OrbitaTrigger";
import { SITE } from "@/src/content/site";

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/**
 * 05 Contato (#contact) — the artifact's closing block.
 * Centred CTA over three slow rings (one glowing satellite each): label · "Vamos colocar seu projeto
 * em órbita?" · lead · #orbita: "Marcar uma call" (opens the chat on the booking flow) and
 * "Perguntar à Órbita" (opens the chat) · e-mail, LinkedIn, GitHub.
 * Then #cotacao: the written route — heading beside the five-step QuoteForm (components/quote).
 */
export function Contact() {
  const t = useTranslations("contact");
  const tc = useTranslations("common");
  return (
    <Reveal as="section" id="contact" aria-labelledby="contact-h" className="tx ct">
      <div className="sec ct-cta">
        <span className="ct-rings" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div className="inner ct-in" style={v({ "--stagger": "100ms" })}>
          <p className="eb rv" style={v({ "--i": 0 })}>
            <span className="ct-ix">{t("index")}</span> — {t("indexLabel")}
          </p>
          <h2 id="contact-h" className="ct-h rv" style={v({ "--i": 1 })}>
            {t("h2a")} <span className="ct-acc">{t("h2b")}</span>
          </h2>
          <p className="lead ct-lead rv" style={v({ "--i": 2 })}>
            {t("lead")}
          </p>
          <div id="orbita" className="ct-btns rv" style={v({ "--i": 3 })}>
            <OrbitaTrigger source="contact" variant="primary" ask={{ chip: "bookCall" }} className="ct-btn">
              <Icon icon={Calendar} size={18} />
              {tc("actions.bookCall")}
            </OrbitaTrigger>
            <OrbitaTrigger source="contact" variant="secondary" className="ct-btn">
              {tc("actions.askOrbita")}
            </OrbitaTrigger>
          </div>
          <p className="meta ct-note rv" style={v({ "--i": 4 })}>
            {t("orbitaNote")}
          </p>
          <nav className="ct-links rv" aria-label={t("linksAria")} style={v({ "--i": 5 })}>
            <a className="ct-ul" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            <a className="ct-ul" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
              {SITE.linkedinLabel}
              <span className="sr"> {tc("opensInNewTab")}</span>
            </a>
            <a className="ct-ul" href={SITE.github} target="_blank" rel="noopener noreferrer">
              {SITE.githubLabel}
              <span className="sr"> {tc("opensInNewTab")}</span>
            </a>
          </nav>
        </div>
      </div>

      <div className="sec ct-qsec">
        <div className="inner ct-qgrid">
          <div className="ct-qhead">
            <p className="eb">{t("quoteEyebrow")}</p>
            <h3 className="h3 ct-qt">{t("quoteTitle")}</h3>
            <p className="lead ct-ql">{t("quoteLead")}</p>
          </div>
          <div id="cotacao" className="ct-quote">
            <QuoteForm />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
