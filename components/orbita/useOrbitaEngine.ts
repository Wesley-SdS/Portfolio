"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DEMO_SLOTS, DEMO_VISITOR, SCRIPT, type ChipId, type OrbState } from "@/src/content/orbita";
import { SITE } from "@/src/content/site";
import {
  splitChips,
  type ApiError,
  type BookResponse,
  type OrbitaStatus,
  type OrbitaStreamEvent,
  type OrbitaUi,
  type QuotePrefill,
  type SlotsPayload,
  type ToolLineId,
} from "@/lib/orbita/protocol";
import { zonedTimeToUtc } from "@/lib/orbita/time";
import { dayMonth, dayPicked, hm } from "./format";

/**
 * Órbita conversation engine (v3spec §8). Two engines behind one API:
 *  - LIVE: POST /api/orbita/chat (Claude, streaming NDJSON, tools → UI cards).
 *  - DEMO: the scripted pt-BR conversation of §8.3, run client-side when the
 *    server has no ANTHROPIC_API_KEY (GET /api/orbita/chat → chat:"demo").
 * The booking steps (slot pick → contact card → /api/orbita/book) are shared and
 * deterministic in both engines: the model can propose, only the visitor books.
 */

export type Phase = "online" | "typing" | "calendar" | "invite";
export interface Chip {
  key: string;
  label: string;
  chipId?: ChipId;
}
export interface ContactErrors {
  name?: boolean;
  email?: boolean;
  consent?: boolean;
}
export type Msg =
  | { id: string; kind: "o"; text: string; streaming?: boolean; link?: { label: string; prefill?: QuotePrefill } }
  | { id: string; kind: "v"; text: string }
  | { id: string; kind: "typing" }
  | { id: string; kind: "tool"; tool: ToolLineId; state: "running" | "done" | "error"; errorText?: string }
  | { id: string; kind: "alert"; text: string }
  | { id: string; kind: "chips"; chips: Chip[] }
  | { id: string; kind: "projects"; slugs: string[]; full?: boolean }
  | { id: string; kind: "slots"; data: SlotsPayload; picked?: string; locked?: boolean }
  | {
      id: string;
      kind: "contact";
      variant: "book" | "callback";
      start?: string;
      prefill?: { name?: string; email?: string };
      summary?: string;
      state: "idle" | "sending" | "done";
      errors?: ContactErrors;
    }
  | { id: string; kind: "booking"; variant: "confirmed" | "waiting"; start: string; end: string; email: string; meetLink: string | null; demo: boolean };

type Turn = { role: "user" | "assistant"; content: string };

const FALLBACK_STATUS: OrbitaStatus = { chat: "demo", calendar: "demo", bookingMode: "auto", timeZone: SITE.timeZone, slotMinutes: 30 };
let statusPromise: Promise<OrbitaStatus> | null = null;
function fetchStatus(): Promise<OrbitaStatus> {
  statusPromise ??= fetch("/api/orbita/chat", { method: "GET", cache: "no-store" })
    .then((r) => (r.ok ? (r.json() as Promise<OrbitaStatus>) : FALLBACK_STATUS))
    .catch(() => FALLBACK_STATUS);
  return statusPromise;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const GUARD_RE = /(agenda|calend[aá]rio|calendar|schedule|compromissos|appointments|eventos).*(complet|inteir|toda|whole|full|all)|(mostr|show|list).*(agenda|calendar|compromissos)/i;

/** Slots when the server is unreachable (static preview): the fictional §8.4 days. */
function localDemoSlots(tz: string): SlotsPayload {
  const days = DEMO_SLOTS.map((d) => {
      const [y, m, day] = d.date.split("-").map(Number);
      return {
        date: d.date,
        slots: d.times.map((t) => {
          const [h, mi] = t.split(":").map(Number);
          const s = zonedTimeToUtc(y, m, day, h * 60 + mi, tz);
          return { start: s.toISOString(), end: new Date(s.getTime() + 30 * 60_000).toISOString() };
        }),
      };
    });
  return { mode: "demo", timeZone: tz, slotMinutes: 30, days };
}

class HttpError extends Error {
  constructor(
    public status: number,
    public body: Partial<ApiError> | null,
  ) {
    super(`HTTP ${status}`);
  }
}

export function useOrbitaEngine({ reduced, onOrbitaMessage }: { reduced: boolean; onOrbitaMessage?: () => void }) {
  const t = useTranslations("orbita");
  const locale = useLocale();

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [orb, setOrb] = useState<OrbState>("idle");
  const [phase, setPhase] = useState<Phase>("online");
  const [composer, setComposer] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<OrbitaStatus | null>(null);

  const gen = useRef(0);
  const seq = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const abort = useRef<AbortController | null>(null);
  const history = useRef<Turn[]>([]);
  const started = useRef(false);
  const statusRef = useRef<OrbitaStatus>(FALLBACK_STATUS);
  const chatMode = useRef<"live" | "demo">("demo");
  const expectDraft = useRef(false);
  const lastChips = useRef<ChipId[]>(SCRIPT.b0.chips);
  const path = useRef<{ draft: boolean; engagement?: ChipId; deadline?: ChipId }>({ draft: false });
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const notify = useRef(onOrbitaMessage);
  notify.current = onOrbitaMessage;

  const tz = status?.timeZone ?? SITE.timeZone;
  const nid = () => `m${++seq.current}`;

  /* ---------- primitives ---------- */
  const wait = useCallback((ms: number) => {
    const g = gen.current;
    return new Promise<boolean>((resolve) => {
      const id = setTimeout(() => {
        timers.current.delete(id);
        resolve(g === gen.current);
      }, ms);
      timers.current.add(id);
    });
  }, []);
  const alive = (g: number) => g === gen.current;
  const add = (...m: Msg[]) => setMsgs((prev) => prev.concat(m));
  const patch = (id: string, fn: (m: Msg) => Msg) => setMsgs((prev) => prev.map((m) => (m.id === id ? fn(m) : m)));
  const drop = (id: string) => setMsgs((prev) => prev.filter((m) => m.id !== id));
  const typingMs = (text: string) => (reducedRef.current ? 300 : Math.min(1600, Math.max(700, text.length * 12)));
  const fnDelay = (ms: number) => (reducedRef.current ? 300 : ms);
  const chips = (ids: readonly ChipId[]): Msg => {
    lastChips.current = [...ids];
    return { id: nid(), kind: "chips", chips: ids.map((c) => ({ key: c, label: t(`chips.${c}`), chipId: c })) };
  };

  /** Typing indicator → Órbita text (+ cards after it). */
  const say = useCallback(
    async (text: string, after: Msg[] = [], opts: { orbAfter?: OrbState; link?: { label: string; prefill?: QuotePrefill } } = {}) => {
      const g = gen.current;
      const tid = `m${++seq.current}`;
      setMsgs((prev) => prev.concat({ id: tid, kind: "typing" }));
      setOrb("thinking");
      setPhase("typing");
      if (!(await wait(typingMs(text)))) return false;
      if (!alive(g)) return false;
      setMsgs((prev) => prev.filter((m) => m.id !== tid).concat({ id: `m${++seq.current}`, kind: "o", text, link: opts.link }, ...after));
      setOrb(opts.orbAfter ?? "idle");
      setPhase("online");
      notify.current?.();
      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wait],
  );

  /** Tool line running → done/error while `work` runs (min duration `ms`). */
  const toolLine = useCallback(
    async <T,>(tool: ToolLineId, ms: number, work?: () => Promise<T>) => {
      const g = gen.current;
      const id = `m${++seq.current}`;
      setMsgs((prev) => prev.concat({ id, kind: "tool", tool, state: "running" }));
      setOrb(tool === "calendar" ? "searching" : "thinking");
      setPhase(tool === "calendar" ? "calendar" : tool === "portfolio" ? "typing" : "invite");
      const [ok, res] = await Promise.all([
        wait(fnDelay(ms)),
        (work ? work() : Promise.resolve(undefined as T)).then(
          (value) => ({ ok: true as const, value }),
          (error: unknown) => ({ ok: false as const, error }),
        ),
      ]);
      if (!ok || !alive(g)) return null;
      setMsgs((prev) => prev.map((m) => (m.id === id && m.kind === "tool" ? { ...m, state: res.ok ? "done" : "error" } : m)));
      setOrb("idle");
      setPhase("online");
      return { id, res };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wait],
  );

  const run = useCallback(async (fn: () => Promise<unknown>) => {
    const g = gen.current;
    setBusy(true);
    try {
      await fn();
    } finally {
      if (alive(g)) setBusy(false);
    }
  }, []);

  /* ---------- network ---------- */
  const fetchSlots = useCallback(async (): Promise<SlotsPayload> => {
    try {
      const r = await fetch("/api/orbita/slots?days=3&perDay=6", { cache: "no-store", signal: abort.current?.signal });
      if (!r.ok) throw new HttpError(r.status, null);
      return (await r.json()) as SlotsPayload;
    } catch (e) {
      if (statusRef.current.calendar === "demo") return localDemoSlots(statusRef.current.timeZone);
      throw e;
    }
  }, []);

  const postBook = useCallback(async (body: Record<string, unknown>): Promise<BookResponse> => {
    let r: Response;
    try {
      r = await fetch("/api/orbita/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...body, source: "orbita", locale, website: "" }),
        signal: abort.current?.signal,
      });
    } catch (e) {
      // Static preview without the API: keep the demo usable.
      if (statusRef.current.calendar === "demo") {
        const start = body.start as string | undefined;
        return {
          ok: true,
          mode: "demo",
          intent: body.intent as "book" | "callback",
          status: body.intent === "callback" ? "received" : statusRef.current.bookingMode === "aprovacao" ? "pending" : "confirmed",
          start,
          end: start ? new Date(Date.parse(start) + 30 * 60_000).toISOString() : undefined,
          meetLink: null,
          email: body.email as string,
        };
      }
      throw e;
    }
    const json = (await r.json().catch(() => null)) as BookResponse | ApiError | null;
    if (!r.ok || !json || json.ok !== true) throw new HttpError(r.status, (json as ApiError) ?? null);
    return json;
  }, [locale]);

  const summary = () =>
    history.current
      .filter((h) => h.role === "user")
      .map((h) => h.content)
      .join(" · ")
      .slice(0, 1000);

  /* ---------- shared booking steps ---------- */
  const showSlots = useCallback(
    async (intro: string) => {
      const r = await toolLine("calendar", 900, fetchSlots);
      if (!r) return;
      if (!r.res.ok) {
        patch(r.id, (m) => (m.kind === "tool" ? { ...m, state: "error", errorText: t("script.error.tool") } : m));
        await say(t("script.error.text"), [{ id: nid(), kind: "contact", variant: "callback", state: "idle" }]);
        return;
      }
      const data = r.res.value;
      if (!data.days.length) {
        await say(t("script.noSlots"), [{ id: nid(), kind: "contact", variant: "callback", state: "idle" }]);
        return;
      }
      await say(intro, [{ id: nid(), kind: "slots", data }]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchSlots, say, toolLine, t],
  );

  /* ---------- DEMO engine (v3spec §8.3) ---------- */
  const typeDraft = useCallback(
    async (text: string) => {
      expectDraft.current = true;
      if (reducedRef.current) {
        setComposer(text);
        return;
      }
      for (let i = 1; i <= text.length; i++) {
        if (!(await wait(SCRIPT.b1a.draftCharMs))) return;
        setComposer(text.slice(0, i));
      }
    },
    [wait],
  );

  const beat = useCallback(
    async (id: string) => {
      switch (id) {
        case "b1a":
          if (await say(t("script.b1a.text"))) await typeDraft(t("script.b1a.draft"));
          return;
        case "b1b":
          if (await say(t("script.b1b.text"), [{ id: nid(), kind: "projects", slugs: [...SCRIPT.b1b.cards] }]))
            await say(t("script.b1b.followUp"), [chips(SCRIPT.b1b.chips)]);
          return;
        case "b4":
          await say(t("script.b4.text"), [chips(SCRIPT.b4.chips)]);
          return;
        case "b5":
          await say(t("script.b5.text"), [chips(SCRIPT.b5.chips)]);
          return;
        case "b6": {
          const p = path.current;
          const verbatim = p.draft && p.engagement === "project" && p.deadline === "oneToThree";
          await showSlots(verbatim ? t("script.b6.text") : t("script.b6.short"));
          return;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [say, showSlots, t, typeDraft],
  );

  const demoText = useCallback(
    async (text: string) => {
      if (expectDraft.current) {
        expectDraft.current = false;
        path.current.draft = true;
        const r = await toolLine("portfolio", SCRIPT.b3.toolMs);
        if (!r) return;
        if (await say(t("script.b3.text"), [{ id: nid(), kind: "projects", slugs: [SCRIPT.b3.card], full: true }])) await beat("b4");
        return;
      }
      if (GUARD_RE.test(text)) {
        await say(t("script.guard.text"), [chips(["bookCall"])]);
        return;
      }
      await say(t("demo.reply"), [chips(lastChips.current)]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [beat, say, t, toolLine],
  );

  /* ---------- LIVE engine ---------- */
  const flushUi = (ui: OrbitaUi[], lastOId: string | null): { extra: Msg[]; markers: string[] } => {
    const extra: Msg[] = [];
    const markers: string[] = [];
    for (const u of ui) {
      if (u.kind === "projects") {
        extra.push({ id: nid(), kind: "projects", slugs: u.slugs, full: u.slugs.length === 1 });
        markers.push(`[cards shown: ${u.slugs.join(", ")}]`);
      } else if (u.kind === "slots") {
        if (u.data.days.length) {
          extra.push({ id: nid(), kind: "slots", data: u.data });
          markers.push("[slot picker shown]");
        } else extra.push({ id: nid(), kind: "contact", variant: "callback", state: "idle" });
      } else if (u.kind === "contact") {
        extra.push({
          id: nid(),
          kind: "contact",
          variant: u.start ? "book" : "callback",
          start: u.start ?? undefined,
          prefill: { name: u.name, email: u.email },
          summary: u.summary,
          state: "idle",
        });
        markers.push("[confirmation card shown]");
      } else if (u.kind === "quote") {
        const link = { label: t("script.b8.link"), prefill: u.prefill };
        if (lastOId) patch(lastOId, (m) => (m.kind === "o" ? { ...m, link } : m));
        else extra.push({ id: nid(), kind: "o", text: "", link });
        markers.push("[quote form link shown]");
      }
    }
    return { extra, markers };
  };

  const liveText = useCallback(
    async (text: string): Promise<"ok" | "demo"> => {
      const g = gen.current;
      const ctrl = new AbortController();
      abort.current = ctrl;
      let typingId: string | null = `m${++seq.current}`;
      setMsgs((prev) => prev.concat({ id: typingId!, kind: "typing" }));
      setOrb("thinking");
      setPhase("typing");
      const clearTyping = () => {
        if (typingId) {
          const id = typingId;
          setMsgs((prev) => prev.filter((m) => m.id !== id));
          typingId = null;
        }
      };
      const showTyping = () => {
        if (!typingId) {
          typingId = `m${++seq.current}`;
          const id = typingId;
          setMsgs((prev) => prev.concat({ id, kind: "typing" }));
        }
      };

      let res: Response;
      try {
        res = await fetch("/api/orbita/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history.current.slice(-20), locale }),
          signal: ctrl.signal,
        });
      } catch {
        if (!alive(g)) return "ok";
        clearTyping();
        setOrb("idle");
        setPhase("online");
        add({ id: nid(), kind: "alert", text: t("script.chatError") });
        await say(t("script.chatErrorText"), [{ id: nid(), kind: "contact", variant: "callback", state: "idle" }]);
        return "ok";
      }
      if (!alive(g)) return "ok";
      if (res.status === 503 && res.headers.get("x-orbita-mode") === "demo") {
        clearTyping();
        return "demo";
      }
      if (!res.ok || !res.body) {
        clearTyping();
        setOrb("idle");
        setPhase("online");
        if (res.status === 429) add({ id: nid(), kind: "alert", text: t("script.rateLimit") });
        else {
          add({ id: nid(), kind: "alert", text: t("script.chatError") });
          await say(t("script.chatErrorText"), [{ id: nid(), kind: "contact", variant: "callback", state: "idle" }]);
        }
        return "ok";
      }

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let turnText = "";
      let segText = "";
      let segId: string | null = null;
      let lastOId: string | null = null;
      const toolIds = new Map<string, string>();
      const pendingUi: OrbitaUi[] = [];
      let errorCode: string | null = null;

      const handle = (ev: OrbitaStreamEvent) => {
        if (ev.type === "text") {
          clearTyping();
          segText += ev.delta;
          turnText += ev.delta;
          setPhase("typing");
          setOrb("thinking");
          if (!segId) {
            segId = `m${++seq.current}`;
            lastOId = segId;
            const id = segId;
            const txt = segText;
            setMsgs((prev) => prev.concat({ id, kind: "o", text: txt, streaming: true }));
          } else {
            const id = segId;
            const txt = segText;
            setMsgs((prev) => prev.map((m) => (m.id === id && m.kind === "o" ? { ...m, text: txt } : m)));
          }
        } else if (ev.type === "tool") {
          clearTyping();
          if (segId) {
            const id = segId;
            setMsgs((prev) => prev.map((m) => (m.id === id && m.kind === "o" ? { ...m, streaming: false } : m)));
          }
          segId = null;
          segText = "";
          if (ev.status === "running") {
            const id = `m${++seq.current}`;
            toolIds.set(ev.id, id);
            setMsgs((prev) => prev.concat({ id, kind: "tool", tool: ev.tool, state: "running" }));
            setOrb(ev.tool === "calendar" ? "searching" : "thinking");
            setPhase(ev.tool === "calendar" ? "calendar" : "typing");
          } else {
            const id = toolIds.get(ev.id);
            const state = ev.status === "done" ? "done" : "error";
            const errorText = ev.status === "error" ? (ev.tool === "calendar" ? t("script.error.tool") : t("tools.error")) : undefined;
            if (id) setMsgs((prev) => prev.map((m) => (m.id === id && m.kind === "tool" ? { ...m, state, errorText } : m)));
            setOrb("thinking");
            setPhase("typing");
            showTyping();
          }
        } else if (ev.type === "ui") {
          pendingUi.push(ev.ui);
        } else if (ev.type === "error") {
          errorCode = ev.code;
        }
      };

      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let nl: number;
          while ((nl = buf.indexOf("\n")) !== -1) {
            const line = buf.slice(0, nl).trim();
            buf = buf.slice(nl + 1);
            if (!line) continue;
            try {
              handle(JSON.parse(line) as OrbitaStreamEvent);
            } catch {
              /* ignore malformed line */
            }
          }
          if (!alive(g)) return "ok";
        }
      } catch {
        if (!alive(g)) return "ok";
        errorCode ??= "server";
      }

      clearTyping();
      const { body, chips: live } = splitChips(turnText);
      if (segId) {
        const id = segId;
        const segBody = splitChips(segText).body;
        setMsgs((prev) =>
          prev
            .map((m) => (m.id === id && m.kind === "o" ? { ...m, text: segBody, streaming: false } : m))
            .filter((m) => !(m.kind === "o" && m.id === id && !m.text && !m.link)),
        );
      }
      const { extra, markers } = flushUi(pendingUi, lastOId);
      if (live.length) extra.push({ id: nid(), kind: "chips", chips: live.map((c, i) => ({ key: `live${i}`, label: c })) });
      if (extra.length) add(...extra);
      history.current.push({ role: "assistant", content: [body, ...markers].filter(Boolean).join("\n") || "…" });
      setOrb("idle");
      setPhase("online");
      if (body || extra.length) notify.current?.();

      if (errorCode === "refused") await say(t("script.refused"));
      else if (errorCode === "unavailable" || errorCode === "server") {
        add({ id: nid(), kind: "alert", text: t("script.chatError") });
        await say(t("script.chatErrorText"), [{ id: nid(), kind: "contact", variant: "callback", state: "idle" }]);
      } else if (errorCode === "rate_limited") add({ id: nid(), kind: "alert", text: t("script.rateLimit") });
      return "ok";
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, say, t],
  );

  /* ---------- public API ---------- */
  const start = useCallback(async () => {
    if (started.current) return;
    started.current = true;
    const g = gen.current;
    const s = await fetchStatus();
    if (!alive(g)) return;
    statusRef.current = s;
    chatMode.current = s.chat;
    setStatus(s);
    const tid = `m${++seq.current}`;
    setMsgs([{ id: tid, kind: "typing" }]);
    setOrb("thinking");
    setPhase("typing");
    if (!(await wait(fnDelay(SCRIPT.b0.typingMs)))) return;
    setMsgs([{ id: `m${++seq.current}`, kind: "o", text: t("script.b0.text") }, chips(SCRIPT.b0.chips)]);
    setOrb("idle");
    setPhase("online");
    notify.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, wait]);

  const reset = useCallback(() => {
    gen.current++;
    for (const id of timers.current) clearTimeout(id);
    timers.current.clear();
    abort.current?.abort();
    abort.current = null;
    history.current = [];
    expectDraft.current = false;
    path.current = { draft: false };
    lastChips.current = SCRIPT.b0.chips;
    started.current = false;
    setMsgs([]);
    setOrb("idle");
    setPhase("online");
    setComposer("");
    setBusy(false);
  }, []);

  const restart = useCallback(() => {
    reset();
    void start();
  }, [reset, start]);

  useEffect(() => reset, [reset]);

  const visitorSays = (text: string) => {
    add({ id: nid(), kind: "v", text });
    history.current.push({ role: "user", content: text });
  };

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim().slice(0, 1500);
      if (!text || busy) return;
      setComposer("");
      setMsgs((prev) => prev.filter((m) => m.kind !== "chips"));
      visitorSays(text);
      void run(async () => {
        if (chatMode.current === "live") {
          const r = await liveText(text);
          if (r === "ok") return;
          chatMode.current = "demo";
        }
        await demoText(text);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [busy, demoText, liveText, run],
  );

  const pickChip = useCallback(
    (msgId: string, chip: Chip) => {
      if (busy) return;
      drop(msgId);
      if (chatMode.current === "live" || !chip.chipId) {
        visitorSays(chip.label);
        void run(async () => {
          const r = await liveText(chip.label);
          if (r === "demo") {
            chatMode.current = "demo";
            if (chip.chipId) await beat(SCRIPT.next[chip.chipId]);
            else await demoText(chip.label);
          }
        });
        return;
      }
      visitorSays(chip.label);
      const id = chip.chipId;
      if (id === "project" || id === "continuous" || id === "unsure") path.current.engagement = id;
      if (id === "asap" || id === "oneToThree" || id === "noDate") path.current.deadline = id;
      void run(() => beat(SCRIPT.next[id]));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [beat, busy, demoText, liveText, run],
  );

  const pickSlot = useCallback(
    (msgId: string, start: string) => {
      if (busy) return;
      patch(msgId, (m) => (m.kind === "slots" ? { ...m, picked: start, locked: true } : m));
      const s = statusRef.current;
      visitorSays(t("script.b7.picked", { day: dayPicked(start, locale, s.timeZone), date: dayMonth(start, locale, s.timeZone), time: hm(start, locale, s.timeZone) }));
      const prefill = s.calendar === "demo" && chatMode.current === "demo" ? { name: DEMO_VISITOR.name, email: DEMO_VISITOR.email } : undefined;
      void run(() => say(t("script.b7.text"), [{ id: nid(), kind: "contact", variant: "book", start, prefill, state: "idle" }]));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [busy, locale, run, say, t],
  );

  const noneFits = useCallback(
    (msgId: string) => {
      if (busy) return;
      patch(msgId, (m) => (m.kind === "slots" ? { ...m, locked: true } : m));
      void run(() => say(t("script.fallback.text"), [{ id: nid(), kind: "contact", variant: "callback", state: "idle" }]));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [busy, run, say, t],
  );

  const submitContact = useCallback(
    (msgId: string, values: { name: string; email: string; consent: boolean }) => {
      const card = msgs.find((m) => m.id === msgId);
      if (!card || card.kind !== "contact" || card.state !== "idle") return;
      const name = values.name.trim();
      const email = values.email.trim();
      const errors: ContactErrors = { name: name.length < 2, email: !EMAIL_RE.test(email), consent: !values.consent };
      if (errors.name || errors.email || errors.consent) {
        patch(msgId, (m) => (m.kind === "contact" ? { ...m, errors } : m));
        return;
      }
      patch(msgId, (m) => (m.kind === "contact" ? { ...m, errors: undefined, state: "sending" } : m));
      const sum = card.summary || summary();

      void run(async () => {
        if (card.variant === "callback") {
          try {
            await postBook({ intent: "callback", name, email, consent: true, summary: sum });
            patch(msgId, (m) => (m.kind === "contact" ? { ...m, state: "done" } : m));
            history.current.push({ role: "assistant", content: "[callback request sent to Wesley]" });
            await say(t("script.fallback.done"));
          } catch (e) {
            patch(msgId, (m) => (m.kind === "contact" ? { ...m, state: "idle", errors: fieldErrors(e) } : m));
            if (!(e instanceof HttpError && e.status === 400)) add({ id: nid(), kind: "alert", text: e instanceof HttpError && e.status === 429 ? t("script.rateLimit") : t("script.chatError") });
          }
          return;
        }

        const pending = statusRef.current.bookingMode === "aprovacao";
        const r = await toolLine(pending ? "request" : "invite", 900, () =>
          postBook({ intent: "book", start: card.start, name, email, consent: true, summary: sum }),
        );
        if (!r) return;
        if (r.res.ok) {
          const b = r.res.value;
          const waiting = b.status === "pending";
          if (waiting && !pending) patch(r.id, (m) => (m.kind === "tool" ? { ...m, tool: "request" } : m));
          patch(msgId, (m) => (m.kind === "contact" ? { ...m, state: "done" } : m));
          const bookingMsg: Msg = {
            id: nid(),
            kind: "booking",
            variant: waiting ? "waiting" : "confirmed",
            start: b.start ?? card.start!,
            end: b.end ?? new Date(Date.parse(card.start!) + 30 * 60_000).toISOString(),
            email: b.email,
            meetLink: b.meetLink ?? null,
            demo: b.mode === "demo",
          };
          add(bookingMsg);
          history.current.push({ role: "assistant", content: waiting ? `[call requested for ${bookingMsg.start}, waiting for Wesley]` : `[call booked for ${bookingMsg.start}; invite sent to the visitor]` });
          if (!waiting) setOrb("success");
          if (waiting) await say(t("script.b8.approvalText"));
          else await say(t("script.b8.text"), [], { orbAfter: "success", link: { label: t("script.b8.link") } });
          return;
        }
        const e = r.res.error;
        if (e instanceof HttpError && e.status === 409) {
          patch(r.id, (m) => (m.kind === "tool" ? { ...m, state: "error", errorText: t("script.slotTaken") } : m));
          patch(msgId, (m) => (m.kind === "contact" ? { ...m, state: "done" } : m));
          await showSlots(t("script.b6.short"));
          return;
        }
        if (e instanceof HttpError && e.status === 400) {
          drop(r.id);
          patch(msgId, (m) => (m.kind === "contact" ? { ...m, state: "idle", errors: fieldErrors(e) } : m));
          return;
        }
        if (e instanceof HttpError && e.status === 429) {
          drop(r.id);
          patch(msgId, (m) => (m.kind === "contact" ? { ...m, state: "idle" } : m));
          add({ id: nid(), kind: "alert", text: t("script.rateLimit") });
          return;
        }
        patch(r.id, (m) => (m.kind === "tool" ? { ...m, state: "error", errorText: t("script.error.tool") } : m));
        patch(msgId, (m) => (m.kind === "contact" ? { ...m, state: "done" } : m));
        await say(t("script.error.text"), [{ id: nid(), kind: "contact", variant: "callback", state: "idle", prefill: { name, email } }]);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [msgs, postBook, run, say, showSlots, t, toolLine],
  );

  return {
    msgs,
    orb,
    phase,
    composer,
    setComposer,
    busy,
    status,
    tz,
    isDemo: status ? status.chat === "demo" || status.calendar === "demo" : false,
    chatIsDemo: status?.chat === "demo",
    start,
    restart,
    send,
    pickChip,
    pickSlot,
    noneFits,
    submitContact,
  };
}

function fieldErrors(e: unknown): ContactErrors | undefined {
  if (!(e instanceof HttpError) || e.status !== 400 || !e.body?.issues) return undefined;
  const out: ContactErrors = {};
  for (const i of e.body.issues) {
    if (i.path === "name") out.name = true;
    if (i.path === "email") out.email = true;
    if (i.path === "consent") out.consent = true;
  }
  return out;
}

export type OrbitaEngine = ReturnType<typeof useOrbitaEngine>;
