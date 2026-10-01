import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CropImage, type CropImageProps } from "./CropImage";
import { SmartLink } from "./SmartLink";

export type FigureProps = CropImageProps & {
  /** left caption, e.g. "fig. 03 — Gastos por fluxo …" (meta, --ink-3) */
  caption?: ReactNode;
  /** optional right side of the caption (e.g. an accent link) */
  captionRight?: ReactNode;
  /** whole crop becomes a link and lifts −4px on hover */
  href?: string;
  /** accessible name for the link (defaults to the alt text via the image) */
  linkLabel?: string;
  /** classes on the <figure> */
  figureClassName?: string;
  /** --mat padding override (default 12 mobile / 24 desktop) */
  matClassName?: string;
};

/**
 * <Figure> — figure plate (finalSpec §4.5): `figure > .mat > .crop > img` + figcaption.
 * Paper surfaces only (never on the stage). Nothing accent-coloured inside the mat.
 *
 * @example <Figure crop={crops.orbita.gestao.c} renderWidth={804} caption={t("fig.spend")} />
 * @example <Figure crop={crops.wesley.portrait} className="wipe" caption="Wesley Santos — São Paulo" />
 */
export function Figure({ caption, captionRight, href, linkLabel, figureClassName, matClassName, ...crop }: FigureProps) {
  const plate = <CropImage {...crop} />;
  return (
    <figure className={cn("fig", href && "fig-link", figureClassName)}>
      <div className={cn("mat", matClassName)}>
        {href ? (
          <SmartLink href={href} aria-label={linkLabel} className="block rounded-crop">
            {plate}
          </SmartLink>
        ) : (
          plate
        )}
      </div>
      {caption || captionRight ? (
        <figcaption>
          <span>{caption}</span>
          {captionRight ? <span>{captionRight}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
