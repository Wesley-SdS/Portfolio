import type { Config } from "tailwindcss";

/**
 * Casebook v3 Tailwind config.
 * Every colour/font/radius maps to a CSS variable defined in app/globals.css,
 * so utilities follow the light/dark theme automatically (`bg-surface`,
 * `text-ink-2`, `border-line-strong`, `font-display`, `rounded-mat` …).
 * Product lights are RGB triplets: `bg-l-orbita/30` works via <alpha-value>.
 * Dark variant: `dark:` matches `[data-theme="dark"]` (set by next-themes).
 * Breakpoints: Tailwind defaults (sm 640 · md 768 · lg 1024 · xl 1280) plus
 * `nav` (1120) where the desktop header nav appears.
 */
const v = (name: string) => `var(--${name})`;
const light = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      screens: {
        nav: "1120px",
      },
      colors: {
        bg: v("bg"),
        surface: v("surface"),
        mat: v("mat"),
        ink: { DEFAULT: v("ink"), 2: v("ink-2"), 3: v("ink-3") },
        line: { DEFAULT: v("line"), strong: v("line-strong") },
        accent: {
          DEFAULT: v("accent"),
          hover: v("accent-hover"),
          ink: v("accent-ink"),
          "ink-hover": v("accent-ink-hover"),
        },
        "on-accent": v("on-accent"),
        ok: v("ok"),
        error: v("error"),
        scrim: v("scrim"),
        stage: {
          DEFAULT: v("stage"),
          raise: v("stage-raise"),
          "raise-2": v("stage-raise-2"),
          ink: v("stage-ink"),
          "ink-2": v("stage-ink-2"),
          "ink-3": v("stage-ink-3"),
          line: v("stage-line"),
          "line-strong": v("stage-line-strong"),
          track: v("stage-track"),
          accent: v("stage-accent"),
          "accent-ink": v("stage-accent-ink"),
          ok: v("stage-ok"),
        },
        "orb-tile": v("orb-tile"),
        /* product lights (fills, dots, glows only — never paper text) */
        "l-orbita": light("l-orbita"),
        "l-orbitmind": light("l-orbitmind"),
        "l-nex": light("l-nex"),
        "l-orbitfinance": light("l-orbitfinance"),
        "l-vibecoding": light("l-vibecoding"),
        "l-vektus": light("l-vektus"),
        "l-fsjpii": light("l-fsjpii"),
        "l-adalink": light("l-adalink"),
        /* text-safe tints (stage surfaces only) */
        "t-orbita": v("t-orbita"),
        "t-orbitmind": v("t-orbitmind"),
        "t-nex": v("t-nex"),
        "t-orbitfinance": v("t-orbitfinance"),
        "t-vibecoding": v("t-vibecoding"),
        "t-vektus": v("t-vektus"),
      },
      fontFamily: {
        display: v("font-display"),
        body: v("font-body"),
        sans: v("font-body"),
        mono: v("font-mono"),
      },
      borderRadius: {
        tag: "4px",
        crop: "6px",
        ctl: "8px",
        card: "10px",
        mat: "12px",
        sheet: "16px",
      },
      maxWidth: {
        content: "1280px",
        prose: "64ch",
        lead: "60ch",
      },
      spacing: {
        "page-x": v("page-x"),
        gutter: v("gutter"),
        header: v("header-h"),
      },
      boxShadow: {
        float: v("sh-float"),
        frame: v("sh-frame"),
        dialog: v("sh-dialog"),
        none: "none",
      },
      transitionTimingFunction: {
        standard: v("ease-standard"),
        "out-expo": v("ease-out-expo"),
        "out-quint": v("ease-out-quint"),
        "out-quart": v("ease-out-quart"),
        "in-exit": v("ease-in-exit"),
        inout: v("ease-inout"),
        spring: v("ease-spring"),
      },
      transitionDuration: {
        instant: "120ms",
        quick: "200ms",
        base: "320ms",
        enter: "720ms",
        scene: "900ms",
      },
      zIndex: {
        header: "50",
        panel: "60",
        overlay: "90",
        dialog: "95",
        sheet: "100",
      },
    },
  },
  plugins: [],
};

export default config;
