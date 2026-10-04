import type { CSSProperties, ReactNode } from "react";
import { OrbitaMark } from "@/components/orbita/OrbitaMark";
import { Bell, Check, Globe, MessageCircle, Mic, Send, Smartphone } from "lucide-react";
import { CropImage } from "@/components/ui-v3/CropImage";
import { MetricValue } from "@/components/ui-v3/MetricValue";
import { SmartLink } from "@/components/ui-v3/SmartLink";
import { LIGHT_RGB } from "@/src/content/projects";
import type { CaseBlock, CaseConfig, ChannelIcon } from "@/src/content/cases";
import type { Locale } from "@/src/content/types";
import { ArchDiagram, type DiagramStrings } from "./ArchDiagram";
import { CaseGallery } from "./CaseGallery";
import { MechCard } from "./MechCard";
import { OrbitaButton } from "./OrbitaButton";
import type { Tr } from "./types";

type Ctx = { cfg: CaseConfig; t: Tr; tc: Tr; tg: Tr; locale: Locale };

const ICONS: Record<ChannelIcon, typeof Globe> = {
  globe: Globe,
  phone: Smartphone,
  mic: Mic,
  chat: MessageCircle,
  send: Send,
  bell: Bell,
};

/** "texto com `codigo`" → text + <code> */
export function withCode(s: string): ReactNode {
  const parts = s.split(/`([^`]+)`/);
  return parts.map((p, i) => (i % 2 === 1 ? <code key={i} className="cs-code">{p}</code> : p));
}

const opt = (t: Tr, key: string) => (t.has(key) ? t(key) : undefined);

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="cs-bul">
      {items.map((it, i) => (
        <li key={i}>
          <span aria-hidden="true">–</span>
          <span>{withCode(it)}</span>
        </li>
      ))}
    </ul>
  );
}

export function renderBlock(b: CaseBlock, i: number, ctx: Ctx): ReactNode {
  const { cfg, t, tc, tg, locale } = ctx;
  const light = LIGHT_RGB[cfg.light];

  switch (b.type) {
    case "body":
      return (
        <p key={i} className="cs-body">
          {withCode(t(b.key))}
        </p>
      );

    case "diagram": {
      const d = b.diagram;
      const nodes: DiagramStrings["nodes"] = {};
      for (const n of d.nodes) {
        nodes[n.id] = {
          title: t(`${d.key}.nodes.${n.id}.title`),
          sub: t(`${d.key}.nodes.${n.id}.sub`),
          tip: n.tip ? opt(t, `${d.key}.tooltips.${n.id}`) : undefined,
        };
      }
      const strings: DiagramStrings = {
        title: t(`${d.key}.diagramTitle`),
        caption: t(`${d.key}.caption`),
        hint: tc("diagram.hint"),
        legendPacket: opt(t, `${d.key}.legendPacket`) ?? tc("diagram.legendPacket"),
        legendDashed: opt(t, `${d.key}.legendDashed`),
        label: opt(t, `${d.key}.label`),
        pause: tc("diagram.pause"),
        play: tc("diagram.play"),
        nodes,
      };
      return <ArchDiagram key={i} def={d} strings={strings} light={light} />;
    }

    case "chips":
      return (
        <ul key={i} aria-label={t(`${b.key}.risksAria`)} className="cs-chips">
          <li className="eb cs-chips-l">{t(`${b.key}.risksLabel`)}</li>
          {(t.raw(`${b.key}.risks`) as string[]).map((r) => (
            <li key={r} className="rk">
              <i aria-hidden="true" />
              {r}
            </li>
          ))}
        </ul>
      );

    case "approvalMech": {
      const k = `${b.key}.mech`;
      return (
        <MechCard
          key={i}
          light={light}
          header={t(`${k}.header`)}
          pause={tc("mech.pause")}
          play={tc("mech.play")}
          caption={{ title: t(`${b.key}.caption.title`), text: t(`${b.key}.caption.text`) }}
        >
          <div className="cs-of-q">
            <span className="of-bubble cs-of-bubble">{t(`${k}.bubble`)}</span>
          </div>
          <span className="of-dots busy-dots cs-of-dots" aria-hidden="true">
            <i style={{ ["--i" as string]: 0 } as CSSProperties} />
            <i style={{ ["--i" as string]: 1 } as CSSProperties} />
            <i style={{ ["--i" as string]: 2 } as CSSProperties} />
          </span>
          <div className="of-card cs-of-card">
            <p className="cs-of-tool">{t(`${k}.tool`)}</p>
            <div className="cs-of-event">
              <div>
                <p className="cs-of-title">{t(`${k}.title`)}</p>
                <p className="cs-of-time">{t(`${k}.time`)}</p>
              </div>
              <div className="cs-of-pills">
                <span className="pill cs-pill-ok">{t(`${k}.approve`)}</span>
                <span className="pill cs-pill">{t(`${k}.discard`)}</span>
              </div>
            </div>
          </div>
          <p className="of-insight cs-of-insight">
            <Check width={12} height={12} strokeWidth={2} aria-hidden="true" />
            {t(`${k}.insight`)}
          </p>
        </MechCard>
      );
    }

    case "financeMech": {
      const k = `${b.key}.mech`;
      const rows = t.raw(`${k}.rows`) as { label: string; value: string }[];
      return (
        <MechCard
          key={i}
          light={light}
          header={t(`${k}.header`)}
          pause={tc("mech.pause")}
          play={tc("mech.play")}
          caption={{ title: t(`${b.key}.caption.title`), text: t(`${b.key}.caption.text`) }}
        >
          <div className="cs-of-q">
            <span className="of-bubble cs-of-bubble">{t(`${k}.bubble`)}</span>
          </div>
          <span className="of-dots busy-dots cs-of-dots" aria-hidden="true">
            <i style={{ ["--i" as string]: 0 } as CSSProperties} />
            <i style={{ ["--i" as string]: 1 } as CSSProperties} />
            <i style={{ ["--i" as string]: 2 } as CSSProperties} />
          </span>
          <dl className="of-card cs-of-card cs-of-rows">
            {rows.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
          <p className="of-insight cs-of-insight">
            <Check width={12} height={12} strokeWidth={2} aria-hidden="true" />
            {t(`${k}.insight`)}
          </p>
        </MechCard>
      );
    }

    case "plate":
      return (
        <figure key={i} className="cs-fig">
          <div className="cs-mat">
            <span className="plate wipe cs-plate" style={{ background: b.bg, ["--base" as string]: "300ms" } as CSSProperties}>
              <CropImage crop={b.crop} aspect={false} style={{ width: "100%", height: "100%" }} renderWidth={804} />
            </span>
          </div>
          <figcaption className="cs-cap">{t(b.captionKey)}</figcaption>
        </figure>
      );

    case "shot":
      return (
        <figure key={i} className="cs-shot">
          <div className="cs-mat cs-shot-mat">
            <span className="cs-block cs-shot-img" style={{ width: b.width, height: b.height }}>
              <CropImage crop={b.crop} aspect={false} style={{ width: "100%", height: "100%" }} renderWidth={b.width} />
            </span>
          </div>
          <figcaption className="cs-shot-cap">
            <span className="cs-cap">{t(b.captionKey)}</span>
            {b.textKey ? <span className="cs-small">{t(b.textKey)}</span> : null}
          </figcaption>
        </figure>
      );

    case "bars": {
      const rows = b.rows;
      return (
        <figure key={i} className="cs-fig">
          <div className="cs-bars" role="img" aria-label={t(`${b.key}.aria`)}>
            <div aria-hidden="true" className="cs-bars-legend">
              <span>
                <i className="is-before" />
                {t(`${b.key}.legendBefore`)}
              </span>
              <span>
                <i className="is-after" />
                {t(`${b.key}.legendAfter`)}
              </span>
            </div>
            {rows.map((r, ri) => (
              <div key={r.id} aria-hidden="true" className="cs-bars-row">
                <div className="cs-bars-head">
                  <span className="cs-bars-label">{t(`${b.key}.rows.${r.id}.label`)}</span>
                  <span className="cs-bars-delta">
                    {t(`${b.key}.rows.${r.id}.before`)} → {t(`${b.key}.rows.${r.id}.after`)}
                  </span>
                </div>
                <div className="cs-bars-line">
                  <span className="cs-bars-track">
                    <span className="cs-bar is-before" style={{ width: `${r.before * 100}%` }} />
                  </span>
                  <span className="cs-bars-v is-before">{t(`${b.key}.rows.${r.id}.before`)}</span>
                </div>
                <div className="cs-bars-line">
                  <span className="cs-bars-track">
                    <span
                      className="cs-bar is-after draw-x"
                      style={{ width: `${r.after * 100}%`, ["--base" as string]: `${600 + ri * 160}ms` } as CSSProperties}
                    />
                  </span>
                  <span className="cs-bars-v">{t(`${b.key}.rows.${r.id}.after`)}</span>
                </div>
              </div>
            ))}
            <div aria-hidden="true" className="cs-bars-axis">
              <span className="is-0">{t(`${b.key}.axis.zero`)}</span>
              <span className="is-50">{t(`${b.key}.axis.half`)}</span>
              <span className="is-100">{t(`${b.key}.axis.one`)}</span>
            </div>
          </div>
          <figcaption className="cs-cap">{t(`${b.key}.source`)}</figcaption>
        </figure>
      );
    }

    case "channels":
      // rendered by the section (split layout) — see CasePage
      return null;

    case "gallery": {
      const items = b.items.map((it, ii) => {
        const caption = t(it.captionKey);
        return {
          crop: it.crop,
          full: it.full,
          bg: it.bg,
          caption,
          fig: tc("fig", { n: String(b.figStart + ii).padStart(2, "0") }),
          openLabel: tc("gallery.open", { caption }),
          thumbLabel: tc("gallery.thumb", { n: ii + 1, name: caption.split(" — ")[0] }),
        };
      });
      return (
        <CaseGallery
          key={i}
          id={`gal-${cfg.slug}`}
          items={items}
          pending={b.pending}
          strings={{
            tablistAria: t(`${b.key}.tablistAria`),
            lightboxTitle: t(`${b.key}.lightboxTitle`),
            prev: tc("gallery.prev"),
            next: tc("gallery.next"),
            close: tg("common.actions.close"),
            pending: tg("common.capturePending"),
            counter: tc.raw("gallery.counter") as string,
          }}
        />
      );
    }

    case "pending": {
      const labels = t.raw(`${b.key}.items`) as string[];
      return (
        <div key={i} className="cs-pending">
          <ul className="cs-pending-grid">
            {labels.map((l) => (
              <li key={l} className="cs-pending-tile">
                <span className="cs-pending-tag">{tg("common.capturePending")}</span>
                <span className="cs-pending-l">{l}</span>
              </li>
            ))}
          </ul>
          {t.has(`${b.key}.note`) ? <p className="cs-cap">{t(`${b.key}.note`)}</p> : null}
        </div>
      );
    }

    case "numbers":
      return (
        <div key={i} className="cs-numbers">
          <dl className="cs-nums">
            {b.items.map((it, ii) => (
              <div key={it.id} className="cs-num">
                <dt>{t(`${b.key}.items.${it.id}`)}</dt>
                <dd className="cs-stat">
                  <MetricValue metric={it.metric} locale={locale} animate="run" index={ii} style={{ ["--base" as string]: "400ms" } as CSSProperties} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="cs-cap">{t(`${b.key}.source`)}</p>
        </div>
      );

    case "list":
      return <Bullets key={i} items={t.raw(b.key) as string[]} />;

    case "dl":
      return (
        <dl key={i} className="cs-dl">
          {(t.raw(b.key) as { term: string; desc: string }[]).map((d, di) => (
            <div key={d.term} className="rv" style={{ ["--base" as string]: "200ms", ["--i" as string]: di, ["--stagger" as string]: "60ms" } as CSSProperties}>
              <dt>{d.term}</dt>
              <dd>{withCode(d.desc)}</dd>
            </div>
          ))}
        </dl>
      );

    case "twoCol":
      return (
        <div key={i} className="cs-two">
          <div className="cs-two-grid">
            {(["a", "b"] as const).map((c) => (
              <div key={c}>
                <p className="eb cs-two-t">{t(`${b.key}.${c}.title`)}</p>
                <Bullets items={t.raw(`${b.key}.${c}.items`) as string[]} />
              </div>
            ))}
          </div>
          {t.has(`${b.key}.footnote`) ? <p className="cs-two-foot">{t(`${b.key}.footnote`)}</p> : null}
        </div>
      );

    case "lanes": {
      const lanes = t.raw(`${b.key}.lanes`) as { label: string; pills: string[]; plain?: boolean }[];
      return (
        <figure key={i} className="cs-fig">
          <div className="cs-lanes">
            {lanes.map((lane) => (
              <div key={lane.label} className="cs-lane">
                <p className="eb">{lane.label}</p>
                <ol className={lane.plain ? "cs-lane-pills is-plain" : "cs-lane-pills"}>
                  {lane.pills.map((p, pi) => (
                    <li key={p} className="rv" style={{ ["--base" as string]: "200ms", ["--i" as string]: pi, ["--stagger" as string]: "50ms" } as CSSProperties}>
                      {lane.plain ? null : <span className="cs-lane-n">{String(pi + 1).padStart(2, "0")}</span>}
                      {p}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          {t.has(`${b.key}.note`) ? <figcaption className="cs-cap">{t(`${b.key}.note`)}</figcaption> : null}
        </figure>
      );
    }

    case "note":
      return (
        <aside key={i} className="cs-note">
          <p className="eb">{t(`${b.key}.title`)}</p>
          <p className="cs-note-text">{withCode(t(`${b.key}.text`))}</p>
        </aside>
      );

    case "orbitaCta":
      return (
        <div key={i} className="cs-orbita-cta">
          <div className="cs-orbita-row">
            <OrbitaButton className="btn btn-p cs-orb-btn">
              <OrbitaMark size={22} className="btn-mark" />
              {tg("common.actions.talkToOrbita")}
            </OrbitaButton>
            <SmartLink href="/#orbita" className="qlnk cs-ui">
              {t(`${b.key}.howLink`)}{" "}
              <span className="arr" aria-hidden="true">
                →
              </span>
            </SmartLink>
          </div>
          {t.has(`${b.key}.footnote`) ? <p className="cs-foot">{t(`${b.key}.footnote`)}</p> : null}
        </div>
      );
  }
}

/** Channels split (v3 §11.3 "06 Multicanal"): heading + text + channel list | phone plate. */
export function ChannelsSplit({
  block,
  heading,
  ctx,
}: {
  block: Extract<CaseBlock, { type: "channels" }>;
  heading: ReactNode;
  ctx: Ctx;
}) {
  const { t } = ctx;
  return (
    <div className="cs-split">
      <div className="cs-split-text">
        {heading}
        <p className="cs-body">{t(`${block.key}.body`)}</p>
        <ul aria-label={t(`${block.key}.aria`)} className="cs-chan">
          {block.items.map((it, i) => {
            const Ico = ICONS[it.icon];
            return (
              <li key={it.id} className="rv" style={{ ["--base" as string]: "300ms", ["--i" as string]: i, ["--stagger" as string]: "60ms" } as CSSProperties}>
                <Ico width={18} height={18} strokeWidth={1.5} aria-hidden="true" className="cs-chan-ic" />
                <span className="cs-chan-n">{t(`${block.key}.items.${it.id}.name`)}</span>
                <span className="cs-chan-d">{t(`${block.key}.items.${it.id}.detail`)}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <figure className="cs-split-fig">
        <div className="cs-mat cs-phone-mat">
          <span className="plate cs-phone-plate">
            <CropImage crop={block.phone} aspect={false} style={{ width: "100%", height: "100%" }} sizes="300px" />
          </span>
        </div>
        <figcaption className="cs-cap">{t(block.captionKey)}</figcaption>
      </figure>
    </div>
  );
}
