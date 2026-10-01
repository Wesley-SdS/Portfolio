/**
 * Casebook v3 — content types.
 *
 * Rule: content files hold STRUCTURE and verified FACTS (numbers, dates,
 * links, image crops). Every user-visible string lives in messages/{pt,en,es}.json
 * and is referenced by a message key (documented next to each field).
 * Never invent a number, date or link here — v3spec §3 is the source.
 */

export type Locale = "pt" | "en" | "es";

/* ------------------------------------------------------------------ dates */

/** Month 1–12. */
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export interface YearMonth {
  y: number;
  m: Month;
}
/** A date range. `end: "present"` renders as common.present ("atual"). */
export interface Period {
  start: YearMonth;
  end: YearMonth | "present";
}

/* ----------------------------------------------------------------- images */

/** A file under /public with its natural pixel size. */
export interface ImageAsset {
  /** public path, e.g. "/projects/orbita/escuro-visao-geral.png" */
  src: string;
  width: number;
  height: number;
}

/** Crop box in SOURCE pixels (v1 crop formula, finalSpec §4.5). */
export interface CropBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * A rectangle painted over the crop (hides cursors / dev artefacts).
 * Values are percentages of the CROP BOX (as in v2spec §11), e.g. "76.46%".
 */
export interface CropMask {
  left: string;
  top: string;
  width: string;
  height: string;
  /** CSS colour; the specs use #FFFFFF or an eyedropped background */
  color: string;
}

/** An image + a named crop. `altKey` is a key under the `images` namespace. */
export interface Crop {
  image: ImageAsset;
  box: CropBox;
  masks?: CropMask[];
  /** messages key under `images.*` (e.g. "orbita.visaoGeral") */
  altKey: string;
}

/* --------------------------------------------------------------- statuses */

/**
 * Project/role status. Shape mapping (v3spec §3, finalSpec §4.4):
 * - ring (2px --accent): inDevelopment, beta
 * - filled --ok: mvpDone, done, prototypeDone, inProduction, available
 * - filled --accent: current (a current role)
 * Label key: `common.status.<status>`.
 */
export type Status =
  | "inDevelopment"
  | "beta"
  | "mvpDone"
  | "done"
  | "prototypeDone"
  | "inProduction"
  | "current"
  | "available";

export type StatusShape = "ring" | "ok" | "current";

/* ---------------------------------------------------------------- metrics */

/**
 * A number shown on the stage / grid / numbers strip.
 * - `count`: animated counter (.cnt.run) — integers < 1000 only.
 * - `short`: counter with the 600ms duration (values < 10).
 * - `word`: static text with a mask reveal (≥ 1000 or non-numeric, e.g. "1.258", "AES-256-GCM").
 * Render the numeric part with `formatNumber(value, locale)` (src/content/format.ts)
 * so pt/es print "1.258" and en prints "1,258".
 */
export interface Metric {
  kind: "count" | "short" | "word";
  /** numeric value (used for count/short and for formatted words) */
  value?: number;
  /** decimals for `value` (86,7 → value 86.7, decimals 1) */
  decimals?: number;
  /** literal word when not numeric (e.g. "AES-256-GCM") */
  word?: string;
  prefix?: string; // "~"
  suffix?: string; // "+", "%"
  /** word metrics rendered at 32px instead of the full size */
  small?: boolean;
  /** messages key for the label (dt), relative to the owning namespace */
  labelKey: string;
}

/* --------------------------------------------------------------- projects */

export type ProjectSlug =
  | "orbita"
  | "orbitmind"
  | "nex"
  | "nexbot"
  | "nexconnect"
  | "orbitfinance"
  | "vibecoding"
  | "vektus"
  | "influencerai"
  | "adaflow"
  | "orbitpipeline"
  | "waworkspace"
  | "plantoes"
  | "fsjpii"
  | "love-startup"
  | "ecommerce";

/** Filter chips in "Todos os produtos" (label: `products.chips.<id>`). */
export type ProjectCategory = "ai" | "messaging" | "fintech" | "custom";

/** Product light token name (without the `--l-` prefix). */
export type ProductLight =
  | "orbita"
  | "orbitmind"
  | "nex"
  | "orbitfinance"
  | "vibecoding"
  | "vektus";

/** How a project is previewed when no screenshot exists. */
export type Treatment =
  | "screens" // real screenshots (crops)
  | "diagram" // stage diagram card (OrbitMind, Nex, Vektus)
  | "typographic"; // grid tile: name + stack + "[captura pendente]"

export interface ExternalLink {
  /** "github" | "site" | "orbitmindSite" — label key `common.links.<kind>` */
  kind: "github" | "site" | "orbitmindSite";
  href: string;
}

export interface Project {
  slug: ProjectSlug;
  /** grid order (1 = top) — null when the project is stage-only (Suíte Nex) */
  gridOrder: number | null;
  /** stage chapter number 1..6 — null when grid-only */
  stageOrder: number | null;
  category: ProjectCategory;
  period: Period;
  status: Status;
  light: ProductLight | null;
  treatment: Treatment;
  /** public link (only repos repo-facts marks public). null = no link. */
  link: ExternalLink | null;
  /**
   * Where a "Estudo de caso" link for this project goes (route path without locale).
   * Usually its own page; NexBot/NexConnect point at the Suíte Nex case. null = no case
   * link → link to the products table instead (use `caseLinkFor(slug)` from projects.ts).
   */
  caseHref: string | null;
  /**
   * true → the project has its OWN case page at /projetos/<slug> (drives CASE_SLUGS,
   * generateStaticParams and the sitemap). Content: src/content/cases.ts + messages `case<Slug>`.
   * Stage projects without enough verified material (VibeCoding) have no page.
   */
  hasCase?: boolean;
  /** true for proprietary repos → render common.links.privateCode */
  privateCode?: boolean;
  /** grid "Destaque" value; label in `products.items.<slug>.highlight` */
  hasHighlight: boolean;
  /** index preview (411×257 in the grid) — a 16:10 crop or null (typographic tile) */
  preview: Crop | null;
  /** 40px icon for the typographic tile (InfluencerAI) */
  tileIcon?: string;
  /**
   * Messages: `products.items.<slug>.{name,oneLiner,highlight,stack,type,tagline,outcome,honestNote?}`
   */
}
