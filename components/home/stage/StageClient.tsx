"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight, Icon, Pause, Play } from "@/components/ui-v3/Icon";
import { SmartLink } from "@/components/ui-v3/SmartLink";
import { openOrbita } from "@/components/site/orbita-bridge";
import { requestQuotePrefill } from "@/components/quote/quote-bridge";
import type { ProjectSlug } from "@/src/content/types";
import { STAGE_GO_EVENT, type StageGoDetail } from "./stage-bridge";
import type { StageChapterSlots, StageChapterView, StageStrings } from "./types";

/**
 * ProjectStage state machine (v2spec §6.8 + v3spec §4.1 deltas), production version:
 * - 5s dwell autoplay (timer + CSS rail bar share the same pause conditions)
 * - hold on hover / keyboard focus (clock stops, loops keep playing — `.is-held`)
 * - full pause (`.is-paused`): Pause button, reduced motion, tab hidden, stage off-screen
 * - nothing animates before the stage is first seen (`.is-waiting`)
 * - pointer parallax written straight to CSS vars in rAF (fine pointers only, never with reduced motion)
 * - ≥1120px: layered 1440 canvas; below: compact scroll-snap carousel (swipe + ‹ › + bars)
 * - lazy chapters: a chapter's visuals mount when it is active, adjacent, or was visited
 */

const DWELL = 5000;
const TICK = 100;

type Props = {
  chapters: StageChapterView[];
  slots: StageChapterSlots[];
  s: StageStrings;
  /** element rendered once at the top of #projects (the sr-only h2) */
  heading: ReactNode;
};

const cssVars = (v: Record<string, string>) => v as CSSProperties;

export function StageClient({ chapters, slots, s, heading }: Props) {
  const N = chapters.length;

  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [flip, setFlip] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [intro, setIntro] = useState(true);
  const [swiped, setSwiped] = useState(false);
  const [visited, setVisited] = useState<boolean[]>(() => chapters.map((_, i) => i === 0));

  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [fine, setFine] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [touch, setTouch] = useState(false);
  const [visible, setVisible] = useState(false);
  const [seen, setSeen] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [overStack, setOverStack] = useState(false);
  const [rest, setRest] = useState(false);
  const [railWarm, setRailWarm] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLDivElement>(null);
  const vpRef = useRef<HTMLDivElement>(null);
  const deskTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(0);
  const elapsed = useRef(0);
  const timers = useRef<{ out?: number; rest?: number; resume?: number; scroll?: number; touch?: number }>({});
  const raf = useRef(0);
  const ptr = useRef({ x: 0, y: 0 });
  const overRef = useRef(false);
  const programmatic = useRef<number | null>(null);

  /* ---------------------------------------------------------------- navigation */
  const go = useCallback(
    (target: number, user: boolean, bySwipe = false) => {
      const i = ((target % N) + N) % N;
      const a = activeRef.current;
      elapsed.current = 0;
      if (i === a) return;
      activeRef.current = i;
      window.clearTimeout(timers.current.out);
      setPrev(a);
      setActive(i);
      setIntro(false);
      setFlip((f) => !f);
      setSwiped(bySwipe);
      setAnnounce(user ? chapters[i].label : "");
      setVisited((v) => (v[i] ? v : v.map((x, k) => x || k === i)));
      timers.current.out = window.setTimeout(() => setPrev(-1), 420);
    },
    [N, chapters],
  );

  /* ---------------------------------------------------------------- external chapter requests (hero satellites) */
  useEffect(() => {
    const onGo = (e: Event) => {
      const index = (e as CustomEvent<StageGoDetail>).detail?.index;
      if (typeof index === "number" && Number.isFinite(index)) go(index, true);
    };
    window.addEventListener(STAGE_GO_EVENT, onGo);
    return () => window.removeEventListener(STAGE_GO_EVENT, onGo);
  }, [go]);

  /* ---------------------------------------------------------------- environment */
  useEffect(() => {
    let rm = false;
    let fp = false;
    try {
      rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      fp = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    } catch {
      /* old browsers: defaults */
    }
    setFine(fp);
    if (rm) {
      setReduced(true);
      setPaused(true);
      setIntro(false);
    }
    const onVis = () => setDocHidden(document.visibilityState === "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    const t = timers.current;
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      Object.values(t).forEach((id) => window.clearTimeout(id));
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---------------------------------------------------------------- autoplay clock */
  const held = hover || focus || touch;
  const running = !paused && !held && visible && !docHidden;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      elapsed.current += TICK;
      if (elapsed.current >= DWELL) go(activeRef.current + 1, false);
    }, TICK);
    return () => window.clearInterval(id);
  }, [running, go]);

  /* ---------------------------------------------------------------- mobile track sync */
  useEffect(() => {
    const vp = vpRef.current;
    if (!vp || vp.offsetParent === null) return;
    const w = vp.clientWidth;
    if (!w) return;
    const left = active * w;
    if (Math.abs(vp.scrollLeft - left) > 2) {
      programmatic.current = active;
      vp.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
    }
  }, [active, reduced]);

  const onTrackScroll = () => {
    window.clearTimeout(timers.current.scroll);
    timers.current.scroll = window.setTimeout(() => {
      const vp = vpRef.current;
      if (!vp || !vp.clientWidth) return;
      const idx = Math.max(0, Math.min(N - 1, Math.round(vp.scrollLeft / vp.clientWidth)));
      if (programmatic.current !== null) {
        const target = programmatic.current;
        programmatic.current = null;
        if (idx === target) return;
      }
      if (idx !== activeRef.current) go(idx, true, true);
    }, 120);
  };

  /* ---------------------------------------------------------------- pointer (desktop) */
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || !fine || e.pointerType !== "mouse") return;
    ptr.current = { x: e.clientX, y: e.clientY };
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const sec = deskRef.current;
      const cv = cvRef.current;
      if (!sec || !cv) return;
      const r = cv.getBoundingClientRect();
      if (!r.width) return;
      const k = 1440 / r.width;
      const { x, y } = ptr.current;
      const mx = Math.max(-1, Math.min(1, ((x - r.left) / r.width) * 2 - 1));
      const my = Math.max(-1, Math.min(1, ((y - r.top) / r.height) * 2 - 1));
      sec.style.setProperty("--mx", mx.toFixed(3));
      sec.style.setProperty("--my", my.toFixed(3));
      sec.style.setProperty("--cx", `${Math.round((x - r.left) * k)}px`);
      sec.style.setProperty("--cy", `${Math.round((y - r.top) * k)}px`);
    });
  };
  const onPointerEnter = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timers.current.resume);
    setHover(true);
  };
  const onPointerLeave = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const sec = deskRef.current;
    if (sec) {
      sec.style.setProperty("--mx", "0");
      sec.style.setProperty("--my", "0");
    }
    overRef.current = false;
    setOverStack(false);
    setRest(true);
    window.clearTimeout(timers.current.rest);
    timers.current.rest = window.setTimeout(() => setRest(false), 700);
    window.clearTimeout(timers.current.resume);
    timers.current.resume = window.setTimeout(() => setHover(false), 400);
  };
  const onPointerOver = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const over = !!(e.target as Element).closest?.(".ch.is-active .stack-link");
    if (over !== overRef.current) {
      overRef.current = over;
      setOverStack(over);
    }
  };

  /* ---------------------------------------------------------------- focus hold (keyboard only) */
  const onFocus = (e: FocusEvent<HTMLElement>) => {
    let kb = true;
    try {
      kb = (e.target as Element).matches(":focus-visible");
    } catch {
      kb = true;
    }
    if (kb) setFocus(true);
  };
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false);
  };

  /* ---------------------------------------------------------------- touch hold (mobile) */
  const onTouchStart = () => {
    window.clearTimeout(timers.current.touch);
    setTouch(true);
  };
  const onTouchEnd = () => {
    window.clearTimeout(timers.current.touch);
    timers.current.touch = window.setTimeout(() => setTouch(false), 400);
  };

  /* ---------------------------------------------------------------- delegated link behaviour */
  const onClick = (e: MouseEvent<HTMLElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest?.("a");
    if (!a) return;
    const ref = a.getAttribute("data-quote-ref");
    if (ref) {
      e.preventDefault();
      requestQuotePrefill({ ref: ref as ProjectSlug });
      return;
    }
    if (a.hasAttribute("data-open-orbita")) {
      e.preventDefault();
      openOrbita({ source: "stage", returnFocus: a });
    }
  };

  /* ---------------------------------------------------------------- tabs keyboard */
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number, list: "desk" | "mob") => {
    let n: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % N;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + N) % N;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = N - 1;
    if (n === null) return;
    e.preventDefault();
    go(n, true);
    (list === "desk" ? deskTabs : mobTabs).current[n]?.focus();
  };

  const togglePause = () => {
    setPaused((p) => !p);
    setIntro(false);
  };

  /* ---------------------------------------------------------------- render values */
  const a = active;
  const c = chapters[a];
  const xab = flip ? "xa" : "xb";
  const stopped = reduced || paused || !visible || docHidden;
  const mounted = (i: number) => visited[i] || i === a || i === (a + 1) % N || i === (a - 1 + N) % N;
  const chCls = (i: number) => (i === a ? "ch is-active" : i === prev ? "ch is-out" : "ch");
  const bar = (i: number) => (reduced ? (i === a ? "bar is-still" : "bar") : i === a ? "bar is-active" : i < a ? "bar is-past" : "bar");
  const pauseLabel = paused ? (reduced ? s.play : s.resume) : s.pause;
  const common =
    (stopped ? " is-paused" : "") + (held ? " is-held" : "") + (intro ? " is-intro" : "") + (seen ? "" : " is-waiting");
  const lights = chapters.map((ch, i) => (
    <div key={ch.slug} className={i === a ? "light is-on" : "light"} style={cssVars({ "--L": ch.light })} />
  ));

  const cta = (mobile: boolean) => {
    const inner = (
      <>
        <span className={xab}>{c.cta.label}</span>
        {mobile ? <span className="sr">: {c.fullName}</span> : null} <span className="arr" aria-hidden="true">→</span>
      </>
    );
    return c.cta.kind === "case" ? (
      <SmartLink href={c.cta.href} className="btn btn-p">
        {inner}
      </SmartLink>
    ) : (
      <a href={`?tipo=${c.slug}#cotacao`} data-quote-ref={c.slug} className="btn btn-p">
        {inner}
      </a>
    );
  };
  const ext = c.ext ? (
    <a className="qlnk ext ext-lnk" href={c.ext.href} target="_blank" rel="noopener noreferrer" aria-label={c.ext.aria}>
      <span className={xab}>
        {c.ext.label} <span className="arr">↗</span>
      </span>
    </a>
  ) : (
    <span className={`${xab} priv`}>{s.privateCode}</span>
  );
  const pauseBtn = (
    <button type="button" className="btn btn-g btn-icon" aria-pressed={paused} aria-label={pauseLabel} onClick={togglePause}>
      <span className="icw" aria-hidden="true">
        <Icon icon={Pause} className={paused ? "ic is-off" : "ic"} />
        <Icon icon={Play} className={paused ? "ic" : "ic is-off"} />
      </span>
    </button>
  );
  const roll = (
    <span className={`roll ${flip ? "roll-a" : "roll-b"}`}>
      <span>{c.num}</span>
    </span>
  );

  return (
    <div id="projects" ref={rootRef} className="ps">
      {heading}
      <span className="stage-edge" aria-hidden="true" style={{ top: 0 }} />

      {/* ============ desktop ≥1120: layered 1440×920 canvas ============ */}
      <section
        ref={deskRef}
        className={"ps-d stage on-stage" + common + (overStack ? " is-over-stack" : "") + (rest ? " is-rest" : "")}
        aria-roledescription={s.roledescription}
        aria-label={s.ariaLabel}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        onPointerOver={onPointerOver}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
      >
        <div className="ps-cv ps-lights" aria-hidden="true">
          {lights}
        </div>
        <div className="vignette" aria-hidden="true" />
        <div className="ps-cv" ref={cvRef}>
          {chapters.map((ch, i) => (
            <div
              key={ch.slug}
              id={`ps-ch-${i + 1}`}
              className={chCls(i)}
              role="tabpanel"
              aria-roledescription={s.slideRoledescription}
              aria-label={ch.label}
              aria-hidden={i !== a}
              inert={i !== a}
              style={cssVars({ "--L": ch.light })}
            >
              {slots[i].deskText}
              {mounted(i) ? slots[i].deskStack : null}
            </div>
          ))}

          <div className="ps-top">
            <p className="ps-top-l">
              <b>{s.topNum}</b>
              {s.topRest}
            </p>
            <div className="ps-top-r">
              <span className={(paused || held) && !reduced ? "pchip is-on" : "pchip"} aria-hidden="true">
                {s.paused}
              </span>
              <span className="ps-count">
                <span className="sr">{s.counterSr} </span>
                {roll}
                <span> / {s.total}</span>
              </span>
              {pauseBtn}
              <a className="qlnk dn all-lnk" href="#todos-os-produtos">
                {s.allProducts} <span className="arr">↓</span>
              </a>
            </div>
          </div>

          <div className="ps-acts">
            {cta(false)}
            {ext}
          </div>

          <div
            role="tablist"
            aria-label={s.railAria}
            className="ps-rail"
            onPointerEnter={() => setRailWarm(true)}
            onFocus={() => setRailWarm(true)}
          >
            {chapters.map((ch, i) => (
              <button
                key={ch.slug}
                ref={(el) => {
                  deskTabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`ps-tab-${i + 1}`}
                className="ri"
                aria-selected={i === a}
                aria-controls={`ps-ch-${i + 1}`}
                tabIndex={i === a ? 0 : -1}
                style={cssVars({ "--L": ch.light })}
                onClick={() => go(i, true)}
                onKeyDown={(e) => onTabKey(e, i, "desk")}
              >
                <span className={bar(i)}>
                  <i />
                </span>
                <span className="ri-peek" aria-hidden="true">
                  {railWarm ? slots[i].peek : null}
                </span>
                <span className="ri-row">
                  <span className="ri-num">{ch.num}</span>
                  <span className="ri-name">{ch.railName}</span>
                </span>
                <span className="ri-desc">{ch.railDesc}</span>
              </button>
            ))}
          </div>

          <div className="cursor-label" aria-hidden="true">
            {c.cta.cursor}
          </div>
        </div>
        <p className="sr" aria-live="polite">
          {announce}
        </p>
      </section>

      {/* ============ < 1120: compact carousel (v3 §6.3) ============ */}
      <section
        className={"ps-m stage on-stage m-stage" + common + (swiped ? " is-swiped" : "")}
        aria-roledescription={s.roledescription}
        aria-label={s.ariaLabel}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {lights}
        <div className="vignette" aria-hidden="true" />
        <div className="m-col">
          <div className="sbars" role="tablist" aria-label={s.railAria}>
            {chapters.map((ch, i) => (
              <button
                key={ch.slug}
                ref={(el) => {
                  mobTabs.current[i] = el;
                }}
                type="button"
                role="tab"
                className="sb"
                aria-selected={i === a}
                aria-controls={`ps-m-ch-${i + 1}`}
                aria-label={ch.label}
                tabIndex={i === a ? 0 : -1}
                style={cssVars({ "--L": ch.light })}
                onClick={() => go(i, true)}
                onKeyDown={(e) => onTabKey(e, i, "mob")}
              >
                <span className={bar(i)}>
                  <i />
                </span>
              </button>
            ))}
          </div>
          <div className="srow">
            <p className="srow-l">
              <b>{s.topNum}</b>
              <span className="lbl">{s.topRest.split(" · ")[0]} ·</span>{" "}
              <span className="cn">
                <span className="sr">{s.counterSr} </span>
                {roll} / {s.total}
              </span>
            </p>
            <div className="sbtns">
              <button type="button" className="btn btn-g btn-icon" aria-label={s.prev} onClick={() => go(activeRef.current - 1, true)}>
                <Icon icon={ChevronLeft} />
              </button>
              <button type="button" className="btn btn-g btn-icon" aria-label={s.next} onClick={() => go(activeRef.current + 1, true)}>
                <Icon icon={ChevronRight} />
              </button>
              {pauseBtn}
            </div>
          </div>
        </div>

        <div className="m-body">
          <div className="m-vp" ref={vpRef} onScroll={onTrackScroll}>
            <div className="m-track">
              {chapters.map((ch, i) => (
                <div
                  key={ch.slug}
                  id={`ps-m-ch-${i + 1}`}
                  className={i === a ? "ch slide is-active" : "ch slide"}
                  role="tabpanel"
                  aria-roledescription={s.slideRoledescription}
                  aria-label={ch.label}
                  aria-hidden={i !== a}
                  inert={i !== a}
                  style={cssVars({ "--L": ch.light })}
                >
                  <div className="m-sl">
                    {mounted(i) ? slots[i].mobVisual : <div className="vz" />}
                    {slots[i].mobText}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sdots" aria-hidden="true">
            {chapters.map((ch, i) => (
              <button
                key={ch.slug}
                type="button"
                tabIndex={-1}
                className={i === a ? "sd is-on" : "sd"}
                style={cssVars({ "--L": ch.light })}
                onClick={() => go(i, true)}
              >
                <i />
              </button>
            ))}
          </div>
        </div>

        <div className="m-col">
          <div className="scta">
            {cta(true)}
            {ext}
          </div>
        </div>
        <p className="sr" aria-live="polite">
          {announce}
        </p>
      </section>
      <span className="stage-edge" aria-hidden="true" style={{ bottom: 0 }} />
    </div>
  );
}
