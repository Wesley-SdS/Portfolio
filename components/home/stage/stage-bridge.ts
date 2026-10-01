/**
 * Stage bridge — lets controls outside #projects (the hero satellites) pick a chapter.
 * The stage (StageClient) listens for the event; the link itself scrolls to `#projects`,
 * so everything still works without JavaScript.
 */

export const STAGE_GO_EVENT = "stage:go";

export interface StageGoDetail {
  /** zero-based chapter index (STAGE_CHAPTERS order) */
  index: number;
}

export function goToStageChapter(index: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<StageGoDetail>(STAGE_GO_EVENT, { detail: { index } }));
}
