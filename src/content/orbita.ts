import { crops } from "./images";

/**
 * Órbita site widget — scripted target experience (v3spec §8).
 * HONESTY: this is the TARGET visitor experience; the booking backend does not
 * exist yet (v3spec §10.1, §13 D). Keep the fictional person/slots labelled.
 *
 * Copy: orbita.script.<beatId>.* · orbita.chips.<chipId> · orbita.tools.<toolId>.{running,done}
 *       orbita.slots.* · orbita.booking.* · orbita.contactCard.* · orbita.projectCards.<slug>.*
 */

export type OrbState = "idle" | "thinking" | "searching" | "success";

export const ORB_CROPS = {
  idle: crops.orb.idle,
  thinking: crops.orb.thinking,
  searching: crops.orb.searching,
  success: crops.orb.success,
} as const;

/** Header status line key per phase: orbita.header.status.<key>. */
export const ORB_STATUS = ["online", "typing", "calendar", "invite"] as const;

export type ChipId =
  | "seeProjects"
  | "haveProject"
  | "bookCall"
  | "project"
  | "continuous"
  | "unsure"
  | "asap"
  | "oneToThree"
  | "noDate";

/**
 * Beats (v3spec §8.3). `next` maps a chip to the following beat.
 * Tool delays in ms; typing delay = clamp(700, 12ms × chars, 1600);
 * reduced motion → functional delays 300ms, draft appears whole.
 */
export const SCRIPT = {
  b0: { chips: ["seeProjects", "haveProject", "bookCall"] as ChipId[], typingMs: 600 },
  b1a: { draftKey: "orbita.script.b1a.draft", draftCharMs: 24, autoSendMs: 1200 },
  b1b: { cards: ["orbita", "orbitmind", "nexbot"] as const, chips: ["haveProject", "bookCall"] as ChipId[] },
  b3: { tool: "portfolio", toolMs: 700, card: "nexbot" as const },
  b4: { chips: ["project", "continuous", "unsure"] as ChipId[] },
  b5: { chips: ["asap", "oneToThree", "noDate"] as ChipId[] },
  b6: { tool: "calendar", toolMs: 900, orb: "searching" as OrbState },
  b7: { contactCard: true },
  b8: { tool: "invite", toolMs: 900, orb: "success" as OrbState },
  next: {
    seeProjects: "b1b",
    haveProject: "b1a",
    bookCall: "b4",
    project: "b5",
    continuous: "b5",
    unsure: "b5",
    asap: "b6",
    oneToThree: "b6",
    noDate: "b6",
  } as Record<ChipId, string>,
} as const;

/** Tool lines: orbita.tools.<id>.{running, done} (+ error variants). */
export const TOOLS = ["portfolio", "calendar", "invite", "request"] as const;

/**
 * Fictional free slots (Brasília, 30 min, Google Meet) — demo only.
 * Day labels: orbita.slots.days.<id>; slot aria: orbita.slots.slotAria with {day, time}.
 */
export const DEMO_SLOTS = [
  { id: "wed", date: "2026-09-30", times: ["14:00", "16:30"] },
  { id: "thu", date: "2026-10-01", times: ["10:00", "11:30", "15:00"] },
  { id: "fri", date: "2026-10-02", times: ["09:30", "14:00"] },
] as const;

/** Prefill used by the demo contact card (fictional; OWNER-FLAG v3spec §13 E.29). */
export const DEMO_VISITOR = {
  name: "Ana Ribeiro",
  company: "Clínica Exemplo",
  email: "ana@clinicaexemplo.com.br",
} as const;

/** Widget event bridge: see components/site/orbita-bridge.ts */
export const ORBITA_PANEL_ID = "orbita-panel";
