import type { CSSProperties, ReactNode } from "react";
import { SmartLink } from "@/components/ui-v3/SmartLink";
import { formatMetric, splitMetric } from "@/src/content/format";
import type { Crop, Locale, Metric } from "@/src/content/types";

/** CSS custom properties in a style object. */
export const vars = (v: Record<string, string | number>, extra?: CSSProperties) => ({ ...v, ...extra }) as CSSProperties;

/** Quote link contract (docs/REDESIGN.md §10.1): "?tipo=<slug>#cotacao"; same page → requestQuotePrefill. */
export const quoteHref = (slug: string) => `?tipo=${slug}#cotacao`;

/** The only CTA href of a chapter (the stage front image uses it too). */
export function CtaLink({
  kind,
  href,
  slug,
  className,
  ariaLabel,
  children,
}: {
  kind: "case" | "quote";
  href: string;
  slug: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  if (kind === "case") {
    return (
      <SmartLink href={href} className={className} aria-label={ariaLabel}>
        {children}
      </SmartLink>
    );
  }
  return (
    <a href={quoteHref(slug)} data-quote-ref={slug} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

/** Keeps each stack item on one line: "Vercel AI SDK" never breaks inside. */
export const stackLine = (s: string) =>
  s
    .split(" · ")
    .map((p) => p.replace(/ /g, " "))
    .join(" · ");

/** Wraps hyphenated tokens ("AES-256-GCM", "multi-modelo") in nowrap spans. */
export function noWrapHyphens(text: string): ReactNode {
  const parts = text.split(/(\S+-\S+)/g);
  if (parts.length === 1) return text;
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} className="nw">
        {p}
      </span>
    ) : (
      p
    ),
  );
}

/**
 * next/image `sizes` for a crop drawn inside the scaled 1440 desktop canvas
 * (box width × W/w; the canvas shrinks with the viewport between 1120 and 1440).
 */
export function deskSizes(crop: Crop, boxWidth: number) {
  const px = Math.ceil(boxWidth * (crop.image.width / crop.box.w));
  return `(min-width: 1440px) ${px}px, ${Math.ceil((px / 1440) * 100)}vw`;
}

/** `sizes` for a crop in the mobile visual zone (zone = min(100vw, 600px) − 40px; `fraction` = box / zone). */
export function mobSizes(crop: Crop, fraction: number) {
  const k = fraction * (crop.image.width / crop.box.w);
  return `min(${Math.ceil(560 * k)}px, ${Math.ceil(100 * k)}vw)`;
}

/** First chapter front: desktop + mobile instances share ONE sizes string so the priority preload is deduped. */
export const FIRST_FRONT_SIZES = "(min-width: 1440px) 780px, (min-width: 1120px) 55vw, min(660px, 118vw)";

/**
 * Stage metric (v2 §6.3 recipe): counters use `.cnt` driven by `.ch.is-active .cnt`
 * (count-up on every chapter entrance); ≥1000 / words are mask-revealed text.
 */
export function StageMetric({ metric, locale, index, mobile }: { metric: Metric; locale: Locale; index: number; mobile?: boolean }) {
  const full = formatMetric(metric, locale);
  if (metric.kind === "word") {
    if (mobile) {
      return (
        <span className="e-word">
          <span className={metric.small ? "mnm w20" : "mnm"}>
            <span style={vars({ "--i": index })}>{full}</span>
          </span>
        </span>
      );
    }
    return (
      <span className={metric.small ? "e-word mask wd-s" : "e-word mask"}>
        <span style={vars({ "--i": index })}>{full}</span>
      </span>
    );
  }
  const { to, rest } = splitMetric(metric, locale);
  return (
    <>
      {metric.prefix ? <span aria-hidden="true">{metric.prefix}</span> : null}
      <span
        className={metric.kind === "short" ? "cnt short" : "cnt"}
        aria-hidden="true"
        style={vars({ "--to": to, "--i": index }, mobile ? undefined : { minWidth: `${String(to).length}ch` })}
      />
      {rest ? (
        <span className={!mobile || rest.length > 1 ? "sfx" : undefined} aria-hidden="true">
          {rest}
        </span>
      ) : null}
      <span className="sr">{full}</span>
    </>
  );
}

/** 6px window dots + figure caption (.chrome). */
export function Chrome({ caption }: { caption: string }) {
  return (
    <div className="chrome">
      <i />
      <i />
      <i />
      <span className="cap">{caption}</span>
    </div>
  );
}

/** lucide-style inline check (the artboard draws it as an inline SVG). */
export function Check({ size = 12, stroke = 2, color = "currentColor", className }: { size?: number; stroke?: number; color?: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
