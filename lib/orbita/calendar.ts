import { bookingMode, calendarLive, scheduleConfig } from "./config";
import { freeBusy } from "./google";
import { computeFreeSlots, demoBusy, presentSlots, type SlotDay } from "./slots";
import type { SlotsPayload } from "./protocol";

/**
 * Slot service shared by GET /api/orbita/slots, the chat tool get_free_slots and
 * the pre-insert recheck in booking. Live = Google free/busy; demo = deterministic
 * fake busy blocks on the same business-hours grid (flagged mode:"demo").
 */

export async function allFreeSlots(now = new Date()): Promise<{ mode: "live" | "demo"; days: SlotDay[] }> {
  const cfg = scheduleConfig();
  if (!calendarLive()) return { mode: "demo", days: computeFreeSlots(now, demoBusy(now, cfg), cfg) };
  const timeMax = new Date(now.getTime() + (cfg.lookaheadDays + 1) * 86_400_000);
  const busy = await freeBusy(now, timeMax, cfg.timeZone);
  return { mode: "live", days: computeFreeSlots(now, busy, cfg) };
}

export async function presentedSlots(maxDays = 3, perDay = 6, now = new Date()): Promise<SlotsPayload> {
  const cfg = scheduleConfig();
  const { mode, days } = await allFreeSlots(now);
  const shown = presentSlots(days, maxDays, perDay);
  return {
    mode: mode === "demo" ? "demo" : bookingMode(),
    timeZone: cfg.timeZone,
    slotMinutes: cfg.slotMinutes,
    days: shown,
  };
}
