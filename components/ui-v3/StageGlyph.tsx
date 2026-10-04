import { cn } from "@/lib/utils";
import type { Stage } from "@/src/content/format";

/**
 * Growth glyphs for a project's stage (the "tree" status of the original site): sprout = in
 * development, sapling = MVP / beta, tree = live or done. 18×18, stroke = currentColor, colour by
 * `.stg-<stage>` (products.css). Decorative: always pair it with the status word.
 */
export function StageGlyph({ stage, className }: { stage: Stage; className?: string }) {
  return (
    <svg className={cn("stg", `stg-${stage}`, className)} width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className="stg-ground" d="M3 16h12" />
      {stage === "sprout" ? (
        <g className="stg-plant">
          <path d="M9 16v-5" />
          <path d="M9 11.5c0-2.2-1.6-3.6-3.8-3.6 0 2.2 1.6 3.6 3.8 3.6z" />
          <path d="M9 11c0-2.4 1.7-3.9 4.1-3.9 0 2.4-1.7 3.9-4.1 3.9z" />
        </g>
      ) : stage === "sapling" ? (
        <g className="stg-plant">
          <path d="M9 16V6.5" />
          <path d="M9 12.5c0-2-1.5-3.3-3.6-3.3 0 2 1.5 3.3 3.6 3.3z" />
          <path d="M9 10c0-2.1 1.5-3.5 3.7-3.5 0 2.1-1.5 3.5-3.7 3.5z" />
          <path d="M9 6.5c0-1.7-1.2-2.8-3-2.8 0 1.7 1.2 2.8 3 2.8z" />
        </g>
      ) : (
        <g className="stg-plant">
          <path d="M9 16v-4.5" />
          <path d="M9 12.2l-2-1.6M9 13l2.2-1.7" />
          <path d="M5.2 10.4a3 3 0 0 1 .3-5.6 3.6 3.6 0 0 1 7-.1 3 3 0 0 1 .3 5.7c-.5.2-1 .3-1.6.3H6.8c-.6 0-1.1-.1-1.6-.3z" />
        </g>
      )}
    </svg>
  );
}
