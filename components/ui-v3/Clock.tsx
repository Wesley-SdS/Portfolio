"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { SITE } from "@/src/content/site";

/** "14:32" in São Paulo (24h). Safe fallback if Intl time zones are unavailable. */
export function saoPauloTime(date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: SITE.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(date);
  } catch {
    return "--:--";
  }
}

/**
 * useSaoPauloClock — live HH:MM that flips `roll` between "roll-a"/"roll-b" on
 * every change so the digit-roll animation restarts (v2 library `.roll`).
 * SSR-safe: the first client render re-syncs on mount; mismatches are suppressed.
 */
export function useSaoPauloClock() {
  const [state, setState] = useState(() => ({ time: saoPauloTime(), flip: false }));
  useEffect(() => {
    const tick = () =>
      setState((prev) => {
        const time = saoPauloTime();
        return time === prev.time ? prev : { time, flip: !prev.flip };
      });
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return { time: state.time, roll: state.flip ? "roll-b" : "roll-a" };
}

/** Just the rolling time: <span class="roll roll-a"><span>14:32</span></span>. */
export function Clock({ className }: { className?: string }) {
  const { time, roll } = useSaoPauloClock();
  return (
    <span className={cn("roll", roll, className)}>
      <span suppressHydrationWarning>{time}</span>
    </span>
  );
}

/**
 * <ClockLine> — "São Paulo · 14:32 · UTC−3" as a `.meta` paragraph (hero byline, footer).
 * The time is wrapped in <time> with an sr label ("Horário de São Paulo").
 */
export function ClockLine({ className, as: Tag = "p" }: { className?: string; as?: "p" | "span" }) {
  const t = useTranslations("common.clock");
  return (
    <Tag className={cn("meta", className)}>
      <span className="sr">{t("label")}: </span>
      <span aria-hidden="true">{t("city")} · </span>
      <time>
        <Clock />
      </time>
      <span aria-hidden="true"> · {t("utc")}</span>
    </Tag>
  );
}
