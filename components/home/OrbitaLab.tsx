import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Home, Layers, MessageCircle, Mic, Network, ShieldCheck, Wallet, Wrench, type LucideIcon } from "lucide-react";
import { CropImage, Icon, Reveal, TextLink } from "@/components/ui-v3";
import { ORB_MODE_LIST } from "@/components/orbita/presence-orb";
import { crops } from "@/src/content/images";
import { PROJECTS, caseLinkFor } from "@/src/content/projects";
import { LabClient, type LabCopy, type LabState } from "./orbita-lab/LabClient";

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

const SCREENS = [
  { id: "map", crop: crops.orbita.conhecimento.c },
  { id: "memory", crop: crops.orbita.memoria.c },
  { id: "meetings", crop: crops.orbita.reunioes.c },
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
              <div className="lab-card" data-spot="">
                <span className="lab-ico" aria-hidden="true">
                  <Icon icon={f.icon} size={20} />
                </span>
                <h3 className="h4 lab-card-t">{t(`features.${f.id}.title`)}</h3>
                <p className="small lab-card-p">{t(`features.${f.id}.text`)}</p>
              </div>
            </li>
          ))}
        </ul>

        <ul className="lab-gal">
          {SCREENS.map((s) => (
            <li key={s.id}>
              <figure className="lab-shot">
                <div className="lab-shot-c">
                  <CropImage crop={s.crop} renderWidth={410} />
                </div>
                <figcaption className="meta">{t(`screens.${s.id}`)}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
