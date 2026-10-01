"use client";

import { useRef, useState, type FormEvent } from "react";
import { Chip } from "@/components/ui-v3/Chip";
import { ArrowUp, Icon } from "@/components/ui-v3/Icon";
import { openOrbita } from "@/components/site/orbita-bridge";
import { ORBITA_PANEL_ID, type ChipId } from "@/src/content/orbita";

export type AskOrbitaProps = {
  /** eyebrow line above the field */
  eyebrow: string;
  placeholder: string;
  inputAria: string;
  sendAria: string;
  /** quick replies: the chat's own opening chips */
  chips: { id: ChipId; label: string }[];
};

/**
 * Hero "Pergunte à Órbita" box — the visitor types a question (or picks a quick reply) and the
 * real chat opens with it as the first message (orbita-bridge `ask`). Submitting empty just opens
 * the chat. Without JS the field does nothing; the contact section still lists the direct channels.
 */
export function AskOrbita({ eyebrow, placeholder, inputAria, sendAria, chips }: AskOrbitaProps) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = q.trim().slice(0, 1500);
    openOrbita({ source: "hero", returnFocus: input.current, ask: text ? { text } : undefined });
    setQ("");
  };

  return (
    <div className="ask">
      <p className="ask-eb eb">
        <span className="pulse" aria-hidden="true" />
        <span>{eyebrow}</span>
      </p>
      <form className="ask-row" onSubmit={submit}>
        <input
          ref={input}
          className="ask-in"
          type="text"
          value={q}
          maxLength={1500}
          placeholder={placeholder}
          aria-label={inputAria}
          autoComplete="off"
          enterKeyHint="send"
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" className="btn btn-p btn-icon ask-send" aria-label={sendAria} aria-haspopup="dialog" aria-controls={ORBITA_PANEL_ID}>
          <Icon icon={ArrowUp} />
        </button>
      </form>
      <div className="ask-chips">
        {chips.map((c) => (
          <Chip
            key={c.id}
            aria-haspopup="dialog"
            aria-controls={ORBITA_PANEL_ID}
            onClick={(e) => openOrbita({ source: "hero", returnFocus: e.currentTarget, ask: { chip: c.id } })}
          >
            {c.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
