import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { languageAlternates, localePath } from "@/i18n/paths";
import { Link } from "@/i18n/routing";
import { ROUTES, SITE } from "@/src/content/site";
import { ButtonLink } from "@/components/ui-v3/Button";

/**
 * /privacidade — LGPD-style privacy notice for the quote form, contact and the Órbita chat.
 * Linked from the footer, the quote consent (step 5) and the chat disclosure.
 * OWNER-FLAG: every "[…]" token in `privacy.*` (retention, contracting entity, response time,
 * legal bases, publication date) is rendered highlighted until the owner fills it in.
 */
const PATH = ROUTES.privacy;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("privacyTitle"),
    description: t("privacyDescription"),
    alternates: { canonical: localePath(locale, PATH), languages: languageAlternates(PATH) },
  };
}

const SECTIONS = [
  "controller",
  "collect",
  "purpose",
  "legalBasis",
  "processors",
  "retention",
  "rights",
  "storage",
  "security",
  "changes",
] as const;
const COLLECT = ["quote", "orbita", "booking", "email", "technical"] as const;
const PROCESSORS = ["resend", "anthropic", "google", "vercel"] as const;

/** Highlights owner-review placeholders such as [RETENÇÃO] so they cannot slip into production unnoticed. */
function flag(text: string): ReactNode {
  const parts = text.split(/(\[[^\]]+\])/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /^\[[^\]]+\]$/.test(part) ? (
      <mark key={i} className="priv-flag">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const s = (key: string) => t(`sections.${key}`);

  return (
    <div className="priv">
      <section className="sec priv-intro" aria-labelledby="priv-h1">
        <div className="inner">
          <nav aria-label={t("breadcrumb.aria")}>
            <p className="crumb">
              <Link href="/">{t("breadcrumb.home")}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{t("breadcrumb.current")}</span>
            </p>
          </nav>
          <p className="eb priv-eb">{t("eyebrow")}</p>
          <h1 id="priv-h1" className="display priv-h1">
            {t("h1")}
          </h1>
          <p className="lead priv-lead">{t("lead")}</p>
          <p className="meta priv-updated">{flag(t("updated"))}</p>
          <aside className="priv-review" aria-label={t("reviewLabel")}>
            <span className="tag tag-s">{t("reviewLabel")}</span>
            <p className="small m-0">{t("reviewNote")}</p>
          </aside>
        </div>
      </section>

      <section className="sec priv-body-sec">
        <div className="inner g12 priv-grid">
          <nav className="priv-toc" aria-labelledby="priv-toc-title">
            <p id="priv-toc-title" className="eb">
              {t("tocTitle")}
            </p>
            <ol>
              {SECTIONS.map((id, i) => (
                <li key={id}>
                  <a className="qlnk" href={`#${id}`}>
                    <span className="priv-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s(`${id}.title`)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="priv-content">
            {SECTIONS.map((id, i) => (
              <section key={id} id={id} className="priv-sec" aria-labelledby={`${id}-h`}>
                <p className="meta priv-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 id={`${id}-h`} className="h3s">
                  {s(`${id}.title`)}
                </h2>

                {id === "controller" && (
                  <>
                    <p className="para">{flag(s("controller.text"))}</p>
                    <dl className="priv-dl">
                      <dt className="eb">{s("controller.emailLabel")}</dt>
                      <dd>
                        <a className="lnk" href={`mailto:${SITE.email}`}>
                          {SITE.email}
                        </a>
                      </dd>
                    </dl>
                  </>
                )}

                {id === "collect" && (
                  <>
                    <p className="para">{s("collect.intro")}</p>
                    <dl className="priv-items">
                      {COLLECT.map((k) => (
                        <div key={k} className="priv-item">
                          <dt className="h4">{s(`collect.items.${k}.name`)}</dt>
                          <dd className="para">{s(`collect.items.${k}.text`)}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}

                {id === "purpose" && (
                  <>
                    <ul className="priv-list">
                      {(t.raw("sections.purpose.items") as string[]).map((item) => (
                        <li key={item} className="para">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="para priv-strong">{s("purpose.never")}</p>
                  </>
                )}

                {id === "processors" && (
                  <>
                    <p className="para">{s("processors.intro")}</p>
                    <ul className="priv-procs">
                      {PROCESSORS.map((k) => (
                        <li key={k} className="priv-proc">
                          <p className="h4">{s(`processors.rows.${k}.name`)}</p>
                          <dl>
                            <div>
                              <dt className="eb">{s("processors.purposeLabel")}</dt>
                              <dd className="body">{s(`processors.rows.${k}.purpose`)}</dd>
                            </div>
                            <div>
                              <dt className="eb">{s("processors.dataLabel")}</dt>
                              <dd className="body">{flag(s(`processors.rows.${k}.data`))}</dd>
                            </div>
                          </dl>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {id === "rights" && (
                  <>
                    <p className="para">{s("rights.intro")}</p>
                    <ul className="priv-list">
                      {(t.raw("sections.rights.items") as string[]).map((item) => (
                        <li key={item} className="para">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="para">
                      {flag(s("rights.how"))}{" "}
                      <a className="lnk" href={`mailto:${SITE.email}`}>
                        {SITE.email}
                      </a>
                    </p>
                  </>
                )}

                {(id === "legalBasis" || id === "retention" || id === "storage" || id === "security" || id === "changes") && (
                  <p className="para">{flag(s(`${id}.text`))}</p>
                )}
              </section>
            ))}

            <div className="priv-end">
              <ButtonLink href="/" variant="secondary" arrow>
                {t("backHome")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
