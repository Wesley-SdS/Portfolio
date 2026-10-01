import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Activity, Bot, Coins, FileSearch, GitMerge, History, LayoutDashboard, MessageCircle, Mic, Plug, ShieldCheck, Smartphone, Workflow } from "lucide-react";
import { languageAlternates, localePath } from "@/i18n/paths";
import { Link } from "@/i18n/routing";
import { ANCHORS, ROUTES, SITE } from "@/src/content/site";
import { ENGAGEMENT_MODELS, SOLUTIONS } from "@/src/content/services";
import { AI_METHOD_ROWS, PROCESS_STEPS } from "@/src/content/process";
import { ButtonLink } from "@/components/ui-v3/Button";
import { SmartLink } from "@/components/ui-v3/SmartLink";
import { SectionIndexBar } from "@/components/ui-v3/SectionIndexBar";
import { Reveal } from "@/components/ui-v3/Reveal";
import { Check, Icon, type LucideIcon } from "@/components/ui-v3/Icon";
import { OrbitaTrigger } from "@/components/site/OrbitaTrigger";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { CopyEmailButton } from "@/components/quote/CopyEmailButton";
import { Comparison } from "@/components/hire/Comparison";
import { Faq } from "@/components/hire/Faq";

/**
 * /contratar — "Como trabalhar comigo" (v3spec §9, Hire.dc.html 1440×4320).
 * Intro (the page's only h1) · #modelos comparison · O que eu construo ·
 * Processo + método · #cotacao (QuoteForm) · FAQ. Header/footer/Órbita come
 * from the locale layout. Prefill: /contratar?formato=project#cotacao (REDESIGN §10.1).
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("hireTitle"),
    description: t("hireDescription"),
    alternates: { canonical: localePath(locale, "/contratar"), languages: languageAlternates("/contratar") },
  };
}

const SOLUTION_ICON: Record<string, LucideIcon> = {
  web_platform: LayoutDashboard,
  mobile_app: Smartphone,
  ai_agents: Bot,
  rag: FileSearch,
  workflows: Workflow,
  whatsapp_bots: MessageCircle,
  integrations: Plug,
  security: ShieldCheck,
  finops: Coins,
  pipeline: GitMerge,
  quality: Activity,
  voice: Mic,
  legacy_evolution: History,
};

/** home anchors ("#todos-os-produtos") must point back to the home page from here */
const fromHome = (href: string) => (href.startsWith("#") ? `/${href}` : href);

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export default async function HirePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const h1Words = t("hire.h1").split(" ");
  const h1Last = h1Words.pop();
  const proofRows = [
    { id: "tools", href: ROUTES.project("orbita"), source: "Órbita", counter: 102 },
    { id: "commits", href: `/#${ANCHORS.experience}`, source: t("nav.experience"), counter: null },
    { id: "tests", href: `/#${ANCHORS.allProducts}`, source: t("products.items.nex.name"), counter: null },
  ] as const;

  return (
    <div className="hire">
      {/* ============ INTRO ============ */}
      <section className="sec hire-intro" aria-labelledby="hire-h1">
        <div className="inner hire-intro-g">
          <div className="hire-intro-l">
            <nav aria-label={t("hire.breadcrumb.aria")} className="rv-fade">
              <p className="crumb">
                <Link href="/">{t("hire.breadcrumb.home")}</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{t("hire.breadcrumb.current")}</span>
              </p>
            </nav>
            <h1 id="hire-h1" className="display hire-h1">
              <span className="mask">
                <span style={v({ "--base": "80ms" })}>
                  {h1Words.join(" ")}{" "}
                  <span className="hire-pw">
                    {h1Last}
                    <span className="draw-x pencil" aria-hidden="true" style={v({ "--base": "700ms" })} />
                  </span>
                </span>
              </span>
            </h1>
            <p className="lead rv hire-lead" style={v({ "--base": "220ms" })}>
              {t("hire.lead")}
            </p>
            <div className="rv hire-ctas" style={v({ "--base": "340ms" })}>
              <ButtonLink href="#cotacao" arrow>
                {t("common.actions.requestQuote")}
              </ButtonLink>
              <OrbitaTrigger source="hire" withOrb>
                {t("common.actions.talkToOrbita")}
              </OrbitaTrigger>
            </div>
            <div className="rv hire-jump" style={v({ "--base": "440ms" })}>
              <p id="hire-jump-l" className="meta">
                {t("hire.jump.label")}
              </p>
              <div role="group" aria-labelledby="hire-jump-l" className="hire-jump-g">
                {ENGAGEMENT_MODELS.map((m) => (
                  <a key={m.id} className="chip jump" href={`#${m.hireAnchor}`}>
                    {t(`hire.jump.${m.id}`)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <aside className="proof" aria-labelledby="pq-title">
            <p id="pq-title" className="eb pq-eb">
              {t("hire.proof.title")}
            </p>
            {proofRows.map((r, i) => (
              <div key={r.id} className="pq rv-r" style={v({ "--base": "420ms", "--i": i })}>
                <p className="pq-num">
                  {r.counter ? (
                    <>
                      <span className="cnt run" style={v({ "--to": r.counter, "--base": "500ms" })} aria-hidden="true" />
                      <span className="sr">{t(`hire.proof.rows.${r.id}.value`)}</span>
                    </>
                  ) : (
                    t(`hire.proof.rows.${r.id}.value`)
                  )}
                </p>
                <div>
                  <p className="pq-lbl">{t(`hire.proof.rows.${r.id}.label`)}</p>
                  <SmartLink className="src" href={r.href}>
                    {t("common.source", { name: r.source })} <span aria-hidden="true">→</span>
                  </SmartLink>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* ============ 01 MODELOS ============ */}
      <Reveal as="section" id="modelos" aria-labelledby="modelos-h" className="sec hire-sec">
        <div className="inner">
          <SectionIndexBar index={t("hire.sections.models.index")} label={t("hire.sections.models.label")} meta={t("services.indexMeta")} />
          <h2 id="modelos-h" className="h2 hire-h2">
            <span className="mask">
              <span>{t("hire.comparison.h2")}</span>
            </span>
          </h2>
          <p className="lead rv hire-sub" style={v({ "--base": "160ms" })}>
            {t("services.lead")}
          </p>
          <Comparison />
        </div>
      </Reveal>

      {/* ============ 02 O QUE EU CONSTRUO ============ */}
      <Reveal as="section" id="construo" aria-labelledby="construo-h" className="sec hire-sec">
        <div className="inner">
          <SectionIndexBar index={t("hire.sections.build.index")} label={t("hire.sections.build.label")} meta={t("hire.sections.build.meta")} />
          <h2 id="construo-h" className="h3s hire-h3">
            {t("hire.build.title")}
          </h2>
          <div className="svc-g">
            {SOLUTIONS.map((s, i) => (
              <article key={s.id} className="svc hov lift rv" data-solution={s.id} style={v({ "--i": i, "--stagger": "60ms" })}>
                <span className="grow-bar" aria-hidden="true" />
                <div className="svc-top">
                  <h3 className="svc-t">{t(`services.solutions.${s.id}.title`)}</h3>
                  <Icon icon={SOLUTION_ICON[s.id] ?? LayoutDashboard} size={20} className="svc-ic" />
                </div>
                <p className="svc-d">{t(`services.solutions.${s.id}.desc`)}</p>
                <p className="svc-p">
                  <span className="svc-pl">{t("common.proof")}</span>{" "}
                  {s.proofs.map((p, j) => (
                    <span key={p.key}>
                      {j > 0 ? " · " : null}
                      <SmartLink className="qlnk" href={fromHome(p.href)}>
                        {t(`services.solutions.${s.id}.proofs.${p.key}`)}
                      </SmartLink>
                    </span>
                  ))}
                </p>
                <p className="svc-s">{t(`services.solutions.${s.id}.stack`)}</p>
              </article>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ============ 03 PROCESSO + MÉTODO ============ */}
      <Reveal as="section" id="processo" aria-labelledby="processo-h" className="sec hire-sec">
        <div className="inner">
          <SectionIndexBar index={t("hire.sections.process.index")} label={t("hire.sections.process.label")} meta={t("process.meta")} />
          <h2 id="processo-h" className="h3s hire-h3">
            {t("process.title")}
          </h2>
          <ol className="hp-steps">
            <li aria-hidden="true" className="hp-line draw-x" style={v({ "--base": "300ms" })} />
            {PROCESS_STEPS.map((s, i) => (
              <li key={s.id} className="hp-step">
                <span className={s.filled ? "hp-node promo pop" : "hp-node pop"} style={v({ "--base": "400ms", "--i": i })} aria-hidden="true" />
                <div className="hp-txt">
                  <p className="eb hp-num">{s.num}</p>
                  <h3 className="hp-st">{t(`process.steps.${s.id}.title`)}</h3>
                  <p className="hp-stx">{t(`process.steps.${s.id}.text`)}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="method rv">
            <div>
              <h3 className="h3s">{t("hire.aiMethod.title")}</h3>
              <p className="method-b">{t("hire.aiMethod.body")}</p>
            </div>
            <ul className="method-rows">
              {AI_METHOD_ROWS.map((r) => (
                <li key={r} className="mrow">
                  <Icon icon={Check} size={16} style={{ flex: "none" }} />
                  {t(`hire.aiMethod.rows.${r}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* ============ 04 SOLICITAR ORÇAMENTO ============ */}
      <Reveal as="section" id="cotacao" aria-labelledby="cotacao-h" className="sec hire-sec hire-quote">
        <div className="inner">
          <SectionIndexBar index={t("hire.sections.quote.index")} label={t("hire.sections.quote.label")} meta={t("contact.indexMeta")} />
          <div className="hq-g">
            <div className="hq-l">
              <h2 id="cotacao-h" className="h2 hq-h2">
                <span className="mask">
                  <span>{t("hire.quote.h2")}</span>
                </span>
              </h2>
              <p className="lead hq-lead">{t("hire.quote.lead")}</p>
              <p className="eb hq-after">{t("hire.quote.afterTitle")}</p>
              <ol className="next">
                {(t.raw("hire.quote.after") as string[]).map((s, i) => (
                  <li key={s}>
                    <span className="eb eb-a">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <div className="note">
                <p>{t("hire.quote.note")}</p>
                <OrbitaTrigger source="hire" size="sm" withOrb className="note-btn">
                  {t("common.actions.talkToOrbita")}
                </OrbitaTrigger>
              </div>
              <div className="hq-mail">
                <span className="eb">{t("common.links.email")}</span>
                <a className="lnk" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
                <CopyEmailButton size="sm" />
              </div>
            </div>
            <div className="hq-r">
              <QuoteForm />
            </div>
          </div>
        </div>
      </Reveal>

      {/* ============ 05 FAQ ============ */}
      <Reveal as="section" id="faq" aria-labelledby="faq-h" className="sec hire-sec hire-faq">
        <div className="inner">
          <SectionIndexBar index={t("hire.sections.faq.index")} label={t("hire.sections.faq.label")} meta={t("hire.sections.faq.meta")} />
          <div className="hf-g">
            <div className="hf-l">
              <h2 id="faq-h" className="h3s">
                {t("hire.faq.title")}
              </h2>
              <p className="hf-lead">{t("hire.faq.lead")}</p>
              <OrbitaTrigger source="hire" size="sm" withOrb className="hf-btn">
                {t("common.actions.talkToOrbita")}
              </OrbitaTrigger>
            </div>
            <div className="hf-r">
              <Faq />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
