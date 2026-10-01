import type { Period } from "./types";

/**
 * "Sobre & experiência" (#experience) — the career timeline, newest first.
 * Source of truth: the owner's CV (cv_wesley_santos.pdf, Sep 2026). Public-safe only:
 * employer names, roles, dates and the CV's own bullets; no client names, no internal screens.
 *
 * Copy: leadership.companies.<id>.{name, role, mode, paragraph, bullets[], stack, period?}
 * and, for multi-role entries, leadership.companies.<id>.roles.<roleId>.{title, text}.
 */

export interface Role {
  /** leadership.companies.<company>.roles.<id>.{title, text} */
  id: string;
  period: Period;
  /** node filled with --accent (reached by promotion) */
  promoted: boolean;
}

export interface Company {
  id: "cia" | "adalink" | "chatguru" | "alura" | "revoluna" | "love" | "mg";
  /** null → the row shows leadership.companies.<id>.period (the CV gives only a duration) */
  span: Period | null;
  /** the CV gives years only ("2015 – 2023") */
  yearsOnly: boolean;
  current: boolean;
  /** role ladder inside the entry, newest first (empty for single-role entries) */
  roles: Role[];
  link: { href: string; label: string } | null;
}

export const COMPANIES: Company[] = [
  {
    id: "cia",
    span: { start: { y: 2026, m: 7 }, end: "present" },
    yearsOnly: false,
    current: true,
    roles: [],
    link: null,
  },
  {
    id: "adalink",
    span: { start: { y: 2025, m: 2 }, end: "present" },
    yearsOnly: false,
    current: true,
    roles: [
      { id: "lead", period: { start: { y: 2025, m: 6 }, end: "present" }, promoted: true },
      { id: "senior", period: { start: { y: 2025, m: 2 }, end: { y: 2025, m: 6 } }, promoted: false },
    ],
    link: { href: "https://adalink.com.br", label: "adalink.com.br" },
  },
  {
    id: "chatguru",
    span: { start: { y: 2026, m: 2 }, end: { y: 2026, m: 7 } },
    yearsOnly: false,
    current: false,
    roles: [],
    link: null,
  },
  {
    id: "alura",
    span: { start: { y: 2026, m: 2 }, end: { y: 2026, m: 6 } },
    yearsOnly: false,
    current: false,
    roles: [],
    link: null,
  },
  {
    id: "revoluna",
    span: { start: { y: 2025, m: 10 }, end: { y: 2026, m: 6 } },
    yearsOnly: false,
    current: false,
    roles: [],
    link: null,
  },
  {
    id: "love",
    span: null,
    yearsOnly: false,
    current: false,
    roles: [],
    link: null,
  },
  {
    id: "mg",
    span: { start: { y: 2015, m: 10 }, end: { y: 2023, m: 7 } },
    yearsOnly: true,
    current: false,
    roles: [
      { id: "lead", period: { start: { y: 2021, m: 1 }, end: { y: 2023, m: 7 } }, promoted: true },
      { id: "fullstack", period: { start: { y: 2019, m: 1 }, end: { y: 2021, m: 1 } }, promoted: true },
      { id: "frontend", period: { start: { y: 2015, m: 10 }, end: { y: 2019, m: 1 } }, promoted: false },
    ],
    link: { href: "https://melhordograo.com.br", label: "melhordograo.com.br" },
  },
];

/** Default open entry in the single-open timeline. */
export const DEFAULT_OPEN_COMPANY: Company["id"] = "cia";
