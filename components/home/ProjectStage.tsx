import { useTranslations } from "next-intl";
import { LIGHT_RGB, STAGE_CHAPTERS } from "@/src/content/projects";
import { DeskText, MobText, MobVisual, RailPeek } from "./stage/Chapter";
import { DeskStack } from "./stage/DeskStack";
import { StageClient } from "./stage/StageClient";
import type { StageChapterSlots, StageChapterView, StageStrings } from "./stage/types";

/**
 * Palco de produtos (#projects) — v3spec §4 (desktop 1440×920), §6.3 (mobile island), v2spec §6.
 * Server component: renders every chapter's copy, diagrams and crops (so the HTML carries the
 * content) and hands them as slots to the client state machine (./stage/StageClient).
 * Data: STAGE_CHAPTERS / LIGHT_RGB (src/content/projects.ts) · copy: messages `stage.*`.
 * Styles: app/styles/sections/stage.css (scoped under `.ps`).
 */
export function ProjectStage() {
  const t = useTranslations("stage");
  const tc = useTranslations("common");
  const total = String(STAGE_CHAPTERS.length).padStart(2, "0");

  const chapters: StageChapterView[] = STAGE_CHAPTERS.map((ch, i) => {
    const fullName = t(`chapters.${ch.slug}.announceName`);
    const extLabel = tc("links.github");
    return {
      slug: ch.slug,
      num: ch.num,
      light: LIGHT_RGB[ch.light],
      label: t("chapterLabel", { n: i + 1, total: STAGE_CHAPTERS.length, name: fullName }),
      fullName,
      railName: t(`chapters.${ch.slug}.rail.name`),
      railDesc: t(`chapters.${ch.slug}.rail.desc`),
      cta: {
        kind: ch.cta.kind,
        href: ch.cta.href,
        label: ch.cta.kind === "case" ? t("ctaCase") : t("ctaQuote"),
        cursor: ch.cta.kind === "case" ? t("cursorCase") : t("cursorQuote"),
      },
      ext: ch.ext ? { href: ch.ext, label: extLabel, aria: `${extLabel} — ${fullName} ${tc("opensInNewTab")}` } : null,
    };
  });

  const slots: StageChapterSlots[] = STAGE_CHAPTERS.map((ch, i) => {
    const frontAria = ch.cta.kind === "case" ? t("frontCase", { name: chapters[i].fullName }) : t("frontQuote", { name: chapters[i].fullName });
    return {
      deskText: <DeskText ch={ch} />,
      deskStack: <DeskStack ch={ch} frontAria={frontAria} />,
      peek: <RailPeek ch={ch} />,
      mobVisual: <MobVisual ch={ch} frontAria={frontAria} />,
      mobText: <MobText ch={ch} />,
    };
  });

  const top = t("topbar");
  const cut = top.indexOf(" — ");
  const strings: StageStrings = {
    srTitle: t("srTitle"),
    ariaLabel: t("ariaLabel"),
    roledescription: t("roledescription"),
    slideRoledescription: t("slideRoledescription"),
    topNum: cut > 0 ? top.slice(0, cut) : "",
    topRest: cut > 0 ? top.slice(cut) : top,
    allProducts: t("allProducts"),
    counterSr: t("counterSr"),
    total,
    paused: t("paused"),
    pause: t("pause"),
    play: t("play"),
    resume: t("resume"),
    prev: t("prev"),
    next: t("next"),
    railAria: t("railAria"),
    privateCode: tc("links.privateCode"),
  };

  return <StageClient chapters={chapters} slots={slots} s={strings} heading={<h2 className="sr">{strings.srTitle}</h2>} />;
}
