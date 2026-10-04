"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/src/content/types";

export type LabScreen = {
  id: string;
  image: ImageAsset;
  title: string;
  text: string;
  alt: string;
};

const DWELL = 5000;

/**
 * "Telas reais" of the Órbita lab: whole screenshots (16:10, never cropped) in a window frame that
 * crossfades through the screens on its own (paused on hover/focus and while the lightbox is open),
 * a list to jump to any screen, and a click-to-expand lightbox with prev/next (buttons and ←/→).
 */
export function LabScreens({ screens, labels }: { screens: LabScreen[]; labels: { list: string; open: string; close: string; prev: string; next: string } }) {
  const [cur, setCur] = useState(0);
  const [open, setOpen] = useState(false);
  const [hold, setHold] = useState(false);
  const n = screens.length;
  const go = (i: number) => setCur(((i % n) + n) % n);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = visible && !hold && !open;
  useEffect(() => {
    if (!running || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setCur((c) => (c + 1) % n), DWELL);
    return () => window.clearTimeout(id);
  }, [running, cur, n]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(cur + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(cur - 1);
    }
  };

  const s = screens[cur];

  return (
    <div
      ref={ref}
      className={cn("lab-scr", running && "is-running")}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <ol className="lab-scr-list" aria-label={labels.list}>
        {screens.map((it, i) => (
          <li key={it.id}>
            <button type="button" className="lab-scr-tab" aria-pressed={i === cur} onClick={() => go(i)}>
              <span className="lab-scr-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="lab-scr-tx">
                <b>{it.title}</b>
                <span>{it.text}</span>
              </span>
              <span className="lab-scr-bar" aria-hidden="true">
                <i key={i === cur ? `on${cur}` : "off"} />
              </span>
            </button>
          </li>
        ))}
      </ol>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <div className="lab-scr-win">
          <div className="lab-scr-chrome" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>órbita · {s.title.toLowerCase()}</span>
          </div>
          <Dialog.Trigger asChild>
            <button type="button" className="lab-scr-view" aria-label={`${labels.open}: ${s.title}`}>
              {screens.map((it, i) => (
                <span key={it.id} className={cn("lab-scr-img", i === cur && "is-on")} aria-hidden={i !== cur}>
                  <Image src={it.image.src} width={it.image.width} height={it.image.height} alt={i === cur ? it.alt : ""} sizes="(min-width: 1024px) 760px, 92vw" />
                </span>
              ))}
              <span className="lab-scr-zoom" aria-hidden="true">
                <Maximize2 width={16} height={16} strokeWidth={1.6} />
              </span>
            </button>
          </Dialog.Trigger>
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="dlg-scrim" />
          <Dialog.Content className="dlg-panel lab-lb" onKeyDown={onKey} aria-describedby={undefined}>
            <div className="lab-lb-top">
              <Dialog.Title className="eb">
                {s.title} <span className="lab-lb-c">{`${cur + 1} / ${n}`}</span>
              </Dialog.Title>
              <Dialog.Close asChild>
                <button type="button" className="btn btn-g btn-icon" aria-label={labels.close}>
                  <X width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <div className="lab-lb-img">
              {/* the window's copy (already loaded) shows at once; the sharper one fades in over it */}
              <Image key={`lo-${s.id}`} src={s.image.src} width={s.image.width} height={s.image.height} alt="" aria-hidden sizes="(min-width: 1024px) 760px, 92vw" />
              <Image
                key={`hi-${s.id}`}
                className="lab-lb-hi"
                src={s.image.src}
                width={s.image.width}
                height={s.image.height}
                alt={s.alt}
                sizes="(min-width: 1248px) 1152px, 92vw"
                onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
              />
            </div>
            <div className="lab-lb-bot">
              <p className="lab-lb-tx">{s.text}</p>
              <div className="lab-lb-nav">
                <button type="button" className="btn btn-g btn-icon" aria-label={labels.prev} onClick={() => go(cur - 1)}>
                  <ChevronLeft width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button type="button" className="btn btn-g btn-icon" aria-label={labels.next} onClick={() => go(cur + 1)}>
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
