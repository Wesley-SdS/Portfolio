import { addDays, zonedParts, zonedTimeToUtc } from "./time";

/**
 * Free-slot computation for the Órbita booking flow (v3spec §8.4, §13 D.22).
 * Pure: takes "now", the busy intervals from Google free/busy and the schedule
 * config, returns bookable slots grouped by local day. Never sees event titles.
 */

export interface Interval {
  start: Date;
  end: Date;
}

export interface ScheduleConfig {
  /** IANA zone the working hours are expressed in (default America/Sao_Paulo) */
  timeZone: string;
  /** 0 = Sunday … 6 = Saturday */
  workDays: number[];
  /** working windows in minutes of day, e.g. [[540, 720], [810, 1080]] */
  workWindows: Array<[number, number]>;
  slotMinutes: number;
  /** calendar days scanned, starting today (local) */
  lookaheadDays: number;
  minNoticeHours: number;
  /** free margin required around busy blocks */
  bufferMinutes: number;
}

export interface Slot {
  /** ISO 8601 UTC */
  start: string;
  end: string;
}

export interface SlotDay {
  /** local calendar date YYYY-MM-DD in config.timeZone */
  date: string;
  slots: Slot[];
}

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && aEnd > bStart;
}

/** All bookable slots, grouped by local day (days without slots are omitted). */
export function computeFreeSlots(now: Date, busy: Interval[], cfg: ScheduleConfig): SlotDay[] {
  const slotMs = cfg.slotMinutes * 60_000;
  const bufferMs = cfg.bufferMinutes * 60_000;
  const earliest = now.getTime() + cfg.minNoticeHours * 3_600_000;
  const blocks = busy
    .map((b) => ({ s: b.start.getTime() - bufferMs, e: b.end.getTime() + bufferMs }))
    .filter((b) => Number.isFinite(b.s) && Number.isFinite(b.e) && b.e > b.s);

  const today = zonedParts(now, cfg.timeZone);
  const days: SlotDay[] = [];
  for (let i = 0; i < cfg.lookaheadDays; i++) {
    const d = addDays(today.year, today.month, today.day, i);
    if (!cfg.workDays.includes(d.weekday)) continue;
    const slots: Slot[] = [];
    for (const [from, to] of cfg.workWindows) {
      for (let m = from; m + cfg.slotMinutes <= to; m += cfg.slotMinutes) {
        const start = zonedTimeToUtc(d.year, d.month, d.day, m, cfg.timeZone).getTime();
        const end = start + slotMs;
        if (start < earliest) continue;
        if (blocks.some((b) => overlaps(start, end, b.s, b.e))) continue;
        slots.push({ start: new Date(start).toISOString(), end: new Date(end).toISOString() });
      }
    }
    if (slots.length) {
      const date = `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
      days.push({ date, slots });
    }
  }
  return days;
}

/** True when `startIso` is exactly one of the currently bookable slots. */
export function isBookable(startIso: string, days: SlotDay[]): Slot | null {
  const t = Date.parse(startIso);
  if (!Number.isFinite(t)) return null;
  for (const d of days) for (const s of d.slots) if (Date.parse(s.start) === t) return s;
  return null;
}

/**
 * Trim to what the widget shows: the first `maxDays` days, at most `perDay` slots each,
 * spread evenly across the day (so a free day offers morning and afternoon options).
 */
export function presentSlots(days: SlotDay[], maxDays = 3, perDay = 6): SlotDay[] {
  return days.slice(0, maxDays).map((d) => ({ date: d.date, slots: spread(d.slots, perDay) }));
}

export function spread<T>(items: T[], n: number): T[] {
  if (items.length <= n) return items;
  if (n <= 1) return items.slice(0, Math.max(0, n));
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(items[Math.round((i * (items.length - 1)) / (n - 1))]);
  return out;
}

/**
 * Deterministic, realistic busy blocks for demo mode (no Google credentials):
 * a few meetings per working day so the picker looks like a real calendar.
 */
export function demoBusy(now: Date, cfg: ScheduleConfig): Interval[] {
  const today = zonedParts(now, cfg.timeZone);
  const out: Interval[] = [];
  const patterns: Array<Array<[number, number]>> = [
    [[9 * 60, 10 * 60 + 30], [13 * 60, 14 * 60], [17 * 60, 18 * 60]],
    [[9 * 60 + 30, 10 * 60], [12 * 60, 15 * 60]],
    [[10 * 60, 11 * 60], [14 * 60 + 30, 16 * 60], [16 * 60 + 30, 18 * 60]],
    [[8 * 60, 9 * 60 + 30], [11 * 60, 13 * 60 + 30]],
    [[9 * 60, 12 * 60], [15 * 60, 16 * 60 + 30]],
  ];
  for (let i = 0; i < cfg.lookaheadDays; i++) {
    const d = addDays(today.year, today.month, today.day, i);
    const p = patterns[(d.day + d.month) % patterns.length];
    for (const [s, e] of p) {
      out.push({
        start: zonedTimeToUtc(d.year, d.month, d.day, s, cfg.timeZone),
        end: zonedTimeToUtc(d.year, d.month, d.day, e, cfg.timeZone),
      });
    }
  }
  return out;
}
