import { CropImage } from "@/components/ui-v3";
import type { Project } from "@/src/content/types";

/**
 * The screen that floats beside the cursor in the products index (16:10). Only projects with a real
 * screenshot have one; the others show no preview rather than a placeholder.
 */
export function ProductPreview({ project }: { project: Project }) {
  if (!project.preview) return null;
  return <CropImage crop={project.preview} decorative aspect={false} renderWidth={360} className="px-pv-img" />;
}
