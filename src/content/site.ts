/**
 * Site-wide constants: identity, external profiles, anchors and routes.
 * Placeholders the owner must fill before launch are marked OWNER-FLAG
 * (v3spec §13 A.3). Keep the literal placeholder href so it is greppable.
 */

export const SITE = {
  name: "Wesley Santos",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://wesley-santos.dev",
  email: "wesleysantos.0095@gmail.com",
  github: "https://github.com/Wesley-SdS",
  githubLabel: "github.com/Wesley-SdS",
  linkedin: "https://www.linkedin.com/in/wesley-sds/",
  linkedinLabel: "linkedin.com/in/wesley-sds",
  /** OWNER-FLAG: replace with the real OrbitMind site URL (v3spec §13 A.3) */
  orbitmindUrl: "#URL-DO-SITE-DA-ORBITMIND",
  orbitmindUrlTitle: "[URL DO SITE DA ORBITMIND]",
  timeZone: "America/Sao_Paulo",
  /** career start (Out 2015); the CV states "10+ anos de experiência" */
  careerStart: { y: 2015, m: 10 },
} as const;

/** Home anchors — exactly one element per id (v3spec §2). */
export const ANCHORS = {
  home: "home",
  projects: "projects",
  allProducts: "todos-os-produtos",
  services: "servicos",
  process: "processo",
  experience: "experience",
  about: "about",
  orbitaLab: "orbita-lab",
  contact: "contact",
  quote: "cotacao",
  orbita: "orbita",
  footer: "footer",
  main: "main",
} as const;

/** Routes (path without the locale prefix; use the next-intl Link from @/i18n/routing). */
export const ROUTES = {
  home: "/",
  hire: "/contratar",
  project: (slug: string) => `/projetos/${slug}`,
  /** /privacidade exists (integration pass); OWNER-FLAG: fill its [placeholders] before launch (v3spec §13 A.3) */
  privacy: "/privacidade",
} as const;

/** Header nav (5 items, in page order). Label key: `nav.<key>`. */
export const NAV_ITEMS = [
  { key: "products", num: "01", anchor: ANCHORS.projects },
  { key: "orbita", num: "02", anchor: ANCHORS.orbitaLab },
  { key: "experience", num: "03", anchor: ANCHORS.experience },
  { key: "services", num: "04", anchor: ANCHORS.services },
  { key: "contact", num: "05", anchor: ANCHORS.contact },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];

/**
 * Hero stats strip (about the person). Label key: `hero.stats.<id>`. Sources: the CV (10+ years, 7 companies,
 * Tech Lead at two companies today) and the products index (15 rows).
 */
export const HERO_STATS = [
  { id: "years", value: 10, suffix: "+" },
  { id: "teams", value: 2, suffix: "" },
  { id: "projects", value: 15, suffix: "" },
  { id: "companies", value: 7, suffix: "" },
] as const;
