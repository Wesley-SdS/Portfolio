import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { HTML_LANG, languageAlternates, localePath } from "@/i18n/paths";
import { CASE_SLUGS } from "@/src/content/projects";
import { CASES, isCaseSlug } from "@/src/content/cases";
import { asLocale } from "@/src/content/format";
import { SITE } from "@/src/content/site";
import { CasePage } from "@/components/case/CasePage";

/**
 * Case studies /projetos/[slug] — one template (components/case/*) fed by src/content/cases.ts.
 * Pages: every project with `hasCase` (CASE_SLUGS) × pt/en/es, statically generated; others 404.
 */
// dynamicParams stays true: an unknown slug reaches the page and calls notFound(), which renders the
// locale 404 (app/[locale]/not-found.tsx) instead of the bare global one. Known slugs are still static.

const hasPage = (slug: string) => isCaseSlug(slug) && (CASE_SLUGS as string[]).includes(slug);

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => CASE_SLUGS.filter(isCaseSlug).map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasPage(slug) || !isCaseSlug(slug)) return {};
  const cfg = CASES[slug];
  const t = await getTranslations({ locale, namespace: "meta" });
  const path = `/projetos/${slug}`;
  const title = t(cfg.metaKeys.title);
  const description = t(cfg.metaKeys.description);
  const front = cfg.cover.front.kind === "screen" ? cfg.cover.front.crop.image : null;
  return {
    title,
    description,
    alternates: { canonical: localePath(locale, path), languages: languageAlternates(path) },
    openGraph: {
      type: "article",
      siteName: SITE.name,
      title,
      description,
      url: localePath(locale, path),
      locale: HTML_LANG[locale]?.replace("-", "_") ?? "pt_BR",
      ...(front ? { images: [{ url: front.src, width: front.width, height: front.height, alt: title }] } : null),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CaseRoute({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!hasPage(slug) || !isCaseSlug(slug)) notFound();
  setRequestLocale(locale);
  return <CasePage cfg={CASES[slug]} locale={asLocale(locale)} />;
}
