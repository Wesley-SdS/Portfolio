import { useLocale, useTranslations } from "next-intl";
import { CropImage } from "@/components/ui-v3/CropImage";
import { StageGlyph } from "@/components/ui-v3/StageGlyph";
import { stageOf } from "@/src/content/format";
import type { Status } from "@/src/content/types";

function StageBadge({ status }: { status: Status }) {
  const t = useTranslations("common.status");
  return (
    <span className="ps-stage">
      <StageGlyph stage={stageOf(status)} />
      {t(status)}
    </span>
  );
}
import { asLocale, formatPeriod } from "@/src/content/format";
import { crops } from "@/src/content/images";
import { PROJECTS, type StageChapter } from "@/src/content/projects";
import type { Crop } from "@/src/content/types";
import { CtaLink, FIRST_FRONT_SIZES, StageMetric, mobSizes, noWrapHyphens, stackLine, vars } from "./parts";

/* =================================================================== desktop text column */

/** Bottom-anchored text column (v3 §4.2): tag+meta · name · descriptor · outcome · metrics · stack · extra link. */
export function DeskText({ ch }: { ch: StageChapter }) {
  const t = useTranslations(`stage.chapters.${ch.slug}`);
  const tp = useTranslations("products.items");
  const locale = asLocale(useLocale());
  const eyebrow = t.has("eyebrow") ? t("eyebrow") : null;
  const status = PROJECTS[ch.slug].status;
  const row = (
    <>
      <StageBadge status={status} />
      <span className="meta">{t("meta")}</span>
    </>
  );
  return (
    <div className="tcol">
      {eyebrow ? (
        <div className="e-meta has-eb">
          <div className="e-meta-row">{row}</div>
          <span className="meta eb-l">{eyebrow}</span>
        </div>
      ) : (
        <div className="e-meta">{row}</div>
      )}
      <h3 className={ch.nameSize === "compact" ? "e-name nm nm-s" : "e-name nm"}>
        <span className="mask mask-acc">
          <span style={vars({ "--i": 0 })}>{t("name")}</span>
        </span>
      </h3>
      <p className="e-text ds" style={vars({ "--d": "320ms" })}>
        {t("descriptor")}
      </p>
      <p className="e-text ps-oc" style={vars({ "--d": "400ms" })}>
        {noWrapHyphens(t("outcome"))}
      </p>
      <dl className={ch.slug === "orbita" ? "e-metrics mx mx-tight" : "e-metrics mx"}>
        {ch.metrics.map((m, i) => (
          <div key={m.labelKey} className="mi">
            <dt className="ml">{t(`metrics.${m.labelKey}`)}</dt>
            <dd className="mv">
              <StageMetric metric={m} locale={locale} index={i} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="e-text sl" style={vars({ "--d": "480ms" })}>
        {stackLine(tp(`${ch.slug}.stack`))}
      </p>
      {ch.extraLink && t.has("extraLink") ? (
        <p className="e-text xl" style={vars({ "--d": "540ms" })}>
          <ExtraLink ch={ch} label={t("extraLink")} />
        </p>
      ) : null}
    </div>
  );
}

function ExtraLink({ ch, label }: { ch: StageChapter; label: string }) {
  const x = ch.extraLink!;
  if (x.opensOrbita) {
    /* "#orbita" works without JS; with JS the stage opens the widget (orbita-bridge) */
    return (
      <a className="qlnk" href={x.href} data-open-orbita="">
        {label} <span className="arr">→</span>
      </a>
    );
  }
  const http = /^https?:\/\//.test(x.href);
  return (
    <a
      className="qlnk ext"
      href={x.href}
      {...(http ? { target: "_blank", rel: "noopener noreferrer" } : { title: "[URL DO SITE DA ORBITMIND]" })}
    >
      {label} <span className="arr">↗</span>
    </a>
  );
}

/* =================================================================== rail peek (144×90) */

const peekSizes = (c: Crop) => `${Math.ceil(144 * (c.image.width / c.box.w))}px`;

export function RailPeek({ ch }: { ch: StageChapter }) {
  const t = useTranslations(`stage.chapters.${ch.slug}`);
  const tc = useTranslations("common");
  if (!ch.peek) {
    return (
      <span className="pk-tile">
        <span>
          <span className="pk-bar" />
          <span className="pk-nm">{t("rail.name")}</span>
        </span>
        <span className="pk-cp">{tc("capturePending")}</span>
      </span>
    );
  }
  const bg = ch.slug === "orbita" ? "#16211B" : ch.slug === "orbitmind" ? "#FFFFFF" : undefined;
  return (
    <>
      <CropImage crop={ch.peek} decorative aspect={false} sizes={peekSizes(ch.peek)} className="fill" style={{ background: bg }} />
      {ch.slug === "orbitmind" ? <span className="pk-v1">{t("fig.peekTag")}</span> : null}
    </>
  );
}

/* =================================================================== mobile (< 1120) */

export function MobText({ ch }: { ch: StageChapter }) {
  const t = useTranslations(`stage.chapters.${ch.slug}`);
  const tp = useTranslations("products.items");
  const locale = asLocale(useLocale());
  const p = PROJECTS[ch.slug];
  const eyebrow = t.has("eyebrow") ? `${t("eyebrow")} ` : "";
  return (
    <>
      <div className="smeta e-meta">
        <StageBadge status={p.status} />
        <p>
          {eyebrow}
          {formatPeriod(p.period, locale)}
        </p>
      </div>
      <h3 className="sname e-name">
        <span className="mnm">
          <span>{t("name")}</span>
        </span>
      </h3>
      <p className="sdesc e-text">{t.has("descriptorShort") ? t("descriptorShort") : t("descriptor")}</p>
      <p className="sout e-text">{noWrapHyphens(t.has("outcomeShort") ? t("outcomeShort") : t("outcome"))}</p>
      <dl className="smx e-metrics">
        {ch.metrics.map((m, i) => (
          <div key={m.labelKey}>
            <dt>{t(`metrics.${m.labelKey}`)}</dt>
            <dd>
              <StageMetric metric={m} locale={locale} index={i} mobile />
            </dd>
          </div>
        ))}
      </dl>
      <p className="sstk e-text">{stackLine(tp(`${ch.slug}.stack`))}</p>
    </>
  );
}

/** Screenshot back peek (300×188 scaled .9) of the mobile visual zone. */
function MobBack({ crop, bg, tag }: { crop: Crop; bg?: string; tag?: string }) {
  return (
    <div className="pk">
      <div className="e-back fill">
        <div className="shot dim fill">
          {tag ? <span className="v1tag">{tag}</span> : null}
          <CropImage crop={crop} decorative aspect={false} sizes={mobSizes(crop, 300 / 350)} className="fill" style={{ background: bg }} />
        </div>
      </div>
    </div>
  );
}

export function MobVisual({ ch, frontAria }: { ch: StageChapter; frontAria: string }) {
  const t = useTranslations(`stage.chapters.${ch.slug}`);
  const tall = ch.slug === "nex" || ch.slug === "vektus";
  const first = ch.slug === "orbita";

  let back = null;
  if (ch.slug === "orbita") back = <MobBack crop={cropOf("orbitaC")} bg="#F7F8F4" />;
  if (ch.slug === "orbitmind") back = <MobBack crop={ch.peek!} bg="#FFFFFF" tag={t("fig.backTag").split(" · ").slice(0, 2).join(" · ")} />;
  if (ch.slug === "orbitfinance") back = <MobBack crop={cropOf("financeRecurso")} />;
  if (ch.slug === "vibecoding") back = <MobBack crop={cropOf("vibeGeracao")} />;

  let front;
  if (ch.front) {
    front = (
      <div className="shot fill">
        <CropImage
          crop={ch.front}
          aspect={false}
          priority={first}
          sizes={first ? FIRST_FRONT_SIZES : mobSizes(ch.front, 330 / 350)}
          className="fill"
          style={{ background: first ? "#16211B" : undefined }}
        />
      </div>
    );
  } else {
    front = (
      <div className="shot fill" role="img" aria-label={t("fig.ariaShort")}>
        <div className="mc-sc" aria-hidden="true">
          {ch.slug === "orbitmind" ? <MobOrbitMind /> : ch.slug === "nex" ? <MobNex /> : <MobVektus />}
        </div>
      </div>
    );
  }

  return (
    <div className="vz">
      <div className="push">
        {back}
        <div className={tall ? "fm fm-t" : "fm"}>
          <div className="e-front fill">
            <CtaLink kind={ch.cta.kind} href={ch.cta.href} slug={ch.slug} className="stack-link fill" ariaLabel={frontAria}>
              {front}
            </CtaLink>
          </div>
        </div>
      </div>
    </div>
  );
}

/* mobile back crops that differ from the desktop ones (16:10 boxes) */
function cropOf(k: "orbitaC" | "financeRecurso" | "vibeGeracao"): Crop {
  if (k === "orbitaC") return crops.orbita.conexoes.c;
  if (k === "financeRecurso") return crops.orbitfinance.recurso;
  return crops.vibecoding.geracao;
}

/* static schematic cards (no loops on mobile), designed at 330×206 / 330×222 */
const OM7 = [33, 77, 121, 165, 209, 253, 297];
function MobOrbitMind() {
  const t = useTranslations("stage.chapters.orbitmind");
  const short = t.raw("mech.nodesShort") as string[];
  const log = t.raw("mech.log") as string[];
  return (
    <div className="mc">
      <p className="mc-lab" style={{ color: "#7DB2FF" }}>
        {t("mech.architect")}
      </p>
      <p style={{ margin: "6px 0 0" }}>
        <span className="mc-bub">{t("mech.bubble")}</span>
      </p>
      <span className="mc-ln" style={{ left: 33, top: 104, width: 264 }} />
      {OM7.map((x, i) => (
        <span key={x} className={i === 6 ? "nd7 on" : "nd7"} style={{ left: x, top: 104 }} />
      ))}
      {OM7.map((x, i) => (
        <span key={x} className="nd7-l" style={{ left: x, top: 116, color: i === 6 ? "var(--stage-ink-2)" : undefined }}>
          {short[i]}
        </span>
      ))}
      <span style={{ position: "absolute", left: 268, top: 78, width: 8, height: 8, transform: "rotate(45deg)", border: "1px solid #7DB2FF" }} />
      <span style={{ position: "absolute", left: 14, top: 146, width: 302, font: "400 11px/16px var(--font-mono)", color: "var(--stage-ink-2)" }}>{log[2]}</span>
      <p className="mc-cap">{t("fig.mobileCap")}</p>
    </div>
  );
}

const NXA = [30, 74, 118, 162, 206, 250, 294];
const NXB = [30, 67.7, 105.4, 143.1, 180.9, 218.6, 256.3, 294];
function MobNex() {
  const t = useTranslations("stage.chapters.nex");
  return (
    <div className="mc">
      <p className="mc-lab" style={{ color: "#F7C25C" }}>
        {t("mech.laneA")}
      </p>
      <span className="mc-ln" style={{ left: 30, top: 44, width: 264 }} />
      {NXA.map((x) => (
        <span key={x} className="nd7" style={{ left: x, top: 44 }} />
      ))}
      <span style={{ position: "absolute", left: 294, top: 50, width: 1, height: 22, borderLeft: "1px dashed var(--stage-line-strong)" }} />
      <p className="mc-lab" style={{ position: "absolute", left: 14, top: 62, color: "#F7C25C" }}>
        {t("mech.laneB")}
      </p>
      <span className="mc-ln" style={{ left: 30, top: 92, width: 264 }} />
      {NXB.map((x, i) => (
        <span key={x} className={i === 7 ? "nd7 on" : "nd7"} style={{ left: x, top: 92 }} />
      ))}
      <span className="mc-bub" style={{ position: "absolute", left: 14, top: 112 }}>
        {t("mech.question")}
      </span>
      <span
        style={{ position: "absolute", right: 14, top: 144, maxWidth: 236, padding: "6px 10px", borderRadius: 10, border: "1px solid rgb(var(--L) / .6)", font: "400 12px/16px var(--font-body)", color: "var(--stage-ink)" }}
      >
        {t("mech.reply")}
      </span>
      <p className="mc-cap">{t("fig.mobileCap")}</p>
    </div>
  );
}

const VK_ICONS = [
  <>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </>,
  <>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 8h8" />
    <path d="M7 12h10" />
    <path d="M7 16h6" />
  </>,
  <>
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </>,
  <>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.59 13.51 6.83 3.98" />
    <path d="m15.41 6.51-6.82 3.98" />
  </>,
  <>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 9h8" />
    <path d="M8 13h5" />
  </>,
];

function MobVektus() {
  const t = useTranslations("stage.chapters.vektus");
  const cols = t.raw("mech.columnsShort") as string[];
  return (
    <div className="mc">
      <p style={{ margin: 0, textAlign: "right" }}>
        <span className="mc-bub">{t("mech.question")}</span>
      </p>
      <div style={{ position: "absolute", left: 14, right: 14, top: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {VK_ICONS.map((ic, i) => (
          <span key={i} style={{ display: "contents" }}>
            {i > 0 ? <span className="mc-arr">→</span> : null}
            <span className="vk-ic" style={i === 2 ? { color: "#FDA4B4" } : undefined}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {ic}
              </svg>
            </span>
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 14, right: 14, top: 96, display: "flex", justifyContent: "space-between", font: "400 9px/12px var(--font-mono)", color: "var(--stage-ink-3)" }}>
        {cols.map((c) => (
          <span key={c} style={{ width: 40, textAlign: "center" }}>
            {c}
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 14, top: 122, maxWidth: 260, padding: "8px 10px", borderRadius: 10, background: "var(--stage-raise-2)" }}>
        <p style={{ margin: 0, font: "400 12px/16px var(--font-body)", color: "var(--stage-ink)" }}>{t("mech.answer")}</p>
        <span style={{ display: "inline-block", marginTop: 6, padding: "0 6px", borderRadius: 4, border: "1px solid #FDA4B4", font: "400 11px/18px var(--font-mono)", color: "#FDA4B4" }}>
          {t("mech.cite")}
        </span>
      </div>
      <p className="mc-cap">{t("fig.mobileCap")}</p>
    </div>
  );
}
