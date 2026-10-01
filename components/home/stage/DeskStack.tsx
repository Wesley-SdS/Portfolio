import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { CropImage } from "@/components/ui-v3/CropImage";
import type { StageChapter } from "@/src/content/projects";
import { OrbitaCore } from "./OrbitaCore";
import { Check, Chrome, CtaLink, FIRST_FRONT_SIZES, deskSizes, vars } from "./parts";

/**
 * Desktop layered stack (v3spec §4.3, v2 §6.4): .stack → .tilt → .push → three .par
 * layers (BACK 520×289 · FRONT 624×418 · LOUPE 300×212 or mechanism card 344×232).
 * Every loop carries `.loop` (frozen by Pause); its static style is the END frame.
 */

const BACK: CSSProperties = { left: 200, top: 24, width: 520, height: 289 };
const FRONT: CSSProperties = { left: 16, top: 140, width: 624, height: 418 };
const LOUPE: CSSProperties = { left: 396, top: 444, width: 300, height: 212 };
const MECH: CSSProperties = { left: 380, top: 432, width: 344, height: 232 };

const noCheck = (s: string) => s.replace(/^✓\s*/, "");

/** Live core layer of chapter 01 (210×210, in front of everything; sits in the free corner above the front screen). */
const CORE: CSSProperties = { left: -24, top: -52, width: 210, height: 210 };

function Stack({ back, front, loupe, loupeBox, core }: { back: ReactNode; front: ReactNode; loupe: ReactNode; loupeBox: CSSProperties; core?: ReactNode }) {
  return (
    <div className="stack">
      <div className="tilt">
        <div className="push">
          <div className="par back" style={BACK}>
            <div className="e-back fill">{back}</div>
          </div>
          <div className="par front" style={FRONT}>
            <div className="e-front fill">{front}</div>
          </div>
          <div className="par loupe" style={loupeBox}>
            <div className="e-loupe fill">
              <div className="float fill">{loupe}</div>
            </div>
          </div>
          {core ? (
            <div className="par core" style={CORE}>
              <div className="e-core fill">
                <div className="float fill">{core}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FrontLink({ ch, aria, children }: { ch: StageChapter; aria: string; children: ReactNode }) {
  return (
    <CtaLink kind={ch.cta.kind} href={ch.cta.href} slug={ch.slug} className="stack-link" ariaLabel={aria}>
      {children}
    </CtaLink>
  );
}

/** Screenshot front: chrome caption + 624×390 crop. */
function ShotFront({ ch, caption, aria, bg, first }: { ch: StageChapter; caption: string; aria: string; bg?: string; first?: boolean }) {
  const crop = ch.front!;
  return (
    <FrontLink ch={ch} aria={aria}>
      <div className="shot" style={{ width: 624, height: 418 }}>
        <Chrome caption={caption} />
        <CropImage
          crop={crop}
          aspect={false}
          priority={first}
          sizes={first ? FIRST_FRONT_SIZES : deskSizes(crop, 624)}
          style={{ width: 624, height: 390, background: bg }}
        />
      </div>
    </FrontLink>
  );
}

function ShotBack({ crop, bg, tag }: { crop: NonNullable<StageChapter["back"]>; bg?: string; tag?: string }) {
  return (
    <div className="shot dim" style={{ width: 520, height: 289 }}>
      <CropImage crop={crop} decorative aspect={false} sizes={deskSizes(crop, 520)} style={{ width: 520, height: 289, background: bg }} />
      {tag ? <span className="v1tag">{tag}</span> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ 01 Órbita */
function OrbitaStack({ ch, aria }: { ch: StageChapter; aria: string }) {
  const t = useTranslations("stage.chapters.orbita");
  return (
    <Stack
      loupeBox={MECH}
      core={
        <OrbitaCore
          labels={{
            idle: t("mech.core.idle"),
            listening: t("mech.core.listening"),
            thinking: t("mech.core.thinking"),
            attention: t("mech.core.attention"),
            success: t("mech.core.success"),
          }}
        />
      }
      back={<ShotBack crop={ch.back!} bg="#F7F8F4" />}
      front={<ShotFront ch={ch} caption={t("fig.front")} aria={aria} bg="#16211B" first />}
      loupe={
        <div className="shot sm" style={{ width: 344, height: 232 }}>
          <div className="lp-h lp-t">{t("mech.header")}</div>
          <div className="of-b">
            <div className="of-bubble ob-bubble loop">{t("mech.bubble")}</div>
            <div className="of-slot">
              <span className="of-dots busy-dots loop" aria-hidden="true">
                <i style={vars({ "--i": 0 })} />
                <i style={vars({ "--i": 1 })} />
                <i style={vars({ "--i": 2 })} />
              </span>
              <div className="of-card ob-card loop">
                <div className="ob-tool">{t("mech.tool")}</div>
                <div className="ob-box">
                  <div className="ob-t">{t("mech.eventTitle")}</div>
                  <div className="ob-d">{t("mech.eventWhen")}</div>
                  <div className="ob-acts">
                    <span className="ob-pill ob-yes loop">{t("mech.approve")}</span>
                    <span className="ob-pill">{t("mech.discard")}</span>
                    {/* the owner answers by voice: five bars while "manda" is heard */}
                    <span className="ob-wave loop" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <i key={i} style={vars({ "--i": i })} />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="of-insight loop" style={{ color: "#A6DCAB" }}>
              <Check />
              <span>{noCheck(t("mech.insight"))}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------ 02 OrbitMind */
const OM_X = [20, 105, 190, 275, 360, 445, 530];
/** When the token (cb-om-token, 6000ms) sits on each node, in ms from the loop start: first pass… */
const OM_PASS_1 = [240, 840, 1440, 1920, 2400, 2880, 5400];
/** …and the second pass through nodes 03–06 after the veto sends it back. */
const OM_PASS_2 = [null, null, 3480, 3840, 4080, 4320, null];

function OrbitMindStack({ ch, aria }: { ch: StageChapter; aria: string }) {
  const t = useTranslations("stage.chapters.orbitmind");
  const nodes = t.raw("mech.nodes") as string[];
  const log = t.raw("mech.log") as string[];
  return (
    <Stack
      loupeBox={{ left: 470, top: 370, width: 220, height: 300 }}
      back={<ShotBack crop={ch.back!} bg="#FFFFFF" tag={t("fig.backTag")} />}
      front={
        <FrontLink ch={ch} aria={aria}>
          <div className="shot om" style={{ width: 624, height: 418 }}>
            <Chrome caption={t("fig.front")} />
            <div className="dg" role="img" aria-label={t("fig.aria")}>
              <div className="om-arch">
                <span className="om-al">{t("mech.architect")}</span>
                <span className="bub bub-l">{t("mech.bubble")}</span>
              </div>
              <svg style={{ position: "absolute", left: 0, top: 0 }} width="624" height="140" viewBox="0 0 624 140" fill="none" aria-hidden="true">
                <path className="om-arc loop" d="M481 103 Q353.5 36 226 103" stroke="#77726A" strokeWidth="1" strokeDasharray="3 4" />
                <polyline className="om-arc-h loop" points="232 103.2 226 103 229.2 97.9" stroke="#77726A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="om-arcl">{t("mech.loop")}</span>
              {nodes.map((n, i) => (
                <div key={i} className="om-node" style={{ left: OM_X[i] }}>
                  {/* lit while the token is on this node: first pass, then the pass after the veto loop-back */}
                  <i className="om-hit loop" style={vars({ "--t": `${OM_PASS_1[i]}ms` })} />
                  {OM_PASS_2[i] !== null ? <i className="om-hit loop" style={vars({ "--t": `${OM_PASS_2[i]}ms` })} /> : null}
                  <span className="om-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="om-nm">{n}</span>
                  {i === 5 ? <span className="om-veto loop">{t("mech.veto")}</span> : null}
                </div>
              ))}
              {OM_X.slice(0, 6).map((x, i) => (
                <span key={i} className="om-cn" style={{ left: x + 72 }} />
              ))}
              <span className="om-cpline" />
              <span className="om-cpl">{t("mech.checkpoint")}</span>
              <span className="om-cp loop">
                <Check className="om-ok loop" size={9} stroke={3} color="#5CC48A" />
              </span>
              <span className="om-token loop" />
              <div className="om-log">
                <span className="om-l1 loop">{log[0]}</span>
                <span className="om-l2 loop">{log[1]}</span>
                <span className="om-l3 loop" style={{ color: "#7DB2FF" }}>
                  {log[2]}
                </span>
                <span className="om-l4 loop" style={{ color: "#5CC48A" }}>
                  <Check size={11} />
                  {noCheck(log[3])}
                </span>
              </div>
              <p className="dg-cap" style={{ left: 20, top: 340, width: 420 }}>
                {t("mech.footer")}
              </p>
            </div>
          </div>
        </FrontLink>
      }
      loupe={
        <div className="shot sm" style={{ width: 220, height: 300 }}>
          <div className="lp-h">{t("fig.loupeHeader")}</div>
          <CropImage crop={ch.loupe!} aspect={false} sizes={deskSizes(ch.loupe!, 220)} style={{ width: 220, height: 276, background: "#171717" }} />
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------ 03 Suíte Nex */
const NX_A = [152, 216, 280, 344, 408, 472, 536];
const NX_B = [152, 209, 266, 323, 380, 437, 494, 551];

function NexStack({ ch, aria }: { ch: StageChapter; aria: string }) {
  const t = useTranslations("stage.chapters.nex");
  const channels = t.raw("mech.channels") as string[];
  const laneA = t.raw("mech.laneAPills") as string[];
  const laneB = t.raw("mech.laneBPills") as string[];
  const arch = t.raw("mech.arch") as { title: string; sub: string }[];
  const rows = t.raw("mech.loupeRows") as { label: string; value: string }[];
  /** "mídia · STT" → two centred lines, as in the artboard */
  const pill = (s: string) => {
    const [a, b] = s.includes(" · ") ? [s.split(" · ")[0] + " ·", s.split(" · ")[1]] : s.includes(" ") ? s.split(" ") : [s];
    return b ? (
      <>
        {a}
        <br />
        {b}
      </>
    ) : (
      a
    );
  };
  return (
    <Stack
      loupeBox={LOUPE}
      back={
        <div className="shot dim" style={{ width: 520, height: 289, padding: 16 }}>
          <p className="bk-h">{t("mech.archHeader")}</p>
          <div className="nx-arch">
            {arch.map((b) => (
              <div key={b.title} className="nx-box">
                <b>{b.title}</b>
                <span>{b.sub}</span>
              </div>
            ))}
          </div>
          <p className="nx-foot">{t("mech.archFooter")}</p>
        </div>
      }
      front={
        <FrontLink ch={ch} aria={aria}>
          <div className="shot nx" style={{ width: 624, height: 418 }}>
            <Chrome caption={t("fig.front")} />
            <div className="dg" role="img" aria-label={t("fig.aria")}>
              <div className="nx-chs">
                <span className="nx-chl">{t("mech.channelsLabel")}</span>
                {channels.map((c) => (
                  <span key={c} className="nx-ch">
                    {c}
                  </span>
                ))}
              </div>
              <svg style={{ position: "absolute", left: 0, top: 0 }} width="624" height="300" viewBox="0 0 624 300" fill="none" aria-hidden="true">
                <path d="M134 53 H140 V277 H134" stroke="#77726A" strokeWidth="1" />
                <path d="M140 64 H150" stroke="#77726A" strokeWidth="1" />
                <path className="nx-link loop" d="M564 85 V102 H176.5 V138" stroke="#77726A" strokeWidth="1" strokeDasharray="3 3" />
                <polyline points="172.5 133 176.5 138.5 180.5 133" stroke="#77726A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="nx-lbl" style={{ left: 152, top: 24 }}>
                {t("mech.laneA")}
              </span>
              {laneA.map((p, i) => (
                <span key={i} className="nx-pill" style={{ left: NX_A[i], top: 44, width: 56 }}>
                  <i className="nx-lit loop" style={vars({ "--i": i })} />
                  <span>{pill(p)}</span>
                </span>
              ))}
              {/* lane progress: fills while the message crosses each lane */}
              <span className="nx-prog nx-pa loop" style={{ left: 152, top: 88, width: 440 }} />
              <span className="nx-lbl" style={{ left: 192, top: 120 }}>
                {t("mech.laneB")}
              </span>
              {laneB.map((p, i) => (
                <span key={i} className="nx-pill" style={{ left: NX_B[i], top: 140, width: 49 }}>
                  <i className="nx-lit loop" style={vars({ "--i": 7 + i })} />
                  <span>{p}</span>
                </span>
              ))}
              <span className="nx-prog nx-pb loop" style={{ left: 152, top: 184, width: 448 }} />
              <span className="bub bub-l nx-q loop">{t("mech.question")}</span>
              <span className="nx-dots busy-dots loop" aria-hidden="true">
                <i style={vars({ "--i": 0 })} />
                <i style={vars({ "--i": 1 })} />
                <i style={vars({ "--i": 2 })} />
              </span>
              <p className="nx-reply loop">{t("mech.reply")}</p>
              <p className="dg-cap" style={{ left: 152, top: 340, width: 228 }}>
                {t("mech.note")}
              </p>
            </div>
          </div>
        </FrontLink>
      }
      loupe={
        <div className="shot sm" style={{ width: 300, height: 212 }}>
          <div className="lp-h">{t("mech.loupeHeader")}</div>
          <dl className="nx-dl">
            {rows.map((r, i) => (
              <div key={r.label} className="loop" style={vars({ "--i": i })}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------ 04 OrbitFinance */
function OrbitFinanceStack({ ch, aria }: { ch: StageChapter; aria: string }) {
  const t = useTranslations("stage.chapters.orbitfinance");
  const rows = t.raw("mech.rows") as { label: string; value: string }[];
  return (
    <Stack
      loupeBox={MECH}
      back={<ShotBack crop={ch.back!} />}
      front={<ShotFront ch={ch} caption={t("fig.front")} aria={aria} />}
      loupe={
        <div className="shot sm of" style={{ width: 344, height: 232 }}>
          <div className="lp-h">{t("mech.header")}</div>
          <div className="of-b">
            <div className="of-bubble loop">{t("mech.bubble")}</div>
            <div className="of-slot">
              <span className="of-dots busy-dots loop" aria-hidden="true">
                <i style={vars({ "--i": 0 })} />
                <i style={vars({ "--i": 1 })} />
                <i style={vars({ "--i": 2 })} />
              </span>
              <div className="of-card loop">
                {rows.map((r, i) => (
                  <div key={r.label} className="of-row" style={vars({ "--i": i })}>
                    <span>{r.label}</span>
                    <span>{r.value}</span>
                  </div>
                ))}
                {/* decorative trend line drawn once the entry is classified */}
                <svg className="of-spark" viewBox="0 0 300 22" width="100%" height="22" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 17 L34 14 L62 16 L96 9 L128 12 L160 6 L196 10 L228 4 L262 7 L298 2" pathLength={1} />
                </svg>
              </div>
            </div>
            <div className="of-insight loop">
              <Check />
              <span>{noCheck(t("mech.insight"))}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------ 05 VibeCoding */
/* Code lines are verbatim from Demo.png (code, not copy — never translated). */
function VibeCodingStack({ ch, aria }: { ch: StageChapter; aria: string }) {
  const t = useTranslations("stage.chapters.vibecoding");
  const L = ({ i, n, children }: { i: number; n: number; children: ReactNode }) => (
    <div className="vc-line loop" style={vars({ "--i": i })}>
      <span className="ln">{n}</span>
      {children}
    </div>
  );
  return (
    <Stack
      loupeBox={MECH}
      back={<ShotBack crop={ch.back!} />}
      front={<ShotFront ch={ch} caption={t("fig.front")} aria={aria} />}
      loupe={
        <div className="shot sm vc" style={{ width: 344, height: 232 }}>
          <div className="lp-h">{t("mech.header")}</div>
          <div className="vc-b">
            <p className="vc-prompt loop" lang="pt-BR">
              {t("mech.prompt")}
            </p>
            <div className="vc-code" role="img" aria-label={t("mech.codeAria")}>
              <L i={0} n={1}>
                <span className="s">&apos;use client&apos;</span>
              </L>
              <L i={1} n={3}>
                <span className="k">import</span>
                <span className="p"> {"{"} </span>
                <span className="f">useFormStatus</span>
                <span className="p"> {"}"} </span>
                <span className="k">from</span>
                <span className="s"> &apos;react-dom&apos;</span>
              </L>
              <L i={2} n={8}>
                <span className="k">export function </span>
                <span className="f">SignUpForm</span>
                <span className="p">() {"{"}</span>
              </L>
              <L i={3} n={9}>
                <span className="k">{"  const "}</span>
                <span className="p">{"{ pending } = "}</span>
                <span className="f">useFormStatus</span>
                <span className="p">()</span>
              </L>
              <L i={4} n={11}>
                <span className="k">{"  return "}</span>
                <span className="p">(</span>
              </L>
              <L i={5} n={12}>
                <span className="p">{"    <"}</span>
                <span className="t">form</span>
                <span className="p"> className=</span>
                <span className="s">&quot;space-y-4&quot;</span>
                <span className="p">&gt;</span>
              </L>
              <L i={6} n={13}>
                <span className="p">{"      <"}</span>
                <span className="t">div</span>
                <span className="p"> className=</span>
                <span className="s">&quot;space-y-2&quot;</span>
                <span className="p">&gt;</span>
                <span className="vc-caret" aria-hidden="true" />
              </L>
            </div>
            {/* streaming bar: fills while the lines are written */}
            <div className="vc-bar loop" aria-hidden="true">
              <i />
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------ 06 Vektus */
const VK_CHUNKS: [number, number][] = [
  [-214, 3], [-240, 3], [-266, 3],
  [-214, -17], [-240, -17], [-266, -17],
  [-214, -37], [-240, -37], [-266, -37],
];
/** The three chunks the retrieval step picks (lit after the graph is drawn). */
const VK_TOP = [1, 4, 6];
const VK_DOTS: [number, number][] = [[14, 20], [44, 10], [78, 24], [26, 50], [58, 44], [86, 62], [20, 84], [62, 82]];
const VK_EDGES = ["M14 20 L44 10", "M44 10 L78 24", "M14 20 L26 50", "M44 10 L58 44", "M26 50 L58 44", "M58 44 L78 24", "M58 44 L86 62", "M26 50 L20 84", "M58 44 L62 82"];

function VektusStack({ ch, aria }: { ch: StageChapter; aria: string }) {
  const t = useTranslations("stage.chapters.vektus");
  const tc = useTranslations("common");
  const cols = t.raw("mech.columns") as string[];
  const ocr = t.raw("mech.ocr") as string[];
  const back = t.raw("mech.back") as { title: string; sub: string }[];
  const [fileName, filePages] = t("mech.file").split(" · ");
  /** "extração + OCR híbrido" → two lines at the "+" */
  const colCap = (s: string) => {
    const i = s.indexOf(" + ");
    return i < 0 ? (
      s
    ) : (
      <>
        {s.slice(0, i + 2)}
        <br />
        {s.slice(i + 3)}
      </>
    );
  };
  return (
    <Stack
      loupeBox={LOUPE}
      back={
        <div className="shot dim" style={{ width: 520, height: 289 }}>
          <div className="cap-rows">
            {back.map((r) => (
              <div key={r.title} className="cap-row">
                <b>{r.title}</b>
                <span>{r.sub}</span>
              </div>
            ))}
          </div>
        </div>
      }
      front={
        <FrontLink ch={ch} aria={aria}>
          <div className="shot vk" style={{ width: 624, height: 418 }}>
            <Chrome caption={t("fig.front")} />
            <div className="dg" role="img" aria-label={t("fig.aria")}>
              <span className="bub bub-r vk-q">{t("mech.question")}</span>
              <div className="vk-col" style={{ left: 20 }}>
                <div className="vk-body">
                  <div className="vk-doc loop">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      <path d="M10 9H8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                    </svg>
                    <i />
                    <i style={{ width: "80%" }} />
                    <i />
                    <i style={{ width: "60%" }} />
                  </div>
                  <span className="vk-dn">
                    {fileName}
                    {filePages ? (
                      <>
                        <br />· {filePages}
                      </>
                    ) : null}
                  </span>
                </div>
                <span className="vk-cc">{colCap(cols[0])}</span>
              </div>
              <span className="vk-arr loop" style={vars({ "--i": 0 }, { left: 124 })}>
                →
              </span>
              <div className="vk-col" style={{ left: 140 }}>
                <div className="vk-body">
                  {ocr.map((o, i) => (
                    <span key={o} className="vk-chip loop" style={vars({ "--i": i })}>
                      {o}
                    </span>
                  ))}
                </div>
                <span className="vk-cc">{colCap(cols[1])}</span>
              </div>
              <span className="vk-arr loop" style={vars({ "--i": 1 }, { left: 244 })}>
                →
              </span>
              <div className="vk-col" style={{ left: 260 }}>
                <div className="vk-body">
                  <div className="vk-grid">
                    {VK_CHUNKS.map(([dx, dy], i) => (
                      <span
                        key={i}
                        className={VK_TOP.includes(i) ? "vk-chunk is-top loop" : "vk-chunk loop"}
                        style={vars({ "--i": i, "--dx": `${dx}px`, "--dy": `${dy}px` })}
                      />
                    ))}
                  </div>
                </div>
                <span className="vk-cc">{colCap(cols[2])}</span>
              </div>
              <span className="vk-arr loop" style={vars({ "--i": 2 }, { left: 364 })}>
                →
              </span>
              <div className="vk-col" style={{ left: 380 }}>
                <div className="vk-body">
                  <svg viewBox="0 0 96 100" width="96" height="100" fill="none" aria-hidden="true">
                    <g stroke="#77726A" strokeWidth="1">
                      {VK_EDGES.map((d, i) => (
                        <path key={d} className="vk-edge loop" style={vars({ "--i": i })} d={d} pathLength={1} />
                      ))}
                    </g>
                    <g fill="#FB7185" stroke="#FB7185" strokeOpacity=".25" strokeWidth="4">
                      {VK_DOTS.map(([cx, cy], i) => (
                        <circle key={i} className="vk-dot loop" style={vars({ "--i": i })} cx={cx} cy={cy} r="2" />
                      ))}
                    </g>
                  </svg>
                </div>
                <span className="vk-cc">{colCap(cols[3])}</span>
              </div>
              <span className="vk-arr loop" style={vars({ "--i": 3 }, { left: 484 })}>
                →
              </span>
              <div className="vk-col" style={{ left: 500 }}>
                <div className="vk-body">
                  <span className="vk-frame">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 5v14" />
                      <path d="m19 12-7 7-7-7" />
                    </svg>
                  </span>
                </div>
                <span className="vk-cc">{colCap(cols[4])}</span>
              </div>
              <div className="vk-ans">
                <span className="vk-answer loop">{t("mech.answer")}</span>
                <span className="vk-cite loop">{t("mech.cite")}</span>
              </div>
              <p className="dg-cap" style={{ left: 20, top: 362 }}>
                {t("mech.footer")}
              </p>
            </div>
          </div>
        </FrontLink>
      }
      loupe={
        <div className="shot sm" style={{ width: 300, height: 212 }}>
          <div className="lp-h">{t("mech.loupeHeader")}</div>
          <div className="vk-lp">
            <span className="vk-big">{t("mech.loupeValue")}</span>
            <span className="vk-lc">{t("mech.loupeCaption")}</span>
            {ch.ext ? (
              <a className="qlnk ext vk-ll" href={ch.ext} target="_blank" rel="noopener noreferrer">
                {t("mech.loupeLink")} <span className="arr" aria-hidden="true">↗</span>
                <span className="sr"> {tc("opensInNewTab")}</span>
              </a>
            ) : null}
          </div>
        </div>
      }
    />
  );
}

export function DeskStack({ ch, frontAria }: { ch: StageChapter; frontAria: string }) {
  switch (ch.slug) {
    case "orbita":
      return <OrbitaStack ch={ch} aria={frontAria} />;
    case "orbitmind":
      return <OrbitMindStack ch={ch} aria={frontAria} />;
    case "nex":
      return <NexStack ch={ch} aria={frontAria} />;
    case "orbitfinance":
      return <OrbitFinanceStack ch={ch} aria={frontAria} />;
    case "vibecoding":
      return <VibeCodingStack ch={ch} aria={frontAria} />;
    case "vektus":
      return <VektusStack ch={ch} aria={frontAria} />;
  }
}
