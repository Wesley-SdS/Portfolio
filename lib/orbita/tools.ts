import type Anthropic from "@anthropic-ai/sdk";
import { presentedSlots } from "./calendar";
import { searchProjects } from "./knowledge";
import { bookCallInput, getFreeSlotsInput, handoffInput, searchPortfolioInput } from "./schemas";
import { isBookable } from "./slots";
import type { ChatLocale, OrbitaUi, ToolLineId } from "./protocol";

/**
 * The visitor-mode tool whitelist (4 tools). None of them can read private data
 * or write anything: slots expose free time only, book_call and handoff_to_quote
 * just show UI the visitor must act on. Inputs are validated with zod before use
 * (eager_input_streaming disables server-side validation).
 */

export const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: "search_portfolio",
    description:
      "Search Wesley's public products and projects (from the site). Returns matching projects with status, one-liner, highlight and link, and shows up to 3 project cards to the visitor. Call with no query to list the main products.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keywords, e.g. 'whatsapp bot', 'rag', 'fintech'. Optional." },
        category: { type: "string", enum: ["ai", "messaging", "fintech", "custom"], description: "Optional category filter." },
      },
      additionalProperties: false,
    },
    eager_input_streaming: true,
  },
  {
    name: "get_free_slots",
    description:
      "Get Wesley's next free 30-minute slots for a Google Meet call (Brasília time, business hours, at least 24h ahead). Shows a slot picker to the visitor. Returns only free times — never appointments.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "book_call",
    description:
      "Propose a specific free slot the visitor asked for in text. Does not create anything: it shows a confirmation card where the visitor enters name and e-mail and gives consent. Use the exact ISO start time returned by get_free_slots.",
    input_schema: {
      type: "object",
      properties: {
        start: { type: "string", description: "ISO 8601 start of the chosen slot, exactly as returned by get_free_slots." },
        name: { type: "string", description: "Visitor's name if they already said it. Optional." },
        email: { type: "string", description: "Visitor's e-mail if they already said it. Optional." },
        summary: { type: "string", description: "One or two sentences summarising the need, engagement type and timeline, for Wesley." },
      },
      required: ["start"],
      additionalProperties: false,
    },
    eager_input_streaming: true,
  },
  {
    name: "handoff_to_quote",
    description:
      "Show the visitor a link to the written quote form, prefilled with what was learned. Use when they want a proposal or ask about price.",
    input_schema: {
      type: "object",
      properties: {
        engagement: { type: "string", enum: ["continuous", "project", "consulting", "unsure"] },
        solutions: {
          type: "array",
          items: { type: "string", enum: ["web_platform", "mobile_app", "ai_agents", "whatsapp_bots", "integrations", "legacy_evolution", "other"] },
        },
        deadline: { type: "string", enum: ["asap", "1_3_months", "no_date"] },
        description: { type: "string", description: "Short description of what they want to build, in their words." },
      },
      additionalProperties: false,
    },
    eager_input_streaming: true,
  },
];

export interface ToolOutcome {
  /** JSON string returned to the model */
  content: string;
  isError?: boolean;
  /** UI to render in the chat after the assistant's text */
  ui?: OrbitaUi;
  /** visible "tool line" (v3spec §8.2) — omitted for silent tools */
  line?: ToolLineId;
}

export function toolLineFor(name: string): ToolLineId | undefined {
  if (name === "search_portfolio") return "portfolio";
  if (name === "get_free_slots") return "calendar";
  return undefined;
}

function invalid(detail: string): ToolOutcome {
  return { content: JSON.stringify({ INVALID_INPUT: detail }), isError: true };
}

export async function runTool(name: string, input: unknown, locale: ChatLocale): Promise<ToolOutcome> {
  switch (name) {
    case "search_portfolio": {
      const p = searchPortfolioInput.safeParse(input);
      if (!p.success) return invalid(JSON.stringify(input));
      const results = searchProjects(locale, p.data.query, p.data.category);
      const shown = results.slice(0, 3).map((r) => r.slug);
      return {
        content: JSON.stringify({ results, shown_to_visitor_as_cards: shown }),
        ui: shown.length ? { kind: "projects", slugs: shown } : undefined,
        line: "portfolio",
      };
    }
    case "get_free_slots": {
      const p = getFreeSlotsInput.safeParse(input ?? {});
      if (!p.success) return invalid(JSON.stringify(input));
      try {
        const data = await presentedSlots();
        const compact = data.days.map((d) => ({ date: d.date, starts: d.slots.map((s) => s.start) }));
        return {
          content: JSON.stringify({
            mode: data.mode,
            timeZone: data.timeZone,
            minutes: data.slotMinutes,
            days: compact,
            note: data.days.length ? "A slot picker is now visible to the visitor." : "No free slots in the next days — offer the e-mail callback.",
          }),
          ui: { kind: "slots", data },
          line: "calendar",
        };
      } catch (e) {
        console.error("[orbita] get_free_slots failed", e);
        return { content: JSON.stringify({ error: "calendar_unavailable", hint: "Offer to take the visitor's e-mail so Wesley replies with times." }), isError: true, line: "calendar" };
      }
    }
    case "book_call": {
      const p = bookCallInput.safeParse(input);
      if (!p.success) return invalid(JSON.stringify(input));
      try {
        const data = await presentedSlots(10, 48);
        const slot = isBookable(p.data.start, data.days);
        if (!slot) return { content: JSON.stringify({ error: "slot_not_available", hint: "Call get_free_slots and let the visitor pick." }), isError: true };
        return {
          content: JSON.stringify({ status: "awaiting_visitor_confirmation", start: slot.start, note: "A confirmation card is visible; the visitor must submit it. Nothing is booked yet." }),
          ui: { kind: "contact", start: slot.start, name: p.data.name, email: p.data.email, summary: p.data.summary },
        };
      } catch (e) {
        console.error("[orbita] book_call check failed", e);
        return { content: JSON.stringify({ error: "calendar_unavailable" }), isError: true };
      }
    }
    case "handoff_to_quote": {
      const p = handoffInput.safeParse(input ?? {});
      if (!p.success) return invalid(JSON.stringify(input));
      return {
        content: JSON.stringify({ status: "quote_link_shown" }),
        ui: { kind: "quote", prefill: p.data },
      };
    }
    default:
      return invalid(`unknown tool ${name}`);
  }
}
