"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Button, buttonClass } from "@/components/ui-v3/Button";
import { BusyDots } from "@/components/ui-v3/BusyDots";
import { AlertCircle, AlertTriangle, ArrowRight, Check, CheckCircle2, Icon, X } from "@/components/ui-v3/Icon";
import { ROUTES } from "@/src/content/site";
import { DEMO_VISITOR } from "@/src/content/orbita";
import {
  QUOTE_BUDGETS,
  QUOTE_DEADLINES,
  QUOTE_ENGAGEMENTS,
  QUOTE_SOLUTIONS,
  QUOTE_STARTS,
  QUOTE_STEP_COUNT,
  type QuoteSolution,
} from "@/src/content/quote";
import { RadioGroup } from "./RadioGroup";
import { SlotPicker } from "./SlotPicker";
import { BookingCard } from "./BookingCard";
import { bookSlot, fetchSlots, groupSlots, sendSlotPreference, type BookingMode, type Slot, type SlotDay } from "./booking";
import { hasPrefill, prefillFromSearch, sanitizePrefill } from "./prefill";
import { ORBITA_QUOTE_PREFILL_EVENT, QUOTE_PREFILL_EVENT } from "./quote-bridge";
import {
  EMPTY_VALUES,
  STEP_FIELDS,
  buildPayload,
  firstInvalidStep,
  firstName,
  validateStep,
  type FormStep,
  type QuoteField,
  type QuoteLocale,
  type QuoteValues,
  type StepErrors,
} from "./validate";

type Phase = FormStep | "sending" | 6 | 7 | "waitEmail";
type SlotsState = { status: "idle" | "loading" | "ready" | "error"; mode: BookingMode; days: SlotDay[] };
type Booking = { status: "confirmed" | "pending"; meetUrl?: string; slot: Slot };

export type QuoteFormProps = {
  /** payload `source` (the Órbita chat reuses "orbita") */
  source?: "site" | "orbita";
  className?: string;
};

const SHOW_EXAMPLE = process.env.NODE_ENV !== "production";
const MIN_SENDING_MS = 700;

/**
 * QuoteForm (v3spec §7) — 5-step quote request → POST /api/quote → success
 * summary + slot picker (GET /api/orbita/slots) → booking (POST /api/orbita/book).
 * Fluid: the 600×800 artboard frame at ≥520px container width, the 350×760
 * compact stepper (v3spec §6.4) below (container query in quote.css).
 * Prefill: ?tipo= / ?formato= / ?solucao= and the `quote:prefill` event (REDESIGN §10.1).
 */
export function QuoteForm({ source = "site", className }: QuoteFormProps) {
  const t = useTranslations("quote");
  const tRoot = useTranslations();
  const locale = useLocale() as QuoteLocale;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (s: string) => `qf${uid}-${s}`;

  const [phase, setPhase] = useState<Phase>(1);
  const [dir, setDir] = useState<1 | -1>(1);
  const [values, setValues] = useState<QuoteValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<StepErrors>({});
  const [sendError, setSendError] = useState<string | null>(null);
  const [shake, setShake] = useState<0 | 1 | 2>(0);
  const [confirmationSent, setConfirmationSent] = useState(true);
  const [slots, setSlots] = useState<SlotsState>({ status: "idle", mode: "auto", days: [] });
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookBusy, setBookBusy] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const [stepKey, setStepKey] = useState(0);
  const [prefSource, setPrefSource] = useState<"site" | "orbita" | null>(null);

  const honeypot = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const mounted = useRef(true);
  const lastStepKey = useRef(0);
  const phaseRef = useRef<Phase>(1);
  phaseRef.current = phase;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const set = <K extends keyof QuoteValues>(k: K, v: QuoteValues[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => {
      if (!(k in prev)) return prev;
      const next = { ...prev };
      delete next[k as QuoteField];
      return next;
    });
  };

  /* ---------- prefill (URL on mount + same-page event) ---------- */
  const applyPrefill = useCallback((raw: unknown) => {
    const p = sanitizePrefill(raw as Parameters<typeof sanitizePrefill>[0]);
    if (!hasPrefill(p)) return;
    const ph = phaseRef.current;
    if (typeof ph !== "number" || ph > 5) return;
    setValues((prev) => ({
      ...prev,
      ref: p.ref ?? prev.ref,
      engagement: p.engagement ?? prev.engagement,
      solutions: p.solutions ?? prev.solutions,
      deadline: p.deadline ?? prev.deadline,
      description: prev.description.trim() ? prev.description : p.description ?? prev.description,
    }));
    if (p.source) setPrefSource(p.source);
    setErrors({});
  }, []);

  useEffect(() => {
    applyPrefill(prefillFromSearch(window.location.search));
    const onPrefill = (e: Event) => applyPrefill((e as CustomEvent<unknown>).detail ?? {});
    window.addEventListener(QUOTE_PREFILL_EVENT, onPrefill);
    window.addEventListener(ORBITA_QUOTE_PREFILL_EVENT, onPrefill);
    return () => {
      window.removeEventListener(QUOTE_PREFILL_EVENT, onPrefill);
      window.removeEventListener(ORBITA_QUOTE_PREFILL_EVENT, onPrefill);
    };
  }, [applyPrefill]);

  /* ---------- focus: heading on every phase change (not on first render) ---------- */
  useEffect(() => {
    // stepKey only changes through go()/server-error jumps — never on mount (StrictMode-safe)
    if (lastStepKey.current === stepKey) return;
    lastStepKey.current = stepKey;
    titleRef.current?.focus({ preventScroll: true });
    // keep the panel top in view on small screens
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) rootRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }, [stepKey]);

  const go = (next: Phase, d: 1 | -1) => {
    setDir(d);
    setErrors({});
    setSendError(null);
    setBookError(null);
    setShake(0);
    setStepKey((k) => k + 1);
    setPhase(next);
  };
  const doShake = () => setShake((s) => (s === 1 ? 2 : 1));

  const focusFirstInvalid = () => {
    window.requestAnimationFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const el = root.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"]');
      if (!el) return;
      if (el.getAttribute("role") === "radiogroup" || el.getAttribute("role") === "group") {
        el.querySelector<HTMLElement>('button[tabindex="0"], button')?.focus();
      } else el.focus();
    });
  };

  /* ---------- slots ---------- */
  const loadSlots = useCallback(async () => {
    setSlots((s) => ({ ...s, status: "loading" }));
    try {
      const res = await fetchSlots();
      if (!mounted.current) return;
      setSlots({ status: "ready", mode: res.mode, days: groupSlots(res.slots, locale) });
      setDay(0);
      setSlot(null);
    } catch {
      if (mounted.current) setSlots({ status: "error", mode: "auto", days: [] });
    }
  }, [locale]);

  /* ---------- submit ---------- */
  const send = async () => {
    setPhase("sending");
    const payload = buildPayload(values, { locale, source: prefSource ?? source, website: honeypot.current?.value ?? "" });
    const started = Date.now();
    let nextError = "quote.errors.send";
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        confirmation?: boolean;
        issues?: { path?: (string | number)[]; message?: string }[];
      } | null;
      const wait = MIN_SENDING_MS - (Date.now() - started);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      if (!mounted.current) return;
      if (res.ok && data?.ok) {
        setConfirmationSent(data.confirmation === true);
        go(6, 1);
        void loadSlots();
        return;
      }
      if (res.status === 400 && Array.isArray(data?.issues)) {
        const errs: StepErrors = {};
        for (const i of data.issues) {
          const key = i.path?.[0] as QuoteField | undefined;
          if (key && i.message && !errs[key]) errs[key] = i.message.startsWith("quote.") ? i.message : "quote.errors.send";
        }
        const s = firstInvalidStep(errs);
        if (s) {
          setDir(-1);
          setStepKey((k) => k + 1);
          setPhase(s);
          setErrors(errs);
          doShake();
          focusFirstInvalid();
          return;
        }
      }
      if (res.status === 429) nextError = "quote.errors.rateLimit";
    } catch {
      /* network error → generic message */
    }
    if (!mounted.current) return;
    setPhase(5);
    setSendError(nextError);
    doShake();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (typeof phase !== "number" || phase > 5) return;
    const step = phase as FormStep;
    const errs = validateStep(step, values, locale);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setSendError(null);
      doShake();
      focusFirstInvalid();
      return;
    }
    if (step < QUOTE_STEP_COUNT) go((step + 1) as FormStep, 1);
    else void send();
  };

  const back = () => {
    if (typeof phase === "number" && phase > 1 && phase <= 5) go((phase - 1) as FormStep, -1);
  };

  const toggleSolution = (v: QuoteSolution) => {
    const has = values.solutions.includes(v);
    set("solutions", has ? values.solutions.filter((s) => s !== v) : [...values.solutions, v]);
    if (v === "other" && has) setErrors((prev) => ({ ...prev, other: undefined }));
  };

  const fillExample = () => {
    setValues((prev) => ({
      ...prev,
      engagement: "project",
      solutions: ["ai_agents", "whatsapp_bots"],
      description: t("steps.s3.prefillDescription"),
      start: "zero",
      deadline: "1_3_months",
      budget: "discuss_on_call",
      name: DEMO_VISITOR.name,
      company: DEMO_VISITOR.company,
      email: DEMO_VISITOR.email,
    }));
    setErrors({});
    setSendError(null);
  };

  /** one-line context for the calendar invite (≤1500 chars, Órbita book `summary`) */
  const bookingSummary = () =>
    [
      t("eyebrow"),
      values.engagement ? t(`steps.s1.options.${values.engagement}.title`) : null,
      values.solutions.map((s) => t(`steps.s2.options.${s}`)).join(", ") || null,
      values.company.trim() || null,
      values.description.trim(),
    ]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 1400);

  const confirmSlot = async () => {
    if (bookBusy) return;
    if (!slot) {
      doShake();
      return;
    }
    setBookBusy(true);
    setBookError(null);
    const demo = slots.mode === "demo";
    try {
      if (demo) {
        // calendar not connected: e-mail Wesley the preferred time and show the waiting card
        await sendSlotPreference({
          start: slot.start,
          end: slot.end,
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim() || undefined,
          locale,
          ref: values.ref,
        });
        if (!mounted.current) return;
        setBooking({ status: "pending", slot });
        go(7, 1);
        return;
      }
      const r = await bookSlot({
        start: slot.start,
        name: values.name.trim(),
        email: values.email.trim(),
        summary: bookingSummary(),
        locale,
      });
      if (!mounted.current) return;
      if (r.status === "taken") {
        setBookError("quote.booking.taken");
        doShake();
        void loadSlots();
        return;
      }
      setBooking({ status: r.status, meetUrl: r.status === "confirmed" ? r.meetUrl : undefined, slot });
      go(7, 1);
    } catch {
      if (!mounted.current) return;
      setBookError("quote.booking.error");
      doShake();
    } finally {
      if (mounted.current) setBookBusy(false);
    }
  };

  const restart = () => {
    setValues(EMPTY_VALUES);
    setSlots({ status: "idle", mode: "auto", days: [] });
    setSlot(null);
    setDay(0);
    setBooking(null);
    setPrefSource(null);
    if (honeypot.current) honeypot.current.value = "";
    go(1, -1);
  };

  /* ---------- derived view ---------- */
  const sending = phase === "sending";
  const view: Phase = sending ? 5 : phase;
  const isForm = typeof view === "number" && view <= 5;
  const formStep = (isForm ? view : 5) as FormStep;
  const formId = id(`form-${formStep}`);
  const errId = id("err");
  const first = firstName(values.name);
  const email = values.email.trim();

  let title = "";
  let helper = "";
  let check = false;
  if (isForm) {
    title = t(`steps.s${formStep}.title`);
    helper = formStep === 5 ? "" : t(`steps.s${formStep}.helper`);
  } else if (view === 6) {
    title = t("success.title", { name: first });
    helper = confirmationSent ? t("success.helper", { email }) : t("success.helperNoConfirm", { email });
    check = true;
  } else if (view === 7) {
    title = t("success.title", { name: first });
    helper = booking?.status === "confirmed" ? t("confirmed.text") : t("confirmed.waitingText");
    check = true;
  } else {
    title = t("waitEmail.title");
    helper = t("waitEmail.helper");
    check = true;
  }

  const stepErrorKey =
    sendError ??
    bookError ??
    (formStep === 1 && isForm ? errors.engagement : undefined) ??
    (formStep === 2 && isForm ? errors.solutions ?? errors.other : undefined) ??
    (formStep === 3 && isForm ? errors.description ?? errors.link : undefined) ??
    (formStep === 4 && isForm ? errors.deadline : undefined) ??
    null;
  const errMsg = stepErrorKey ? tRoot(stepErrorKey) : "";
  const shakeCls = shake === 1 ? "shake" : shake === 2 ? "qf-shake-b" : "";

  let announce = "";
  if (sending) announce = t("sendingAnnounce");
  else if (isForm) announce = t("stepAnnounce", { n: formStep, total: QUOTE_STEP_COUNT, title });
  else if (view === 7) announce = "";
  else announce = `${title} ${helper}`;

  const sumSolutions = QUOTE_SOLUTIONS.filter((s) => values.solutions.includes(s))
    .map((s) => (s === "other" && values.other.trim() ? `${t("steps.s2.options.other")} (${values.other.trim()})` : t(`steps.s2.options.${s}`)))
    .join(", ");

  const summary = (
    <dl className="qf-sum rv" aria-label={t("success.summaryAria")}>
      <dt>{t("success.summary.engagement")}</dt>
      <dd>{values.engagement ? t(`steps.s1.options.${values.engagement}.title`) : "—"}</dd>
      <dt>{t("success.summary.solutions")}</dt>
      <dd>{sumSolutions || "—"}</dd>
      <dt>{t("success.summary.deadline")}</dt>
      <dd>{values.deadline ? t(`steps.s4.deadlines.${values.deadline}`) : "—"}</dd>
      <dt>{t("success.summary.budget")}</dt>
      <dd>{t(`steps.s4.budgets.${values.budget}`)}</dd>
    </dl>
  );

  const fieldErr = (k: QuoteField) => (
    <p id={id(`err-${k}`)} className={cn("err", errors[k] && "is-on")}>
      {errors[k] ? (
        <>
          <Icon icon={AlertCircle} size={14} />
          {tRoot(errors[k]!)}
        </>
      ) : null}
    </p>
  );

  // "Passo {n} de 5" split around the number so only the digit rolls
  const counterParts = t("stepOf", { n: "\u0001", total: QUOTE_STEP_COUNT }).split("\u0001");
  const refName = values.ref ?tRoot(`products.items.${values.ref}.name`) : null;
  const otherOn = values.solutions.includes("other");

  return (
    <section
      ref={rootRef}
      className={cn("qf", className)}
      aria-labelledby={id("title")}
      data-phase={String(phase)}
    >
      <div className="qf-panel tx">
        {/* eyebrow + step counter */}
        <div className="qf-top">
          <p className="eb">{t("eyebrow")}</p>
          <p className="meta qf-count" aria-hidden="true">
            {isForm ? (
              <>
                {counterParts[0]}
                <span className="roll roll-a">
                  <span key={formStep}>{formStep}</span>
                </span>
                {counterParts[1]}
              </>
            ) : (
              <span className="status-in" style={{ display: "inline-block" }}>
                {t("sent")}
              </span>
            )}
          </p>
        </div>

        {/* progress: 5 segments */}
        <div
          className="qf-prog"
          role="progressbar"
          aria-label={t("progressAria")}
          aria-valuemin={1}
          aria-valuemax={QUOTE_STEP_COUNT}
          aria-valuenow={isForm ? formStep : QUOTE_STEP_COUNT}
          aria-valuetext={isForm ? t("stepOf", { n: formStep, total: QUOTE_STEP_COUNT }) : t("sent")}
        >
          {Array.from({ length: QUOTE_STEP_COUNT }, (_, i) => (
            <span key={i} className={cn("qf-seg", (!isForm || i < formStep - 1) && "is-done", isForm && i === formStep - 1 && "is-cur")}>
              <i style={{ ["--i" as string]: i }} />
            </span>
          ))}
        </div>

        {/* title (re-keyed so the mask replays) */}
        <div className="qf-ttl">
          {check ? (
            <Icon key={`c${stepKey}`} icon={CheckCircle2} size={32} className="check-draw pop-in qf-check" style={{ color: "var(--ok)" }} />
          ) : null}
          <h3 id={id("title")} ref={titleRef} className="h3s qf-title" tabIndex={-1} data-quote-title>
            <span className="mask">
              <span key={`t${stepKey}`} style={{ ["--base" as string]: "40ms" }}>
                {title}
              </span>
            </span>
          </h3>
        </div>
        <p key={`h${stepKey}`} className="qf-hlp">
          {helper}
        </p>
        <p className="sr" aria-live="polite">
          {announce}
        </p>

        {/* CONTENT BOX */}
        <div className="qf-box" style={{ ["--sdx" as string]: dir < 0 ? "-16px" : "16px" } as CSSProperties}>
          {refName && isForm ? (
            <p className="qf-ref">
              <span>{t("ref", { name: refName })}</span>
              <button type="button" className="qf-ref-x" aria-label={t("refRemove")} onClick={() => set("ref", undefined)}>
                <Icon icon={X} size={14} />
              </button>
            </p>
          ) : null}

          {view === 1 ? (
            <form key={`s1-${stepKey}`} id={formId} className="qf-stp" onSubmit={onSubmit} noValidate style={{ ["--base" as string]: "60ms", ["--stagger" as string]: "45ms" }}>
              <RadioGroup
                options={QUOTE_ENGAGEMENTS}
                value={values.engagement}
                onChange={(v) => set("engagement", v)}
                labelledBy={id("title")}
                describedBy={errId}
                invalid={Boolean(errors.engagement)}
                className="qf-opts"
                optionClassName="qf-opt rv"
                renderOption={(v) => (
                  <>
                    <span className="qf-rdo" aria-hidden="true" />
                    <span className="qf-opt-b">
                      <span className="qf-opt-t">{t(`steps.s1.options.${v}.title`)}</span>
                      <span className="qf-opt-s">{t(`steps.s1.options.${v}.sub`)}</span>
                    </span>
                  </>
                )}
              />
            </form>
          ) : null}

          {view === 2 ? (
            <form key={`s2-${stepKey}`} id={formId} className="qf-stp" onSubmit={onSubmit} noValidate style={{ ["--base" as string]: "60ms", ["--stagger" as string]: "35ms" }}>
              <div role="group" aria-labelledby={id("title")} aria-describedby={errId} data-invalid={errors.solutions ? "true" : undefined} className="qf-tgs">
                {QUOTE_SOLUTIONS.map((s, i) => {
                  const pressed = values.solutions.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      className={cn("qf-tg rv", errors.solutions && "is-bad")}
                      aria-pressed={pressed}
                      style={{ ["--i" as string]: i }}
                      onClick={() => toggleSolution(s)}
                    >
                      <span>{t(`steps.s2.options.${s}`)}</span>
                      <Icon icon={Check} size={16} className="qf-tg-ic" />
                    </button>
                  );
                })}
              </div>
              <div className="rv qf-other" style={{ ["--i" as string]: 7 }}>
                <label htmlFor={id("other")} className={cn("qf-lbl", !otherOn && "is-off")}>
                  {t("steps.s2.otherLabel")}
                </label>
                <input
                  id={id("other")}
                  name="outro"
                  type="text"
                  className={cn("fld", otherOn && "pop-in")}
                  autoComplete="off"
                  maxLength={200}
                  placeholder={t("steps.s2.otherPlaceholder")}
                  disabled={!otherOn}
                  aria-invalid={errors.other ? true : undefined}
                  aria-describedby={errId}
                  value={values.other}
                  onChange={(e) => set("other", e.target.value)}
                />
              </div>
            </form>
          ) : null}

          {view === 3 ? (
            <form key={`s3-${stepKey}`} id={formId} className="qf-stp" onSubmit={onSubmit} noValidate style={{ ["--base" as string]: "60ms", ["--stagger" as string]: "50ms" }}>
              <div className="rv" style={{ ["--i" as string]: 0 }}>
                <label htmlFor={id("desc")} className="qf-lbl">
                  {t("steps.s3.descriptionLabel")}
                </label>
                <textarea
                  id={id("desc")}
                  name="descricao"
                  className="fld qf-ta"
                  maxLength={4000}
                  placeholder={t("steps.s3.descriptionPlaceholder")}
                  aria-invalid={errors.description ? true : undefined}
                  aria-describedby={errId}
                  value={values.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
              <div className="rv qf-gap" style={{ ["--i" as string]: 1 }}>
                <p id={id("lbl-start")} className="qf-lbl">
                  {t("steps.s3.startLabel")}
                </p>
                <RadioGroup
                  options={QUOTE_STARTS}
                  value={values.start}
                  onChange={(v) => set("start", v)}
                  labelledBy={id("lbl-start")}
                  className="qf-sg"
                  optionClassName="qf-sgb"
                  renderOption={(v) => t(`steps.s3.starts.${v}`)}
                />
              </div>
              <div className="rv qf-gap" style={{ ["--i" as string]: 2 }}>
                <label htmlFor={id("link")} className="qf-lbl">
                  {t("steps.s3.linkLabel")}
                </label>
                <input
                  id={id("link")}
                  name="link"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  className="fld"
                  placeholder={t("steps.s3.linkPlaceholder")}
                  aria-invalid={errors.link ? true : undefined}
                  aria-describedby={errId}
                  value={values.link}
                  onChange={(e) => set("link", e.target.value)}
                />
              </div>
            </form>
          ) : null}

          {view === 4 ? (
            <form key={`s4-${stepKey}`} id={formId} className="qf-stp" onSubmit={onSubmit} noValidate style={{ ["--base" as string]: "60ms", ["--stagger" as string]: "45ms" }}>
              <p id={id("lbl-deadline")} className="qf-lbl rv">
                {t("steps.s4.deadlineLabel")}
              </p>
              <RadioGroup
                options={QUOTE_DEADLINES}
                value={values.deadline}
                onChange={(v) => set("deadline", v)}
                labelledBy={id("lbl-deadline")}
                describedBy={errId}
                invalid={Boolean(errors.deadline)}
                className="qf-pls"
                style={{ ["--base" as string]: "105ms" }}
                optionClassName={cn("qf-pl rv", errors.deadline && "is-bad")}
                renderOption={(v) => t(`steps.s4.deadlines.${v}`)}
              />
              <p id={id("lbl-budget")} className="qf-lbl rv qf-gap-l" style={{ ["--i" as string]: 4 }}>
                {t("steps.s4.budgetLabel")}
              </p>
              <RadioGroup
                options={QUOTE_BUDGETS}
                value={values.budget}
                onChange={(v) => set("budget", v)}
                labelledBy={id("lbl-budget")}
                className="qf-rws"
                style={{ ["--base" as string]: "285ms" }}
                optionClassName="qf-rw rv"
                renderOption={(v) => (
                  <>
                    <span className="qf-rdo" aria-hidden="true" />
                    <span>{t(`steps.s4.budgets.${v}`)}</span>
                  </>
                )}
              />
            </form>
          ) : null}

          {view === 5 ? (
            <form key={`s5-${stepKey}`} id={formId} className="qf-stp qf-s5" onSubmit={onSubmit} noValidate style={{ ["--base" as string]: "60ms", ["--stagger" as string]: "45ms" }}>
              <div className="rv qf-row2" style={{ ["--i" as string]: 0 }}>
                <div>
                  <label htmlFor={id("name")} className="qf-lbl">
                    {t("steps.s5.nameLabel")}
                  </label>
                  <input
                    id={id("name")}
                    name="nome"
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    className="fld"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={id("err-name")}
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                  {fieldErr("name")}
                </div>
                <div>
                  <label htmlFor={id("company")} className="qf-lbl">
                    {t("steps.s5.companyLabel")}
                  </label>
                  <input
                    id={id("company")}
                    name="empresa"
                    type="text"
                    autoComplete="organization"
                    maxLength={120}
                    className="fld"
                    value={values.company}
                    onChange={(e) => set("company", e.target.value)}
                  />
                </div>
              </div>
              <div className="rv" style={{ ["--i" as string]: 1 }}>
                <label htmlFor={id("email")} className="qf-lbl">
                  {t("steps.s5.emailLabel")}
                </label>
                <input
                  id={id("email")}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={200}
                  className="fld"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={id("err-email")}
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                {fieldErr("email")}
              </div>
              <div className="rv" style={{ ["--i" as string]: 2 }}>
                <label htmlFor={id("wa")} className="qf-lbl">
                  {t("steps.s5.whatsappLabel")}
                </label>
                <input
                  id={id("wa")}
                  name="whatsapp"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  className="fld"
                  placeholder={t("steps.s5.whatsappPlaceholder")}
                  value={values.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                />
              </div>
              <div className="rv qf-consent-w" style={{ ["--i" as string]: 3 }}>
                <div className="qf-consent">
                  <span className={cn("qf-cbx", errors.consent && "is-bad")}>
                    <input
                      id={id("consent")}
                      type="checkbox"
                      name="consent"
                      checked={values.consent}
                      aria-invalid={errors.consent ? true : undefined}
                      aria-describedby={id("err-consent")}
                      onChange={(e) => set("consent", e.target.checked)}
                    />
                    <span className="qf-cbx-b" aria-hidden="true">
                      <Icon icon={Check} size={14} strokeWidth={2} />
                    </span>
                  </span>
                  <p className="qf-cbx-p">
                    <label htmlFor={id("consent")} className="qf-cbx-t">
                      {t("steps.s5.consent")}
                    </label>{" "}
                    <Link className="qlnk" href={ROUTES.privacy}>
                      {t("steps.s5.privacy")}
                    </Link>
                  </p>
                </div>
                {fieldErr("consent")}
              </div>
              <div className="qf-hp" aria-hidden="true">
                <label htmlFor={id("website")}>{t("steps.s5.honeypotLabel")}</label>
                <input ref={honeypot} id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>
            </form>
          ) : null}

          {view === 6 ? (
            <div key={`s6-${stepKey}`} className="qf-stp qf-s6" style={{ ["--base" as string]: "120ms", ["--stagger" as string]: "70ms" }}>
              {summary}
              <SlotPicker
                idBase={id("sl")}
                className="rv"
                status={slots.status}
                mode={slots.mode}
                days={slots.days}
                day={day}
                onDay={(i) => {
                  if (i !== day) {
                    setDay(i);
                    setSlot(null);
                  }
                }}
                slot={slot}
                onSlot={(s) => {
                  setSlot(s);
                  setBookError(null);
                }}
                onRetry={() => void loadSlots()}
                onNoneFits={() => go("waitEmail", 1)}
                locale={locale}
              />
              <button type="button" className="btn btn-g qf-wait-in" onClick={() => go("waitEmail", 1)}>
                {t("success.wait")}
              </button>
            </div>
          ) : null}

          {view === 7 && booking ? (
            <div key={`s7-${stepKey}`} className="qf-stp qf-s7" style={{ ["--base" as string]: "120ms" }}>
              <BookingCard status={booking.status} slot={booking.slot} email={email} meetUrl={booking.meetUrl} locale={locale} />
            </div>
          ) : null}

          {view === "waitEmail" ? (
            <div key={`sw-${stepKey}`} className="qf-stp" style={{ ["--base" as string]: "120ms" }}>
              {summary}
            </div>
          ) : null}
        </div>

        {/* error slot */}
        <div id={errId} role="alert" className="qf-errslot">
          <p className={cn("err qf-err", errMsg && "is-on")}>
            {errMsg ? <Icon icon={sendError ? AlertTriangle : AlertCircle} size={14} /> : null}
            <span>{errMsg}</span>
          </p>
        </div>

        {/* footers */}
        {isForm ? (
          <div className="qf-foot">
            <button
              type="button"
              className={cn("btn btn-g qf-back", formStep === 1 && "is-first")}
              aria-disabled={sending || undefined}
              onClick={sending ? undefined : back}
              style={{ visibility: formStep > 1 ? "visible" : "hidden" }}
              tabIndex={formStep > 1 ? 0 : -1}
            >
              <Icon icon={ArrowRight} size={16} style={{ transform: "scaleX(-1)" }} />
              {t("back")}
            </button>
            <Button
              type="submit"
              form={formId}
              className={cn("qf-next", shakeCls)}
              busy={sending}
              busyLabel={t("sending")}
              arrow={formStep !== QUOTE_STEP_COUNT}
            >
              {formStep === QUOTE_STEP_COUNT ? t("send") : t("continue")}
            </Button>
          </div>
        ) : null}
        {view === 6 ? (
          <div className="qf-foot">
            <button type="button" className="btn btn-g qf-wait" onClick={() => go("waitEmail", 1)}>
              {t("success.wait")}
            </button>
            <button
              type="button"
              className={cn(buttonClass("primary", "md", !slot || bookBusy), "qf-next", shakeCls)}
              aria-disabled={!slot || bookBusy || undefined}
              aria-busy={bookBusy || undefined}
              onClick={confirmSlot}
            >
              {bookBusy ? (
                <>
                  {t("booking.confirming")}
                  <BusyDots />
                </>
              ) : (
                t("success.confirm")
              )}
            </button>
          </div>
        ) : null}
        {view === 7 ? (
          <div className="qf-foot qf-foot-end">
            <button type="button" className="btn btn-g" onClick={restart}>
              {t("restart")}
            </button>
          </div>
        ) : null}
        {view === "waitEmail" ? (
          <div className="qf-foot">
            {slots.status === "ready" && slots.days.length ? (
              <button type="button" className="btn btn-g qf-back" onClick={() => go(6, -1)}>
                <Icon icon={ArrowRight} size={16} style={{ transform: "scaleX(-1)" }} />
                {t("waitEmail.backToSlots")}
              </button>
            ) : (
              <button type="button" className="btn btn-g qf-back" onClick={restart}>
                {t("restart")}
              </button>
            )}
          </div>
        ) : null}

        {/* microcopy (+ dev-only example filler) */}
        <div className="qf-mic">
          <p className="qf-micro">{t("microcopy")}</p>
          {SHOW_EXAMPLE && isForm && !sending ? (
            <button type="button" className="qf-fill" onClick={fillExample}>
              {t("prefill")}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
