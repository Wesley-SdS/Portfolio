import type { ReactNode } from "react";
import type { StageChapter } from "@/src/content/projects";

/** Serializable per-chapter data the client state machine needs (all copy already translated). */
export interface StageChapterView {
  slug: StageChapter["slug"];
  num: string;
  /** RGB triplet for --L */
  light: string;
  /** "1 de 6: OrbitMind VibeCoding" — slide aria-label and the live announcement */
  label: string;
  /** full product name (announce / sr suffixes) */
  fullName: string;
  railName: string;
  railDesc: string;
  cta: { kind: "case" | "quote"; href: string; label: string; cursor: string };
  ext: { href: string; label: string; aria: string } | null;
}

/** Server-rendered pieces of one chapter (passed as slots to the client component). */
export interface StageChapterSlots {
  /** desktop text column (.tcol) */
  deskText: ReactNode;
  /** desktop layered stack (.stack) — mounted lazily */
  deskStack: ReactNode;
  /** desktop rail peek content (144×90) — mounted on first rail hover/focus */
  peek: ReactNode;
  /** mobile visual zone (.vz) — mounted lazily */
  mobVisual: ReactNode;
  /** mobile text block */
  mobText: ReactNode;
}

export interface StageStrings {
  srTitle: string;
  ariaLabel: string;
  roledescription: string;
  slideRoledescription: string;
  topNum: string;
  topRest: string;
  allProducts: string;
  counterSr: string;
  total: string;
  paused: string;
  pause: string;
  play: string;
  resume: string;
  prev: string;
  next: string;
  railAria: string;
  privateCode: string;
}
