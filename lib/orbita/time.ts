/**
 * Timezone helpers without dependencies (Intl only). Pure — safe on server and client.
 * Used by slot computation (lib/orbita/slots.ts) and the widget's date labels.
 */

export interface ZonedParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
}

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string) {
  let f = formatterCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    });
    formatterCache.set(timeZone, f);
  }
  return f;
}

/** Wall-clock parts of an instant in `timeZone`. */
export function zonedParts(date: Date, timeZone: string): ZonedParts {
  const out: Record<string, string> = {};
  for (const p of partsFormatter(timeZone).formatToParts(date)) out[p.type] = p.value;
  return {
    year: Number(out.year),
    month: Number(out.month),
    day: Number(out.day),
    hour: Number(out.hour) % 24,
    minute: Number(out.minute),
    second: Number(out.second),
    weekday: WEEKDAYS[out.weekday] ?? 0,
  };
}

/** Offset of `timeZone` from UTC at `date`, in ms (São Paulo = −3h = −10 800 000). */
export function tzOffsetMs(date: Date, timeZone: string): number {
  const p = zonedParts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const truncated = date.getTime() - date.getUTCMilliseconds();
  return asUtc - truncated;
}

/**
 * The UTC instant of a wall-clock time in `timeZone`.
 * `minutesOfDay` may exceed 1440 (rolls into the next day). Handles DST by re-checking
 * the offset at the candidate instant (non-existent local times shift forward).
 */
export function zonedTimeToUtc(year: number, month: number, day: number, minutesOfDay: number, timeZone: string): Date {
  const localAsUtc = Date.UTC(year, month - 1, day, 0, minutesOfDay);
  const off1 = tzOffsetMs(new Date(localAsUtc), timeZone);
  let ts = localAsUtc - off1;
  const off2 = tzOffsetMs(new Date(ts), timeZone);
  if (off2 !== off1) ts = localAsUtc - off2;
  return new Date(ts);
}

/** Calendar date (YYYY-MM-DD) of an instant in `timeZone`. */
export function zonedDateKey(date: Date, timeZone: string): string {
  const p = zonedParts(date, timeZone);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/** Add whole days to a Y/M/D triple (pure calendar arithmetic). */
export function addDays(year: number, month: number, day: number, n: number) {
  const d = new Date(Date.UTC(year, month - 1, day + n));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), weekday: d.getUTCDay() };
}

/** "HH:MM" → minutes of day. Throws on malformed input. */
export function parseHm(hm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hm.trim());
  if (!m) throw new Error(`Invalid time "${hm}" (expected HH:MM)`);
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 24 || min > 59 || (h === 24 && min > 0)) throw new Error(`Invalid time "${hm}"`);
  return h * 60 + min;
}
