/** @jest-environment node */
import { describe, expect, it } from "@jest/globals";
import { computeFreeSlots, isBookable, presentSlots, spread, type ScheduleConfig } from "../../lib/orbita/slots";
import { tzOffsetMs, zonedDateKey, zonedParts, zonedTimeToUtc } from "../../lib/orbita/time";
import { parseWorkDays, parseWorkWindows } from "../../lib/orbita/config";

const SP: ScheduleConfig = {
  timeZone: "America/Sao_Paulo",
  workDays: [1, 2, 3, 4, 5],
  workWindows: [[9 * 60, 18 * 60]],
  slotMinutes: 30,
  lookaheadDays: 10,
  minNoticeHours: 24,
  bufferMinutes: 0,
};
const at = (iso: string) => new Date(iso);
const startsOf = (days: ReturnType<typeof computeFreeSlots>, date: string) => days.find((d) => d.date === date)?.slots.map((s) => s.start) ?? [];

describe("timezone helpers", () => {
  it("converts São Paulo wall-clock to UTC (UTC−3, no DST)", () => {
    expect(zonedTimeToUtc(2026, 10, 1, 10 * 60, "America/Sao_Paulo").toISOString()).toBe("2026-10-01T13:00:00.000Z");
    expect(tzOffsetMs(at("2026-01-15T12:00:00Z"), "America/Sao_Paulo")).toBe(-3 * 3_600_000);
  });

  it("handles DST transitions (America/New_York, fall back on 2026-11-01)", () => {
    expect(zonedTimeToUtc(2026, 10, 30, 9 * 60, "America/New_York").toISOString()).toBe("2026-10-30T13:00:00.000Z");
    expect(zonedTimeToUtc(2026, 11, 2, 9 * 60, "America/New_York").toISOString()).toBe("2026-11-02T14:00:00.000Z");
  });

  it("reads local date and weekday of an instant", () => {
    // 02:00Z on Oct 1 is still Sep 30 (Wednesday) in São Paulo
    expect(zonedDateKey(at("2026-10-01T02:00:00Z"), "America/Sao_Paulo")).toBe("2026-09-30");
    expect(zonedParts(at("2026-10-01T02:00:00Z"), "America/Sao_Paulo").weekday).toBe(3);
  });
});

describe("computeFreeSlots", () => {
  // Tue 2026-09-29 09:00 in São Paulo
  const now = at("2026-09-29T12:00:00Z");

  it("respects business hours in the configured timezone", () => {
    const days = computeFreeSlots(now, [], SP);
    const wed = startsOf(days, "2026-09-30");
    expect(wed).toHaveLength(18); // 09:00 … 17:30
    expect(wed[0]).toBe("2026-09-30T12:00:00.000Z"); // 09:00 local
    expect(wed[wed.length - 1]).toBe("2026-09-30T20:30:00.000Z"); // 17:30 local, ends 18:00
    for (const d of days) for (const s of d.slots) {
      const p = zonedParts(new Date(s.start), SP.timeZone);
      const m = p.hour * 60 + p.minute;
      expect(m).toBeGreaterThanOrEqual(9 * 60);
      expect(m + 30).toBeLessThanOrEqual(18 * 60);
    }
  });

  it("enforces the minimum notice (24h) — nothing today, tomorrow from the same hour", () => {
    const later = at("2026-09-29T18:00:00Z"); // Tue 15:00 local
    const days = computeFreeSlots(later, [], SP);
    expect(days.find((d) => d.date === "2026-09-29")).toBeUndefined();
    expect(startsOf(days, "2026-09-30")[0]).toBe("2026-09-30T18:00:00.000Z"); // Wed 15:00 local
  });

  it("skips weekends and stops at the lookahead", () => {
    const days = computeFreeSlots(now, [], SP);
    const dates = days.map((d) => d.date);
    expect(dates).not.toContain("2026-10-03"); // Saturday
    expect(dates).not.toContain("2026-10-04"); // Sunday
    expect(dates[dates.length - 1]).toBe("2026-10-08"); // day 9 of 10 (Thu)
    expect(dates).toHaveLength(7);
  });

  it("removes slots overlapping busy blocks (boundaries are free)", () => {
    const busy = [
      { start: at("2026-09-30T13:00:00Z"), end: at("2026-09-30T14:00:00Z") }, // 10:00–11:00 local
      { start: at("2026-09-30T17:15:00Z"), end: at("2026-09-30T17:45:00Z") }, // 14:15–14:45 local
    ];
    const wed = startsOf(computeFreeSlots(now, busy, SP), "2026-09-30");
    expect(wed).toContain("2026-09-30T12:30:00.000Z"); // 09:30–10:00 touches the block → free
    expect(wed).not.toContain("2026-09-30T13:00:00.000Z");
    expect(wed).not.toContain("2026-09-30T13:30:00.000Z");
    expect(wed).toContain("2026-09-30T14:00:00.000Z"); // 11:00 starts when the block ends → free
    expect(wed).not.toContain("2026-09-30T17:00:00.000Z"); // 14:00–14:30 overlaps 14:15
    expect(wed).not.toContain("2026-09-30T17:30:00.000Z"); // 14:30–15:00 overlaps until 14:45
    expect(wed).toHaveLength(14);
  });

  it("applies the buffer around busy blocks", () => {
    const busy = [{ start: at("2026-09-30T13:00:00Z"), end: at("2026-09-30T14:00:00Z") }];
    const wed = startsOf(computeFreeSlots(now, busy, { ...SP, bufferMinutes: 15 }), "2026-09-30");
    expect(wed).not.toContain("2026-09-30T12:30:00.000Z");
    expect(wed).not.toContain("2026-09-30T14:00:00.000Z");
    expect(wed).toContain("2026-09-30T14:30:00.000Z");
  });

  it("supports split windows (lunch break) and multi-day busy blocks", () => {
    const cfg = { ...SP, workWindows: [[9 * 60, 12 * 60], [13 * 60 + 30, 18 * 60]] as Array<[number, number]> };
    const busy = [{ start: at("2026-10-01T00:00:00Z"), end: at("2026-10-03T00:00:00Z") }];
    const days = computeFreeSlots(now, busy, cfg);
    const wed = startsOf(days, "2026-09-30");
    expect(wed).toHaveLength(6 + 9);
    expect(wed).not.toContain("2026-09-30T15:00:00.000Z"); // 12:00 local = lunch
    expect(days.find((d) => d.date === "2026-10-01")).toBeUndefined();
    expect(days.find((d) => d.date === "2026-10-02")).toBeUndefined();
  });

  it("computes local days in another timezone across DST", () => {
    const cfg: ScheduleConfig = { ...SP, timeZone: "America/New_York", workDays: [0, 1, 2, 3, 4, 5, 6], workWindows: [[9 * 60, 10 * 60]], minNoticeHours: 0, lookaheadDays: 4 };
    const days = computeFreeSlots(at("2026-10-30T12:00:00Z"), [], cfg);
    expect(days.map((d) => d.slots[0].start)).toEqual([
      "2026-10-30T13:00:00.000Z",
      "2026-10-31T13:00:00.000Z",
      "2026-11-01T14:00:00.000Z",
      "2026-11-02T14:00:00.000Z",
    ]);
  });
});

describe("presentation and booking checks", () => {
  const now = at("2026-09-29T12:00:00Z");
  it("spreads slots evenly and keeps the first 3 days", () => {
    const shown = presentSlots(computeFreeSlots(now, [], SP), 3, 6);
    expect(shown).toHaveLength(3);
    expect(shown[0].slots).toHaveLength(6);
    expect(shown[0].slots[0].start).toBe("2026-09-30T12:00:00.000Z");
    expect(shown[0].slots[5].start).toBe("2026-09-30T20:30:00.000Z");
    expect(spread([1, 2, 3], 6)).toEqual([1, 2, 3]);
  });

  it("accepts only exact free slot starts", () => {
    const days = computeFreeSlots(now, [], SP);
    expect(isBookable("2026-09-30T13:00:00.000Z", days)?.end).toBe("2026-09-30T13:30:00.000Z");
    expect(isBookable("2026-09-30T10:00:00-03:00", days)).not.toBeNull(); // same instant, other notation
    expect(isBookable("2026-09-30T13:10:00.000Z", days)).toBeNull();
    expect(isBookable("2026-10-03T13:00:00.000Z", days)).toBeNull(); // Saturday
    expect(isBookable("not-a-date", days)).toBeNull();
  });
});

describe("env parsing", () => {
  it("parses work days and windows with safe defaults", () => {
    expect(parseWorkDays("1-5")).toEqual([1, 2, 3, 4, 5]);
    expect(parseWorkDays("1,3,5")).toEqual([1, 3, 5]);
    expect(parseWorkDays("")).toEqual([1, 2, 3, 4, 5]);
    expect(parseWorkWindows("09:00-12:00,13:30-18:00")).toEqual([[540, 720], [810, 1080]]);
    expect(parseWorkWindows("garbage")).toEqual([[540, 1080]]);
  });
});
