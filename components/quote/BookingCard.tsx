"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar, Check, CheckCircle2, Clock, Copy, Icon } from "@/components/ui-v3/Icon";
import { buildIcs, downloadIcs, formatDayMedium, formatDayShortComma, formatTime, type Slot } from "./booking";

export type BookingCardProps = {
  status: "confirmed" | "pending";
  slot: Slot;
  email: string;
  meetUrl?: string;
  locale: string;
};

/**
 * `.bk-card` (v3spec §8.4): "Conversa marcada" with when/where/invite, .ics and
 * copy-link actions — or the waiting variant ("Pedido enviado · aguardando o Wesley").
 */
export function BookingCard({ status, slot, email, meetUrl, locale }: BookingCardProps) {
  const t = useTranslations("orbita.booking");
  const tq = useTranslations("quote.booking");
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const start = formatTime(slot.start, locale);
  const end = formatTime(slot.end, locale);

  if (status === "pending") {
    return (
      <div className="qf-bk rv" role="status">
        <div className="qf-bk-h">
          <Icon icon={Clock} size={20} style={{ color: "var(--ink-2)" }} />
          <p className="qf-bk-t" style={{ color: "var(--ink)" }}>
            {t("waitingTitle")}
          </p>
        </div>
        <p className="qf-bk-when">{tq("waitingWhen", { day: formatDayShortComma(slot.start, locale), time: start })}</p>
        <dl className="qf-bk-dl">
          <dt>{t("whereLabel")}</dt>
          <dd>{t("waitingWhere")}</dd>
        </dl>
      </div>
    );
  }

  const copy = async () => {
    if (!meetUrl) return;
    try {
      await navigator.clipboard?.writeText(meetUrl);
    } catch {
      /* clipboard blocked — the link stays visible in the card */
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const addToCalendar = () => {
    downloadIcs(buildIcs({ slot, title: tq("icsTitle"), description: tq("icsDescription"), url: meetUrl }));
  };

  return (
    <div className="qf-bk rv" role="status">
      <div className="qf-bk-h">
        <Icon icon={CheckCircle2} size={20} className="check-draw" style={{ color: "var(--ok)" }} />
        <p className="qf-bk-t">{t("title")}</p>
      </div>
      <dl className="qf-bk-dl">
        <dt>{t("whenLabel")}</dt>
        <dd>{tq("when", { day: formatDayMedium(slot.start, locale), start, end })}</dd>
        <dt>{t("whereLabel")}</dt>
        <dd className="qf-bk-url">
          {meetUrl ? (
            <>
              Google Meet ·{" "}
              <a className="qlnk" href={meetUrl} target="_blank" rel="noopener noreferrer">
                {meetUrl.replace(/^https:\/\//, "")}
              </a>
            </>
          ) : (
            tq("whereInvite")
          )}
        </dd>
        <dt>{t("inviteLabel")}</dt>
        <dd>{t("invite", { email })}</dd>
      </dl>
      <div className="qf-bk-act">
        <button type="button" className="btn btn-s btn-sm" onClick={addToCalendar}>
          <Icon icon={Calendar} size={16} />
          {t("addToCalendar")}
        </button>
        {meetUrl ? (
          <button type="button" className="btn btn-g btn-sm" onClick={copy}>
            {copied ? (
              <>
                <Icon icon={Check} size={16} className="pop-in" style={{ color: "var(--ok)" }} />
                {t("copied")}
              </>
            ) : (
              <>
                <Icon icon={Copy} size={16} />
                {t("copyLink")}
              </>
            )}
          </button>
        ) : null}
        <span className="sr" aria-live="polite">
          {copied ? tq("linkCopied") : ""}
        </span>
      </div>
    </div>
  );
}
