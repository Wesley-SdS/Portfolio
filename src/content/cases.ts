import { crops, images } from "./images";
import type { Crop, ImageAsset, Metric, ProductLight, ProjectSlug, Status } from "./types";

/**
 * Case studies (/projetos/[slug]) — STRUCTURE + verified facts only (v3spec §3, §11 and
 * repo-facts/*.md). Every visible string lives in messages under the case's namespace
 * (`caseOrbita`, `caseOrbitmind`, `caseNex`, `caseOrbitfinance`, `caseVektus`) plus the shared
 * template strings in `caseCommon`. Block `key`s are message keys relative to that namespace.
 *
 * Which projects have a case is decided by `hasCase` in projects.ts (CASE_SLUGS).
 * VibeCoding has no case: a 4-day prototype with no tests and no architecture/results facts.
 * Its links fall back to the products table (CASE_FALLBACK_HREF).
 *
 * Rendered by components/case/CasePage.tsx.
 */

export type CaseSlug = "orbita" | "orbitmind" | "nex" | "orbitfinance" | "vektus";

/* ----------------------------------------------------------- diagram */

export interface DiagramNode {
  /** id = message key under `<diagram.key>.nodes.<id>.{title,sub}` */
  id: string;
  x: number;
  y: number;
  /** default 200 */
  w?: number;
  /** has a hover tooltip at `<diagram.key>.tooltips.<id>` */
  tip?: boolean;
}

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  /** orthogonal polyline in card px (1280-wide coordinate space) */
  path: [number, number][];
  dashed?: boolean;
}

export interface DiagramPacket {
  edge: string;
  /** travel the edge from its last point to its first (a "return") */
  reverse?: boolean;
  /** start / end as % of the 6000ms cycle */
  from: number;
  to: number;
}

export interface DiagramFlash {
  node: string;
  /** % of the cycle: peak, optional hold end, fade-out end */
  at: number;
  hold?: number;
  out: number;
}

export interface DiagramDef {
  /** unique id (keyframe names) */
  id: string;
  /** messages prefix, e.g. "sections.architecture" → nodes/tooltips/diagramTitle/caption/label/legend* */
  key: string;
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  packets: DiagramPacket[];
  flashes: DiagramFlash[];
  /** mono status line that appears at the end of the cycle (`<key>.label`) */
  label?: { x: number; y: number; from: number; to: number };
  /** show the dashed-line legend (`<key>.legendDashed`) */
  dashedLegend?: boolean;
}

/* ------------------------------------------------------------- blocks */

export interface GalleryItem {
  /** plate + thumb crop (16:10) */
  crop: Crop;
  /** lightbox crop (full frame) */
  full: Crop;
  /** caption key (relative to the namespace) */
  captionKey: string;
  /** plate background behind the image (eyedropped) */
  bg: string;
}

export interface BarRow {
  /** `<key>.rows.<id>.{label,before,after}` */
  id: string;
  /** 0..1 on the shared scale */
  before: number;
  after: number;
}

export type CaseBlock =
  /** paragraph (`<key>` string) */
  | { type: "body"; key: string }
  | { type: "diagram"; diagram: DiagramDef }
  /** risk chips (ink only): `<key>.risks` (array) + `<key>.risksLabel` + `<key>.risksAria` */
  | { type: "chips"; key: string }
  /** small stage card with the PEDIDO → PROPOSTA → APROVAÇÃO loop (`<key>.mech.*`, `<key>.caption.*`) */
  | { type: "approvalMech"; key: string }
  /** small stage card MENSAGEM → LANÇAMENTO (OrbitFinance) (`<key>.mech.*`, `<key>.caption.*`) */
  | { type: "financeMech"; key: string }
  /** screenshot plate on a --mat (804×503 at desktop) */
  | { type: "plate"; crop: Crop; captionKey: string; bg: string }
  /** narrow real crop (e.g. OrbitMind nav) + caption beside it */
  | { type: "shot"; crop: Crop; width: number; height: number; captionKey: string; textKey?: string }
  /** paired before/after bars (`<key>.rows.*`, legendBefore/After, axis.*, aria, source) */
  | { type: "bars"; key: string; rows: BarRow[] }
  /** text + channel list + phone plate (`<key>.body`, `<key>.aria`, `<key>.items.<id>.{name,detail}`) */
  | { type: "channels"; key: string; items: { id: string; icon: ChannelIcon }[]; phone: Crop; captionKey: string }
  /** gallery + lightbox; `pending` = number of "[captura pendente]" thumbs */
  | { type: "gallery"; key: string; items: GalleryItem[]; pending: number; figStart: number }
  /** "[captura pendente]" tiles with labels (`<key>.items` array, `<key>.note`) */
  | { type: "pending"; key: string }
  /** count-up results grid (`<key>.items.<id>`, `<key>.source`) */
  | { type: "numbers"; key: string; items: { id: string; metric: Metric }[] }
  /** bullet list (`<key>` array of strings) */
  | { type: "list"; key: string }
  /** term / description list (`<key>` array of {term, desc}) */
  | { type: "dl"; key: string }
  /** two titled columns of bullets (`<key>.a.{title,items}`, `<key>.b.{title,items}`, `<key>.footnote?`) */
  | { type: "twoCol"; key: string }
  /** two lanes of stage pills (`<key>.lanes` array of {label, pills[]}, `<key>.note`) */
  | { type: "lanes"; key: string }
  /** honest-status callout (`<key>.title`, `<key>.text`) */
  | { type: "note"; key: string }
  /** "Falar com a Órbita" + "Como funciona o agendamento" (`<key>.howLink`, `<key>.footnote`) */
  | { type: "orbitaCta"; key: string };

export type ChannelIcon = "globe" | "phone" | "mic" | "chat" | "send" | "bell";

export interface CaseSection {
  /** DOM id / anchor (pt, as in the artboard) */
  id: string;
  /** `toc.<key>` (label) and `sections.<key>.title` (optional longer h2) */
  key: string;
  blocks: CaseBlock[];
}

/* -------------------------------------------------------------- cover */

export type CoverFront =
  | { kind: "screen"; crop: Crop; bg: string }
  /** illustrative schematic drawn in markup (no screenshot exists) */
  | { kind: "pipeline" | "lanes" | "columns" };

export type CoverBack =
  | { kind: "screen"; crop: Crop; bg: string; tag?: boolean }
  /** three raised cards (`cover.back` array of {title, sub}) */
  | { kind: "cards" };

export type CoverLoupe =
  | { kind: "phone"; crop: Crop; bg: string }
  | { kind: "crop"; crop: Crop; width: number; height: number; bg: string }
  /** raised numbers card (`cover.loupe.{header,rows[]}` or {header,value,caption}) */
  | { kind: "stats" }
  | null;

export interface CaseCover {
  front: CoverFront;
  back: CoverBack | null;
  loupe: CoverLoupe;
  /** labels at `cover.metrics.m1..m3` */
  metrics: [Metric, Metric, Metric];
}

export interface CaseConfig {
  slug: CaseSlug;
  /** messages namespace */
  ns: string;
  light: ProductLight;
  status: Status;
  cover: CaseCover;
  /** public repo (GitHub ↗) — only repos the repo-facts mark public */
  github: string | null;
  /** second quiet link in the cover (e.g. the OrbitMind site placeholder) */
  extraLink?: { href: string; labelKey: string };
  /** render "Falar com a Órbita" in the cover */
  orbita?: boolean;
  sections: CaseSection[];
  /** "Próximo estudo de caso" */
  next: CaseSlug;
  /** meta keys for <title>/<meta description> */
  metaKeys: { title: string; description: string };
}

/* ============================================================ helpers */

const full = (image: ImageAsset, altKey: string): Crop => ({
  image,
  box: { x: 0, y: 0, w: image.width, h: image.height },
  altKey,
});

const DARK = "#192820";
const LIGHT = "#FCFCF9";

/* =============================================================== ÓRBITA (v3spec §11) */

const ORBITA_DIAGRAM: DiagramDef = {
  id: "orbita",
  key: "sections.architecture",
  width: 1280,
  height: 600,
  nodes: [
    { id: "a1", x: 40, y: 80 },
    { id: "a2", x: 40, y: 240 },
    { id: "a3", x: 40, y: 400 },
    { id: "b1", x: 340, y: 240 },
    { id: "c1", x: 640, y: 80, tip: true },
    { id: "c2", x: 640, y: 240, tip: true },
    { id: "c3", x: 640, y: 400 },
    { id: "d1", x: 1040, y: 64, w: 224, tip: true },
    { id: "d2", x: 1040, y: 200, w: 224 },
    { id: "d3", x: 1040, y: 336, w: 224, tip: true },
    { id: "d4", x: 1040, y: 472, w: 224 },
  ],
  edges: [
    { id: "e1", from: "a1", to: "b1", path: [[240, 112], [290, 112], [290, 272], [340, 272]] },
    { id: "e2", from: "a2", to: "b1", path: [[240, 272], [340, 272]] },
    { id: "e3", from: "a3", to: "b1", path: [[240, 432], [290, 432], [290, 272], [340, 272]] },
    { id: "e4", from: "b1", to: "c1", path: [[540, 272], [590, 272], [590, 112], [640, 112]] },
    { id: "e5", from: "b1", to: "c2", path: [[540, 272], [640, 272]] },
    { id: "e6", from: "c1", to: "c3", path: [[840, 112], [880, 112], [880, 420], [840, 420]] },
    { id: "e7", from: "c3", to: "d4", path: [[840, 444], [950, 444], [950, 504], [1040, 504]] },
    { id: "e8", from: "b1", to: "d1", path: [[440, 240], [440, 192], [1000, 192], [1000, 96], [1040, 96]] },
    { id: "e9", from: "a3", to: "d2", dashed: true, path: [[140, 464], [140, 560], [1010, 560], [1010, 232], [1040, 232]] },
    { id: "e10", from: "b1", to: "d3", dashed: true, path: [[440, 304], [440, 368], [1040, 368]] },
  ],
  // A1→B1, B1→C2, C2→B1 return, B1→C1, C1→C3, (C3 approves), C3→D4 — 6000ms (v3spec §11.3)
  packets: [
    { edge: "e1", from: 0, to: 10 },
    { edge: "e5", from: 11.67, to: 18.33 },
    { edge: "e5", reverse: true, from: 25, to: 31.67 },
    { edge: "e4", from: 33.33, to: 43.33 },
    { edge: "e6", from: 45, to: 56.67 },
    { edge: "e7", from: 70, to: 80 },
  ],
  flashes: [
    { node: "a1", at: 1.5, out: 8 },
    { node: "b1", at: 11, out: 17 },
    { node: "b1", at: 32.5, out: 38.5 },
    { node: "c2", at: 19.5, hold: 25, out: 29 },
    { node: "c1", at: 44.5, out: 50 },
    { node: "c3", at: 58, hold: 70, out: 74 },
    { node: "d4", at: 81, out: 88 },
  ],
  label: { x: 640, y: 474, from: 63, to: 94 },
  dashedLegend: true,
};

const ORBITA: CaseConfig = {
  slug: "orbita",
  ns: "caseOrbita",
  light: "orbita",
  status: "inDevelopment",
  github: "https://github.com/Wesley-SdS/Orbita",
  orbita: true,
  cover: {
    front: { kind: "screen", crop: crops.orbita.visaoGeral.c, bg: DARK },
    back: { kind: "screen", crop: crops.orbita.conexoes.back, bg: LIGHT },
    loupe: { kind: "phone", crop: crops.orbita.phone, bg: "#F6F7F2" },
    metrics: [
      { kind: "count", value: 102, labelKey: "m1" },
      { kind: "count", value: 86.7, decimals: 1, suffix: "%", labelKey: "m2" },
      { kind: "short", value: 7, labelKey: "m3" },
    ],
  },
  sections: [
    { id: "premissa", key: "premise", blocks: [{ type: "body", key: "sections.premise.body" }] },
    {
      id: "arquitetura",
      key: "architecture",
      blocks: [
        { type: "body", key: "sections.architecture.body" },
        { type: "diagram", diagram: ORBITA_DIAGRAM },
      ],
    },
    {
      id: "seguranca",
      key: "safety",
      blocks: [
        { type: "body", key: "sections.safety.body" },
        { type: "chips", key: "sections.safety" },
        { type: "approvalMech", key: "sections.safety" },
      ],
    },
    {
      id: "llm",
      key: "llm",
      blocks: [
        { type: "body", key: "sections.llm.body" },
        { type: "plate", crop: crops.orbita.gestao.c, captionKey: "fig.spend", bg: LIGHT },
      ],
    },
    {
      id: "rag",
      key: "rag",
      blocks: [
        { type: "body", key: "sections.rag.body" },
        {
          type: "bars",
          key: "sections.rag",
          rows: [
            { id: "top5", before: 0.5, after: 0.867 },
            { id: "mrr", before: 0.345, after: 0.708 },
          ],
        },
      ],
    },
    {
      id: "multicanal",
      key: "channels",
      blocks: [
        {
          type: "channels",
          key: "sections.channels",
          items: [
            { id: "web", icon: "globe" },
            { id: "app", icon: "phone" },
            { id: "voice", icon: "mic" },
            { id: "whatsapp", icon: "chat" },
            { id: "telegram", icon: "send" },
            { id: "push", icon: "bell" },
          ],
          phone: crops.orbita.phone,
          captionKey: "fig.phoneOverview",
        },
      ],
    },
    {
      id: "telas",
      key: "screens",
      blocks: [
        {
          type: "gallery",
          key: "sections.screens",
          figStart: 5,
          pending: 0,
          items: [
            { crop: crops.orbita.visaoGeral.c, full: crops.orbita.visaoGeral.full, captionKey: "sections.screens.captions.visaoGeral", bg: DARK },
            { crop: crops.orbita.conexoes.c, full: crops.orbita.conexoes.full, captionKey: "sections.screens.captions.conexoes", bg: LIGHT },
            { crop: crops.orbita.gestao.c, full: crops.orbita.gestao.full, captionKey: "sections.screens.captions.gestao", bg: LIGHT },
            { crop: crops.orbita.conhecimento.c, full: crops.orbita.conhecimento.full, captionKey: "sections.screens.captions.conhecimento", bg: DARK },
            { crop: crops.orbita.reunioes.c, full: crops.orbita.reunioes.full, captionKey: "sections.screens.captions.reunioes", bg: LIGHT },
            { crop: crops.orbita.memoria.c, full: crops.orbita.memoria.full, captionKey: "sections.screens.captions.memoria", bg: LIGHT },
            { crop: crops.orbita.login.c, full: crops.orbita.login.full, captionKey: "sections.screens.captions.login", bg: "#17231F" },
          ],
        },
      ],
    },
    {
      id: "numeros",
      key: "numbers",
      blocks: [
        {
          type: "numbers",
          key: "sections.numbers",
          items: [
            { id: "commits", metric: { kind: "count", value: 209, labelKey: "commits" } },
            { id: "tools", metric: { kind: "count", value: 102, labelKey: "tools" } },
            { id: "tests", metric: { kind: "word", value: 1000, suffix: "+", labelKey: "tests" } },
            { id: "migrations", metric: { kind: "count", value: 53, labelKey: "migrations" } },
            { id: "routes", metric: { kind: "count", value: 80, prefix: "~", labelKey: "routes" } },
            { id: "providers", metric: { kind: "short", value: 7, labelKey: "providers" } },
          ],
        },
      ],
    },
    {
      id: "proximo-passo",
      key: "next",
      blocks: [
        { type: "body", key: "sections.next.body" },
        { type: "orbitaCta", key: "sections.next" },
      ],
    },
  ],
  next: "orbitmind",
  metaKeys: { title: "caseOrbitaTitle", description: "caseOrbitaDescription" },
};

/* ============================================================ ORBITMIND (repo-facts §1) */

const ORBITMIND_DIAGRAM: DiagramDef = {
  id: "orbitmind",
  key: "sections.architecture",
  width: 1280,
  height: 600,
  nodes: [
    { id: "a1", x: 40, y: 80 },
    { id: "a2", x: 40, y: 240, tip: true },
    { id: "a3", x: 40, y: 400 },
    { id: "b1", x: 340, y: 240 },
    { id: "c1", x: 640, y: 80 },
    { id: "c2", x: 640, y: 240, tip: true },
    { id: "c3", x: 640, y: 400 },
    { id: "d1", x: 1040, y: 64, w: 224, tip: true },
    { id: "d2", x: 1040, y: 200, w: 224, tip: true },
    { id: "d3", x: 1040, y: 336, w: 224 },
    { id: "d4", x: 1040, y: 472, w: 224 },
  ],
  edges: [
    { id: "e1", from: "a1", to: "b1", path: [[240, 112], [290, 112], [290, 272], [340, 272]] },
    { id: "e2", from: "a2", to: "b1", path: [[240, 272], [340, 272]] },
    { id: "e3", from: "a3", to: "b1", path: [[240, 432], [290, 432], [290, 272], [340, 272]] },
    { id: "e4", from: "b1", to: "c1", path: [[540, 272], [590, 272], [590, 112], [640, 112]] },
    { id: "e5", from: "b1", to: "c2", path: [[540, 272], [640, 272]] },
    { id: "e11", from: "c1", to: "c2", path: [[740, 144], [740, 240]] },
    { id: "e6", from: "c2", to: "c3", path: [[740, 304], [740, 400]] },
    { id: "e7", from: "c3", to: "d3", path: [[840, 432], [950, 432], [950, 368], [1040, 368]] },
    { id: "e8", from: "c2", to: "d1", path: [[840, 272], [900, 272], [900, 96], [1040, 96]] },
    { id: "e9", from: "b1", to: "d2", path: [[440, 240], [440, 192], [1000, 192], [1000, 232], [1040, 232]] },
    { id: "e10", from: "b1", to: "d4", path: [[440, 304], [440, 540], [1000, 540], [1000, 504], [1040, 504]] },
  ],
  // pedido → Arquiteto monta o squad → agentes chamam o LLM → checkpoint humano → publica via integração
  packets: [
    { edge: "e1", from: 0, to: 10 },
    { edge: "e4", from: 12, to: 20 },
    { edge: "e11", from: 29, to: 33 },
    { edge: "e8", from: 36, to: 46 },
    { edge: "e8", reverse: true, from: 48, to: 58 },
    { edge: "e6", from: 60, to: 64 },
    { edge: "e7", from: 78, to: 88 },
  ],
  flashes: [
    { node: "a1", at: 1.5, out: 8 },
    { node: "b1", at: 11, out: 17 },
    { node: "c1", at: 21.5, hold: 26, out: 29 },
    { node: "c2", at: 34.5, out: 40 },
    { node: "d1", at: 47.5, out: 52 },
    { node: "c2", at: 59, out: 62 },
    { node: "c3", at: 65.5, hold: 76, out: 80 },
    { node: "d3", at: 89.5, out: 96 },
  ],
  label: { x: 640, y: 474, from: 66, to: 94 },
};

const ORBITMIND: CaseConfig = {
  slug: "orbitmind",
  ns: "caseOrbitmind",
  light: "orbitmind",
  status: "inDevelopment",
  github: "https://github.com/Wesley-SdS/orbitmind-platform",
  /** OWNER-FLAG: real OrbitMind site URL (v3spec §13 A.3) */
  extraLink: { href: "#URL-DO-SITE-DA-ORBITMIND", labelKey: "common.links.orbitmindSite" },
  cover: {
    front: { kind: "pipeline" },
    back: { kind: "screen", crop: crops.orbitmind.flowBack, bg: "#FFFFFF", tag: true },
    loupe: { kind: "crop", crop: crops.orbitmind.appNav, width: 220, height: 276, bg: "#0B0B0F" },
    metrics: [
      { kind: "count", value: 39, labelKey: "m1" },
      { kind: "short", value: 6, labelKey: "m2" },
      { kind: "short", value: 3, labelKey: "m3" },
    ],
  },
  sections: [
    { id: "contexto", key: "context", blocks: [{ type: "body", key: "sections.context.body" }] },
    {
      id: "o-que-construi",
      key: "built",
      blocks: [
        { type: "body", key: "sections.built.body" },
        { type: "dl", key: "sections.built.modules" },
      ],
    },
    {
      id: "arquitetura",
      key: "architecture",
      blocks: [
        { type: "body", key: "sections.architecture.body" },
        { type: "diagram", diagram: ORBITMIND_DIAGRAM },
      ],
    },
    {
      id: "pipeline",
      key: "pipeline",
      blocks: [
        { type: "body", key: "sections.pipeline.body" },
        { type: "lanes", key: "sections.pipeline" },
      ],
    },
    {
      id: "telas",
      key: "screens",
      blocks: [
        {
          type: "shot",
          crop: crops.orbitmind.appNav,
          width: 220,
          height: 276,
          captionKey: "sections.screens.navCaption",
          textKey: "sections.screens.navText",
        },
      ],
    },
    {
      id: "numeros",
      key: "numbers",
      blocks: [
        {
          type: "numbers",
          key: "sections.numbers",
          items: [
            { id: "integrations", metric: { kind: "count", value: 39, labelKey: "integrations" } },
            { id: "squads", metric: { kind: "short", value: 6, labelKey: "squads" } },
            { id: "commits", metric: { kind: "count", value: 178, labelKey: "commits" } },
            { id: "tables", metric: { kind: "count", value: 24, labelKey: "tables" } },
            { id: "routes", metric: { kind: "count", value: 56, labelKey: "routes" } },
            { id: "locales", metric: { kind: "short", value: 3, labelKey: "locales" } },
          ],
        },
      ],
    },
  ],
  next: "nex",
  metaKeys: { title: "caseOrbitmindTitle", description: "caseOrbitmindDescription" },
};

/* ================================================================ SUÍTE NEX (repo-facts nex §1–2) */

const NEX_DIAGRAM: DiagramDef = {
  id: "nex",
  key: "sections.architecture",
  width: 1280,
  height: 600,
  nodes: [
    { id: "a1", x: 40, y: 80 },
    { id: "a2", x: 40, y: 240 },
    { id: "a3", x: 40, y: 400 },
    { id: "b1", x: 340, y: 80, tip: true },
    { id: "b2", x: 340, y: 240 },
    { id: "b3", x: 340, y: 400 },
    { id: "c1", x: 640, y: 80, tip: true },
    { id: "c2", x: 640, y: 240, tip: true },
    { id: "c3", x: 640, y: 400 },
    { id: "d1", x: 1040, y: 64, w: 224, tip: true },
    { id: "d2", x: 1040, y: 200, w: 224 },
    { id: "d3", x: 1040, y: 336, w: 224, tip: true },
    { id: "d4", x: 1040, y: 472, w: 224 },
  ],
  edges: [
    { id: "e1", from: "a1", to: "b1", path: [[240, 112], [340, 112]] },
    { id: "e2", from: "b1", to: "c1", path: [[540, 112], [640, 112]] },
    { id: "e3", from: "c1", to: "c2", path: [[740, 144], [740, 240]] },
    { id: "e4", from: "a2", to: "b2", path: [[240, 272], [340, 272]] },
    { id: "e5", from: "b2", to: "c2", path: [[540, 272], [640, 272]] },
    { id: "e6", from: "c2", to: "d1", path: [[840, 272], [900, 272], [900, 96], [1040, 96]] },
    { id: "e7", from: "c2", to: "d2", path: [[840, 272], [900, 272], [900, 232], [1040, 232]] },
    { id: "e8", from: "b2", to: "d3", path: [[440, 304], [440, 352], [1000, 352], [1000, 368], [1040, 368]] },
    { id: "e9", from: "c2", to: "c3", path: [[740, 304], [740, 400]] },
    { id: "e10", from: "a3", to: "b3", path: [[240, 432], [340, 432]] },
    { id: "e11", from: "b3", to: "b2", path: [[480, 400], [480, 304]] },
    { id: "e12", from: "c3", to: "d4", dashed: true, path: [[840, 432], [950, 432], [950, 504], [1040, 504]] },
  ],
  // canal → NexConnect → 7 estágios → webhook HMAC → 8 etapas → RAG (Vektus) → LLM (AI Gateway)
  packets: [
    { edge: "e1", from: 0, to: 6 },
    { edge: "e2", from: 8, to: 14 },
    { edge: "e3", from: 18, to: 22 },
    { edge: "e7", from: 28, to: 36 },
    { edge: "e7", reverse: true, from: 38, to: 46 },
    { edge: "e6", from: 50, to: 58 },
    { edge: "e6", reverse: true, from: 60, to: 68 },
  ],
  flashes: [
    { node: "b1", at: 7.5, out: 13 },
    { node: "c1", at: 15, hold: 17, out: 22 },
    { node: "c2", at: 23.5, out: 28 },
    { node: "d2", at: 37, out: 42 },
    { node: "c2", at: 47.5, out: 50 },
    { node: "d1", at: 59, out: 64 },
    { node: "c2", at: 69.5, hold: 78, out: 84 },
  ],
  label: { x: 752, y: 180, from: 17, to: 44 },
  dashedLegend: true,
};

const NEX: CaseConfig = {
  slug: "nex",
  ns: "caseNex",
  light: "nex",
  status: "beta",
  github: null,
  cover: {
    front: { kind: "lanes" },
    back: { kind: "cards" },
    loupe: { kind: "stats" },
    metrics: [
      { kind: "word", value: 1258, labelKey: "m1" },
      { kind: "count", value: 10, suffix: "+", labelKey: "m2" },
      { kind: "short", value: 8, labelKey: "m3" },
    ],
  },
  sections: [
    { id: "contexto", key: "context", blocks: [{ type: "body", key: "sections.context.body" }] },
    {
      id: "arquitetura",
      key: "architecture",
      blocks: [
        { type: "body", key: "sections.architecture.body" },
        { type: "diagram", diagram: NEX_DIAGRAM },
      ],
    },
    {
      id: "mensagem",
      key: "message",
      blocks: [
        { type: "body", key: "sections.message.body" },
        { type: "lanes", key: "sections.message" },
      ],
    },
    {
      id: "engenharia",
      key: "engineering",
      blocks: [
        { type: "body", key: "sections.engineering.body" },
        { type: "twoCol", key: "sections.engineering.columns" },
      ],
    },
    {
      id: "numeros",
      key: "numbers",
      blocks: [
        {
          type: "numbers",
          key: "sections.numbers",
          items: [
            { id: "testsBot", metric: { kind: "count", value: 757, labelKey: "testsBot" } },
            { id: "testsConnect", metric: { kind: "count", value: 501, labelKey: "testsConnect" } },
            { id: "models", metric: { kind: "count", value: 40, labelKey: "models" } },
            { id: "modules", metric: { kind: "count", value: 22, labelKey: "modules" } },
            { id: "processors", metric: { kind: "count", value: 11, labelKey: "processors" } },
            { id: "adrs", metric: { kind: "count", value: 11, labelKey: "adrs" } },
          ],
        },
      ],
    },
  ],
  next: "orbitfinance",
  metaKeys: { title: "caseNexTitle", description: "caseNexDescription" },
};

/* ============================================================ ORBITFINANCE (repo-facts §4) */

const ORBITFINANCE_DIAGRAM: DiagramDef = {
  id: "orbitfinance",
  key: "sections.architecture",
  width: 1280,
  height: 600,
  nodes: [
    { id: "a1", x: 40, y: 80 },
    { id: "a2", x: 40, y: 240 },
    { id: "a3", x: 40, y: 400 },
    { id: "b1", x: 340, y: 80, tip: true },
    { id: "b2", x: 340, y: 240 },
    { id: "c1", x: 640, y: 80, tip: true },
    { id: "c2", x: 640, y: 240 },
    { id: "c3", x: 640, y: 400, tip: true },
    { id: "d1", x: 1040, y: 64, w: 224 },
    { id: "d2", x: 1040, y: 200, w: 224 },
    { id: "d3", x: 1040, y: 336, w: 224, tip: true },
    { id: "d4", x: 1040, y: 472, w: 224 },
  ],
  edges: [
    { id: "e1", from: "a1", to: "b1", path: [[240, 112], [340, 112]] },
    { id: "e2", from: "b1", to: "c1", path: [[540, 112], [640, 112]] },
    { id: "e3", from: "c1", to: "c2", path: [[740, 144], [740, 240]] },
    { id: "e4", from: "a2", to: "b2", path: [[240, 272], [340, 272]] },
    { id: "e5", from: "b2", to: "c2", path: [[540, 272], [640, 272]] },
    { id: "e6", from: "a3", to: "c3", path: [[240, 432], [640, 432]] },
    { id: "e7", from: "c2", to: "c3", path: [[740, 304], [740, 400]] },
    { id: "e8", from: "c1", to: "d1", path: [[840, 112], [940, 112], [940, 96], [1040, 96]] },
    { id: "e9", from: "c2", to: "d2", path: [[840, 272], [900, 272], [900, 232], [1040, 232]] },
    { id: "e10", from: "c2", to: "d3", path: [[840, 272], [900, 272], [900, 368], [1040, 368]] },
    { id: "e11", from: "c3", to: "d4", path: [[840, 432], [950, 432], [950, 504], [1040, 504]] },
  ],
  // mensagem → webhook → intenção (regra) → lançamento → banco → insight com Gemini
  packets: [
    { edge: "e1", from: 0, to: 6 },
    { edge: "e2", from: 8, to: 14 },
    { edge: "e3", from: 18, to: 22 },
    { edge: "e9", from: 26, to: 34 },
    { edge: "e7", from: 38, to: 42 },
    { edge: "e11", from: 56, to: 66 },
  ],
  flashes: [
    { node: "b1", at: 7.5, out: 13 },
    { node: "c1", at: 15, hold: 17, out: 22 },
    { node: "c2", at: 23.5, out: 28 },
    { node: "d2", at: 35.5, out: 40 },
    { node: "c3", at: 43.5, hold: 52, out: 56 },
    { node: "d4", at: 67.5, out: 74 },
  ],
  label: { x: 756, y: 176, from: 14, to: 40 },
};

const ORBITFINANCE: CaseConfig = {
  slug: "orbitfinance",
  ns: "caseOrbitfinance",
  light: "orbitfinance",
  status: "mvpDone",
  github: "https://github.com/OrbitMind/OrbitFinance",
  cover: {
    front: { kind: "screen", crop: crops.orbitfinance.inicio, bg: "#FFFFFF" },
    back: { kind: "screen", crop: crops.orbitfinance.recursoBack, bg: "#FFFFFF" },
    loupe: null,
    metrics: [
      { kind: "count", value: 102, labelKey: "m1" },
      { kind: "short", value: 3, labelKey: "m2" },
      { kind: "short", value: 3, labelKey: "m3" },
    ],
  },
  sections: [
    { id: "contexto", key: "context", blocks: [{ type: "body", key: "sections.context.body" }] },
    {
      id: "arquitetura",
      key: "architecture",
      blocks: [
        { type: "body", key: "sections.architecture.body" },
        { type: "diagram", diagram: ORBITFINANCE_DIAGRAM },
      ],
    },
    {
      id: "ia",
      key: "ai",
      blocks: [
        { type: "body", key: "sections.ai.body" },
        { type: "financeMech", key: "sections.ai" },
      ],
    },
    {
      id: "telas",
      key: "screens",
      blocks: [
        {
          type: "gallery",
          key: "sections.screens",
          figStart: 2,
          pending: 0,
          items: [
            {
              crop: crops.orbitfinance.inicio,
              full: full(images.orbitfinance.inicio, "orbitfinance.inicio"),
              captionKey: "sections.screens.captions.inicio",
              bg: "#FFFFFF",
            },
            {
              crop: crops.orbitfinance.recurso,
              full: full(images.orbitfinance.recurso, "orbitfinance.recurso"),
              captionKey: "sections.screens.captions.recurso",
              bg: "#FFFFFF",
            },
          ],
        },
      ],
    },
    {
      id: "numeros",
      key: "numbers",
      blocks: [
        {
          type: "numbers",
          key: "sections.numbers",
          items: [
            { id: "tests", metric: { kind: "count", value: 102, labelKey: "tests" } },
            { id: "commits", metric: { kind: "count", value: 62, labelKey: "commits" } },
            { id: "pages", metric: { kind: "count", value: 23, labelKey: "pages" } },
            { id: "routes", metric: { kind: "count", value: 38, labelKey: "routes" } },
            { id: "models", metric: { kind: "count", value: 20, labelKey: "models" } },
            { id: "intents", metric: { kind: "count", value: 10, labelKey: "intents" } },
          ],
        },
      ],
    },
  ],
  next: "vektus",
  metaKeys: { title: "caseOrbitfinanceTitle", description: "caseOrbitfinanceDescription" },
};

/* ================================================================== VEKTUS (v3spec §3.6 + repo-facts §5) */

const VEKTUS_DIAGRAM: DiagramDef = {
  id: "vektus",
  key: "sections.architecture",
  width: 1280,
  height: 520,
  nodes: [
    { id: "a1", x: 40, y: 120 },
    { id: "b1", x: 290, y: 120 },
    { id: "c1", x: 540, y: 120, tip: true },
    { id: "d1", x: 790, y: 120, tip: true },
    { id: "e1", x: 1040, y: 120, tip: true },
    { id: "a2", x: 40, y: 392, tip: true },
    { id: "e2", x: 1040, y: 392 },
  ],
  edges: [
    { id: "e1", from: "a1", to: "b1", path: [[240, 152], [290, 152]] },
    { id: "e2", from: "b1", to: "c1", path: [[490, 152], [540, 152]] },
    { id: "e3", from: "c1", to: "d1", path: [[740, 152], [790, 152]] },
    { id: "e4", from: "d1", to: "e1", path: [[990, 152], [1040, 152]] },
    { id: "e5", from: "a2", to: "a1", path: [[140, 392], [140, 184]] },
    { id: "e8", from: "e2", to: "e1", path: [[1140, 392], [1140, 184]] },
  ],
  // documento → extração → OCR híbrido → vetores (HNSW) → chat → LLM → resposta com citação
  packets: [
    { edge: "e1", from: 0, to: 5 },
    { edge: "e2", from: 8, to: 13 },
    { edge: "e3", from: 24, to: 29 },
    { edge: "e4", from: 38, to: 43 },
    { edge: "e8", reverse: true, from: 46, to: 54 },
    { edge: "e8", from: 58, to: 66 },
  ],
  flashes: [
    { node: "b1", at: 6.5, out: 12 },
    { node: "c1", at: 14.5, hold: 20, out: 24 },
    { node: "d1", at: 30.5, out: 36 },
    { node: "e1", at: 44.5, out: 48 },
    { node: "e2", at: 55.5, out: 58 },
    { node: "e1", at: 67.5, hold: 84, out: 90 },
  ],
  label: { x: 1040, y: 92, from: 68, to: 94 },
};

const VEKTUS: CaseConfig = {
  slug: "vektus",
  ns: "caseVektus",
  light: "vektus",
  status: "inDevelopment",
  github: "https://github.com/Wesley-SdS/Vektus",
  cover: {
    front: { kind: "columns" },
    back: { kind: "cards" },
    loupe: { kind: "stats" },
    metrics: [
      { kind: "word", value: 1000, suffix: "+", labelKey: "m1" },
      { kind: "short", value: 3, labelKey: "m2" },
      { kind: "short", value: 3, labelKey: "m3" },
    ],
  },
  sections: [
    { id: "premissa", key: "premise", blocks: [{ type: "body", key: "sections.premise.body" }] },
    {
      id: "arquitetura",
      key: "architecture",
      blocks: [
        { type: "body", key: "sections.architecture.body" },
        { type: "diagram", diagram: VEKTUS_DIAGRAM },
      ],
    },
    {
      id: "plataforma",
      key: "platform",
      blocks: [
        { type: "body", key: "sections.platform.body" },
        { type: "list", key: "sections.platform.items" },
      ],
    },
    {
      id: "numeros",
      key: "numbers",
      blocks: [
        {
          type: "numbers",
          key: "sections.numbers",
          items: [
            { id: "tests", metric: { kind: "word", value: 1000, suffix: "+", labelKey: "tests" } },
            { id: "files", metric: { kind: "count", value: 96, labelKey: "files" } },
            { id: "commits", metric: { kind: "count", value: 263, labelKey: "commits" } },
            { id: "providers", metric: { kind: "short", value: 3, labelKey: "providers" } },
            { id: "connectors", metric: { kind: "short", value: 3, labelKey: "connectors" } },
            { id: "commitsTotal", metric: { kind: "count", value: 588, labelKey: "commitsTotal" } },
          ],
        },
      ],
    },
  ],
  next: "orbita",
  metaKeys: { title: "caseVektusTitle", description: "caseVektusDescription" },
};

/* ================================================================== registry */

export const CASES: Record<CaseSlug, CaseConfig> = {
  orbita: ORBITA,
  orbitmind: ORBITMIND,
  nex: NEX,
  orbitfinance: ORBITFINANCE,
  vektus: VEKTUS,
};

export const isCaseSlug = (slug: string): slug is CaseSlug => Object.prototype.hasOwnProperty.call(CASES, slug);

/** Product slug for a case (same strings; kept explicit for the type system). */
export const caseProject = (slug: CaseSlug): ProjectSlug => slug;
