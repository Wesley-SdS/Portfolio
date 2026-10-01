"use client";

import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { OrbitaAsk } from "@/components/site/orbita-bridge";
import { Icon, ArrowUp, RotateCcw, X } from "@/components/ui-v3/Icon";
import { ROUTES } from "@/src/content/site";
import { cn } from "@/lib/utils";
import { AlertLine, BookingCard, Chips, ContactCard, OrbitaText, ProjectCards, SlotPicker, ToolLine, Typing, VisitorBubble } from "./ChatParts";
import { useReducedMotion } from "./hooks";
import { LiveOrb } from "./LiveOrb";
import { useOrbitaEngine, type Msg } from "./useOrbitaEngine";

export type OrbitaChatProps = {
  /** panel (desktop drawer) · sheet (mobile) · inline (embedded; no close button) */
  variant?: "panel" | "sheet" | "inline";
  /** start the conversation (beat 0) once true; the host flips it on open / in view */
  active?: boolean;
  /** "Fechar" in the header (hidden when omitted) */
  onClose?: () => void;
  /** called whenever Órbita adds a message (hosts use it for the unread badge) */
  onOrbitaMessage?: () => void;
  className?: string;
};

export type OrbitaChatHandle = {
  /** v3spec §8.5: focus the first chip if chips are showing, else the composer */
  focusEntry: () => void;
  /** send a first message for the visitor (hero ask box); waits until the conversation has started */
  ask: (ask: OrbitaAsk) => void;
};

/**
 * <OrbitaChat> — the chat component of v3spec §8 (recipes, script, booking recipes, a11y) in the
 * artifact's drawer look: the live Órbita core in the header (it thinks, searches and speaks with
 * the conversation), bubbles and a pill composer. Clearly an AI assistant: "ASSISTENTE DE IA" chip,
 * disclosure bar with the privacy link, every message attributed to "Órbita".
 * Live (Claude) or demo (scripted) engine — see useOrbitaEngine.
 */
export const OrbitaChat = forwardRef<OrbitaChatHandle, OrbitaChatProps>(function OrbitaChat(
  { variant = "panel", active = true, onClose, onOrbitaMessage, className },
  ref,
) {
  const t = useTranslations("orbita");
  const reduced = useReducedMotion();
  const e = useOrbitaEngine({ reduced, onOrbitaMessage });
  const h2id = useId();
  const rootRef = useRef<HTMLElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (active) void e.start();
  }, [active, e.start]); // eslint-disable-line react-hooks/exhaustive-deps

  const pendingAsk = useRef<OrbitaAsk | null>(null);
  const [askTick, setAskTick] = useState(0);

  useImperativeHandle(ref, () => ({
    focusEntry: () => {
      const chip = rootRef.current?.querySelector<HTMLButtonElement>(".oc-chips .chip");
      (chip ?? taRef.current)?.focus({ preventScroll: true });
    },
    ask: (ask) => {
      pendingAsk.current = ask;
      setAskTick((n) => n + 1);
    },
  }));

  /* a queued first message goes out once Órbita has greeted and nothing is running */
  const greeted = e.msgs.some((m) => m.kind === "o");
  useEffect(() => {
    const ask = pendingAsk.current;
    if (!ask || e.busy || !greeted) return;
    pendingAsk.current = null;
    if (ask.chip) {
      for (const m of e.msgs) {
        if (m.kind !== "chips") continue;
        const chip = m.chips.find((c) => c.chipId === ask.chip);
        if (chip) {
          e.pickChip(m.id, chip);
          return;
        }
      }
      e.send(t(`chips.${ask.chip}`));
      return;
    }
    if (ask.text) e.send(ask.text);
  }, [askTick, e.busy, greeted]); // eslint-disable-line react-hooks/exhaustive-deps

  /* the header core follows the conversation: speaking while a reply streams, else the engine state */
  const liveMode = e.msgs.some((m) => m.kind === "o" && m.streaming) ? "speaking" : e.orb;

  const canSend = e.composer.trim().length > 0 && !e.busy;
  const submit = () => {
    if (!canSend) return;
    e.send(e.composer);
  };
  const onKey = (ev: KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === "Enter" && !ev.shiftKey && !ev.nativeEvent.isComposing) {
      ev.preventDefault();
      submit();
    }
  };
  const focusComposer = () => requestAnimationFrame(() => taRef.current?.focus({ preventScroll: true }));

  /** "Órbita" label on the first Órbita item of a run (after a visitor bubble or at start). */
  const labels = new Set<string>();
  let prevVisitor = true;
  for (const m of e.msgs) {
    if (m.kind === "v") prevVisitor = true;
    else if (m.kind === "o" || m.kind === "tool" || m.kind === "alert" || m.kind === "typing") {
      if (prevVisitor) labels.add(m.id);
      prevVisitor = false;
    }
  }

  const render = (m: Msg) => {
    const label = labels.has(m.id);
    switch (m.kind) {
      case "o":
        return <OrbitaText msg={m} label={label} />;
      case "v":
        return <VisitorBubble text={m.text} />;
      case "typing":
        return <Typing label={label} />;
      case "tool":
        return <ToolLine msg={m} label={label} />;
      case "alert":
        return <AlertLine text={m.text} label={label} />;
      case "chips":
        return (
          <Chips
            chips={m.chips}
            disabled={e.busy}
            onPick={(c) => {
              e.pickChip(m.id, c);
              focusComposer();
            }}
          />
        );
      case "projects":
        return <ProjectCards slugs={m.slugs} full={m.full} />;
      case "slots":
        return <SlotPicker data={m.data} picked={m.picked} locked={m.locked} onPick={(s) => e.pickSlot(m.id, s)} onNoneFits={() => e.noneFits(m.id)} />;
      case "contact":
        return <ContactCard msg={m} onSubmit={(v) => e.submitContact(m.id, v)} />;
      case "booking":
        return <BookingCard msg={m} tz={e.tz} />;
    }
  };

  return (
    <section
      ref={rootRef}
      className={cn("oc", `oc-${variant}`, className)}
      aria-labelledby={h2id}
      data-motion={reduced ? "reduced" : undefined}
    >
      <h2 className="sr" id={h2id}>
        {t("srTitle")}
      </h2>

      <div className="oc-head">
        <LiveOrb mode={liveMode} interactive={false} labels={false} className="oc-live" />
        <div className="oc-id">
          <div className="oc-name">
            {t("name")} <span className="oc-ai">{t("chip")}</span>
          </div>
          <span className="oc-st" aria-hidden="true">
            <span className="pulse" />
            <span className="oc-st-t">{t(`header.status.${e.phase}`)}</span>
            {e.isDemo && (
              <span className="oc-demo" title={t("demo.note")}>
                demo
              </span>
            )}
          </span>
        </div>
        <div className="oc-hb">
          <button type="button" className="btn btn-g oc-ib" aria-label={t("header.restart")} title={t("header.restart")} onClick={e.restart}>
            <Icon icon={RotateCcw} />
          </button>
          {onClose && (
            <button type="button" className="btn btn-g oc-ib oc-x" aria-label={t("header.close")} title={t("header.close")} onClick={onClose}>
              <Icon icon={X} />
            </button>
          )}
        </div>
      </div>


      <div className="oc-log" role="log" aria-live="polite" aria-relevant="additions" aria-label={t("log.aria")} tabIndex={-1}>
        <div className="oc-thread">
          {e.msgs.map((m) => (
            <div key={m.id} className="oc-it">
              {render(m)}
            </div>
          ))}
        </div>
      </div>

      <div className="oc-comp">
        <form
          className="oc-cform"
          onSubmit={(ev) => {
            ev.preventDefault();
            submit();
          }}
        >
          <textarea
            ref={taRef}
            className={cn("oc-ta", e.composer.includes("\n") && "is-tall")}
            rows={1}
            value={e.composer}
            maxLength={1500}
            placeholder={t("composer.placeholder")}
            aria-label={t("composer.aria")}
            onChange={(ev) => e.setComposer(ev.target.value)}
            onKeyDown={onKey}
          />
          <button
            type="submit"
            className={cn("btn btn-p btn-icon oc-send", !canSend && "btn-busy")}
            aria-label={t("composer.send")}
            aria-disabled={!canSend || undefined}
          >
            <Icon icon={ArrowUp} />
          </button>
        </form>
        <p className="oc-hint">
          {t("disclosure.text")}{" "}
          <Link className="qlnk" href={ROUTES.privacy}>
            {t("disclosure.privacy")}
          </Link>
        </p>
      </div>
    </section>
  );
});
