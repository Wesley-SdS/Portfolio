import { crops, images } from "./images";
import { ROUTES } from "./site";
import type { Crop, Metric, Project, ProjectCategory, ProjectSlug, ProductLight } from "./types";

/**
 * Projects — verified facts only (v3spec §3). Copy lives in
 * messages `products.items.<slug>.*`:
 *   name · oneLiner · highlight · stack · type · tagline · outcome · honestNote?
 * Excluded (v3spec §3.8 + owner, Sep 2026): app-revoluna, CIA, OpenJarvis, vocacional_sytem,
 * Rubrica, Portfolio/Blog, plataforma-unica (client-confidential), cg_platform (contribution, not a product).
 * Employer-built products the owner leads appear with a light "for <company>" type line (adaflow,
 * orbitpipeline, waworkspace; plantoes for Revoluna) — facts from the repo audit of 2026-09-30.
 */

const GH = {
  orbita: "https://github.com/Wesley-SdS/Orbita",
  orbitmind: "https://github.com/Wesley-SdS/orbitmind-platform",
  orbitfinance: "https://github.com/OrbitMind/OrbitFinance",
  vibecoding: "https://github.com/OrbitMind/OrbitMind-VibeCoding",
  vektus: "https://github.com/Wesley-SdS/Vektus",
  /** OWNER-FLAG: confirm public (v3spec §13 C.15) */
  influencerai: "https://github.com/OrbitMind/InfluencerAI",
} as const;

export const PROJECTS: Record<ProjectSlug, Project> = {
  orbita: {
    slug: "orbita",
    gridOrder: 1,
    stageOrder: 1,
    category: "ai",
    period: { start: { y: 2026, m: 7 }, end: { y: 2026, m: 9 } },
    status: "inDevelopment",
    light: "orbita",
    treatment: "screens",
    link: { kind: "github", href: GH.orbita },
    caseHref: ROUTES.project("orbita"),
    hasCase: true,
    hasHighlight: true,
    preview: crops.orbita.visaoGeral.c,
  },
  vektus: {
    slug: "vektus",
    gridOrder: 5,
    stageOrder: 6,
    category: "ai",
    period: { start: { y: 2026, m: 3 }, end: { y: 2026, m: 5 } },
    status: "inDevelopment",
    light: "vektus",
    treatment: "diagram",
    link: { kind: "github", href: GH.vektus },
    caseHref: ROUTES.project("vektus"),
    hasCase: true,
    hasHighlight: true,
    preview: null,
  },
  orbitmind: {
    slug: "orbitmind",
    gridOrder: 6,
    stageOrder: 2,
    category: "ai",
    period: { start: { y: 2025, m: 9 }, end: "present" },
    status: "inDevelopment",
    light: "orbitmind",
    treatment: "diagram",
    link: { kind: "github", href: GH.orbitmind },
    caseHref: ROUTES.project("orbitmind"),
    hasCase: true,
    hasHighlight: true,
    preview: null,
  },
  /** Stage chapter 03 only ("Suíte Nex" = NexBot + NexConnect). */
  nex: {
    slug: "nex",
    gridOrder: null,
    stageOrder: 3,
    category: "messaging",
    period: { start: { y: 2026, m: 3 }, end: { y: 2026, m: 5 } },
    status: "beta",
    light: "nex",
    treatment: "diagram",
    link: null,
    caseHref: ROUTES.project("nex"),
    hasCase: true,
    privateCode: true,
    hasHighlight: false,
    preview: null,
  },
  nexbot: {
    slug: "nexbot",
    gridOrder: 7,
    stageOrder: null,
    category: "messaging",
    period: { start: { y: 2026, m: 3 }, end: { y: 2026, m: 5 } },
    status: "beta",
    light: "nex",
    treatment: "typographic",
    link: null,
    caseHref: ROUTES.project("nex"),
    privateCode: true,
    hasHighlight: true,
    preview: null,
  },
  nexconnect: {
    slug: "nexconnect",
    gridOrder: 8,
    stageOrder: null,
    category: "messaging",
    period: { start: { y: 2026, m: 3 }, end: { y: 2026, m: 5 } },
    status: "beta",
    light: "nex",
    treatment: "typographic",
    link: null,
    caseHref: ROUTES.project("nex"),
    privateCode: true,
    hasHighlight: true,
    preview: null,
  },
  influencerai: {
    slug: "influencerai",
    gridOrder: 10,
    stageOrder: null,
    category: "ai",
    period: { start: { y: 2025, m: 12 }, end: { y: 2026, m: 3 } },
    status: "mvpDone",
    light: null,
    treatment: "typographic",
    link: { kind: "github", href: GH.influencerai },
    caseHref: null,
    hasHighlight: true,
    preview: null,
    tileIcon: images.influencerIcon,
  },
  vibecoding: {
    slug: "vibecoding",
    gridOrder: 11,
    stageOrder: 5,
    category: "ai",
    period: { start: { y: 2025, m: 12 }, end: { y: 2025, m: 12 } },
    status: "prototypeDone",
    light: "vibecoding",
    treatment: "screens",
    link: { kind: "github", href: GH.vibecoding },
    caseHref: null,
    hasHighlight: true,
    preview: crops.vibecoding.editor,
  },
  orbitfinance: {
    slug: "orbitfinance",
    gridOrder: 12,
    stageOrder: 4,
    category: "fintech",
    period: { start: { y: 2025, m: 10 }, end: { y: 2025, m: 12 } },
    status: "mvpDone",
    light: "orbitfinance",
    treatment: "screens",
    link: { kind: "github", href: GH.orbitfinance },
    caseHref: ROUTES.project("orbitfinance"),
    hasCase: true,
    hasHighlight: true,
    preview: crops.orbitfinance.inicio,
  },
  /* ---- products built and led at employers (owner: "produto meu, feito para a Adalink") ---- */
  waworkspace: {
    slug: "waworkspace",
    gridOrder: 2,
    stageOrder: null,
    category: "messaging",
    period: { start: { y: 2026, m: 9 }, end: { y: 2026, m: 9 } },
    status: "mvpDone",
    light: "nex",
    treatment: "typographic",
    link: null,
    caseHref: null,
    privateCode: true,
    hasHighlight: true,
    preview: null,
  },
  adaflow: {
    slug: "adaflow",
    gridOrder: 3,
    stageOrder: null,
    category: "ai",
    period: { start: { y: 2025, m: 12 }, end: "present" },
    status: "inProduction",
    light: "orbitmind",
    treatment: "typographic",
    link: { kind: "site", href: "https://adalink.com.br" },
    caseHref: null,
    privateCode: true,
    hasHighlight: true,
    preview: null,
  },
  orbitpipeline: {
    slug: "orbitpipeline",
    gridOrder: 4,
    stageOrder: null,
    category: "ai",
    period: { start: { y: 2026, m: 3 }, end: "present" },
    status: "inProduction",
    light: "vibecoding",
    treatment: "typographic",
    link: null,
    caseHref: null,
    privateCode: true,
    hasHighlight: true,
    preview: null,
  },
  plantoes: {
    slug: "plantoes",
    gridOrder: 9,
    stageOrder: null,
    category: "custom",
    period: { start: { y: 2025, m: 12 }, end: { y: 2026, m: 3 } },
    status: "mvpDone",
    light: null,
    treatment: "typographic",
    link: null,
    caseHref: null,
    privateCode: true,
    hasHighlight: true,
    preview: null,
  },
  fsjpii: {
    slug: "fsjpii",
    gridOrder: 13,
    stageOrder: null,
    category: "custom",
    period: { start: { y: 2025, m: 9 }, end: { y: 2025, m: 12 } },
    /** OWNER-FLAG: "Em produção"? (v3spec §13 C.16) */
    status: "done",
    light: null,
    treatment: "screens",
    link: null,
    caseHref: null,
    privateCode: true,
    hasHighlight: true,
    preview: crops.fsjpii.login,
  },
  "love-startup": {
    slug: "love-startup",
    gridOrder: 14,
    stageOrder: null,
    category: "custom",
    period: { start: { y: 2024, m: 12 }, end: { y: 2025, m: 1 } },
    status: "done",
    light: null,
    treatment: "typographic",
    link: null,
    caseHref: null,
    hasHighlight: false,
    preview: null,
  },
  ecommerce: {
    slug: "ecommerce",
    gridOrder: 15,
    stageOrder: null,
    category: "custom",
    period: { start: { y: 2023, m: 10 }, end: { y: 2024, m: 12 } },
    status: "done",
    light: null,
    treatment: "screens",
    link: null,
    caseHref: null,
    hasHighlight: false,
    /** OWNER-FLAG: shows a client brand (v3spec §13 C.20) */
    preview: crops.ecommerce.home,
  },
};

/** "Todos os produtos e projetos" rows, most recent first (15 rows). */
export const GRID_PROJECTS: Project[] = Object.values(PROJECTS)
  .filter((p) => p.gridOrder !== null)
  .sort((a, b) => (a.gridOrder ?? 0) - (b.gridOrder ?? 0));

/** Chip order + counts: Todos 15 · IA & Agentes 7 · Atendimento & Mensageria 3 · Fintech 1 · Sob encomenda 4. */
export const PROJECT_CATEGORIES: { id: "all" | ProjectCategory; count: number }[] = [
  { id: "all", count: GRID_PROJECTS.length },
  ...(["ai", "messaging", "fintech", "custom"] as const).map((id) => ({
    id,
    count: GRID_PROJECTS.filter((p) => p.category === id).length,
  })),
];

/**
 * Slugs that have their own case page at /projetos/[slug] (`hasCase`):
 * orbita · orbitmind · nex · orbitfinance · vektus. VibeCoding has no page (too little
 * verified material for a credible case) — see docs/REDESIGN.md §10.
 */
export const CASE_SLUGS: ProjectSlug[] = Object.values(PROJECTS)
  .filter((p) => p.hasCase === true)
  .map((p) => p.slug);

/** Fallback target for "Estudo de caso" links of projects without a case: the products table. */
export const CASE_FALLBACK_HREF = "/#todos-os-produtos";

/**
 * Href for a project's "Estudo de caso" link: its case page (or the Suíte Nex case for
 * NexBot/NexConnect), else the products table anchor. Pass to SmartLink/ButtonLink.
 */
export function caseLinkFor(slug: ProjectSlug): string {
  return PROJECTS[slug].caseHref ?? CASE_FALLBACK_HREF;
}

/* ================================================================ STAGE */

/** RGB triplets per product light (for inline `--L`). */
export const LIGHT_RGB: Record<ProductLight, string> = {
  orbita: "134 194 140",
  orbitmind: "59 130 246",
  nex: "245 158 11",
  orbitfinance: "139 92 246",
  vibecoding: "16 185 129",
  vektus: "251 113 133",
};

/**
 * ProjectStage chapters (v3spec §4.1–4.3). Order = colour rhythm
 * sage → blue → amber → violet → emerald → rose.
 * Copy: `stage.chapters.<slug>.*` (rail, tag, meta, eyebrow?, name, descriptor,
 * outcome, metrics.m1..m3, extraLink?, fig.*, mech.*) + `products.items.<slug>.stack`.
 */
export interface StageChapter {
  slug: "orbita" | "orbitmind" | "nex" | "orbitfinance" | "vibecoding" | "vektus";
  num: string;
  light: ProductLight;
  /** primary CTA: case page or the quote anchor. Label: stage.ctaCase | stage.ctaQuote */
  cta: { kind: "case" | "quote"; href: string };
  /** secondary: public repo, or null → render common.links.privateCode */
  ext: string | null;
  /** optional extra quiet link in the text column (label: stage.chapters.<slug>.extraLink) */
  extraLink?: { href: string; opensOrbita?: boolean; external?: boolean };
  metrics: [Metric, Metric, Metric];
  /** images; diagram chapters draw their FRONT in markup */
  front: Crop | null;
  back: Crop | null;
  loupe: Crop | null;
  /** rail peek 144×90 — null = raised tile with the name */
  peek: Crop | null;
  /** name size override (OrbitFinance 80/76) */
  nameSize?: "default" | "compact";
}

export const STAGE_CHAPTERS: StageChapter[] = [
  {
    slug: "orbita",
    num: "01",
    light: "orbita",
    cta: { kind: "case", href: caseLinkFor("orbita") },
    ext: GH.orbita,
    extraLink: { href: "#orbita", opensOrbita: true },
    metrics: [
      { kind: "count", value: 102, labelKey: "m1" },
      { kind: "count", value: 86.7, decimals: 1, suffix: "%", labelKey: "m2" },
      { kind: "short", value: 7, labelKey: "m3" },
    ],
    front: crops.orbita.visaoGeral.c,
    back: crops.orbita.conexoes.back,
    loupe: null,
    peek: crops.orbita.visaoGeral.c,
  },
  {
    slug: "orbitmind",
    num: "02",
    light: "orbitmind",
    cta: { kind: "quote", href: "#cotacao" },
    ext: GH.orbitmind,
    extraLink: { href: "#URL-DO-SITE-DA-ORBITMIND", external: true },
    metrics: [
      { kind: "count", value: 39, labelKey: "m1" },
      { kind: "short", value: 6, labelKey: "m2" },
      { kind: "short", value: 3, labelKey: "m3" },
    ],
    front: null,
    back: crops.orbitmind.flowBack,
    loupe: crops.orbitmind.appNav,
    peek: crops.orbitmind.flowPeek,
  },
  {
    slug: "nex",
    num: "03",
    light: "nex",
    cta: { kind: "quote", href: "#cotacao" },
    ext: null,
    metrics: [
      { kind: "word", value: 1258, labelKey: "m1" },
      { kind: "count", value: 10, suffix: "+", labelKey: "m2" },
      { kind: "short", value: 8, labelKey: "m3" },
    ],
    front: null,
    back: null,
    loupe: null,
    peek: null,
  },
  {
    slug: "orbitfinance",
    num: "04",
    light: "orbitfinance",
    cta: { kind: "quote", href: "#cotacao" },
    ext: GH.orbitfinance,
    metrics: [
      { kind: "count", value: 102, labelKey: "m1" },
      { kind: "short", value: 3, labelKey: "m2" },
      { kind: "short", value: 3, labelKey: "m3" },
    ],
    front: crops.orbitfinance.inicio,
    back: crops.orbitfinance.recursoBack,
    loupe: null,
    peek: crops.orbitfinance.inicio,
    nameSize: "compact",
  },
  {
    slug: "vibecoding",
    num: "05",
    light: "vibecoding",
    cta: { kind: "quote", href: "#cotacao" },
    ext: GH.vibecoding,
    metrics: [
      { kind: "short", value: 6, labelKey: "m1" },
      { kind: "count", value: 39, labelKey: "m2" },
      { kind: "word", word: "AES-256-GCM", small: true, labelKey: "m3" },
    ],
    front: crops.vibecoding.editor,
    back: crops.vibecoding.geracaoBack,
    /** loupe = the .vc code card in markup; its text is verbatim from Demo.png (this crop is the reference / 16:10 thumb) */
    loupe: crops.vibecoding.demo,
    peek: crops.vibecoding.editor,
  },
  {
    slug: "vektus",
    num: "06",
    light: "vektus",
    cta: { kind: "quote", href: "#cotacao" },
    ext: GH.vektus,
    metrics: [
      { kind: "word", value: 1000, suffix: "+", labelKey: "m1" },
      { kind: "short", value: 3, labelKey: "m2" },
      { kind: "short", value: 3, labelKey: "m3" },
    ],
    front: null,
    back: null,
    loupe: null,
    peek: null,
  },
];

/* ============================================================ NUMBERS */

/**
 * Numbers strip: four business-facing proofs. Copy: `numbers.cells.<id>.*`.
 * Sources (repo audit 2026-09-30): Adaflow ALL_ADAPTERS fixture (114 native connectors);
 * adalink-platform ORBIT_METRICS.md (last 30 merged PRs: 100% graded A, median 0.5 h to merge);
 * the CV (Companhia de Estágios: 600+ clients in Brazil, USA, Italy and Latin America);
 * CATALOGO-ADALINK-BACK.md (25,937 backend tests in 2,404 suites, executed).
 */
export const NUMBERS = [
  { id: "connectors", metric: { kind: "count", value: 114, labelKey: "label" } as Metric, href: "#todos-os-produtos" },
  { id: "merge", metric: { kind: "word", value: 0.5, decimals: 1, labelKey: "label" } as Metric, steps: ["issue", "review", "merge"], href: "#todos-os-produtos" },
  { id: "clients", metric: { kind: "count", value: 600, suffix: "+", labelKey: "label" } as Metric, regions: ["br", "us", "it", "latam"], href: "#experience" },
  { id: "tests", metric: { kind: "word", value: 25937, labelKey: "label" } as Metric, suites: 2404, href: "#todos-os-produtos" },
] as const;
