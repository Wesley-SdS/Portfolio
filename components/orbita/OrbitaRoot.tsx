"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { useOrbitaListener, type OrbitaAsk, type OrbitaOpenDetail } from "@/components/site/orbita-bridge";
import { ORBITA_PANEL_ID } from "@/src/content/orbita";
import { cn } from "@/lib/utils";
import { OrbitaChat, type OrbitaChatHandle } from "./OrbitaChat";
import { OrbitaMark } from "./OrbitaMark";
import { useMedia, useReducedMotion } from "./hooks";

/** In-content areas the floating launcher must never cover: the stage, the quote form (its step buttons sit
 * bottom-right) and anything marked [data-orbita-avoid]. */
const AVOID_SELECTOR = "#projects, #cotacao, [data-orbita-avoid]";

/**
 * <OrbitaRoot> — mounted once in app/[locale]/layout.tsx (v3spec §5.11, §6.5, §8.5).
 *  - the floating "Pergunte à Órbita" pill (glowing accent border, mini orb), fixed bottom-right;
 *    it steps away while the chat is open or while it would cover in-content controls.
 *  - ≥768px: a full-height drawer on the right (470px) over a blurred scrim.
 *  - <768px: a bottom sheet with a grabber that closes it, plus scroll lock.
 *  Both are modal dialogs (aria-modal="true", focus trap; the scrim closes them).
 * Opens from any trigger through the bridge (components/site/orbita-bridge.ts).
 * Esc / "Fechar" / launcher close and return focus to the opener. The chat mounts on
 * first open and keeps its conversation while closed.
 */
export function OrbitaRoot() {
  const t = useTranslations("orbita");
  const isDesktop = useMedia("(min-width: 768px)");
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unread, setUnread] = useState(false);
  const [away, setAway] = useState(false);
  const pathname = usePathname();

  const openRef = useRef(false);
  openRef.current = open;
  const chatRef = useRef<OrbitaChatHandle>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** mobile bottom sheet (the desktop drawer is the default shape) */
  const sheet = isDesktop === false;

  const pendingAsk = useRef<OrbitaAsk | null>(null);
  const [askTick, setAskTick] = useState(0);

  const doOpen = useCallback((detail: OrbitaOpenDetail = {}) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    returnFocus.current = detail.returnFocus ?? null;
    if (detail.ask && (detail.ask.text || detail.ask.chip)) {
      pendingAsk.current = detail.ask;
      setAskTick((n) => n + 1);
    }
    setMounted(true);
    setClosing(false);
    setOpen(true);
    setUnread(false);
  }, []);

  /* hand a first message (hero ask box) to the chat once it is mounted; the chat queues it until it has greeted */
  useEffect(() => {
    if (!mounted || !pendingAsk.current) return;
    const id = requestAnimationFrame(() => {
      const ask = pendingAsk.current;
      if (!ask || !chatRef.current) return;
      pendingAsk.current = null;
      chatRef.current.ask(ask);
    });
    return () => cancelAnimationFrame(id);
  }, [mounted, askTick]);

  const doClose = useCallback(() => {
    if (!openRef.current) return;
    setOpen(false);
    setClosing(true);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setClosing(false), reduced ? 0 : 300);
    const back = returnFocus.current && document.contains(returnFocus.current) ? returnFocus.current : null;
    (back ?? launcherRef.current)?.focus({ preventScroll: true });
  }, [reduced]);

  useOrbitaListener(doOpen, doClose);

  /*
   * Keep the floating launcher off in-content controls: while the project stage (#projects; on desktop
   * only its bottom 200px — rail + CTAs) or any [data-orbita-avoid] element reaches the bottom strip where
   * the launcher/FAB sits, the launcher steps away (fade + slide, not focusable) and returns when clear.
   */
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const h = window.innerHeight;
      const zoneTop = h - 112;
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      let hit = false;
      document.querySelectorAll<HTMLElement>(AVOID_SELECTOR).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.height) return;
        // desktop stage: only its bottom band (chapter rail + CTAs) collides with the pill;
        // mobile: the whole island (controls at the top, CTA/links at the bottom)
        const top = desktop && el.id === "projects" ? r.bottom - 200 : r.top;
        if (top < h && r.bottom > zoneTop) hit = true;
      });
      setAway(hit);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    const late = setTimeout(check, 600);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(late);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  /* focus on open (§8.5): first chip if showing, else the composer */
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => chatRef.current?.focusEntry()));
    return () => cancelAnimationFrame(id);
  }, [open]);

  /* Esc closes (drawer and sheet) */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      doClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, doClose]);

  /* mobile sheet: scroll lock */
  useEffect(() => {
    if (!open || !sheet) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [open, sheet]);

  /* focus trap (drawer and sheet) */
  const trap = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const f = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const visible = open || closing;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={cn("orb-launch", (open || away) && "is-away")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={ORBITA_PANEL_ID}
        tabIndex={open || away ? -1 : undefined}
        onClick={() => doOpen({ source: "launcher", returnFocus: launcherRef.current })}
      >
        <OrbitaMark size={26} className="fab-mark" />
        <span className="fab-l">{t("launcher.title")}</span>
        {unread && (
          <>
            <span className="fab-badge" aria-hidden="true">
              1
            </span>
            <span className="sr">{t("launcher.unread")}</span>
          </>
        )}
      </button>

      <div className={cn("orb-scrim", open && "is-open")} hidden={!visible} aria-hidden="true" onClick={doClose} />

      <div
        ref={panelRef}
        id={ORBITA_PANEL_ID}
        role="dialog"
        aria-modal="true"
        aria-label={t("panelAria")}
        className={cn("orb-panel", sheet && "is-sheet", open && "is-open", closing && "is-closing")}
        hidden={!visible}
        onKeyDown={trap}
      >
        {sheet && (
          <button type="button" className="grab" aria-label={t("launcher.close")} onClick={doClose}>
            <i />
          </button>
        )}
        {mounted && (
          <OrbitaChat
            ref={chatRef}
            variant={sheet ? "sheet" : "panel"}
            active={mounted}
            onClose={doClose}
            onOrbitaMessage={() => {
              if (!openRef.current) setUnread(true);
            }}
          />
        )}
      </div>
    </>
  );
}
