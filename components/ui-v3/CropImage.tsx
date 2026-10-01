import Image from "next/image";
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { cropStyle } from "@/src/content/images";
import type { Crop, CropBox, CropMask } from "@/src/content/types";

type Source =
  | {
      /** a named crop from src/content/images.ts (alt comes from images.<altKey>) */
      crop: Crop;
      src?: never;
      width?: never;
      height?: never;
      box?: never;
      masks?: never;
    }
  | {
      crop?: never;
      /** public path */
      src: string;
      /** natural width of the source file */
      width: number;
      /** natural height of the source file */
      height: number;
      /** crop box in source px */
      box: CropBox;
      /** cover rectangles (% of the crop box) */
      masks?: CropMask[];
    };

export type CropImageProps = Source & {
  /** alt text; overrides the crop's altKey. Required when using raw src props (use "" + decorative for ornaments) */
  alt?: string;
  /** decorative → alt="" (e.g. dimmed back layers, rail peeks that repeat a visible label) */
  decorative?: boolean;
  /**
   * Rendered width of the crop box in CSS px at desktop. Used to compute `sizes`
   * (box width × W/w, since the image overflows the box). Ignored if `sizes` is set.
   */
  renderWidth?: number;
  sizes?: string;
  priority?: boolean;
  /**
   * true (default): the box sets aspect-ratio w/h and fills its parent's width.
   * false: size the box yourself (className/style with width + height), e.g. stage slots.
   */
  aspect?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * <CropImage> — the one crop formula for every screenshot (finalSpec §4.5):
 *   img { width: W/w×100%; left: −x/w×100%; top: −y/h×100%; height:auto; max-width:none }
 * Renders `<span class="crop"><Image class="crop-img" …/>{masks}</span>` with next/image.
 *
 * @example <CropImage crop={crops.orbita.visaoGeral.c} renderWidth={624} />
 * @example <CropImage crop={crops.orbita.conexoes.back} decorative aspect={false} style={{ width: 520, height: 289 }} />
 * @example <CropImage src="/x.png" width={1920} height={869} box={{ x: 70, y: 0, w: 1264, h: 790 }} alt="…" />
 */
export function CropImage(props: CropImageProps) {
  const t = useTranslations("images");
  const { alt, decorative, renderWidth, sizes, priority, aspect = true, className, style } = props;
  const image = props.crop ? props.crop.image : { src: props.src!, width: props.width!, height: props.height! };
  const box = props.crop ? props.crop.box : props.box!;
  const masks = props.crop ? props.crop.masks : props.masks;
  const altText = decorative ? "" : alt ?? (props.crop ? t(props.crop.altKey) : "");
  const css = cropStyle(image, box);
  const scale = image.width / box.w;
  const computedSizes = sizes ?? (renderWidth ? `${Math.ceil(renderWidth * scale)}px` : `(min-width: 1024px) ${Math.round(60 * scale)}vw, ${Math.round(100 * scale)}vw`);

  return (
    <span
      className={cn("crop block", className)}
      style={{ ...(aspect ? { aspectRatio: `${box.w} / ${box.h}`, width: "100%" } : null), ...style }}
    >
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={altText}
        sizes={computedSizes}
        priority={priority}
        className="crop-img"
        style={{ position: "absolute", width: css.width, left: css.left, top: css.top, height: "auto", maxWidth: "none" }}
      />
      {masks?.map((m, i) => (
        <span
          key={i}
          className="mk"
          aria-hidden="true"
          style={{ left: m.left, top: m.top, width: m.width, height: m.height, background: m.color }}
        />
      ))}
    </span>
  );
}
