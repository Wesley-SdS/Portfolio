"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui-v3/Button";
import { LiveOrb } from "@/components/orbita/LiveOrb";
import { ESTADOS } from "@/components/orbita/motor-webgl";
import type { OrbMode } from "@/components/orbita/presence-orb";
import { OrbitaTrigger } from "@/components/site/OrbitaTrigger";
import { SmartLink } from "@/components/ui-v3/SmartLink";

export type LabState = {
  id: OrbMode;
  /** chip label ("Pensando") */
  label: string;
  /** mono status line ("Processando · conectando possibilidades") */
  status: string;
  /** what Órbita says in this state */
  title: string;
  /** the product's one-line description under the title */
  description: string;
  /** how the core moves */
  note: string;
};

export type LabCopy = {
  stageEyebrow: string;
  tagLeft: string;
  tagRight: string;
  hint: string;
  orbAria: string;
  statesTitle: string;
  statesAria: string;
  tourLabel: string;
  talkLabel: string;
  caseLabel: string;
  caseHref: string;
};

/** "Percorrer uma conversa": the states of one exchange, in order (ms from the start). */
const TOUR: [OrbMode, number][] = [
  ["listening", 0],
  ["thinking", 2400],
  ["searching", 4800],
  ["speaking", 7200],
  ["success", 10000],
  ["idle", 12400],
];

/**
 * Órbita lab (client leaf) — the product's own presence card, rebuilt: the live core on the mint
 * stage with its glass tags, crosses and captions, then status · title · description and the
 * actions; beside it, the ten states as chips (picking one pulses the core and swaps the copy) and
 * the tour that walks through one conversation. Timers are cleared on manual picks and on unmount.
 */
export function LabClient({ states, copy }: { states: LabState[]; copy: LabCopy }) {
  const [mode, setMode] = useState<OrbMode>("idle");
  const [pulse, setPulse] = useState(0);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clear, []);

  const show = useCallback((id: OrbMode) => {
    setMode(id);
    setPulse((n) => n + 1);
  }, []);

  const pick = (id: OrbMode) => {
    clear();
    show(id);
  };

  const tour = () => {
    clear();
    timers.current = TOUR.map(([id, at]) => window.setTimeout(() => show(id), at));
  };

  const current = states.find((s) => s.id === mode) ?? states[0];

  return (
    <div className="lab">
      <article className="lab-pc tx" aria-label={copy.stageEyebrow}>
        <div className="lab-pc-top">
          <p className="lab-eb">
            <span className="lab-dot" aria-hidden="true" />
            <span>{copy.stageEyebrow}</span>
          </p>
          <span className="lab-expand" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
            </svg>
          </span>
        </div>

        <div className="lab-stage">
          <LiveOrb mode={mode} pulseKey={pulse} className="lab-canvas" label={copy.orbAria} />
          <span className="lab-cross" style={{ left: "18%", top: "24%" }} aria-hidden="true" />
          <span className="lab-cross" style={{ right: "17%", bottom: "26%" }} aria-hidden="true" />
          <span className="lab-gtag lab-gtag-l" key={`l${pulse}`} aria-hidden="true">
            <i className="lab-dot" />
            {current.label}
          </span>
          <span className="lab-gtag lab-gtag-r" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2.5l1.2 3.3 3.3 1.2-3.3 1.2L8 11.5 6.8 8.2 3.5 7l3.3-1.2L8 2.5zM12.5 11.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" />
            </svg>
            {copy.tagRight}
          </span>
          <p className="lab-cap" aria-hidden="true">
            <span>{copy.hint}</span>
            <span>NEURAL CORE</span>
          </p>
        </div>

        {/* the key restarts the swap animation on every change */}
        <div key={pulse} className="lab-copy" aria-live="polite">
          <p className="lab-status">
            <i className="lab-dot" aria-hidden="true" />
            {current.status}
          </p>
          <h3 className="lab-title">{current.title}</h3>
          <p className="lab-desc">{current.description}</p>
        </div>
        <div className="lab-actions">
          <OrbitaTrigger source="lab" variant="primary" className="lab-btn lab-btn-p">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" />
              <path d="M3 7.5a5 5 0 0 0 10 0M8 12.5V15" />
            </svg>
            {copy.talkLabel}
          </OrbitaTrigger>
          <Button variant="secondary" className="lab-btn" onClick={tour}>
            {copy.tourLabel}
          </Button>
          <SmartLink href={copy.caseHref} className="btn btn-s lab-btn">
            {copy.caseLabel}
          </SmartLink>
        </div>
      </article>

      <aside className="lab-panel">
        <p className="eb lab-panel-t">{copy.statesTitle}</p>
        <ol className="lab-states" role="group" aria-label={copy.statesAria}>
          {states.map((s, i) => {
            const on = mode === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className="lab-st"
                  aria-pressed={on}
                  onClick={() => pick(s.id)}
                  style={{ ["--h" as string]: ESTADOS[s.id].hue.join(" ") }}
                >
                  <span className="lab-st-dot" aria-hidden="true" />
                  <span className="lab-st-l">{s.label}</span>
                  <span className="lab-st-n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
                {on ? (
                  <p key={`n${pulse}`} className="lab-note">
                    {s.note}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}
