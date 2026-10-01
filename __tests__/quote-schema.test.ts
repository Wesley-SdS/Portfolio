import { describe, it, expect } from "@jest/globals";
import { quoteSchema } from "../src/content/quote";
import { EMPTY_VALUES, buildPayload, collectErrors, firstInvalidStep, normalizeLink, validateStep, type QuoteValues } from "../components/quote/validate";
import { prefillFromSearch, sanitizePrefill } from "../components/quote/prefill";
import { buildIcs, demoSlots, formatDayTab, formatTime, groupSlots, parseSlotsResponse } from "../components/quote/booking";

const valid: QuoteValues = {
  ...EMPTY_VALUES,
  engagement: "project",
  solutions: ["ai_agents", "whatsapp_bots"],
  description: "Atendimento com IA no WhatsApp para uma clínica.",
  deadline: "1_3_months",
  name: "Ana Ribeiro",
  company: "Clínica Exemplo",
  email: "ana@clinicaexemplo.com.br",
  consent: true,
};

describe("quoteSchema + per-step validation", () => {
  it("accepts a complete payload", () => {
    const res = quoteSchema.safeParse(buildPayload(valid, { locale: "pt" }));
    expect(res.success).toBe(true);
  });

  it("flags only the fields of the current step (message keys)", () => {
    expect(validateStep(1, EMPTY_VALUES)).toEqual({ engagement: "quote.steps.s1.error" });
    expect(validateStep(2, EMPTY_VALUES)).toEqual({ solutions: "quote.steps.s2.error" });
    expect(validateStep(3, { ...EMPTY_VALUES, description: "curto" })).toEqual({ description: "quote.steps.s3.error" });
    expect(validateStep(4, EMPTY_VALUES)).toEqual({ deadline: "quote.steps.s4.error" });
    expect(validateStep(5, EMPTY_VALUES)).toEqual({
      name: "quote.errors.name",
      email: "quote.errors.email",
      consent: "quote.errors.consent",
    });
    expect(validateStep(5, valid)).toEqual({});
  });

  it("requires 'Qual?' when Outro is selected, even if other steps are incomplete", () => {
    expect(validateStep(2, { ...EMPTY_VALUES, solutions: ["other"] })).toEqual({ other: "quote.steps.s2.otherError" });
    expect(validateStep(2, { ...EMPTY_VALUES, solutions: ["other"], other: "ERP" })).toEqual({});
  });

  it("normalizes links and rejects garbage", () => {
    expect(normalizeLink("exemplo.com.br")).toBe("https://exemplo.com.br");
    expect(normalizeLink("  ")).toBe("");
    expect(validateStep(3, { ...valid, link: "exemplo.com.br" })).toEqual({});
    expect(validateStep(3, { ...valid, link: "not a url at all" })).toEqual({ link: "quote.errors.link" });
  });

  it("rejects a filled honeypot and maps issues back to their step", () => {
    const errs = collectErrors({ ...buildPayload(valid, { locale: "pt" }), website: "http://spam" });
    expect(errs.website).toBeDefined();
    expect(firstInvalidStep({ email: "x" })).toBe(5);
    expect(firstInvalidStep({ description: "x", email: "y" })).toBe(3);
    expect(firstInvalidStep({})).toBeNull();
  });
});

describe("prefill contract", () => {
  it("reads ?tipo / ?formato / ?solucao and drops unknown values", () => {
    expect(prefillFromSearch("?tipo=orbitmind")).toEqual({ ref: "orbitmind", solutions: ["ai_agents", "web_platform"] });
    expect(prefillFromSearch("?formato=consulting&solucao=integrations,nope")).toEqual({ engagement: "consulting", solutions: ["integrations"] });
    expect(prefillFromSearch("?tipo=cia&formato=free")).toEqual({});
    expect(sanitizePrefill({ ref: "nex", solutions: ["mobile_app"] })).toEqual({ ref: "nex", solutions: ["mobile_app"] });
    // Órbita chat hand-over (orbita:quote-prefill)
    expect(sanitizePrefill({ engagement: "project", deadline: "asap", description: "  Bot  ", source: "orbita", extra: 1 } as never)).toEqual({
      engagement: "project",
      deadline: "asap",
      description: "Bot",
      source: "orbita",
    });
  });
});

describe("booking helpers", () => {
  it("parses slot responses defensively", () => {
    const r = parseSlotsResponse({
      mode: "auto",
      slots: [
        { start: "2026-10-01T13:00:00.000Z", end: "2026-10-01T13:30:00.000Z" },
        { start: "bad", end: "x" },
        { start: "2026-09-30T17:00:00.000Z", end: "2026-09-30T17:30:00.000Z" },
      ],
    });
    expect(r.mode).toBe("auto");
    expect(r.slots).toHaveLength(2);
    expect(r.slots[0].start).toBe("2026-09-30T17:00:00.000Z");
    expect(parseSlotsResponse({ slots: [] }).mode).toBe("demo");
    // implemented Órbita shape (lib/orbita/protocol.ts SlotsPayload)
    const live = parseSlotsResponse({
      mode: "live",
      timeZone: "America/Sao_Paulo",
      slotMinutes: 30,
      days: [{ date: "2026-10-01", slots: [{ start: "2026-10-01T13:00:00.000Z", end: "2026-10-01T13:30:00.000Z" }] }],
    });
    expect(live.mode).toBe("auto");
    expect(live.slots).toHaveLength(1);
    expect(() => parseSlotsResponse(null)).toThrow();
  });

  it("groups demo slots by São Paulo day with localized labels", () => {
    const days = groupSlots(demoSlots().slots, "pt");
    expect(days.map((d) => d.slots.length)).toEqual([2, 3, 2]);
    expect(days[0].tab).toBe("Qua 30/09");
    expect(formatTime(days[1].slots[0].start, "pt")).toBe("10:00");
    expect(formatDayTab(days[1].slots[0].start, "en")).toBe("Thu 10/01");
  });

  it("builds a valid .ics", () => {
    const ics = buildIcs({ slot: demoSlots().slots[0], title: "Conversa; teste", description: "30 min", url: "https://meet.google.com/abc" });
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART:20260930T170000Z");
    expect(ics).toContain("SUMMARY:Conversa\\; teste");
  });
});
