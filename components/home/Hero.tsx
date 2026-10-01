import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { LIGHT_RGB, STAGE_CHAPTERS } from "@/src/content/projects";
import { ANCHORS, HERO_STATS } from "@/src/content/site";
import { SCRIPT } from "@/src/content/orbita";
import { AskOrbita } from "./hero/AskOrbita";
import { HeroOrbit, type HeroSatellite } from "./hero/HeroOrbit";

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Where each stage product sits in the hero orbit system (ring 1 = inner). */
const ORBITS: Record<(typeof STAGE_CHAPTERS)[number]["slug"], { ring: 1 | 2 | 3; deg: number }> = {
  orbita: { ring: 1, deg: 310 },
  orbitmind: { ring: 1, deg: 130 },
  nex: { ring: 2, deg: 30 },
  orbitfinance: { ring: 2, deg: 215 },
  vibecoding: { ring: 3, deg: 265 },
  vektus: { ring: 3, deg: 85 },
};

/**
 * Hero (#home) — "em órbita" redesign. The page's only <h1>.
 * Left: eyebrow (role, with the live pulse) · H1 with the orbit swoosh · lead · rotating "building now"
 * line · the "Pergunte à Órbita" box (opens the real chat with the question).
 * Right: the orbit system — the live Órbita core (canvas) with the six stage products as satellites;
 * a satellite scrolls to #projects and selects its chapter. Bottom: the four count-up stats.
 * Server component; client leaves: AskOrbita, HeroOrbit. Plays at load (above the fold).
 */
export function Hero() {
  const t = useTranslations("hero");
  const ts = useTranslations("stage");
  const to = useTranslations("orbita");

  const satellites: HeroSatellite[] = STAGE_CHAPTERS.map((ch, index) => ({
    slug: ch.slug,
    label: ts(`chapters.${ch.slug}.rail.name`),
    index,
    light: LIGHT_RGB[ch.light],
    ...ORBITS[ch.slug],
  }));
  const ticker = t.raw("ticker.items") as string[];

  return (
    <section id={ANCHORS.home} className="sec home-hero" aria-labelledby="hero-title">
      <div className="inner">
        <div className="hero-grid">
          <div className="hero-col">
            <p className="hero-eb eb rv" style={v({ "--base": "0ms" })}>
              <span className="pulse" aria-hidden="true" />
              {t("eyebrow")}
            </p>

            {/* H1: the visual lines are aria-hidden; the accessible text is the plain sentence */}
            <h1 id="hero-title" className="display hero-h1" style={v({ "--base": "120ms", "--stagger": "90ms" })}>
              <span aria-hidden="true">
                <span className="mask">
                  <span style={v({ "--i": 0 })}>{t("h1.l1")}</span>
                </span>
                <span className="mask">
                  <span style={v({ "--i": 1 })}>{t("h1.l2")}</span>
                </span>
                <span className="hero-orbw">
                  <span className="mask">
                    <span className="hero-acc" style={v({ "--i": 2 })}>
                      {t("h1.l3")}
                    </span>
                  </span>
                  <svg className="hero-swoosh" viewBox="0 0 400 120" preserveAspectRatio="none" focusable="false">
                    <ellipse cx="200" cy="60" rx="196" ry="54" />
                  </svg>
                </span>
              </span>
              <span className="sr">{t("h1.plain")}</span>
            </h1>

            <p className="lead hero-lead rv" style={v({ "--base": "420ms" })}>
              {t("lead")}
            </p>

            <p className="hero-tick rv" style={v({ "--base": "500ms" })}>
              <span className="hero-tick-l">{t("ticker.label")} →</span>
              <span className="hero-tick-w" aria-hidden="true">
                <span className="hero-tick-c">
                  {[...ticker, ticker[0]].map((item, i) => (
                    <span key={i}>{item}</span>
                  ))}
                </span>
              </span>
              <span className="sr">{ticker.join(", ")}</span>
            </p>

            <div className="rv hero-ask" style={v({ "--base": "580ms" })}>
              <AskOrbita
                eyebrow={t("ask.eyebrow")}
                placeholder={t("ask.placeholder")}
                inputAria={t("ask.inputAria")}
                sendAria={t("ask.sendAria")}
                chips={SCRIPT.b0.chips.map((id) => ({ id, label: to(`chips.${id}`) }))}
              />
            </div>
          </div>

          <HeroOrbit satellites={satellites} navLabel={t("orbit.navAria")} orbLabel={t("orbit.orbAria")} />
        </div>

        <dl className="hero-stats" style={v({ "--base": "760ms", "--stagger": "90ms" })}>
          {HERO_STATS.map((s, i) => (
            <div key={s.id} className="hero-stat rv" style={v({ "--i": i })}>
              <dt>{t(`stats.${s.id}`)}</dt>
              <dd>
                <span className="cnt run" aria-hidden="true" style={v({ "--to": s.value, "--i": i })} />
                <span aria-hidden="true">{s.suffix}</span>
                <span className="sr">
                  {s.value}
                  {s.suffix}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
