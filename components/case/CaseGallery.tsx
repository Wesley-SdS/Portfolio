"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CropImage } from "@/components/ui-v3/CropImage";
import type { Crop } from "@/src/content/types";

/** sizes for an 804-wide plate (100vw on phones), accounting for the crop overflow (W/w). */
const plateSizes = (c: Crop) => {
  const k = c.image.width / c.box.w;
  return `(min-width: 1024px) ${Math.ceil(804 * k)}px, ${Math.ceil(100 * k)}vw`;
};

export type GalleryViewItem = {
  crop: Crop;
  full: Crop;
  bg: string;
  caption: string;
  fig: string;
  openLabel: string;
  thumbLabel: string;
};

export type GalleryStrings = {
  tablistAria: string;
  lightboxTitle: string;
  prev: string;
  next: string;
  close: string;
  pending: string;
  /** "{n} / {total}" */
  counter: string;
};

/**
 * Case gallery (v2 §9.3 "Telas"): a --mat plate (804×503 at desktop) with stacked `.xf`
 * crossfading crops (160ms), `role="tablist"` thumbnails (94×59, roving arrows/Home/End),
 * "[captura pendente]" placeholders (aria-hidden, not clickable), and a Radix Dialog
 * lightbox with the FULL frame, prev/next (buttons and ←/→), Esc and focus return.
 */
export function CaseGallery({
  id,
  items,
  pending,
  strings,
}: {
  id: string;
  items: GalleryViewItem[];
  pending: number;
  strings: GalleryStrings;
}) {
  const [cur, setCur] = useState(0);
  const [open, setOpen] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = items.length;
  const count = (i: number) => strings.counter.replace("{n}", String(i + 1)).replace("{total}", String(n));
  const go = (i: number) => setCur((i + n) % n);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    setCur(next);
    tabs.current[next]?.focus();
  };

  const onDialogKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(cur + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(cur - 1);
    }
  };

  const item = items[cur];
  const panelId = `${id}-panel`;

  return (
    <div className="cs-gal">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <figure id={panelId} role="tabpanel" aria-label={item.caption} className="cs-gal-fig">
          <div className="cs-mat cs-gal-mat">
            <Dialog.Trigger asChild>
              <button type="button" className="plate-btn cs-gal-plate" aria-label={item.openLabel}>
                {items.map((it, i) => (
                  <span key={i} className={cn("xf gx", i === cur && "is-on")} style={{ background: it.bg }} aria-hidden={i !== cur}>
                    <CropImage
                      crop={it.crop}
                      aspect={false}
                      style={{ width: "100%", height: "100%" }}
                      sizes={plateSizes(it.crop)}
                      decorative={i !== cur}
                    />
                  </span>
                ))}
                <span aria-hidden="true" className="cs-gal-zoom">
                  <Maximize2 width={18} height={18} strokeWidth={1.5} />
                </span>
              </button>
            </Dialog.Trigger>
          </div>
          <figcaption className="cs-cap cs-gal-cap">
            <span>
              {item.fig} — {item.caption}
            </span>
            <span className="cs-nowrap">{count(cur)}</span>
          </figcaption>
        </figure>

        <div role="tablist" aria-label={strings.tablistAria} className="cs-gal-thumbs">
          {items.map((it, i) => (
            <button
              key={i}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              className="thumb"
              aria-selected={i === cur}
              aria-controls={panelId}
              tabIndex={i === cur ? 0 : -1}
              onClick={() => setCur(i)}
              onKeyDown={(e) => onTabKey(e, i)}
              style={{ background: it.bg }}
            >
              <CropImage crop={it.crop} aspect={false} style={{ width: "100%", height: "100%" }} renderWidth={94} alt={it.thumbLabel} />
            </button>
          ))}
          {Array.from({ length: pending }).map((_, i) => (
            <div key={`p${i}`} aria-hidden="true" className="cs-thumb-pending">
              {strings.pending}
            </div>
          ))}
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="dlg-scrim" />
          <Dialog.Content className="dlg-panel cs-lb" onKeyDown={onDialogKey} aria-describedby={undefined}>
            <div className="cs-lb-top">
              <div className="cs-lb-title">
                <Dialog.Title className="eb">{strings.lightboxTitle}</Dialog.Title>
                <span className="cs-lb-count" aria-live="polite">
                  {count(cur)}
                </span>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="btn btn-g">
                  <X width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
                  {strings.close}
                </button>
              </Dialog.Close>
            </div>
            <div
              className="cs-lb-img"
              style={{ background: item.bg, aspectRatio: `${item.full.image.width} / ${item.full.image.height}`, ["--r" as string]: item.full.image.width / item.full.image.height } as CSSProperties}
            >
              <CropImage key={cur} crop={item.full} aspect={false} style={{ width: "100%", height: "100%" }} sizes="(min-width: 1248px) 1152px, 92vw" />
            </div>
            <div className="cs-lb-bottom">
              <p className="cs-cap cs-lb-cap">
                {item.fig} — {item.caption}
              </p>
              <div className="cs-lb-nav">
                <button type="button" className="btn btn-g btn-icon" aria-label={strings.prev} onClick={() => go(cur - 1)}>
                  <ChevronLeft width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button type="button" className="btn btn-g btn-icon" aria-label={strings.next} onClick={() => go(cur + 1)}>
                  <ChevronRight width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
