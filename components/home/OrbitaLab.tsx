import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Home, Layers, MessageCircle, Mic, Network, ShieldCheck, Wallet, Wrench, type LucideIcon } from "lucide-react";
import { Icon, Reveal, TextLink } from "@/components/ui-v3";
import { ORB_MODE_LIST } from "@/components/orbita/presence-orb";
import { images } from "@/src/content/images";
import { PROJECTS, caseLinkFor } from "@/src/content/projects";
import { LabClient, type LabCopy, type LabState } from "./orbita-lab/LabClient";
import { LabScreens } from "./orbita-lab/LabScreens";

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Feature cards: ids are message keys under `lab.features`; facts are the verified Órbita numbers (v3spec §3). */
const FEATURES: { id: string; icon: LucideIcon }[] = [
  { id: "voice", icon: Mic },
  { id: "rag", icon: Network },
  { id: "tools", icon: Wrench },
  { id: "gate", icon: ShieldCheck },
  { id: "channels", icon: MessageCircle },
  { id: "home", icon: Home },
  { id: "finance", icon: Wallet },
  { id: "providers", icon: Layers },
];

/** whole screenshots from the product (16:10); copy: lab.screens.<id>.{title,text} · alt: images.orbita.<altKey> */
const SCREENS = [
  { id: "overview", image: images.orbita.escuroVisaoGeral, altKey: "visaoGeral" },
  { id: "map", image: images.orbita.escuroConhecimento, altKey: "conhecimento" },
  { id: "memory", image: images.orbita.claroMemoria, altKey: "memoria" },
  { id: "meetings", image: images.orbita.claroReunioes, altKey: "reunioes" },
  { id: "connections", image: images.orbita.claroConexoes, altKey: "conexoes" },
  { id: "spend", image: images.orbita.claroGestao, altKey: "gestao" },
] as const;

/**
 * Órbita ao vivo (#orbita-lab) — the product's own core running in the page.
 * Server component in <Reveal>: heading + CTAs, the lab (client leaf: live core on a stage and its
 * ten states with a guided tour), eight capability cards (pointer spotlight via [data-spot]) and
 * three real screens. Copy: messages `lab.*`; screens: src/content/images.ts.
 */
export function OrbitaLab() {
  const t = useTranslations("lab");
  const tc = useTranslations("common");
  const ti = useTranslations("images");
  const github = PROJECTS.orbita.link;

  const states: LabState[] = ORB_MODE_LIST.map((id) => ({
    id,
    label: t(`states.${id}.label`),
    status: t(`states.${id}.status`),
    title: t(`states.${id}.title`),
    description: t(`states.${id}.description`),
    note: t(`states.${id}.note`),
  }));
  const copy: LabCopy = {
    stageEyebrow: t("stageEyebrow"),
    tagLeft: t("states.idle.label"),
    tagRight: t("tagRight"),
    hint: t("hint"),
    orbAria: t("orbAria"),
    statesTitle: t("statesTitle"),
    statesAria: t("statesAria"),
    tourLabel: t("tour"),
    talkLabel: tc("actions.talkToOrbita"),
    caseLabel: tc("links.caseStudy"),
    caseHref: caseLinkFor("orbita"),
  };

  return (
    <Reveal as="section" id="orbita-lab" className="sec tx home-lab" aria-labelledby="h-lab">
      <div className="inner">
        <div className="lab-head">
          <div className="lab-head-l">
            <p className="eb rv" style={v({ "--base": "120ms" })}>
              <span style={{ color: "var(--accent-ink)" }}>02</span> — {t("eyebrow")}
            </p>
            <h2 id="h-lab" className="h2">
              <span className="mask">
                <span style={v({ "--base": "200ms" })}>{t("h2")}</span>
              </span>
            </h2>
          </div>
          <div className="lab-head-r rv" style={v({ "--base": "320ms" })}>
            <p className="lead lab-lead">{t("lead")}</p>
            {github ? (
              <p className="lab-ctas">
                <TextLink variant="quiet" href={github.href} className="lab-gh">
                  {tc("links.github")}
                </TextLink>
              </p>
            ) : null}
          </div>
        </div>

        <LabClient states={states} copy={copy} />

        <ul className="lab-feat" style={v({ "--base": "200ms", "--stagger": "70ms" })}>
          {FEATURES.map((f, i) => (
            <li key={f.id} className="rv" style={v({ "--i": i % 4 })}>
              {/* the reveal lives on the <li>; the card keeps its own hover transform */}
              <div className="lab-card" data-spot="" style={v({ "--i": i })}>
                <span className="lab-ico" aria-hidden="true">
                  <Icon icon={f.icon} size={20} />
                </span>
                <h3 className="h4 lab-card-t">{t(`features.${f.id}.title`)}</h3>
                <p className="small lab-card-p">{t(`features.${f.id}.text`)}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="lab-scr-head">
          <p className="eb">{t("screens.eyebrow")}</p>
          <h3 className="h3s">{t("screens.title")}</h3>
        </div>
        <LabScreens
          screens={SCREENS.map((s) => ({
            id: s.id,
            image: s.image,
            title: t(`screens.items.${s.id}.title`),
            text: t(`screens.items.${s.id}.text`),
            alt: ti(`orbita.${s.altKey}`),
          }))}
          labels={{
            list: t("screens.listAria"),
            open: t("screens.open"),
            close: tc("actions.close"),
            prev: tc("actions.previous"),
            next: tc("actions.next"),
          }}
        />
      </div>
    </Reveal>
  );
}
