import { useLocale, useTranslations } from "next-intl";
import { GRID_PROJECTS, PROJECT_CATEGORIES, caseLinkFor } from "@/src/content/projects";
import { ANCHORS } from "@/src/content/site";
import { asLocale, formatPeriod, statusShape } from "@/src/content/format";
import type { Period } from "@/src/content/types";
import { ProductsIndex, type IndexRow } from "./products/ProductsIndex";
import { ProductPreview } from "./products/ProductPreview";

function yearSpan(period: Period): string {
  const start = period.start.y;
  if (period.end === "present") return String(start);
  return period.end.y === start ? String(start) : `${start}–${period.end.y}`;
}

/**
 * Todos os produtos e projetos (#todos-os-produtos) — v3spec §5.5, §6.4.
 * Server component: resolves every string, period and link, then hands plain
 * rows to the <ProductsIndex> client island (chips synced to ?cat=, live search,
 * FLIP rows in a fixed .ix-box, floating preview on hover at ≥1024).
 * Preview layers are server-rendered and passed in as children.
 */
export function Products() {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const locale = asLocale(useLocale());

  const rows: IndexRow[] = GRID_PROJECTS.map((p) => {
    const kind: IndexRow["kind"] = p.caseHref ? "case" : p.link ? "gh" : "none";
    const categoryLabel = t(`chips.${p.category}`);
    const statusLabel = tc(`status.${p.status}`);
    return {
      slug: p.slug,
      category: p.category,
      name: t(`items.${p.slug}.name`),
      oneLiner: t(`items.${p.slug}.oneLiner`),
      highlight: p.hasHighlight ? t(`items.${p.slug}.highlight`) : "—",
      period: formatPeriod(p.period, locale),
      mobileMeta: `${yearSpan(p.period)} · ${categoryLabel} · ${statusLabel}`,
      statusLabel,
      statusShape: statusShape(p.status),
      light: p.light,
      kind,
      // case page (own or Suíte Nex) via caseLinkFor; projects without one link to GitHub or nothing
      href: kind === "case" ? caseLinkFor(p.slug) : p.link?.href ?? null,
      linkLabel: kind === "case" ? tc("links.caseStudy") : kind === "gh" && p.link ? tc(`links.${p.link.kind}`) : tc("links.none"),
      search: [
        t(`items.${p.slug}.name`),
        t(`items.${p.slug}.oneLiner`),
        t(`items.${p.slug}.stack`),
        t(`items.${p.slug}.type`),
        p.hasHighlight ? t(`items.${p.slug}.highlight`) : "",
        categoryLabel,
        statusLabel,
      ].join(" "),
    };
  });

  const chips = PROJECT_CATEGORIES.map((c) => ({ id: c.id, label: t(`chips.${c.id}`), count: c.count }));

  return (
    <section id={ANCHORS.allProducts} className="sec home-prod" aria-labelledby="h-todos">
      <div className="inner">
        <div className="prod-top">
          <h2 id="h-todos" className="h3s">
            {t("title")}
          </h2>
          <ProductsIndex
            rows={rows}
            chips={chips}
            total={GRID_PROJECTS.length}
            previews={GRID_PROJECTS.map((p) => (
              <ProductPreview key={p.slug} project={p} />
            ))}
          />
        </div>
      </div>
    </section>
  );
}
