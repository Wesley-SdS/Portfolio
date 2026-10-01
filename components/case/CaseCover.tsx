import type { CSSProperties, ReactNode } from "react";
import { CropImage } from "@/components/ui-v3/CropImage";
import { MetricValue } from "@/components/ui-v3/MetricValue";
import { SmartLink } from "@/components/ui-v3/SmartLink";
import { StatusTag } from "@/components/ui-v3/StatusTag";
import { LIGHT_RGB } from "@/src/content/projects";
import type { CaseConfig } from "@/src/content/cases";
import type { Locale } from "@/src/content/types";
import { OrbitaButton } from "./OrbitaButton";
import { TiltStage } from "./TiltStage";
import type { Tr } from "./types";

type Row = { label: string; value: string };
type Lane = { label: string; pills: string[] };
type Card = { title: string; sub: string };

/* ---------------------------------------------------------------- schematic fronts (illustrative) */

function PipelineFront({ t }: { t: Tr }) {
  const nodes = t.raw("cover.schematic.nodes") as string[];
  const log = t.raw("cover.schematic.log") as string[];
  return (
    <div className="cs-sch">
      <div className="cs-sch-arch">
        <span className="cs-sch-eb">{t("cover.schematic.architect")}</span>
        <span className="cs-sch-bubble">{t("cover.schematic.bubble")}</span>
      </div>
      <ol className="cs-sch-nodes">
        {nodes.map((n, i) => (
          <li key={n} className={i === 5 ? "is-veto" : i === 6 ? "is-check" : undefined}>
            {n}
          </li>
        ))}
      </ol>
      <p className="cs-sch-marks">
        <span className="cs-sch-mark is-veto">{t("cover.schematic.veto")}</span>
        <span className="cs-sch-mark is-check">{t("cover.schematic.checkpoint")}</span>
        <span className="cs-sch-mark">{t("cover.schematic.loop")}</span>
      </p>
      <ul className="cs-sch-log">
        {log.map((l, i) => (
          <li key={i} className="e-text" style={{ ["--d" as string]: `${520 + i * 90}ms` } as CSSProperties}>
            {l}
          </li>
        ))}
      </ul>
      <p className="cs-sch-foot">{t("cover.schematic.footer")}</p>
    </div>
  );
}

function LanesFront({ t }: { t: Tr }) {
  const channels = t.raw("cover.schematic.channels") as string[];
  const lanes = t.raw("cover.schematic.lanes") as Lane[];
  return (
    <div className="cs-sch">
      <p className="cs-sch-row">
        <span className="cs-sch-eb">{t("cover.schematic.channelsLabel")}</span>
        {channels.map((c) => (
          <span key={c} className="cs-sch-chip">
            {c}
          </span>
        ))}
      </p>
      {lanes.map((lane, li) => (
        <div key={lane.label} className="cs-sch-lane">
          <span className="cs-sch-eb">{lane.label}</span>
          <ol className={li === 1 ? "cs-sch-pills is-l" : "cs-sch-pills"}>
            {lane.pills.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      ))}
      <div className="cs-sch-chat">
        <span className="cs-sch-bubble is-q">{t("cover.schematic.question")}</span>
        <span className="cs-sch-bubble is-a">{t("cover.schematic.reply")}</span>
      </div>
      <p className="cs-sch-foot">{t("cover.schematic.footer")}</p>
    </div>
  );
}

function ColumnsFront({ t }: { t: Tr }) {
  const cols = t.raw("cover.schematic.columns") as string[];
  const ocr = t.raw("cover.schematic.ocr") as string[];
  return (
    <div className="cs-sch">
      <p className="cs-sch-row is-end">
        <span className="cs-sch-bubble is-q">{t("cover.schematic.question")}</span>
      </p>
      <ol className="cs-sch-cols">
        {cols.map((c, i) => (
          <li key={c}>
            <span className="cs-sch-eb">{c}</span>
            <span className="cs-sch-col">
              {i === 0 ? <span className="cs-sch-file">{t("cover.schematic.file")}</span> : null}
              {i === 1
                ? ocr.map((o) => (
                    <span key={o} className="cs-sch-chip">
                      {o}
                    </span>
                  ))
                : null}
              {i === 2 ? (
                <span className="cs-sch-chunks" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              ) : null}
              {i === 3 ? (
                <span className="cs-sch-dots" aria-hidden="true">
                  {Array.from({ length: 16 }).map((_, k) => (
                    <i key={k} className={k === 5 || k === 10 ? "is-on" : undefined} />
                  ))}
                </span>
              ) : null}
              {i === 4 ? (
                <>
                  <span className="cs-sch-answer">{t("cover.schematic.answer")}</span>
                  <span className="cs-sch-cite">{t("cover.schematic.cite")}</span>
                </>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
      <p className="cs-sch-foot">{t("cover.schematic.footer")}</p>
    </div>
  );
}

/* --------------------------------------------------------------------------- cover */

export function CaseCover({
  cfg,
  t,
  tc,
  tg,
  locale,
  hasScreens,
}: {
  cfg: CaseConfig;
  t: Tr;
  tc: Tr;
  tg: Tr;
  locale: Locale;
  hasScreens: boolean;
}) {
  const light = LIGHT_RGB[cfg.light];
  const { front, back, loupe, metrics } = cfg.cover;
  const name = t("h1");
  const frontTarget = front.kind === "screen" && hasScreens ? "#telas" : "#arquitetura";

  let frontBody: ReactNode;
  if (front.kind === "screen") {
    frontBody = (
      <span className="cs-front-crop" style={{ background: front.bg }}>
        <CropImage crop={front.crop} aspect={false} style={{ width: "100%", height: "100%" }} renderWidth={624} priority />
      </span>
    );
  } else if (front.kind === "pipeline") {
    frontBody = <PipelineFront t={t} />;
  } else if (front.kind === "lanes") {
    frontBody = <LanesFront t={t} />;
  } else {
    frontBody = <ColumnsFront t={t} />;
  }

  return (
    <TiltStage light={light} labelledBy="case-title">
      <div className="light is-on cs-cover-light" />
      <div className="vignette" />
      <div className="ch is-active cs-cover-ch">
        <div className="cs-cover-text">
          <nav aria-label={tc("breadcrumbAria")} className="e-meta">
            <ol className="cs-crumbs">
              <li>
                <SmartLink href="/#projects" className="qlnk">
                  {tc("breadcrumbProducts")}
                </SmartLink>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="cs-crumb-cur">
                {name}
              </li>
            </ol>
          </nav>
          <div className="e-meta cs-cover-tagrow">
            <StatusTag status={cfg.status} onStage />
            <span className="cs-cover-meta">{t("meta")}</span>
          </div>
          <h1 id="case-title" className="cs-h1">
            <span className="mask" style={{ ["--base" as string]: "800ms" } as CSSProperties}>
              <span>{name}</span>
            </span>
          </h1>
          <p className="e-text cs-descriptor" style={{ ["--d" as string]: "320ms" } as CSSProperties}>
            {t("descriptor")}
          </p>
          <div className="e-text cs-cover-ctas" style={{ ["--d" as string]: "440ms" } as CSSProperties}>
            <a href="#arquitetura" className="btn btn-p">
              {t("ctaArchitecture")}
              <span className="arr arr-down" aria-hidden="true">
                ↓
              </span>
            </a>
            {cfg.github ? (
              <a href={cfg.github} target="_blank" rel="noopener noreferrer" className="qlnk ext cs-ui">
                {tg("common.links.github")}
                <span className="arr" aria-hidden="true">
                  ↗
                </span>
                <span className="sr">{tg("common.opensInNewTab")}</span>
              </a>
            ) : (
              <span className="cs-private">{tg("common.links.privateCode")}</span>
            )}
            {cfg.extraLink ? (
              <a href={cfg.extraLink.href} className="qlnk ext cs-ui" title={tc("siteSoon")}>
                {tg(cfg.extraLink.labelKey)}
                <span className="arr" aria-hidden="true">
                  ↗
                </span>
              </a>
            ) : null}
            {cfg.orbita ? <OrbitaButton className="qlnk btn-reset cs-ui cs-stage-ink">{tg("common.actions.talkToOrbita")}</OrbitaButton> : null}
          </div>
        </div>

        <dl className="e-metrics cs-cover-metrics">
          {metrics.map((m, i) => (
            <div key={m.labelKey}>
              <dt>{t(`cover.metrics.${m.labelKey}`)}</dt>
              <dd>
                <MetricValue metric={m} locale={locale} animate="stage" index={i} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="cs-stackbox">
          <div className="stack cs-stack">
            <div className="tilt">
              <div className="push">
                {back ? (
                  <div className="par back cs-back">
                    <div className="e-back cs-fill">
                      {back.kind === "screen" ? (
                        <div className="shot dim cs-fill">
                          <span className="cs-fill cs-block" style={{ background: back.bg }}>
                            <CropImage crop={back.crop} aspect={false} decorative style={{ width: "100%", height: "100%" }} renderWidth={520} />
                          </span>
                          {back.tag ? <span className="cs-back-tag">{t("fig.backTag")}</span> : null}
                        </div>
                      ) : (
                        <div className="shot cs-fill cs-cards" aria-hidden="true">
                          {(t.raw("cover.back") as Card[]).map((c) => (
                            <span key={c.title} className="cs-card">
                              <span className="node-t">{c.title}</span>
                              <span className="node-s">{c.sub}</span>
                            </span>
                          ))}
                          {t.has("cover.backFooter") ? <span className="cs-cards-foot">{t("cover.backFooter")}</span> : null}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                <div className="par front cs-front">
                  <div className="e-front cs-fill">
                    <a className="stack-link cs-fill" href={frontTarget} aria-label={tc(frontTarget === "#telas" ? "toScreens" : "toArchitecture", { name })}>
                      <div className="shot cs-front-shot">
                        <div className="chrome">
                          <i />
                          <i />
                          <i />
                          <span className="cs-chrome-t">{t("fig.front")}</span>
                        </div>
                        {frontBody}
                      </div>
                    </a>
                  </div>
                </div>

                {loupe?.kind === "phone" ? (
                  <div className="par loupe cs-loupe-phone">
                    <div className="e-loupe cs-fill">
                      <div className="float cs-fill">
                        <div className="shot sm cs-phone" style={{ background: loupe.bg }}>
                          <CropImage crop={loupe.crop} aspect={false} style={{ width: "100%", height: "100%" }} sizes="220px" />
                        </div>
                        <p className="cs-loupe-cap">{t("fig.phone")}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
                {loupe?.kind === "crop" ? (
                  <div className="par loupe cs-loupe-crop" style={{ width: loupe.width }}>
                    <div className="e-loupe cs-fill">
                      <div className="shot sm">
                        <div className="cs-loupe-head">{t("fig.loupeHeader")}</div>
                        <span className="cs-block" style={{ width: loupe.width, height: loupe.height, background: loupe.bg }}>
                          <CropImage crop={loupe.crop} aspect={false} style={{ width: "100%", height: "100%" }} renderWidth={loupe.width} />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
                {loupe?.kind === "stats" ? (
                  <div className="par loupe cs-loupe-stats">
                    <div className="e-loupe cs-fill">
                      <div className="shot sm cs-stats" aria-hidden="true">
                        <div className="cs-loupe-head">{t("cover.loupe.header")}</div>
                        {t.has("cover.loupe.rows") ? (
                          <dl className="cs-stats-rows">
                            {(t.raw("cover.loupe.rows") as Row[]).map((r) => (
                              <div key={r.label}>
                                <dt>{r.label}</dt>
                                <dd>{r.value}</dd>
                              </div>
                            ))}
                          </dl>
                        ) : (
                          <div className="cs-stats-big">
                            <span className="cs-stats-v">{t("cover.loupe.value")}</span>
                            <span className="cs-stats-c">{t("cover.loupe.caption")}</span>
                            <span className="cs-stats-l">{t("cover.loupe.link")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TiltStage>
  );
}
