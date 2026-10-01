"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Check, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DiagramDef } from "@/src/content/cases";

export type DiagramStrings = {
  title: string;
  caption: string;
  hint: string;
  legendPacket: string;
  legendDashed?: string;
  label?: string;
  pause: string;
  play: string;
  /** node texts by id */
  nodes: Record<string, { title: string; sub: string; tip?: string }>;
};

const NODE_H = 64;
const f = (n: number) => `${Math.round(n * 100) / 100}%`;

/** Build the per-diagram keyframes: packets travel their edge polyline, nodes flash on arrival. */
function buildKeyframes(def: DiagramDef) {
  const out: string[] = [];
  const edges = Object.fromEntries(def.edges.map((e) => [e.id, e]));
  def.packets.forEach((p, i) => {
    const edge = edges[p.edge];
    if (!edge) return;
    const pts = p.reverse ? [...edge.path].reverse() : edge.path;
    const [x0, y0] = pts[0];
    const lens = pts.slice(1).map(([x, y], k) => Math.abs(x - pts[k][0]) + Math.abs(y - pts[k][1]));
    const total = lens.reduce((a, b) => a + b, 0) || 1;
    const frames = [`0%{transform:translate(0px,0px);opacity:0}`];
    if (p.from > 0) frames.push(`${f(p.from)}{transform:translate(0px,0px);opacity:0}`);
    frames.push(`${f(p.from + 0.4)}{opacity:1}`);
    let acc = 0;
    pts.slice(1).forEach(([x, y], k) => {
      acc += lens[k];
      const t = p.from + ((p.to - p.from) * acc) / total;
      const last = k === pts.length - 2;
      frames.push(`${f(t)}{transform:translate(${x - x0}px,${y - y0}px)${last ? ";opacity:1" : ""}}`);
    });
    const [xl, yl] = pts[pts.length - 1];
    frames.push(`${f(Math.min(100, p.to + 0.5))}{opacity:0}`);
    frames.push(`100%{transform:translate(${xl - x0}px,${yl - y0}px);opacity:0}`);
    out.push(`@keyframes dg-${def.id}-pk${i}{${frames.join("")}}`);
  });
  const byNode = new Map<string, typeof def.flashes>();
  def.flashes.forEach((fl) => byNode.set(fl.node, [...(byNode.get(fl.node) ?? []), fl]));
  byNode.forEach((list, node) => {
    const frames = ["0%{opacity:0}"];
    list
      .slice()
      .sort((a, b) => a.at - b.at)
      .forEach((w) => {
        if (w.at - 1.5 > 0) frames.push(`${f(w.at - 1.5)}{opacity:0}`);
        frames.push(`${f(w.at)}{opacity:1}`);
        if (w.hold) frames.push(`${f(w.hold)}{opacity:1}`);
        frames.push(`${f(w.out)}{opacity:0}`);
      });
    frames.push("100%{opacity:0}");
    out.push(`@keyframes dg-${def.id}-fl-${node}{${frames.join("")}}`);
  });
  if (def.label) {
    const { from, to } = def.label;
    out.push(
      `@keyframes dg-${def.id}-ap{0%,${f(Math.max(0, from - 3))}{opacity:0}${f(from)},${f(to)}{opacity:1}${f(Math.min(100, to + 6))},100%{opacity:0}}`,
    );
  }
  return out.join("\n");
}

/**
 * Animated architecture diagram (v2 §9.3 recipe, v3 §11.3): a `.stage.on-stage` card with
 * positioned nodes, orthogonal hairline connectors, travelling packets (6000ms cycle) and
 * arrival flashes, hover/focus tooltips that brighten the linked edges, and a Pause toggle.
 * Desktop (≥1200px): the 1280-wide card, scaled to the breakout. Below: a stacked version
 * (columns as groups, tooltips inline). Reduced motion: solid edges, no packets.
 */
export function ArchDiagram({ def, strings, light }: { def: DiagramDef; strings: DiagramStrings; light: string }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [paused, setPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hot, setHot] = useState<string | null>(null);

  const css = useMemo(() => buildKeyframes(def), [def]);
  const cols = useMemo(() => Array.from(new Set(def.nodes.map((n) => n.x))).sort((a, b) => a - b), [def]);
  const flashNodes = useMemo(() => new Set(def.flashes.map((fl) => fl.node)), [def]);

  useEffect(() => {
    try {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch {
      /* ignore */
    }
    const el = frameRef.current;
    if (!el) return;
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      const fit = () => {
        if (el.clientWidth) setScale(Math.min(1, el.clientWidth / def.width));
      };
      fit();
      ro = new ResizeObserver(fit);
      ro.observe(el);
    }
    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((entries) => setOffscreen(!entries.some((e) => e.isIntersecting)), { rootMargin: "80px" });
      io.observe(el);
    }
    return () => {
      ro?.disconnect();
      io?.disconnect();
    };
  }, [def.width]);

  const linked = (id: string) =>
    hot !== null && id !== hot && def.edges.some((e) => (e.from === hot && e.to === id) || (e.to === hot && e.from === id));

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") {
      setHot(null);
      e.currentTarget.blur();
    }
  };

  const L = { ["--L" as string]: light } as CSSProperties;

  return (
    <figure className="cs-breakout cs-dg">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* desktop: positioned card */}
      <div ref={frameRef} className="cs-dg-frame" style={{ height: def.height * scale }}>
        <div
          className={cn("stage on-stage arch cs-dg-canvas", (paused || offscreen) && "is-paused")}
          style={{ ...L, width: def.width, height: def.height, transform: `scale(${scale})` }}
        >
          <div className="light is-on" style={{ ["--horizon" as string]: `${def.height + 100}px` } as CSSProperties} />
          <div className="vignette" />
          <div className="cs-dg-head">
            <span className="eb cs-dg-eb">{strings.title}</span>
            <span className="cs-dg-sub">· {strings.caption}</span>
          </div>
          <div className="cs-dg-tools">
            <span className="cs-dg-legend">
              <span aria-hidden="true" className="cs-dg-legend-dot" />
              {strings.legendPacket}
            </span>
            {def.dashedLegend && strings.legendDashed ? (
              <span className="cs-dg-legend">
                <span aria-hidden="true" className="cs-dg-legend-dash" />
                {strings.legendDashed}
              </span>
            ) : null}
            {!reduced ? (
              <button
                type="button"
                className="btn btn-g btn-icon cs-dg-pause"
                aria-pressed={paused}
                aria-label={paused ? strings.play : strings.pause}
                onClick={() => setPaused((p) => !p)}
              >
                <span className={cn("ic", paused && "is-off")}>
                  <Pause width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className={cn("ic", !paused && "is-off")}>
                  <Play width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
              </button>
            ) : null}
          </div>

          {def.edges.flatMap((e) =>
            e.path.slice(1).map(([x, y], k) => {
              const [px, py] = e.path[k];
              const vert = px === x;
              const isHot = hot !== null && (e.from === hot || e.to === hot);
              const left = Math.min(px, x);
              const top = Math.min(py, y);
              const len = vert ? Math.abs(y - py) : Math.abs(x - px);
              return (
                <span
                  key={`${e.id}-${k}`}
                  aria-hidden="true"
                  className={cn("seg", vert ? "seg-v draw-y" : "seg-h draw-x", e.dashed && "seg-d", isHot && "is-hot")}
                  style={
                    {
                      left,
                      top,
                      [vert ? "height" : "width"]: len,
                      ["--base" as string]: `${Math.round(1000 + (left / def.width) * 500)}ms`,
                    } as CSSProperties
                  }
                />
              );
            }),
          )}

          {def.packets.map((p, i) => {
            const edge = def.edges.find((e) => e.id === p.edge);
            if (!edge) return null;
            const [x0, y0] = p.reverse ? edge.path[edge.path.length - 1] : edge.path[0];
            return (
              <span
                key={i}
                aria-hidden="true"
                className="pk loop"
                style={{ left: x0 - 3, top: y0 - 3, animationName: `dg-${def.id}-pk${i}` }}
              />
            );
          })}

          {def.label && strings.label ? (
            <span
              aria-hidden="true"
              className="ap loop"
              style={{ left: def.label.x, top: def.label.y, animationName: `dg-${def.id}-ap` }}
            >
              <Check width={12} height={12} strokeWidth={2} aria-hidden="true" />
              {strings.label}
            </span>
          ) : null}

          {def.nodes.map((n) => {
            const w = n.w ?? 200;
            const text = strings.nodes[n.id];
            const isHot = hot === n.id;
            const isLinked = linked(n.id);
            const tipId = `dg-${def.id}-tip-${n.id}`;
            const hasTip = Boolean(n.tip && text?.tip);
            const above = n.y + NODE_H + 10 + 96 > def.height;
            const alignRight = n.x + 240 > def.width - 16;
            return (
              <button
                key={n.id}
                type="button"
                className={cn("node pop", (isHot || isLinked) && "is-hot", hasTip && "has-tip")}
                style={
                  {
                    left: n.x,
                    top: n.y,
                    width: w,
                    ["--base" as string]: "400ms",
                    ["--i" as string]: cols.indexOf(n.x),
                    zIndex: isHot ? 6 : undefined,
                  } as CSSProperties
                }
                aria-describedby={hasTip ? tipId : undefined}
                onMouseEnter={() => setHot(n.id)}
                onMouseLeave={() => setHot(null)}
                onFocus={() => setHot(n.id)}
                onBlur={() => setHot(null)}
                onClick={() => setHot(n.id)}
                onKeyDown={onKey}
              >
                {flashNodes.has(n.id) ? (
                  <span aria-hidden="true" className="fl loop" style={{ animationName: `dg-${def.id}-fl-${n.id}` }} />
                ) : null}
                <span className="node-t">{text?.title}</span>
                <span className="node-s">{text?.sub}</span>
                {hasTip ? (
                  <span
                    id={tipId}
                    role="tooltip"
                    className="tip"
                    style={{
                      ...(above ? { bottom: 74 } : { top: 74 }),
                      ...(alignRight ? { right: 0 } : { left: 0 }),
                      ...(isLinked ? { opacity: 0 } : null),
                    }}
                  >
                    {text?.tip}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* mobile / tablet: stacked groups */}
      <div className="stage on-stage cs-dg-mob" style={L}>
        <div className="light is-on" style={{ ["--horizon" as string]: "96%" } as CSSProperties} />
        <div className="vignette" />
        <p className="eb cs-dg-eb cs-dg-mob-head">{strings.title}</p>
        <ol className="cs-dm-groups">
          {cols.map((x, gi) => (
            <li key={x} className="cs-dm-group">
              {gi > 0 ? (
                <span aria-hidden="true" className="cs-dm-link">
                  <i className="loop" />
                </span>
              ) : null}
              <ul className="cs-dm-nodes">
                {def.nodes
                  .filter((n) => n.x === x)
                  .sort((a, b) => a.y - b.y)
                  .map((n) => {
                    const text = strings.nodes[n.id];
                    return (
                      <li key={n.id} className="cs-dm-node">
                        <span className="node-t">{text?.title}</span>
                        <span className="cs-dm-sub">{text?.sub}</span>
                        {n.tip && text?.tip ? <span className="cs-dm-tip">{text.tip}</span> : null}
                      </li>
                    );
                  })}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <figcaption className="cs-cap cs-dg-cap">
        <span className="cs-dg-hint">{strings.hint}</span>
        <span>{strings.caption}</span>
      </figcaption>
    </figure>
  );
}
