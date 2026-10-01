import Image from "next/image";
import { useTranslations } from "next-intl";
import { CropImage } from "@/components/ui-v3";
import type { Project } from "@/src/content/types";

/**
 * One preview layer for the floating `.pv` card (411×257 at 1440, 16:10).
 * Real crops for projects with screenshots; otherwise the typographic tile on
 * --mat (name, stack, "[captura pendente]"; InfluencerAI adds its 40px icon).
 * Decorative: the whole preview column is aria-hidden (the row carries the info).
 */
export function ProductPreview({ project }: { project: Project }) {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  if (project.preview) {
    return <CropImage crop={project.preview} decorative aspect={false} renderWidth={411} className="pvc" />;
  }
  return (
    <div className="pvt">
      <span className="pvt-n">{t(`items.${project.slug}.name`)}</span>
      <span className="meta">{t(`items.${project.slug}.stack`)}</span>
      {project.tileIcon ? (
        <Image src={project.tileIcon} width={40} height={40} alt="" unoptimized className="pvt-ic" />
      ) : null}
      <span className="pvt-p">{tc("capturePending")}</span>
    </div>
  );
}
