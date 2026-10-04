import { useTranslations } from "next-intl";
import { GRID_PROJECTS, PROJECT_CATEGORIES, caseLinkFor } from "@/src/content/projects";
import { ANCHORS } from "@/src/content/site";
import type { Period, Status } from "@/src/content/types";
import { ProductsIndex, type IndexRow, type Stage } from "./products/ProductsIndex";
import { ProductPreview } from "./products/ProductPreview";

function yearSpan(period: Period): string {
  const start = period.start.y;
  if (period.end === "present") return String(start);
  return period.end.y === start ? String(start) : `${start}–${period.end.y}`;
}

/** Growth stage, as the original site told it: in development = sprout, MVP/beta = sapling, live or done = tree. */
function stageOf(status: Status): Stage {
  if (status === "inDevelopment") return "sprout";
  if (status === "done" || status === "inProduction") return "tree";
  return "sapling";
}

/**
 * Todos os produtos e projetos (#todos-os-produtos). Server component: resolves every string, year and
 * link, then hands plain rows to the <ProductsIndex> client island (category tabs synced to ?cat=, live
 * search, sliding rows, growth stages, floating screen beside the cursor). Previews are server-rendered.
 */
export function Products() {
  const t = useTranslations("products");
  const tc = useTranslations("common");

  const rows: IndexRow[] = GRID_PROJECTS.map((p) => {
    const kind: IndexRow["kind"] = p.caseHref ? "case" : p.link ? "gh" : "none";
    const categoryLabel = t(`chips.${p.category}`);
    const statusLabel = tc(`status.${p.status}`);
    const highlight = p.hasHighlight ? t(`items.${p.slug}.highlight`) : "";
    return {
      slug: p.slug,
      category: p.category,
      name: t(`items.${p.slug}.name`),
      oneLiner: t(`items.${p.slug}.oneLiner`),
      highlight: highlight === "—" ? "" : highlight,
      year: yearSpan(p.period),
      type: t(`items.${p.slug}.type`),
      stage: stageOf(p.status),
      statusLabel,
      light: p.light,
      kind,
      href: kind === "case" ? caseLinkFor(p.slug) : p.link?.href ?? null,
      linkLabel: kind === "case" ? tc("links.caseStudy") : kind === "gh" && p.link ? tc(`links.${p.link.kind}`) : tc("links.none"),
      search: [
        t(`items.${p.slug}.name`),
        t(`items.${p.slug}.oneLiner`),
        t(`items.${p.slug}.stack`),
        t(`items.${p.slug}.type`),
        highlight,
        categoryLabel,
        statusLabel,
      ].join(" "),
    };
  });

  const chips = PROJECT_CATEGORIES.map((c) => ({ id: c.id, label: t(`chips.${c.id}`), count: c.count }));

  return (
    <section id={ANCHORS.allProducts} className="sec home-prod" aria-labelledby="h-todos">
      <div className="inner">
        <div className="px-head">
          <h2 id="h-todos" className="h2 px-title">
            {t("title")}
          </h2>
          <p className="lead px-lead">{t("lead")}</p>
        </div>
        <ProductsIndex
          rows={rows}
          chips={chips}
          total={GRID_PROJECTS.length}
          stages={{ sprout: t("stages.sprout"), sapling: t("stages.sapling"), tree: t("stages.tree") }}
          previews={GRID_PROJECTS.map((p) => (p.preview ? <ProductPreview key={p.slug} project={p} /> : null))}
        />
      </div>
    </section>
  );
}
