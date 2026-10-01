"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Chip, Icon, Search, SmartLink, X } from "@/components/ui-v3";
import type { ProductLight, ProjectCategory, StatusShape } from "@/src/content/types";

export interface IndexRow {
  slug: string;
  category: ProjectCategory;
  name: string;
  oneLiner: string;
  highlight: string;
  period: string;
  /** mobile line 2: "2026 · IA & Agentes · Em desenvolvimento" */
  mobileMeta: string;
  statusLabel: string;
  statusShape: StatusShape;
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
  /** one server-rendered preview layer per row (same order) */
  previews: ReactNode[];
}

const ROW_H_DESKTOP = 72;
const CATS: Cat[] = ["all", "ai", "messaging", "fintech", "custom"];

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const isCat = (v: string | null): v is Cat => v !== null && (CATS as string[]).includes(v);

/**
 * <ProductsIndex> — the filterable index (v3spec §5.5 / v2 §7.6 recipe).
 * - chips (aria-pressed) synced to `?cat=` with history.replaceState (no navigation)
 * - live search (accent-insensitive, every term must match); "/" focuses it, Esc clears
 * - rows slide to their new slot (`--slot` × row height) inside a fixed `.ix-box`;
 *   filtered-out rows fade, keep their last slot and leave the tab order + a11y tree
 * - floating `.pv` preview follows the hovered/focused row at ≥1024 (pvX parallax off under reduced motion)
 */
export function ProductsIndex({ rows, chips, total, previews }: ProductsIndexProps) {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const countId = useId();
  const searchId = useId();

  const [cat, setCat] = useState<Cat>("all");
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState(-1);
  const [lastRow, setLastRow] = useState(0);
  const [pvX, setPvX] = useState(0);
  const [pvY, setPvY] = useState(0);
  const [flip, setFlip] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const pvRef = useRef<HTMLDivElement>(null);
  const lastMove = useRef(0);
  const reduced = useRef(false);
  const ysRef = useRef<number[]>(rows.map((_, i) => i));
  const first = useRef(true);

  /* ?cat= → state on mount; reduced-motion flag */
  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("cat");
      if (isCat(fromUrl)) setCat(fromUrl);
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      /* ignore */
    }
  }, []);

  /* "/" focuses the search (unless typing somewhere) */
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

  /* slots: matching rows get 0..n-1; hidden rows keep their last slot (they fade in place) */
  const { slots, shown } = useMemo(() => {
    let s = 0;
    const out = rows.map((r) => {
      const inCat = cat === "all" || r.category === cat;
      const hay = norm(r.search);
      const hit = inCat && terms.every((term) => hay.includes(term));
      return hit ? s++ : -1;
    });
    out.forEach((slot, i) => {
      if (slot >= 0) ysRef.current[i] = slot;
    });
    return { slots: out, shown: s };
  }, [rows, cat, terms]);

  /* roll the count digits on change (not on first render) */
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setFlip((f) => !f);
  }, [shown]);

  const placePreview = useCallback(
    (i: number) => {
      const slot = slots[i] >= 0 ? slots[i] : 0;
      const colH = colRef.current?.offsetHeight ?? 832;
      const pvH = pvRef.current?.offsetHeight ?? 257;
      setPvY(Math.max(0, Math.min(colH - pvH, 40 + slot * ROW_H_DESKTOP - 96)));
    },
    [slots],
  );

  const enterRow = (i: number) => {
    if (slots[i] < 0) return;
    setHover(i);
    setLastRow(i);
    placePreview(i);
  };

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced.current) return;
    const now = Date.now();
    if (now - lastMove.current < 32) return;
    lastMove.current = now;
    const r = e.currentTarget.getBoundingClientRect();
    if (!r.width) return;
    const px = Math.round((((e.clientX - r.left) / r.width) * 2 - 1) * 40);
    setPvX(px);
  };

  const onBlurTable = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHover(-1);
  };

  const clearAll = () => {
    setQuery("");
    pickCat("all");
    inputRef.current?.focus();
  };

  const [countA, countB] = t("shown", { shown: "\u0000", total }).split("\u0000");

  return (
    <>
      {/* controls */}
      <div className="prod-ctl">
        <div role="group" aria-label={t("filterAria")} className="prod-chips">
          {chips.map((c) => (
            <Chip key={c.id} pressed={cat === c.id} count={c.count} onClick={() => pickCat(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="prod-search" role="search">
          <label htmlFor={searchId} className="sr">
            {t("search.label")}
          </label>
          <Icon icon={Search} size={16} className="prod-search-ic" />
          <input
            ref={inputRef}
            id={searchId}
            className="srch"
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
              className="btn btn-g prod-clear"
              aria-label={t("search.clear")}
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              <Icon icon={X} size={16} />
            </button>
          ) : (
            <kbd className="kbd prod-kbd" aria-hidden="true">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* body */}
      <div className="prod-body">
        <div className="prod-table" onMouseMove={onMove} onMouseLeave={() => setHover(-1)} onBlur={onBlurTable}>
          <div role="table" aria-label={t("tableAria")} aria-describedby={countId}>
            <div role="rowgroup" className="ix-headgroup">
              <div role="row" className="ix-cols ix-head">
                <span role="columnheader" className="eb">
                  {t("columns.period")}
                </span>
                <span role="columnheader" className="eb">
                  {t("columns.project")}
                </span>
                <span role="columnheader" className="eb">
                  {t("columns.highlight")}
                </span>
                <span role="columnheader" className="eb">
                  {t("columns.status")}
                </span>
                <span role="columnheader" className="eb ix-head-link">
                  {t("columns.link")}
                </span>
              </div>
            </div>
            <div role="rowgroup" className="ix-box">
              {rows.map((r, i) => {
                const vis = slots[i] >= 0;
                const hasLink = r.kind !== "none" && r.href !== null;
                const glyph = r.kind === "case" ? "→" : r.kind === "gh" ? "↗" : "";
                const linkSr =
                  r.kind === "case" ? `, ${r.linkLabel}` : r.kind === "gh" ? `, ${r.linkLabel} ${tc("opensInNewTab")}` : "";
                return (
                  <div
                    key={r.slug}
                    role="row"
                    className={cn("ix-row", `k-${r.kind}`, !vis && "is-hidden")}
                    aria-hidden={vis ? undefined : true}
                    style={{ ["--slot" as string]: ysRef.current[i], ["--i" as string]: vis ? slots[i] : 0 } as CSSProperties}
                    onMouseEnter={() => enterRow(i)}
                  >
                    <span role="cell" className="ix-per">
                      {r.period}
                    </span>
                    <span role="cell" className="ix-proj">
                      <span className="ix-nm">
                        {r.light ? (
                          <span
                            className="pdot"
                            aria-hidden="true"
                            style={{ background: `rgb(var(--l-${r.light}))` }}
                          />
                        ) : null}
                        {hasLink ? (
                          <SmartLink
                            className="ix-name"
                            href={r.href!}
                            tabIndex={vis ? undefined : -1}
                            onFocus={() => enterRow(i)}
                          >
                            {r.name}
                            <span className="sr">{linkSr}</span>
                          </SmartLink>
                        ) : (
                          <span className="ix-name">{r.name}</span>
                        )}
                      </span>
                      <span className="ix-desc" title={r.oneLiner}>
                        {r.oneLiner}
                      </span>
                      <span className="ix-mmeta">{r.mobileMeta}</span>
                    </span>
                    <span role="cell" className="ix-hi">
                      {r.highlight}
                    </span>
                    <span role="cell" className="ix-st">
                      <span className="tag tag-s">
                        <span
                          className={cn("dot", r.statusShape === "ring" && "dot-ring")}
                          aria-hidden="true"
                          style={{ color: r.statusShape === "ok" ? "var(--ok)" : "var(--accent)" }}
                        />
                        {r.statusLabel}
                      </span>
                    </span>
                    <span role="cell" className="ix-link">
                      {hasLink ? (
                        <span aria-hidden="true">
                          <span className="ix-lbl">{r.linkLabel} </span>
                          <span className={cn("arr", r.kind === "case" ? "a-int" : "a-ext")}>{glyph}</span>
                        </span>
                      ) : (
                        <span className="ix-none">{r.linkLabel}</span>
                      )}
                    </span>
                  </div>
                );
              })}
              {shown === 0 ? (
                <div className="ix-empty">
                  <p className="h4">{t("empty.title")}</p>
                  <button type="button" className="btn btn-s btn-sm" onClick={clearAll}>
                    {t("empty.clear")}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          <p id={countId} className="meta prod-count" aria-live="polite">
            {countA}
            <span className={cn("roll", flip ? "roll-a" : "roll-b")}>
              <span>{shown}</span>
            </span>
            {countB}
          </p>
        </div>

        {/* preview column (≥1024, pointer only) */}
        <div className="prod-pvcol" aria-hidden="true" ref={colRef}>
          <p className={cn("ph", hover >= 0 && "is-off")}>{t("previewHint")}</p>
          <div
            ref={pvRef}
            className={cn("pv", hover >= 0 && "is-on")}
            style={{ ["--py" as string]: `${pvY}px`, ["--px" as string]: `${hover >= 0 ? pvX : 0}px` } as CSSProperties}
          >
            {previews.map((node, i) => (
              <div key={rows[i]?.slug ?? i} className={cn("xf", lastRow === i && "is-on")}>
                {node}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
