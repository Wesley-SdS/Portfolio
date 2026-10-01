"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { HomeAnchorLink } from "@/components/site/HomeAnchorLink";
import { BusyDots } from "@/components/ui-v3/BusyDots";
import { Icon, AlertCircle, Calendar, Check, CheckCircle2, Clock, Copy, Search } from "@/components/ui-v3/Icon";
import { PROJECTS } from "@/src/content/projects";
import { ANCHORS } from "@/src/content/site";
import type { ProjectSlug } from "@/src/content/types";
import { closeOrbita } from "@/components/site/orbita-bridge";
import { requestQuotePrefill } from "@/components/quote/quote-bridge";
import { QUOTE_PREFILL_EVENT, type QuotePrefill, type SlotsPayload, type ToolLineId } from "@/lib/orbita/protocol";
import { dayCard, dayLong, dayTab, hm } from "./format";
import { buildIcs, downloadIcs } from "./ics";
import type { Chip, ContactErrors, Msg } from "./useOrbitaEngine";

/* Message recipes of v3spec §8.2 / §8.4 (classes ported from OrbitaChat.dc.html → orbita.css). */

const TOOL_ICON: Record<ToolLineId, typeof Search> = { portfolio: Search, calendar: Calendar, invite: Calendar, request: Calendar };

export function OrbitaText({ msg, label }: { msg: Extract<Msg, { kind: "o" }>; label: boolean }) {
  const t = useTranslations("orbita");
  return (
    <div className="oc-o status-in">
      {label && <span className="oc-lbl">{t("name")}</span>}
      {msg.text &&
        (msg.streaming ? (
          <p className="oc-txt" aria-hidden="true">
            {msg.text}
          </p>
        ) : (
          <p className="oc-txt" key="final">
            {!label && <span className="sr">{t("name")}: </span>}
            {msg.text}
          </p>
        ))}
      {msg.link && <QuoteLink label={msg.link.label} prefill={msg.link.prefill} />}
    </div>
  );
}

/**
 * "Detalhar orçamento →" — quote prefill contract (docs/REDESIGN.md §10.1): same page → the
 * `orbita:quote-prefill` event (full prefill) + requestQuotePrefill() (scroll + focus);
 * other pages → /?formato=&solucao=#cotacao.
 */
function QuoteLink({ label, prefill }: { label: string; prefill?: QuotePrefill }) {
  const qs = new URLSearchParams();
  if (prefill?.engagement) qs.set("formato", prefill.engagement);
  if (prefill?.solutions?.length) qs.set("solucao", prefill.solutions.join(","));
  const href = `/${qs.size ? `?${qs}` : ""}#${ANCHORS.quote}`;
  return (
    <Link
      href={href}
      className="qlnk oc-ql"
      onClick={(ev) => {
        if (!document.getElementById(ANCHORS.quote)) return;
        ev.preventDefault();
        closeOrbita();
        if (prefill) window.dispatchEvent(new CustomEvent(QUOTE_PREFILL_EVENT, { detail: { ...prefill, source: "orbita" } }));
        requestQuotePrefill({ engagement: prefill?.engagement, solutions: prefill?.solutions });
      }}
    >
      {label}{" "}
      <span className="arr" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

export function VisitorBubble({ text }: { text: string }) {
  const t = useTranslations("orbita");
  return (
    <p className="oc-v status-in">
      <span className="sr">{t("log.you")} </span>
      {text}
    </p>
  );
}

export function Typing({ label }: { label: boolean }) {
  const t = useTranslations("orbita");
  return (
    <div className="oc-typing">
      {label && <span className="oc-lbl">{t("name")}</span>}
      <span className="oc-dots">
        <BusyDots />
        <span className="sr">{t("log.typing")}</span>
      </span>
    </div>
  );
}

export function ToolLine({ msg, label }: { msg: Extract<Msg, { kind: "tool" }>; label: boolean }) {
  const t = useTranslations("orbita");
  return (
    <div className="oc-o">
      {label && <span className="oc-lbl status-in">{t("name")}</span>}
      {msg.state === "running" ? (
        <p className="oc-tool status-in" aria-hidden="true">
          <Icon icon={TOOL_ICON[msg.tool]} size={16} />
          <span>
            {t(`tools.${msg.tool}.running`)}
            <BusyDots />
          </span>
        </p>
      ) : msg.state === "done" ? (
        <p className="oc-tool status-in" key="done">
          <Icon icon={Check} size={16} className="ok" />
          <span>{t(`tools.${msg.tool}.done`)}</span>
        </p>
      ) : (
        <p className="oc-tool is-err status-in" key="err">
          <Icon icon={AlertCircle} size={16} />
          <span>{msg.errorText ?? t("tools.error")}</span>
        </p>
      )}
    </div>
  );
}

export function AlertLine({ text, label }: { text: string; label: boolean }) {
  const t = useTranslations("orbita");
  return (
    <div className="oc-o">
      {label && <span className="oc-lbl">{t("name")}</span>}
      <p className="oc-tool is-err status-in" role="status">
        <Icon icon={AlertCircle} size={16} />
        <span>{text}</span>
      </p>
    </div>
  );
}

export function Chips({ chips, onPick, disabled }: { chips: Chip[]; onPick: (c: Chip) => void; disabled: boolean }) {
  const t = useTranslations("orbita");
  return (
    <div className="oc-chips status-in" role="group" aria-label={t("log.quickReplies")}>
      {chips.map((c) => (
        <button key={c.key} type="button" className="chip" aria-disabled={disabled || undefined} onClick={() => !disabled && onPick(c)}>
          {c.label}
        </button>
      ))}
    </div>
  );
}

export function ProjectCards({ slugs, full }: { slugs: string[]; full?: boolean }) {
  const t = useTranslations();
  return (
    <div className="oc-cards status-in">
      {slugs.map((slug) => {
        const p = PROJECTS[slug as ProjectSlug];
        if (!p) return null;
        const card = `orbita.projectCards.${slug}`;
        const has = (k: string) => t.has(`${card}.${k}`);
        const name = has("name") ? t(`${card}.name`) : t(`products.items.${slug}.name`);
        const meta = full && has("metaLong") ? t(`${card}.metaLong`) : has("meta") ? t(`${card}.meta`) : t.has(`products.items.${slug}.highlight`) ? t(`products.items.${slug}.highlight`) : "";
        const linkLabel = has("link") ? t(`${card}.link`) : t("orbita.projectCards.more");
        const statusWord = t(`common.status.${p.status}`);
        const ring = p.status === "inDevelopment" || p.status === "beta";
        return (
          <div key={slug} className={`oc-card${full ? " is-full" : ""}`}>
            <div className="oc-card-h">
              {p.light && <span className="dot" aria-hidden="true" style={{ color: `rgb(var(--l-${p.light}))` }} />}
              <span className="oc-card-n">{name}</span>
              <span className="oc-tag">
                <span className={ring ? "dot dot-ring" : "dot"} aria-hidden="true" style={{ color: ring ? "var(--accent)" : "var(--ok)" }} />
                {statusWord}
              </span>
            </div>
            <div className="oc-card-b">
              {meta && <span className="oc-card-m">{meta}</span>}
              {p.caseHref ? (
                <Link className="qlnk" href={p.caseHref}>
                  {linkLabel}{" "}
                  <span className="arr" aria-hidden="true">
                    →
                  </span>
                </Link>
              ) : (
                <HomeAnchorLink anchor={ANCHORS.allProducts} className="qlnk">
                  {linkLabel}{" "}
                  <span className="arr" aria-hidden="true">
                    →
                  </span>
                </HomeAnchorLink>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SlotPicker({
  data,
  picked,
  locked,
  onPick,
  onNoneFits,
}: {
  data: SlotsPayload;
  picked?: string;
  locked?: boolean;
  onPick: (start: string) => void;
  onNoneFits: () => void;
}) {
  const t = useTranslations("orbita");
  const locale = useLocale();
  const uid = useId();
  const days = data.days.slice(0, 3);
  const initial = picked ? Math.max(0, days.findIndex((d) => d.slots.some((s) => s.start === picked))) : 0;
  const [sel, setSel] = useState(initial);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const tz = data.timeZone;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % days.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + days.length) % days.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = days.length - 1;
    else return;
    e.preventDefault();
    if (!locked) setSel(n);
    tabs.current[n]?.focus();
  };
  const day = days[sel] ?? days[0];
  if (!day) return null;

  return (
    <div className={`oc-slots status-in${locked ? " is-locked" : ""}`}>
      <p className="oc-sh">{t("slots.header")}</p>
      <div className="oc-days" role="tablist" aria-label={t("slots.daysAria")}>
        {days.map((d, i) => (
          <button
            key={d.date}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-t${i}`}
            aria-selected={i === sel}
            aria-controls={`${uid}-p`}
            tabIndex={i === sel ? 0 : -1}
            className="oc-day"
            onClick={() => !locked && setSel(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {dayTab(d.slots[0].start, locale, tz)}
          </button>
        ))}
      </div>
      <div className="oc-grid" role="tabpanel" id={`${uid}-p`} aria-labelledby={`${uid}-t${sel}`}>
        {day.slots.map((s) => {
          const on = picked === s.start;
          return (
            <button
              key={s.start}
              type="button"
              className={`oc-slot${on ? " pop-in" : ""}`}
              aria-pressed={on}
              aria-disabled={locked || undefined}
              aria-label={t("slots.slotAria", { day: dayLong(s.start, locale, tz), time: hm(s.start, locale, tz) })}
              onClick={() => !locked && onPick(s.start)}
            >
              {hm(s.start, locale, tz)}
            </button>
          );
        })}
      </div>
      {!locked && (
        <div className="oc-slots-f">
          <button type="button" className="oc-none qlnk" onClick={onNoneFits}>
            {t("slots.noneFits")}
          </button>
        </div>
      )}
    </div>
  );
}

export function ContactCard({
  msg,
  onSubmit,
}: {
  msg: Extract<Msg, { kind: "contact" }>;
  onSubmit: (v: { name: string; email: string; consent: boolean }) => void;
}) {
  const t = useTranslations("orbita");
  const uid = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const e: ContactErrors = msg.errors ?? {};
  const disabled = msg.state !== "idle";

  useEffect(() => {
    if (e.name) nameRef.current?.focus();
    else if (e.email) emailRef.current?.focus();
    else if (e.consent) consentRef.current?.focus();
  }, [e.name, e.email, e.consent]);

  return (
    <form
      className="oc-form status-in"
      noValidate
      aria-label={msg.variant === "book" ? t("contactCard.confirm") : t("contactCard.send")}
      onSubmit={(ev) => {
        ev.preventDefault();
        if (disabled) return;
        onSubmit({ name: nameRef.current?.value ?? "", email: emailRef.current?.value ?? "", consent: consentRef.current?.checked ?? false });
      }}
    >
      <fieldset disabled={msg.state === "done"} className="oc-fs">
        <div className="oc-f">
          <label className="oc-fl" htmlFor={`${uid}-n`}>
            {t("contactCard.name")}
          </label>
          <input
            ref={nameRef}
            id={`${uid}-n`}
            className="oc-in"
            name="name"
            autoComplete="name"
            defaultValue={msg.prefill?.name}
            maxLength={120}
            aria-invalid={e.name || undefined}
            aria-describedby={`${uid}-ne`}
          />
          <p id={`${uid}-ne`} className={`err${e.name ? " is-on" : ""}`} aria-live="polite">
            {e.name && (
              <>
                <Icon icon={AlertCircle} size={14} />
                {t("contactCard.errors.name")}
              </>
            )}
          </p>
        </div>
        <div className="oc-f">
          <label className="oc-fl" htmlFor={`${uid}-e`}>
            {t("contactCard.email")}
          </label>
          <input
            ref={emailRef}
            id={`${uid}-e`}
            className="oc-in"
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            defaultValue={msg.prefill?.email}
            maxLength={200}
            aria-invalid={e.email || undefined}
            aria-describedby={`${uid}-ee`}
          />
          <p id={`${uid}-ee`} className={`err${e.email ? " is-on" : ""}`} aria-live="polite">
            {e.email && (
              <>
                <Icon icon={AlertCircle} size={14} />
                {t("contactCard.errors.email")}
              </>
            )}
          </p>
        </div>
        <label className="oc-consent" htmlFor={`${uid}-c`}>
          <input ref={consentRef} id={`${uid}-c`} type="checkbox" name="consent" aria-invalid={e.consent || undefined} aria-describedby={`${uid}-ce ${uid}-m`} />
          <span>{msg.variant === "book" ? t("contactCard.consent") : t("contactCard.consentCallback")}</span>
        </label>
        <p id={`${uid}-ce`} className={`err${e.consent ? " is-on" : ""}`} aria-live="polite">
          {e.consent && (
            <>
              <Icon icon={AlertCircle} size={14} />
              {t("contactCard.errors.consent")}
            </>
          )}
        </p>
        <p id={`${uid}-m`} className="oc-micro">
          {t("contactCard.micro")}
        </p>
        <input className="oc-hp" tabIndex={-1} autoComplete="off" name="website" aria-hidden="true" defaultValue="" />
        <button
          type="submit"
          className={`btn btn-p oc-full${msg.state === "sending" ? " btn-busy" : ""}`}
          aria-busy={msg.state === "sending" || undefined}
          aria-disabled={disabled || undefined}
        >
          {msg.state === "sending" ? (
            <>
              {t("contactCard.sending")}
              <BusyDots />
            </>
          ) : msg.state === "done" ? (
            <>
              <Icon icon={Check} size={16} />
              {msg.variant === "book" ? t("contactCard.confirm") : t("contactCard.send")}
            </>
          ) : msg.variant === "book" ? (
            t("contactCard.confirm")
          ) : (
            t("contactCard.send")
          )}
        </button>
      </fieldset>
    </form>
  );
}

export function BookingCard({ msg, tz }: { msg: Extract<Msg, { kind: "booking" }>; tz: string }) {
  const t = useTranslations("orbita");
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);
  const when = t("booking.whenValue", {
    date: dayCard(msg.start, locale, tz),
    start: hm(msg.start, locale, tz),
    end: hm(msg.end, locale, tz),
    tz: t("slots.tzName"),
  });
  const confirmed = msg.variant === "confirmed";

  return (
    <div className="oc-bk status-in">
      {confirmed ? (
        <p className="oc-bk-h" style={{ color: "var(--ok)" }}>
          <Icon icon={CheckCircle2} size={20} className="check-draw" />
          {t("booking.title")}
        </p>
      ) : (
        <p className="oc-bk-h">
          <Icon icon={Clock} size={20} style={{ color: "var(--ink-2)" }} />
          {t("booking.waitingTitle")}
        </p>
      )}
      <dl>
        <dt>{t("booking.whenLabel")}</dt>
        <dd>{when}</dd>
        <dt>{t("booking.whereLabel")}</dt>
        <dd>
          {!confirmed ? (
            t("booking.waitingWhere")
          ) : msg.meetLink ? (
            <>
              {t("booking.meet")} ·{" "}
              <a className="qlnk" href={msg.meetLink} target="_blank" rel="noopener noreferrer">
                {msg.meetLink.replace(/^https?:\/\//, "")}
              </a>
            </>
          ) : (
            t("booking.where")
          )}
        </dd>
        {confirmed && (
          <>
            <dt>{t("booking.inviteLabel")}</dt>
            <dd>{t("booking.invite", { email: msg.email })}</dd>
          </>
        )}
      </dl>
      {confirmed && (
        <div className="oc-bk-a">
          <button
            type="button"
            className="btn btn-s btn-sm"
            onClick={() =>
              downloadIcs(
                "conversa-wesley-santos.ics",
                buildIcs({ start: msg.start, end: msg.end, title: t("booking.icsTitle"), description: t("booking.icsDescription"), location: msg.meetLink }),
              )
            }
          >
            <Icon icon={Calendar} size={16} />
            {t("booking.addToCalendar")}
          </button>
          <button
            type="button"
            className="btn btn-g btn-sm"
            onClick={() => {
              void navigator.clipboard?.writeText(msg.meetLink ?? t("booking.where")).then(() => setCopied(true), () => setCopied(true));
            }}
          >
            <Icon icon={copied ? Check : Copy} size={16} />
            <span aria-live="polite">{copied ? t("booking.copied") : t("booking.copyLink")}</span>
          </button>
        </div>
      )}
      {msg.demo && <p className="oc-bk-demo">{t("demo.bookingNote")}</p>}
    </div>
  );
}
