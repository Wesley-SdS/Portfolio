import pt from "@/messages/pt.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import { GRID_PROJECTS, PROJECTS } from "@/src/content/projects";
import { ENGAGEMENT_MODELS, SOLUTIONS } from "@/src/content/services";
import { COMPANIES } from "@/src/content/leadership";
import { ABOUT } from "@/src/content/about";
import { SITE, ROUTES, ANCHORS } from "@/src/content/site";
import { formatPeriod, formatYears } from "@/src/content/format";
import type { Locale, Period, Project } from "@/src/content/types";
import type { ChatLocale } from "./protocol";

/**
 * Public knowledge base for the visitor persona — built ONLY from what the site
 * already publishes (src/content + messages). No private data, no owner memory.
 * Compact plain text, memoised per locale (stable → prompt-cache friendly).
 */

type Dict = Record<string, unknown>;
const MESSAGES: Record<ChatLocale, Dict> = { pt: pt as Dict, en: en as Dict, es: es as Dict };

function get(obj: Dict, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Dict)[k] : undefined), obj);
}
function str(obj: Dict, path: string): string {
  const v = get(obj, path);
  return typeof v === "string" ? v.replace(/<\/?hl>/g, "") : "";
}
function list(obj: Dict, path: string): string[] {
  const v = get(obj, path);
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export interface KbProject {
  slug: string;
  name: string;
  category: string;
  status: string;
  period: string;
  type: string;
  oneLiner: string;
  highlight: string;
  stack: string;
  link: string;
  /** site path to learn more */
  href: string;
}

export function kbProjects(locale: ChatLocale): KbProject[] {
  const m = MESSAGES[locale];
  const rows: Project[] = [...GRID_PROJECTS];
  if (!rows.some((p) => p.slug === "nex")) rows.push(PROJECTS.nex);
  return rows.map((p) => {
    const base = `products.items.${p.slug}`;
    const stageBase = `stage.chapters.${p.slug}`;
    return {
      slug: p.slug,
      name: str(m, `${base}.name`) || str(m, `${stageBase}.name`) || p.slug,
      category: p.category,
      status: str(m, `common.status.${p.status}`),
      period: formatPeriod(p.period, locale as Locale),
      type: str(m, `${base}.type`),
      oneLiner: str(m, `${base}.oneLiner`) || str(m, `${stageBase}.descriptor`),
      highlight: str(m, `${base}.highlight`),
      stack: str(m, `${base}.stack`),
      link: p.link?.href ?? (p.privateCode ? "private code" : ""),
      href: p.caseHref ?? `/#${ANCHORS.allProducts}`,
    };
  });
}

const cache = new Map<ChatLocale, string>();

export function buildKnowledgeBase(locale: ChatLocale): string {
  const hit = cache.get(locale);
  if (hit) return hit;
  const m = MESSAGES[locale];
  const L: string[] = [];

  L.push("# About Wesley");
  L.push(`Name: ${SITE.name}. Role: ${str(m, "hero.role")}.`);
  L.push(str(m, "hero.lead"));
  for (const k of ["trajectory", "work", "drive"]) L.push(`${str(m, `about.paragraphs.${k}.head`)} ${str(m, `about.paragraphs.${k}.text`)}`);
  L.push(`Based in São Paulo, Brazil (Brasília time, UTC−3). Works remotely.`);
  L.push(`Public contact: e-mail ${SITE.email} · LinkedIn ${SITE.linkedin} · GitHub ${SITE.github}.`);
  L.push(`Pages: services & hiring ${ROUTES.hire} · Órbita case study ${ROUTES.project("orbita")} · quote form /#${ANCHORS.quote} (also ${ROUTES.hire}#${ANCHORS.quote}).`);

  L.push("\n# Products and projects (his own work; status is authoritative)");
  for (const p of kbProjects(locale)) {
    L.push(
      `- ${p.name} [slug ${p.slug}; ${p.category}; ${p.status}; ${p.period}] ${p.type}. ${p.oneLiner}` +
        (p.highlight ? ` Highlight: ${p.highlight}.` : "") +
        (p.stack ? ` Stack: ${p.stack}.` : "") +
        (p.link ? ` Code: ${p.link}.` : "") +
        ` More: ${p.href}.`,
    );
  }
  const nexOutcome = str(m, "stage.chapters.nex.outcome");
  if (nexOutcome) L.push(`Suíte Nex (NexBot + NexConnect): ${nexOutcome}`);
  const orbitaOutcome = str(m, "products.items.orbita.outcome");
  if (orbitaOutcome) L.push(`Órbita: ${orbitaOutcome}`);

  L.push("\n# Engagement models (investment is always 'on request' — never quote prices)");
  for (const e of ENGAGEMENT_MODELS) {
    const b = `services.models.${e.id}`;
    L.push(`- ${str(m, `${b}.title`)} (id ${e.id}): ${str(m, `${b}.oneLiner`)} Includes: ${list(m, `${b}.items`).join("; ")}. How: ${str(m, `${b}.how`)} Ideal for: ${str(m, `${b}.ideal`)}`);
    const c = `hire.comparison.models.${e.id}`;
    const cadence = str(m, `${c}.cadence`);
    const deliverables = str(m, `${c}.deliverables`);
    if (cadence || deliverables) L.push(`  Cadence: ${cadence} Deliverables: ${deliverables} Investment: ${str(m, `${c}.investment`)}.`);
  }

  L.push("\n# What he builds (solution types)");
  for (const s of SOLUTIONS) {
    const b = `services.solutions.${s.id}`;
    L.push(`- ${str(m, `${b}.title`)} (id ${s.id}): ${str(m, `${b}.desc`)} Stack: ${str(m, `${b}.stack`)}.`);
  }

  L.push("\n# Process");
  for (const k of ["call", "proposal", "build", "delivery"]) L.push(`- ${str(m, `process.steps.${k}.title`)}: ${str(m, `process.steps.${k}.text`)}`);
  L.push(`${str(m, "process.method.eyebrow")}: ${str(m, "process.method.text")}`);

  L.push("\n# Career (from his CV, newest first; do not add details beyond this)");
  L.push(str(m, "leadership.bio"));
  for (const c of COMPANIES) {
    const b = `leadership.companies.${c.id}`;
    const fmt = (p: Period) => (c.yearsOnly ? formatYears(p, locale as Locale) : formatPeriod(p, locale as Locale));
    const when = c.span ? fmt(c.span) : str(m, `${b}.period`);
    L.push(`- ${str(m, `${b}.name`)} — ${str(m, `${b}.role`)} (${when}${c.current ? ", current" : ""}; ${str(m, `${b}.mode`)}). ${str(m, `${b}.paragraph`)}`);
    if (c.roles.length) L.push(`  Roles: ${c.roles.map((r) => `${str(m, `${b}.roles.${r.id}.title`)} (${fmt(r.period)})`).join(", ")}.`);
    const bullets = list(m, `${b}.bullets`);
    if (bullets.length) L.push(`  Work: ${bullets.join("; ")}.`);
    L.push(`  Stack: ${str(m, `${b}.stack`)}.`);
  }
  L.push(`Tech stack: ${ABOUT.stack.map((g) => `${str(m, `leadership.stack.${g.id}`)}: ${g.items.join(", ")}`).join(" | ")}.`);
  L.push(`${str(m, "leadership.educationTitle")}: ${list(m, "leadership.education").join("; ")}.`);

  L.push("\n# FAQ");
  for (const k of ["price", "firstCall", "who", "nda", "code", "remote"]) L.push(`Q: ${str(m, `hire.faq.items.${k}.q`)} A: ${str(m, `hire.faq.items.${k}.a`)}`);

  const kb = L.filter((l) => l.trim().length).join("\n");
  cache.set(locale, kb);
  return kb;
}

/** Diacritics- and case-insensitive search over the public project list. */
export function searchProjects(locale: ChatLocale, query?: string, category?: string, limit = 5): KbProject[] {
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const terms = norm(query ?? "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);
  const scored = kbProjects(locale)
    .filter((p) => p.slug !== "nex")
    .filter((p) => !category || p.category === category)
    .map((p) => {
      const hay = norm(`${p.name} ${p.slug} ${p.type} ${p.oneLiner} ${p.stack} ${p.category} ${p.highlight}`);
      const score = terms.length ? terms.reduce((n, t) => n + (hay.includes(t) ? (norm(p.name).includes(t) ? 3 : 1) : 0), 0) : 1;
      return { p, score };
    })
    .filter((x) => x.score > 0);
  // stable: keep the site's grid order among equal scores
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.p);
}
