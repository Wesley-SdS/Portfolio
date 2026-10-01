import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { languageAlternates, localePath } from "@/i18n/paths";
import { CASE_SLUGS } from "@/src/content/projects";
import { SITE } from "@/src/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/contratar", "/privacidade", ...CASE_SLUGS.map((s) => `/projetos/${s}`)];
  const abs = (p: string) => `${SITE.url}${p === "/" ? "" : p}`;
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: abs(localePath(locale, path)),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(Object.entries(languageAlternates(path)).map(([k, v]) => [k, abs(v)])),
      },
    })),
  );
}
