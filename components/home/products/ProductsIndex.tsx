"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Icon, Search, SmartLink, X } from "@/components/ui-v3";
import type { ProductLight, ProjectCategory } from "@/src/content/types";

/** Growth stage of a project (the "tree" status of the original site): sprout → sapling → tree. */
export type Stage = "sprout" | "sapling" | "tree";

export interface IndexRow {
  slug: string;
  category: ProjectCategory;
  name: string;
  oneLiner: string;
  /** one verifiable number ("" when the project has none) */
  highlight: string;
  /** "2026", "2025–2026" */
  year: string;
  /** "Produto próprio · IA" */
  type: string;
  stage: Stage;
  statusLabel: string;
  light: ProductLight | null;
  kind: "case" | "gh" | "none";
  href: string | null;
  linkLabel: string;
  /** haystack for the live search */
  search: string;
}

type Cat = "all" | ProjectCategory;

export interface ProductsIndexProps {
  rows: IndexRow[];
  chips: { id: Cat; label: string; count: number }[];
  total: number;
  /** one server-rendered preview per row (same order), null when the project has no screen */
  previews: (ReactNode | null)[];
  stages: Record<Stage, string>;
}

const CATS: Cat[] = ["all", "ai", "messaging", "fintech", "custom"];

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const isCat = (v: string | null): v is Cat => v !== null && (CATS as string[]).includes(v);

/** Hand-drawn growth glyphs (16×16, stroke = currentColor). */
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

/**
 * <ProductsIndex> — the filterable index of every product and project.
 * - category tabs synced to `?cat=` (history.replaceState), live accent-insensitive search ("/" focuses, Esc clears)
 * - rows slide to their new slot inside a fixed box; filtered-out rows fade and leave the tab order
 * - each row is one link (case study or external), with its growth stage (sprout · sapling · tree)
 * - at ≥1024 with a fine pointer, the project's screen floats beside the cursor (rows that have one)
 */
export function ProductsIndex({ rows, chips, total, previews, stages }: ProductsIndexProps) {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const countId = useId();
  const searchId = useId();

  const [cat, setCat] = useState<Cat>("all");
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState(-1);
  const [last, setLast] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const pvRef = useRef<HTMLDivElement>(null);
  const ysRef = useRef<number[]>(rows.map((_, i) => i));

  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("cat");
      if (isCat(fromUrl)) setCat(fromUrl);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const input = inputRef.current;
      if (!input || input.offsetParent === null) return;
      e.preventDefault();
      input.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const pickCat = useCallback((next: Cat) => {
    setCat(next);
    setHover(-1);
    try {
      const url = new URL(window.location.href);
      if (next === "all") url.searchParams.delete("cat");
      else url.searchParams.set("cat", next);
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    } catch {
      /* ignore */
    }
  }, []);

  const terms = useMemo(() => norm(query).split(/\s+/).filter(Boolean), [query]);

  const { slots, shown } = useMemo(() => {
    let s = 0;
    const out = rows.map((r) => {
      const inCat = cat === "all" || r.category === cat;
      const hay = norm(r.search);
      return inCat && terms.every((term) => hay.includes(term)) ? s++ : -1;
    });
    out.forEach((slot, i) => {
      if (slot >= 0) ysRef.current[i] = slot;
    });
    return { slots: out, shown: s };
  }, [rows, cat, terms]);

  /* the floating preview follows the pointer without re-rendering (CSS vars on the node) */
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const pv = pvRef.current;
    if (!pv) return;
    pv.style.setProperty("--mx", `${e.clientX}px`);
    pv.style.setProperty("--my", `${e.clientY}px`);
  };

  const enter = (i: number) => {
    if (slots[i] < 0) return;
    setHover(i);
    if (previews[i]) setLast(i);
  };

  const clearAll = () => {
    setQuery("");
    pickCat("all");
    inputRef.current?.focus();
  };

  const [countA, countB] = t("shown", { shown: "\u0000", total }).split("\u0000");
  const showPv = hover >= 0 && previews[hover] != null;

  return (
    <>
      <div className="px-ctl">
        <div role="group" aria-label={t("filterAria")} className="px-tabs">
          {chips.map((c) => (
            <button key={c.id} type="button" className="px-tab" aria-pressed={cat === c.id} onClick={() => pickCat(c.id)}>
              {c.label}
              <sup>{c.count}</sup>
            </button>
          ))}
        </div>
        <div className="px-search" role="search">
          <label htmlFor={searchId} className="sr">
            {t("search.label")}
          </label>
          <Icon icon={Search} size={15} className="px-search-ic" />
          <input
            ref={inputRef}
            id={searchId}
            className="px-srch"
            type="search"
            name="q"
            autoComplete="off"
            spellCheck={false}
            placeholder={t("search.placeholder")}
            value={query}
            aria-describedby={countId}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                e.preventDefault();
                setQuery("");
              }
            }}
          />
          {query ? (
            <button
              type="button"
              className="px-clear"
              aria-label={t("search.clear")}
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              <Icon icon={X} size={14} />
            </button>
          ) : (
            <kbd className="kbd px-kbd" aria-hidden="true">
              /
            </kbd>
          )}
        </div>
      </div>

      <p className="px-legend" aria-hidden="true">
        {(["sprout", "sapling", "tree"] as const).map((s, i) => (
          <span key={s} className="px-leg">
            {i > 0 ? <span className="px-leg-arr">→</span> : null}
            <StageGlyph stage={s} />
            {stages[s]}
          </span>
        ))}
      </p>

      <div className="px-list" onMouseMove={onMove} onMouseLeave={() => setHover(-1)}>
        <div className="px-box" role="list" aria-label={t("tableAria")} aria-describedby={countId} style={{ ["--n" as string]: Math.max(shown, 1) } as CSSProperties}>
          {rows.map((r, i) => {
            const vis = slots[i] >= 0;
            const hasLink = r.kind !== "none" && r.href !== null;
            const linkSr = r.kind === "case" ? `, ${r.linkLabel}` : r.kind === "gh" ? `, ${r.linkLabel} ${tc("opensInNewTab")}` : "";
            const body = (
              <>
                <span className="px-n" aria-hidden="true">
                  {String((vis ? slots[i] : 0) + 1).padStart(2, "0")}
                </span>
                <span className="px-main">
                  <span className="px-name">
                    <span className="px-name-t">{r.name}</span>
                    {r.light ? <i className="px-dot" aria-hidden="true" style={{ background: `rgb(var(--l-${r.light}))` }} /> : null}
                  </span>
                  <span className="px-desc">{r.oneLiner}</span>
                  <span className="px-type">{r.type}</span>
                </span>
                <span className="px-hi">{r.highlight}</span>
                <span className={cn("px-stage", `is-${r.stage}`)}>
                  <StageGlyph stage={r.stage} />
                  <span>{r.statusLabel}</span>
                </span>
                <span className="px-yr">{r.year}</span>
                <span className={cn("px-go", !hasLink && "is-off")} aria-hidden="true">
                  {hasLink ? (r.kind === "case" ? "→" : "↗") : ""}
                </span>
                {hasLink ? <span className="sr">{linkSr}</span> : null}
              </>
            );
            return (
              <div
                key={r.slug}
                role="listitem"
                className={cn("px-row", !vis && "is-hidden", hover === i && "is-hover")}
                aria-hidden={vis ? undefined : true}
                style={{ ["--slot" as string]: ysRef.current[i], ["--i" as string]: vis ? slots[i] : 0 } as CSSProperties}
                onMouseEnter={() => enter(i)}
              >
                {hasLink ? (
                  <SmartLink className="px-a" href={r.href!} tabIndex={vis ? undefined : -1} onFocus={() => enter(i)} onBlur={() => setHover(-1)}>
                    {body}
                  </SmartLink>
                ) : (
                  <div className="px-a is-static">{body}</div>
                )}
              </div>
            );
          })}
          {shown === 0 ? (
            <div className="px-empty">
              <p className="h4">{t("empty.title")}</p>
              <button type="button" className="btn btn-s btn-sm" onClick={clearAll}>
                {t("empty.clear")}
              </button>
            </div>
          ) : null}
        </div>
        <p id={countId} className="meta px-count" aria-live="polite">
          {countA}
          {shown}
          {countB}
        </p>

        {/* floating screen beside the cursor (decorative; the row carries the information) */}
        <div ref={pvRef} className={cn("px-pv", showPv && "is-on")} aria-hidden="true">
          {previews.map((node, i) =>
            node ? (
              <div key={rows[i]?.slug ?? i} className={cn("px-pv-l", last === i && "is-on")}>
                {node}
              </div>
            ) : null,
          )}
        </div>
      </div>
    </>
  );
}
