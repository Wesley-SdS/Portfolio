"use client";

import { useRef, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { BusyDots } from "@/components/ui-v3/BusyDots";
import { formatTime, type BookingMode, type Slot, type SlotDay } from "./booking";

export type SlotPickerProps = {
  idBase: string;
  status: "idle" | "loading" | "ready" | "error";
  mode: BookingMode;
  days: SlotDay[];
  day: number;
  onDay: (i: number) => void;
  slot: Slot | null;
  onSlot: (s: Slot) => void;
  onRetry: () => void;
  onNoneFits: () => void;
  locale: string;
  className?: string;
};

/**
 * Shared `.slots` card (v3spec §8.4): header, day tabs (←/→), slot grid with
 * aria-pressed buttons, "Nenhum horário serve?" link; loading / error / empty
 * variants; demo-mode note (docs/REDESIGN.md §10.3).
 */
export function SlotPicker({ idBase, status, mode, days, day, onDay, slot, onSlot, onRetry, onNoneFits, locale, className }: SlotPickerProps) {
  const t = useTranslations("orbita.slots");
  const tq = useTranslations("quote.booking");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = days[day] ?? days[0];

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const n =
      e.key === "Home" ? 0 : e.key === "End" ? days.length - 1 : (day + (e.key === "ArrowRight" ? 1 : -1) + days.length) % days.length;
    onDay(n);
    tabs.current[n]?.focus();
  };

  return (
    <div className={cn("qf-slots", className)}>
      <p className="qf-slh">{t("header")}</p>
      {mode === "demo" && status === "ready" ? <p className="qf-demo">{tq("demoNote")}</p> : null}

      {status === "loading" || status === "idle" ? (
        <div className="qf-sl-load" role="status">
          <span className="sr">{t("loading")}</span>
          <div className="qf-sl-grid" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="qf-skel" />
            ))}
          </div>
          <p className="qf-sl-busy" aria-hidden="true">
            <BusyDots />
          </p>
        </div>
      ) : status === "error" ? (
        <div className="qf-sl-msg">
          <p>{tq("slotsError")}</p>
          <button type="button" className="btn btn-s btn-sm" onClick={onRetry}>
            {tq("retry")}
          </button>
        </div>
      ) : !current ? (
        <div className="qf-sl-msg">
          <p>{tq("empty")}</p>
        </div>
      ) : (
        <>
          <div role="tablist" aria-label={t("daysAria")} className="qf-days" onKeyDown={onTabKey}>
            {days.map((d, i) => (
              <button
                key={d.key}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${idBase}-day-${i}`}
                aria-selected={i === day}
                aria-controls={`${idBase}-slots`}
                tabIndex={i === day ? 0 : -1}
                className="qf-dt"
                onClick={() => onDay(i)}
              >
                {d.tab}
              </button>
            ))}
          </div>
          <div id={`${idBase}-slots`} role="tabpanel" aria-labelledby={`${idBase}-day-${day}`} className="qf-sl-grid">
            {current.slots.map((s) => {
              const pressed = slot?.start === s.start;
              const time = formatTime(s.start, locale);
              return (
                <button
                  key={s.start}
                  type="button"
                  className={cn("qf-sl", pressed && "pop-in")}
                  aria-pressed={pressed}
                  aria-label={t("slotAria", { day: current.long, time })}
                  onClick={() => onSlot(s)}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </>
      )}
      <button type="button" className="qlnk qf-slf" onClick={onNoneFits}>
        {t("noneFits")}
      </button>
    </div>
  );
}
