import { describe, expect, it } from "@jest/globals";
import { CASES } from "@/src/content/cases";
import {
  CASE_FALLBACK_HREF,
  CASE_SLUGS,
  PROJECTS,
  STAGE_CHAPTERS,
  caseLinkFor,
} from "@/src/content/projects";
import { ROUTES } from "@/src/content/site";
import type { ProjectSlug } from "@/src/content/types";

/** Every "Estudo de caso" target must be a generated case page or the products-table fallback. */
const validCaseHrefs = new Set<string>([...CASE_SLUGS.map((s) => ROUTES.project(s)), CASE_FALLBACK_HREF]);

describe("case links never 404", () => {
  it("case pages = the five projects with hasCase", () => {
    expect([...CASE_SLUGS].sort()).toEqual(["nex", "orbita", "orbitfinance", "orbitmind", "vektus"]);
    expect(Object.keys(CASES).sort()).toEqual([...CASE_SLUGS].sort());
  });

  it("caseLinkFor resolves for every project", () => {
    for (const slug of Object.keys(PROJECTS) as ProjectSlug[]) {
      expect(validCaseHrefs.has(caseLinkFor(slug))).toBe(true);
    }
  });

  it("VibeCoding has no case page and falls back to the products table", () => {
    expect(PROJECTS.vibecoding.hasCase).not.toBe(true);
    expect(caseLinkFor("vibecoding")).toBe(CASE_FALLBACK_HREF);
  });

  it("every caseHref points to a generated case page", () => {
    for (const p of Object.values(PROJECTS)) {
      if (p.caseHref) expect(CASE_SLUGS.map((s) => ROUTES.project(s))).toContain(p.caseHref);
    }
  });

  it("stage case CTAs and case next-links target existing cases", () => {
    for (const ch of STAGE_CHAPTERS) {
      if (ch.cta.kind === "case") expect(validCaseHrefs.has(ch.cta.href)).toBe(true);
    }
    for (const c of Object.values(CASES)) {
      expect(CASE_SLUGS).toContain(c.next);
    }
  });
});
