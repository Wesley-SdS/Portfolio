# Casebook v3 — "Palco à venda" · implementation guide

Branch `redesign-v3`. The foundation (tokens, shell, primitives, content, messages, route stubs) is in place.
Parallel agents replace the stubs listed in §8. **Read this file first, then the spec sections named in your row.**

Design sources (scratchpad, not in the repo): `v3spec.md` (overrides everything below it; §3 = verified facts),
`v2spec.md` (motion, keyframes, class library, stage kit), `finalSpec.md` (v1 tokens/type/grid/recipes) and
the artboards `canvas/project/v3/*.dc.html` (port exact CSS values from their `<helmet><style>` + inline styles).

---

## 1. Run

```bash
export PATH="/c/ProgramData/nvm/v22.22.3:$PATH"          # Node 22
PNPM="node C:/Users/Users/AppData/Local/node/corepack/v1/pnpm/11.8.0/dist/pnpm.mjs"
$PNPM --config.engine-strict=false dev                    # http://localhost:3000 (pt), /en, /es
node node_modules/typescript/bin/tsc --noEmit             # typecheck (must pass)
node node_modules/next/dist/bin/next build                # must pass
```

- Fonts come from `next/font/google` (Funnel Display, Host Grotesk + italics, Geist Mono): the build downloads
  them once and self-hosts them. Builds therefore need network access to fonts.googleapis.com (Vercel has it).
- Env: `RESEND_API_KEY`, `CONTACT_EMAIL`, `RESEND_FROM_EMAIL` (see CONFIGURACAO_RESEND.md), `NEXT_PUBLIC_SITE_URL`;
  Órbita: `ANTHROPIC_API_KEY`, Google Calendar and `ORBITA_*` (§12.4). All documented in `.env.example` (placeholders only).
  Without keys everything runs in demo mode.
- Isolated build dir (optional): `NEXT_DIST_DIR=<dir> next build` (then `next start` with the same env) avoids clobbering
  `.next` while another `next dev`/`next start` runs in the same checkout. Unset (Vercel, normal use) → `.next`; harmless.
- `pnpm-workspace.yaml` exists only for pnpm ≥10/11: it answers the dependency build-script prompt (`allowBuilds`, all
  `false` — prebuilt binaries are enough). pnpm 9 ignores it; Vercel installs work with or without it.

## 2. Architecture

- **Next.js 15 App Router + next-intl 4** (`localePrefix: "as-needed"`: pt at `/`, `/en`, `/es`).
  `i18n/config.ts` holds `routing` (imported by middleware.ts and i18n.ts, keeps the Edge bundle small);
  `i18n/routing.ts` re-exports it plus the locale-aware `Link`, `usePathname`, `useRouter`. `i18n/paths.ts` has `HTML_LANG`,
  `localePath(locale, path)` and `languageAlternates(path)` for metadata.
- `app/layout.tsx` is a pass-through; `app/[locale]/layout.tsx` owns `<html lang>` (pt-BR/en/es), fonts,
  metadata/SEO (v3 positioning), `ThemeProvider`, `SkipLink`, `Header`, `<main id="main">`, `Footer`, `OrbitaRoot`.
  It also adds `class="js"` to `<html>` (enables the reveal gate) and sets `<body class="cb">`.
  The client provider gets every namespace except the server-only ones (`SERVER_ONLY_NAMESPACES`: meta, privacy,
  caseCommon, case*) — a client component that needs one of those must remove it from that set.
- **Theme:** next-themes, `attribute="data-theme"` on `<html>`, `defaultTheme="system"`, never forced.
  CSS falls back to `prefers-color-scheme` before hydration.
- **Server first.** Sections are server components; add `"use client"` only to the interactive leaf
  (stage, filters, accordion, chat, quote form). `useTranslations` works in both.
- **No heavy libs:** no WebGL/three/gsap/framer-motion/lottie. They and the other v2-only packages were removed from
  package.json in the integration pass (see VALIDACAO.md). Motion = CSS classes in §5.

## 3. File map

```
app/
  globals.css                 tokens + keyframes + class library + v3 helpers + reveal gate + reduced motion
  styles/sections/*.css       ONE FILE PER OWNER (hero, stage, numbers, products, services, process,
                              leadership, about, contact, quote, orbita, hire, case-orbita) — imported by the layout
  [locale]/layout.tsx         shell (see §2)
  [locale]/page.tsx           home: composes components/home/* in spec order
  [locale]/contratar/page.tsx /contratar stub (hire agent)
  [locale]/projetos/[slug]/page.tsx  case template route; generateStaticParams = locales × CASE_SLUGS (5 cases, §11)
  [locale]/not-found.tsx      404 (locale shell) · [locale]/[...rest]/page.tsx → notFound() for unknown paths
  [locale]/privacidade/page.tsx  privacy notice (LGPD) · styles/sections/privacy.css
  not-found.tsx               global fallback 404 with its own <html>/<body> (root layout is a pass-through)
  api/contact/route.ts        existing Resend endpoint (unchanged, still works)
  sitemap.ts, robots.ts
components/
  site/        Header, MobileMenu, Footer, SkipLink, LocaleSwitcher, ThemeToggle, ThemeProvider,
               HomeAnchorLink (+useAnchorHref), OrbitaTrigger, orbita-bridge.ts
  ui-v3/       shared primitives (§4) — barrel: "@/components/ui-v3"
  home/        Hero, ProjectStage, Numbers, Products, Services, Process, Leadership, About, Contact (STUBS)
  orbita/      OrbitaRoot (launcher/FAB + panel/sheet, mounted once), OrbitaChat, OrbitaInlineChat (§12)
src/content/   typed content (§6) — barrel: "@/src/content"
messages/      pt.json (verbatim spec copy), en.json, es.json — identical key sets (1451 keys)
public/        projects/orbita/*.png (8), orbita/orb-*.png (5), projects/orbitmind/app-nav.png,
               projects/influencerai/icon.svg + existing files
```

Path alias: `@/*` → repo root (so `@/src/content`, `@/components/ui-v3`, `@/i18n/routing`).

## 4. Primitives (`@/components/ui-v3`) — props contracts

| component | key props | renders |
|---|---|---|
| `Button` | `variant` primary\|secondary\|ghost · `size` md(48)\|sm(40)\|icon(44) · `arrow` · `busy` + `busyLabel` · native button props (type defaults to "button") | `.btn .btn-p/.btn-s/.btn-g` (+`.btn-busy`, `aria-busy`, clicks ignored when busy) |
| `ButtonLink` | same variants/sizes · `href` · `arrow` (→ internal, ↗ external) · `external?` | link styled as button (via SmartLink) |
| `buttonClass(variant, size, busy, className)` | — | class string for custom elements (e.g. a Link) |
| `TextLink` | `variant` accent (`.lnk`) \| quiet (`.qlnk`) · `arrow` (default true) · `href` · `external?` | inline link; external adds target/rel + sr "(abre em nova aba)" |
| `SmartLink` | `href`, `external?` | `#hash` → `<a>`, `/route` → next-intl `Link`, `http(s)` → new tab |
| `StatusTag` | `status` (content `Status`) or `shape` ring\|ok\|current · `size` md\|sm · `ping` loop\|once · `pingDelay` · `onStage` · `bare` · `children` (override word) | `.tag` with 8px glyph + UPPERCASE word from `common.status.*` |
| `SectionIndexBar` | `index` "02" · `label` · `meta?` · `onMat?` | `.ixbar` "02 — Serviços" + meta |
| `CropImage` | `crop` (from `crops.*`) **or** `src,width,height,box,masks?` · `alt?`/`decorative?` · `renderWidth` (for `sizes`) · `aspect` (default true: box sets aspect-ratio; false: size it yourself) · `priority` | `.crop` + next/image with the crop formula + masks |
| `Figure` | CropImage props + `caption`, `captionRight`, `href`, `linkLabel` | `figure.fig > .mat > .crop` + figcaption (paper only) |
| `Chip` | `pressed?` (omit for quick replies) · `count?` | `.chip` with `aria-pressed`, 44px hit area |
| `Kbd` | children | `.kbd` |
| `Icon` + re-exported lucide icons (`Sun`, `Moon`, `X`, `ArrowRight`, `CheckCircle2`, `AlertTriangle`, `RotateCcw`, `ArrowUp`, `Copy`, `Search`, `Pause`, `Play`, `Clock`, …) | `icon`, `size` (18), `label?` | lucide with stroke 1.5, aria-hidden by default. Never emoji. |
| `Clock` / `ClockLine` / `useSaoPauloClock()` | — | live São Paulo HH:MM with `.roll roll-a/roll-b`; `ClockLine` = "São Paulo · 14:32 · UTC−3" (`.meta`). SSR-safe. |
| `Reveal` | `as`, `rootMargin`, `threshold`, any HTML attrs | wrapper with `data-inview` false→true (once); pauses reveal classes inside until in view (§5.3) |
| `Orb` | `size` · `state` idle\|thinking\|searching\|success · `crossfade` · `label?` | `.orb` circular crop of the orb stills |
| `MetricValue` | `metric` (content `Metric`) · `locale` · `animate` run\|stage\|none · `index` | `.cnt` counter (+sr full value) or mask-revealed word ("1.258") |
| `BusyDots` | — | `.busy-dots` (3 dots) |

Site-level (`components/site`): `Header`, `Footer`, `MobileMenu` (Radix Dialog sheet), `LocaleSwitcher`
(`ariaLabel?`), `ThemeToggle` (`withText?`), `HomeAnchorLink anchor="servicos"` (→ `#servicos` on home,
`/#servicos` elsewhere; `#cotacao` stays local on /contratar), `OrbitaTrigger source="hero" withOrb variant size`.

### Órbita bridge (`components/site/orbita-bridge.ts`)
Every "Falar com a Órbita" control calls `openOrbita({ source, returnFocus })` (or renders `<OrbitaTrigger>`).
The widget root (`components/orbita/OrbitaRoot.tsx`, mounted once in the layout) subscribes with
`useOrbitaListener(onOpen, onClose)`; `closeOrbita()` closes. Panel id: `ORBITA_PANEL_ID` = `"orbita-panel"`
(triggers already set `aria-controls`). Implemented — see §12.

## 5. CSS contract (`app/globals.css`)

### 5.1 Tokens (CSS variables on `:root`; dark on `[data-theme="dark"]` + prefers-color-scheme fallback)
- v1: `--bg --surface --mat --ink --ink-2 --ink-3 --line --line-strong --accent --accent-hover --on-accent
  --accent-ink --accent-ink-hover --ok --error --scrim`; fonts `--font-display --font-body --font-mono`.
- layout: `--page-x` (20/40/80), `--gutter` (16/24), `--content-max` 1280, `--header-h` (56/64).
- v2: `--stage*`, product lights `--l-orbitmind/-vibecoding/-orbitfinance/-fsjpii/-adalink` (RGB triplets),
  tints `--t-*`, shadows `--sh-float --sh-frame --sh-dialog`, durations `--dur-*`, easings `--ease-*`,
  staggers `--stagger-*`, `--rise`.
- v3: `--l-orbita --l-nex --l-vektus` (+ `--t-*`), `--orb-tile`, `--chat-w --chat-h`.
- Rules: accent = fills only; accent text uses `--accent-ink`; product colour on paper = 8px dots only;
  nothing accent inside a `--mat`; status = shape + word.

Tailwind exposes the same tokens: `bg-bg bg-surface bg-mat text-ink text-ink-2 text-ink-3 border-line
border-line-strong bg-accent text-accent-ink text-ok bg-stage text-stage-ink bg-l-orbita/30 …`,
`font-display font-body font-mono`, `rounded-tag/crop/ctl/card/mat/sheet`, `max-w-content/prose/lead`,
`px-page-x`, `shadow-float/frame/dialog`, `ease-out-expo …`, `z-header/panel/overlay/dialog/sheet`,
screen `nav:` (1120px, where the desktop nav appears). `dark:` = `[data-theme="dark"]`.

### 5.2 Classes (names verbatim from v2 §4 / v3 artboards)
- Reveal: `.rv .rv-fade .rv-r .mask>span .draw-x .draw-y .pop .wipe .clip-x` (set `--base`, `--i`, `--stagger`)
- Buttons/links: `.btn .btn-sm .btn-p .btn-s .btn-g .btn-icon .btn-busy .arr .ext .lnk .qlnk` (+ `.on-stage` variants)
- Status: `.dot .dot-ring .ping .ping-once .tag .tag-s`
- Hover/bars: `.lift .grow-bar .hov`
- Marquee: `.mq .mq-track .mq-set .fr` · Rail: `.bar (> i) .is-past .is-active .is-still`
- Counters: `.cnt .run .short` (`--to`) · Gauge `.gauge` · Digit roll `.roll .roll-a .roll-b`
- Accordion: `.acc` (+ `.is-open` on the row) `.plus` · Chips `.chip .cc` · Index `.ix-box .ix-row .is-hidden`
- Preview: `.pv .is-on .xf` · Nav: `.nav-ind` (`--nx`, `--nw`) · Forms: `.err .is-on .busy-dots .check-draw .pop-in .status-in .shake`
- Theme crossfade: `.tx` · Stage kit: `.stage .is-intro .light .vignette .ch .is-active .is-out .stack .tilt .push .par(.back/.front/.loupe) .is-rest .shot .sm .chrome .crop .mk .dim .stack-link .e-meta .e-name .e-text .e-back .e-front .e-loupe .e-word .float .loop .is-paused`
- v3 helpers: `.sec` (full-bleed + page margins) + `.inner` (1280 column), `.wrap`, `.g12` (4/8/12 cols),
  `.skip`, type `.display .h2 .h3 .h3s .h4 .lead .outcome .body .small .ui .meta .eb .stat-l .stat-m .para .wordmark`
  (mobile sizes below 1024px, desktop at ≥1024), `.ixbar(.on-mat)`, `.tile .mono-tile`, `.seg-ctl`, `.nv .ni .nl`,
  `.ic .is-off .ic-sun .ic-moon`, `.stage-edge`, `.orb`, `.flink .top-lnk .up`, fields `.fld-label .fld`,
  `.kbd`, figure `.fig .mat .fig-link`, header `.site-header .is-scrolled .hdr-desktop .hdr-mobile`,
  sheet `.sheet .sl .sheet-link .ey .sl-t`, dialog `.dlg-scrim .dlg-panel` (for Radix lightbox etc.).
- Artboard scoping: tokens are global; `<body>` has `class="cb"`, so pasted `.cb X` selectors work. Rewrite
  `.cb[data-theme="dark"] X` as `[data-theme="dark"] X`. Put section CSS in **your** `app/styles/sections/*.css`.

### 5.3 Motion in production
- The artboards play every reveal at load. Below the fold, wrap the section (or block) in `<Reveal>`:
  reveal classes stay paused on frame 0 until in view. Above the fold (hero) plays at load.
- Final state of every animation is the visible state; loops show their END frame statically.
- Reduced motion: global `@media (prefers-reduced-motion: reduce)` kills animations/transitions (v2 §5), and
  `[data-motion="reduced"]` does the same on any subtree. JS islands must also read
  `matchMedia('(prefers-reduced-motion: reduce)')` (autoplay off, instant swaps, 300ms functional delays).

## 6. Content layer (`@/src/content`)

Content files hold structure + verified facts (numbers, dates, links, crops). **All visible copy is in messages.**
Never add a number/date/claim that v3spec §3 does not state; never render excluded items (§3.8).

| file | exports |
|---|---|
| `types.ts` | `Locale`, `YearMonth`, `Period`, `ImageAsset`, `CropBox`, `CropMask`, `Crop`, `Status` (inDevelopment\|beta\|mvpDone\|done\|prototypeDone\|current\|available), `StatusShape`, `Metric` (kind count\|short\|word, value, decimals, word, prefix, suffix, small, labelKey), `ProjectSlug`, `ProjectCategory` (ai\|messaging\|fintech\|custom), `ProductLight`, `Treatment` (screens\|diagram\|typographic), `ExternalLink`, `Project` |
| `format.ts` | `asLocale`, `formatMonth`, `formatPeriod(period, locale)` ("Jul – Set 2026", "Set 2025 – atual"), `formatYears` ("2015 – 2023"), `formatNumber(n, locale, decimals)` (pt/es "1.258", en "1,258"), `formatMetric`, `splitMetric` (counter int + static rest), `statusShape` |
| `images.ts` | `images` (files + natural sizes), `crops` (`crops.orbita.visaoGeral.c/.full`, `crops.orbita.conexoes.back/.c`, `gestao/conhecimento/reunioes/memoria/login .c/.full`, `crops.orbita.phone`, `crops.orb.*`, `crops.orbitmind.flowBack/flowPeek/appNav`, `crops.orbitfinance.inicio/recursoBack/recurso`, `crops.vibecoding.editor/geracaoBack/geracao/demo`, `crops.fsjpii.login`, `crops.ecommerce.home`, `crops.wesley.avatar/portrait/portraitMobile`), `ORB_BOX`, `cropStyle(image, box)` |
| `site.ts` | `SITE` (email, github, linkedin, `orbitmindUrl` = placeholder `#URL-DO-SITE-DA-ORBITMIND`, timeZone), `ANCHORS`, `ROUTES` (`hire`, `project(slug)`, `privacy`), `NAV_ITEMS` (5, page order: products · orbita · experience · services · contact), `NavKey`, `HERO_STATS` (4 count-ups) |
| `projects.ts` | `PROJECTS` (12 incl. stage-only `nex`), `GRID_PROJECTS` (11 rows, spec order), `PROJECT_CATEGORIES` (all 11 · ai 5 · messaging 2 · fintech 1 · custom 3), `CASE_SLUGS` (projects with `hasCase`: orbita, orbitmind, nex, orbitfinance, vektus), `caseLinkFor(slug)` + `CASE_FALLBACK_HREF`, `LIGHT_RGB`, `STAGE_CHAPTERS` (6: cta, ext, extraLink, 3 metrics, front/back/loupe/peek crops, nameSize), `NUMBERS` (4 cells) |
| `services.ts` | `ENGAGEMENT_MODELS` (continuous/project/consulting + hire anchors), `SOLUTIONS` (6 ids = quote enum, proof links), `COMPARISON_ROWS` |
| `process.ts` | `PROCESS_STEPS` (4, last filled), `AI_METHOD_ROWS`, `FAQ_ITEMS` |
| `leadership.ts` | `COMPANIES` (7 CV entries, newest first: cia, adalink, chatguru, alura, revoluna, love, mg — `span` \| null, `yearsOnly`, `current`, role ladder, link), `DEFAULT_OPEN_COMPANY` |
| `about.ts` | `ABOUT` (portrait crops, paragraph ids, the CV's 8 stack groups, `marquee` list) |
| `contact.ts` | `CONTACT_CHANNELS` (email with copy, linkedin, github, orbitmind, status) |
| `quote.ts` | `QUOTE_ENGAGEMENTS/SOLUTIONS/STARTS/DEADLINES/BUDGETS`, `quoteSchema` (zod; issue messages are **message keys** like `quote.errors.email` → `t(issue.message)`), `QuotePayload`, `QUOTE_STEP_COUNT` |
| `cases.ts` | `CASES` (per-case config: cover, sections → typed blocks, diagrams, gallery, numbers, next), `CaseSlug`, `isCaseSlug`, `DiagramDef` — see §11 |
| `orbita.ts` | `OrbState`, `ORB_CROPS`, `ORB_STATUS`, `ChipId`, `SCRIPT` (beats, chips, delays, `next` map), `TOOLS`, `DEMO_SLOTS`, `DEMO_VISITOR`, `ORBITA_PANEL_ID` |

`OWNER-FLAG` comments mark values the owner must confirm (v3spec §13). Keep them.

## 7. Messages (`messages/{pt,en,es}.json`)

PT is verbatim from the spec; EN/ES are natural translations. **Key sets must stay identical** (1451 keys) — add
every new key to all three. Rich text: `hero.h1.line1` contains `<hl>…</hl>` → `t.rich("h1.line1", { hl: (c) => … })`.
Arrays via `t.raw(...)`: `services.models.*.items`, `leadership.companies.*.capabilities`, list fields under
`stage.chapters.*.mech`, `hire.quote.after`, `contact.orbitaCard.slots`, `caseOrbita.sections.safety.risks`.

| namespace | contents |
|---|---|
| `meta` | titles/descriptions: home, /contratar, case, 404 |
| `common` | skipLink, present, `status.*`, `links.*` (github, orbitmindSite, caseStudy, privateCode…), `actions.*` (requestQuote, talkToOrbita, copy/copied, close, menu, back, continue, backToTop, pause/play…), `theme.*`, `language.*`, `clock.*`, source, capturePending, illustrative, investmentOnRequest, proof, opensInNewTab |
| `nav` | aria, footerAria, products, services, experience, about, contact, hire, openMenu, menuTitle |
| `hero` | avatarAlt, name, role, `h1.{line1,line2,plain}`, lead, currentlyTitle, `currently.{orbitmind,revoluna,adalink}.{title,org,logoAlt}` |
| `stage` | srTitle, ariaLabel, topbar, allProducts, counter, announce, pause/play, ctaCase/ctaQuote, cursorCase/cursorQuote, railAria, `chapters.<slug>.{rail, announceName, tag, eyebrow?, meta, name, descriptor, outcome, outcomeShort?, metrics.m1-m3, extraLink?, fig.*, mech.*}` |
| `numbers` | title, `cells.{tools,rag,tests,promotion}.{label,source,compare?,split?,unit?}` |
| `products` | title, filterAria, `chips.*`, `search.*`, `columns.*`, tableAria, shown, previewHint, `empty.*`, `items.<slug>.{name,type,tagline?,oneLiner,outcome?,highlight,stack,modules?,honestNote?}` |
| `services` | index/indexLabel/indexMeta, h2, hireLink, lead, includes/howItWorks/idealFor, `models.<id>.{title,oneLiner,items,how,ideal}`, buildTitle, `solutions.<id>.{title,desc,stack,proofs.<key>}` |
| `process` | title, meta, `steps.<id>.{title,text}`, `method.{eyebrow,text}` |
| `leadership` | index…, h2, lead, meta, linkedin, `companies.<id>.*` (name, scope, logoAlt, roles.<id>.{title,text?}, promoted, paragraph, scale.*, arch.*, capabilities, subcase.*, mode, stack) |
| `about` | index…, caption, h2, `paragraphs.<id>.{head,text}`, stackTitle, `stack.<group>` |
| `contact` | index…, h2, lead, orbitaEyebrow, orbitaNote, quoteEyebrow, `orbitaCard.*`, `channels.<id>.{dt,dd?}`, copyEmail, emailCopied |
| `quote` | eyebrow, stepOf, sent, microcopy, prefill, back/continue/send/sending, `steps.s1…s5.*`, `errors.*`, `success.*`, `confirmed.*`, `waitEmail.*` |
| `orbita` | name, chip, `launcher.*`, panelAria, srTitle, `header.*`, `disclosure.*`, `composer.*`, `log.*`, `chips.<ChipId>`, `script.<beat>.*`, `tools.<id>.{running,done}`, `projectCards.*`, `slots.*`, `contactCard.*`, `booking.*` |
| `hire` | breadcrumb, h1, lead, jump, `proof.*`, `comparison.{h2,rows,models.<id>.*,cta}`, build, `aiMethod.*`, `quote.*`, `faq.{title,items.<id>.{q,a}}` |
| `caseCommon` | shared case-template strings: tocTitle, stackLabel, breadcrumb*, nextCase, toScreens/toArchitecture, fig, `diagram.*`, `mech.*`, `gallery.*` |
| `caseOrbitmind` `caseNex` `caseOrbitfinance` `caseVektus` | same shape as `caseOrbita` (meta, h1, descriptor, ctaArchitecture, `fig.*`, `cover.*`, lead, `metaGrid.*`, stack, `toc.*`, `sections.*`, `end.*`); titles in `meta.case<Slug>Title/Description` |
| `caseOrbita` | breadcrumb, tag, meta, h1, descriptor, ctaArchitecture, `fig.*`, lead, `metaGrid.*`, stack, tocTitle, `toc.*`, `sections.*` (premise; architecture nodes/tooltips; safety risks; llm; rag rows/source; channels; screens captions; numbers items; next), `end.*` |
| `footer` | description, navTitle, linksTitle, langAria, copyright ({year}), privacy, colophon |
| `privacy` | /privacidade: breadcrumb, eyebrow, h1, lead, updated, reviewNote/Label, tocTitle, `sections.<id>.*` (controller, collect, purpose, legalBasis, processors, retention, rights, storage, security, changes), backHome — `[…]` tokens are owner placeholders (rendered highlighted) |
| `notFound`, `images` | 404 copy; alt texts keyed by each crop's `altKey` (`images.orbita.visaoGeral`, `images.orb.idle`, `images.logos.*`…) |

The old v2 namespaces (`solutions`, `gallery`, `search`, old `experience`/`projects`) were removed with the v2 components.

## 8. Owners — parallel checklist

Each agent edits ONLY its files (+ its CSS file) and keeps tsc/build green. Shared files (globals.css,
tailwind.config.ts, src/content, messages, ui-v3, site) change only by ADDING keys/exports — never rename or remove.

| owner | files | spec |
|---|---|---|
| hero | `components/home/Hero.tsx`, `app/styles/sections/hero.css` | v3 §1, §5.2, §6.2 (the page's only h1; `id="home"`) |
| stage | `components/home/ProjectStage.tsx` (+ `components/stage/*`), `stage.css` | v3 §4, §6.3; v2 §6 (id `projects`, 6 chapters, pause, reduced motion) |
| numbers | `components/home/Numbers.tsx`, `numbers.css` | v3 §5.4, §6.4 |
| products | `components/home/Products.tsx`, `products.css` | v3 §5.5, §6.4 (chips synced to ?cat=, search, fixed ix-box, preview) |
| services + process | `components/home/Services.tsx`, `Process.tsx`, `services.css`, `process.css` | v3 §5.6, §5.7, §6.4 |
| leadership | `components/home/Leadership.tsx`, `leadership.css` | v3 §5.8, §6.4 (single-open accordion, Adalink open) |
| about | `components/home/About.tsx`, `about.css` | v3 §5.9 |
| contact | `components/home/Contact.tsx`, `contact.css` | v3 §5.10, §6.4 (hosts `#orbita` inline chat + `#cotacao` QuoteForm) |
| quote | `components/quote/*`, `app/api/quote/route.ts`, `quote.css` | v3 §7 (payload = `quoteSchema`; reuse the Resend sender; rate limit; honeypot) |
| orbita | `components/orbita/*` (OrbitaRoot: launcher/panel/FAB/sheet; OrbitaChat), `orbita.css` | v3 §5.11, §6.5, §8 (bridge in §4) |
| hire | `app/[locale]/contratar/page.tsx` (+ `components/hire/*`), `hire.css` | v3 §9 |
| case-orbita | `app/[locale]/projetos/[slug]/page.tsx` (+ `components/case/*`), `case-orbita.css` (all cases) | v3 §11, v2 §9, §11 below |

Definition of done: matches the artboard at 1440 and 390 (fluid between), light + dark, keyboard and screen
reader pass (v3 §8.5), reduced motion shows end frames, no horizontal scroll at 320px, no heavy dependency,
`tsc --noEmit` and `next build` green.

## 9. Open items (owner flags, v3spec §13)
OrbitMind URL, Google Meet link, response time, chat retention, privacy page (`/privacidade` built — fill its `[…]` placeholders),
contracting entity, employer disclosure (Adalink/REVOLUNA names and numbers), public-repo confirmations
(InfluencerAI), FSJPII status, ecommerce.png client brand. Órbita: chat retention wording (`[RETENÇÃO]` in
`orbita.composer.hint`; the backend stores nothing), `/privacidade` (linked from the chat disclosure), booking mode
(`ORBITA_BOOKING_MODE`), Google OAuth setup, and the fictional demo visitor/slots (v3spec §13 E.29).

## 10. Cross-owner contracts (quote · booking · prefill · Órbita slot)

Defined by the quote/contact/hire agent. Other owners code against these; change them only by adding fields.

### 10.1 Quote prefill ("Quero algo assim", "Quero este formato")
- **URL** (cross-page or first load): `?tipo=<ProjectSlug>` (→ payload `ref`), `?formato=<QuoteEngagement>`,
  `?solucao=<QuoteSolution>[,<QuoteSolution>…]`, plus the hash `#cotacao`. Example from the stage:
  `/?tipo=orbitmind#cotacao`; from /contratar: `/contratar?formato=project#cotacao`.
  Unknown values are ignored. `tipo` also pre-selects solutions (map in `components/quote/prefill.ts`).
- **Same page** (no navigation): call `requestQuotePrefill({ ref?, engagement?, solutions? })` from
  `@/components/quote/quote-bridge` (client). It dispatches `window` event `quote:prefill` (detail = the same
  object), scrolls `#cotacao` into view and moves focus to the form heading. Every mounted QuoteForm applies it
  (only while it is still on steps 1–5; values already typed are kept). Plain `<a href="#cotacao">` keeps working.
- The form shows a dismissible "Referência: <name>" chip when `ref` is set (`products.items.<slug>.name`).
- The QuoteForm also listens to the Órbita chat's `orbita:quote-prefill` event (`lib/orbita/protocol.ts`
  `QuotePrefill`: `engagement`, `solutions`, `deadline`, `description`, `source:"orbita"`). `description` is used only
  when the visitor has not typed one; `source:"orbita"` becomes the payload `source`.

### 10.2 `POST /api/quote` (implemented: `app/api/quote/route.ts`)
- Body = `QuotePayload` (`quoteSchema` in `src/content/quote.ts`). Validated again server-side.
- `200 { ok: true, delivered: boolean, confirmation: boolean }` — `delivered:false` only in development without
  `RESEND_API_KEY` (payload is logged). A filled honeypot (`website`) also gets `200 { ok: true }` (silently dropped).
- `400 { ok: false, error: "invalid", issues: [{ path, message }] }` (message = message key, e.g. `quote.errors.email`).
- `429 { ok: false, error: "rate_limited" }` (5 requests / 10 min / IP, in memory per instance; `Retry-After` header).
- `503 { ok: false, error: "email_not_configured" }` (production without `RESEND_API_KEY`) · `502 { ok:false, error:"send_failed" }`.
- Env: `RESEND_API_KEY`, `CONTACT_EMAIL` (to, default the SITE e-mail), `RESEND_FROM_EMAIL` (from, default
  `onboarding@resend.dev`). Visitor confirmation e-mail is sent only when `RESEND_FROM_EMAIL` is set (a verified
  domain) and `QUOTE_CONFIRMATION_EMAIL` is not `"off"`.

### 10.3 Booking endpoints (implemented by the Órbita agent: `app/api/orbita/*`, types in `lib/orbita/protocol.ts`)
- QuoteForm step 6 calls `GET /api/orbita/slots?days=3&perDay=8` →
  `200 { mode: "auto" | "aprovacao" | "demo", timeZone, slotMinutes, days: [{ date: "YYYY-MM-DD", slots: [{ start, end }] }] }`
  (`mode` = `ORBITA_BOOKING_MODE` when the calendar is live; only `days` is sent, never a flat `slots` list).
  The client (`components/quote/booking.ts`) flattens and regroups by São Paulo day (first 3 days, ≤8 slots/day)
  and also accepts a flat `{ mode, slots }` body.
- Confirm (live calendar) → `POST /api/orbita/book` `{ intent: "book", start, name, email, consent: true, summary,
  locale, website: "" }` → `BookResponse { status: "confirmed" | "pending", meetLink?, mode }`; `409 slot_taken`
  → the form reloads the slots and asks for another time; any other error → message + "Prefiro aguardar o e-mail".
  `confirmed` (and `mode:"live"`) shows "Conversa marcada" (+ .ics, copy Meet link); `pending` shows the waiting card.
- **Demo calendar** (`mode:"demo"`, no Google credentials): the picker shows the note `quote.booking.demoNote`
  ("horários ilustrativos") and Confirm posts `POST /api/quote/slot` `{ start, end, name, email, company?, locale,
  ref?, website:"" }` (quote agent, `app/api/quote/slot/route.ts`), which e-mails Wesley the preferred time
  (reply-to = visitor). The result is always the waiting card — a demo booking is never shown as confirmed.
- Slots request failing: message + "Tentar de novo" + "Prefiro aguardar o e-mail". In `next dev` only, an
  unreachable slots endpoint falls back to `DEMO_SLOTS` so the flow can be reviewed locally.

### 10.4 Órbita in 05 Contato (`#orbita`)
Since §14 the contact block has no inline chat: `#orbita` is the pair of buttons "Marcar uma call"
(`<OrbitaTrigger ask={{ chip: "bookCall" }}>`, opens the drawer straight into the booking flow) and "Perguntar à Órbita".
`components/orbita/OrbitaInlineChat.tsx` still exists (unused) for an embedded chat elsewhere.

### 10.5 ProjectStage (`#projects`, implemented)
- Files: `components/home/ProjectStage.tsx` (server: copy, crops, diagrams) → `components/home/stage/StageClient.tsx`
  (client state machine) + `stage/{Chapter,DeskStack,parts,types}.tsx`; CSS `app/styles/sections/stage.css` (all under `.ps`).
- The stage renders `<div id="projects" class="ps">` itself. ≥1120px: the 1440×920 artboard canvas, scaled down to the
  viewport width (1120–1440) with `tan(atan2(100cqw, 1440px))`; <1120px: the compact carousel (scroll-snap swipe, bars, ‹ ›).
- CTAs: Órbita → `ROUTES.project("orbita")`; the others → `?tipo=<slug>#cotacao`, intercepted on click with
  `requestQuotePrefill({ ref })` (§10.1). The Órbita extra link (`#orbita`) calls `openOrbita({ source: "stage" })`.
- Pauses: Pause button, hover / keyboard focus (clock only), touch, tab hidden, off-screen; nothing animates before the
  stage is first seen. Reduced motion: no autoplay, end frames, Play button restarts the 7s dwell.
- New messages: `stage.{paused,resume,prev,next,counterSr,frontCase,frontQuote}`, `stage.chapters.orbita.descriptorShort`,
  `stage.chapters.{orbitmind,nex,vektus}.fig.{aria,ariaShort,mobileCap}`, `nex.mech.archHeader`,
  `vibecoding.mech.codeAria`, `vektus.mech.columnsShort`.

## 11. Case studies (/projetos/[slug]) — template + which projects have one

- **One template, five pages.** `components/case/CasePage.tsx` renders any `CASES[slug]` from `src/content/cases.ts`:
  cover mini stage (`TiltStage`: pointer tilt + `is-rest`, stack scaled by `--k` below 1280) → meta band → body
  (sticky `CaseToc` with active section, sections of typed blocks, full-width breakouts) → "Próximo estudo de caso" →
  contact band. Blocks: body, diagram (`ArchDiagram`: positioned nodes, orthogonal segments, packets/flashes generated
  from `DiagramDef` as per-diagram keyframes, hover/focus tooltips, Pause, off-screen pause, stacked version <1200px),
  chips, approval/finance mechanism cards (`MechCard`), plate, shot, bars (RAG chart), channels split, gallery
  (`CaseGallery`: tablist + Radix Dialog lightbox with ←/→), pending captures, numbers (count-up), list, dl, twoCol
  (honesty box), lanes, note, orbitaCta. All CSS in `app/styles/sections/case-orbita.css`, scoped under `.cs`.
- **Pages (hasCase = true):** `orbita` (v3 §11, real screens), `orbitmind` (diagram cover + the real nav crop + v1
  flow back; "[captura pendente]" tiles), `nex` (Suíte Nex; diagrams only, private code), `orbitfinance` (Inicio/Recurso
  screens), `vektus` (pipeline diagram; no screens). Facts only from v3spec §3 + repo-facts.
- **No page: VibeCoding** — a 4-day prototype with 0 tests and no verified architecture/results beyond the stage copy;
  not enough for a credible case. Grid-only projects (InfluencerAI, FSJPII, Love Startup, E-commerce) have no page either.
- **Links:** use `caseLinkFor(slug)` (projects.ts; used by the stage CTA, the products table and the next-case link;
  `__tests__/case-links.test.ts` fails if any case link could 404): own case page, NexBot/NexConnect → `/projetos/nex`, everything else
  → `CASE_FALLBACK_HREF` = `/#todos-os-produtos` (the products table). `STAGE_CHAPTERS[].cta` was left as specified
  (quote for chapters 02–06); the stage owner may add a case link using `caseLinkFor`.
- **Deviation from §11.4:** every case (Órbita included) ends with "Próximo estudo de caso" (orbita → orbitmind → nex →
  orbitfinance → vektus → orbita), since Órbita is no longer the only case.
- Órbita buttons ("Falar com a Órbita" in the cover, §09 and the end band) call `openOrbita({ source: "case" })`.

## 12. Órbita — widget + visitor backend (implemented)

Spec: v3spec §5.11, §6.5, §8, §10; repo facts: `repo-facts/revoluna-rubrica-orbita.md` §3.8 (visitor mode).

### 12.1 Files
```
components/orbita/
  OrbitaRoot.tsx        launcher pill (≥768, fixed right/bottom 24) + non-modal panel (role=dialog, aria-modal=false,
                        id orbita-panel, 390×640 above the launcher) · FAB (<768) + modal bottom sheet (aria-modal=true,
                        scrim, focus trap, scroll lock, grabber). Esc / Fechar / launcher close → focus back to the opener.
                        The chat mounts on first open and keeps the conversation while closed; FAB unread badge.
                        The launcher/FAB steps away (fade, not focusable) while `#cotacao`, `#projects` (desktop: its bottom
                        200px — rail + CTAs; mobile: the whole island) or any `[data-orbita-avoid]` element reaches
                        the bottom strip it occupies — add `data-orbita-avoid` to other bottom-right controls.
  OrbitaChat.tsx        the 390×640 component (§8.1 frame; header orb crossfade + ASSISTENTE DE IA chip; disclosure
                        + privacy link; demo strip; role=log aria-live=polite column-reverse log; composer: Enter sends,
                        Shift+Enter newline). Props: variant panel|sheet|inline, active, onClose, onOrbitaMessage; ref
                        handle focusEntry() (first chip, else composer).
  ChatParts.tsx         §8.2/§8.4 recipes: Órbita text (label on first of run, sr 'Órbita:' otherwise), visitor bubble,
                        typing, tool line (running aria-hidden → done/error announced), alert line, chips, project
                        cards, SlotPicker (tablist ←/→/Home/End, 2-row grid, aria-pressed, 'Nenhum horário serve?'),
                        ContactCard (name, e-mail, consent checkbox, honeypot, inline errors), BookingCard (confirmed /
                        waiting, .ics download, copy link 2000ms micro-state, demo note), QuoteLink (§10.1).
  useOrbitaEngine.ts    engine: LIVE (POST /api/orbita/chat, NDJSON) or DEMO (§8.3 script, client-side); shared
                        deterministic booking steps (slot → contact card → POST /api/orbita/book).
  OrbitaInlineChat.tsx  §10.4 inline instance for #orbita (≥1024, mounted near the viewport).
  format.ts · ics.ts · hooks.ts · index.ts
lib/orbita/             config (env) · time (Intl tz math) · slots (pure free-slot computation) · google (fetch client:
                        OAuth refresh token or service-account JWT; freeBusy, events.insert) · calendar · booking ·
                        notify (Resend) · knowledge (public KB from src/content + messages) · prompt (visitor persona) ·
                        tools (4) · schemas (zod) · rate-limit · http · protocol (wire types, client-safe)
app/api/orbita/chat     GET status { chat, calendar: live|demo, bookingMode, timeZone, slotMinutes } · POST streaming chat
app/api/orbita/slots    GET free slots (§10.3)
app/api/orbita/book     POST booking / callback lead (§10.3)
__tests__/orbita/       slots (timezone, DST, business hours, busy overlap, buffer, notice) + route/tool validation
```

### 12.2 Chat backend (`POST /api/orbita/chat`)
- Body `{ messages: [{ role: "user"|"assistant", content }], locale }` — ≤24 messages, ≤1500 chars each, ≤16 000 total,
  first and last must be `user`; control/bidi characters stripped. Per-IP limits 8/min and 60/h (in memory per instance).
- Claude via `@anthropic-ai/sdk` (`client.beta.messages.stream`): model `ORBITA_MODEL` (default `claude-opus-5`, a valid current id; cheaper: `claude-sonnet-5` $2/$10 or
  `claude-haiku-4-5` $1/$5 per MTok in/out vs Opus 5 $5/$25 — on Haiku 4.5 and pre-4.6 models the route omits adaptive
  thinking/effort, which they reject), adaptive
  thinking, effort `ORBITA_EFFORT` (default low), server-side refusal fallback `fallbacks: "default"` (beta
  `server-side-fallback-2026-07-01`; `ORBITA_FALLBACKS=off` disables), cached system prompt (persona + public knowledge
  base), manual tool loop (≤4 rounds). Stream = NDJSON `OrbitaStreamEvent` (`lib/orbita/protocol.ts`): `text` deltas,
  `tool` running/done/error (tool lines), `ui` cards (projects, slots, contact, quote), `done`, `error`.
- Tools (whitelist): `search_portfolio`, `get_free_slots` (free/busy only), `book_call` (**never books** — validates the
  slot and shows the confirmation card), `handoff_to_quote` (link + prefill). A final line `>> A | B | C` → quick replies.
- Persona rules: visitor mode only; facts strictly from the KB; qualifies engagement / solution / timeline; never prices;
  no private data (free slots only); declines off-topic; visitor text is untrusted (injection hardening); plain text.
- Privacy: no transcript persistence — the browser resends the capped history each turn; logs carry error metadata only.
  Wesley gets a summary by e-mail only when the visitor submits the contact card (consent checkbox).
- No `ANTHROPIC_API_KEY` → `503` + header `x-orbita-mode: demo`; the widget switches to the scripted conversation.

### 12.3 Booking
- Slots: Google free/busy of `WESLEY_CALENDAR_ID` → 30-min grid inside `ORBITA_WORK_HOURS` on `ORBITA_WORK_DAYS`
  (`ORBITA_TIMEZONE`), ≥ `ORBITA_MIN_NOTICE_HOURS` ahead, `ORBITA_LOOKAHEAD_DAYS` scanned, `ORBITA_BUFFER_MINUTES` margin.
  The widget shows 3 days × ≤6 slots (spread across the day). Event titles/attendees are never read.
- Book (explicit submit only): the slot is re-validated against free/busy right before `events.insert`; idempotent event
  id (visitor + slot). `auto` → the visitor as attendee + `conferenceData.createRequest` (Meet) + `sendUpdates=all`, and a
  Resend summary to Wesley. `aprovacao` → tentative hold (no attendee, `sendUpdates=none`) + Resend e-mail to Wesley; the
  visitor sees the waiting card. `409 slot_taken` → the chat reloads the slots.
- Demo (no Google credentials): nothing is written. With `RESEND_API_KEY` the request is e-mailed to Wesley and answered
  `pending`; QuoteForm bookings answer `pending`; otherwise (local dev) the §8.3 result (`confirmed` in auto), always
  `mode: "demo"`. The widget shows a “Modo demonstração” strip and a “nenhum convite foi enviado” note on the card.
- `{ intent: "callback", name, email, consent }` (“Nenhum horário serve?” / agenda errors) → e-mail to Wesley.

### 12.4 Env (see `.env.example`)
`ANTHROPIC_API_KEY` · `ORBITA_MODEL` · `ORBITA_EFFORT` · `ORBITA_MAX_TOKENS` · `ORBITA_FALLBACKS` · `ORBITA_RATE_CHAT_PER_MIN` ·
`ORBITA_RATE_CHAT_PER_HOUR` · `WESLEY_CALENDAR_ID` · `ORBITA_BOOKING_MODE` (auto|aprovacao) · `ORBITA_TIMEZONE` ·
`ORBITA_WORK_DAYS` · `ORBITA_WORK_HOURS` · `ORBITA_SLOT_MINUTES` · `ORBITA_LOOKAHEAD_DAYS` · `ORBITA_MIN_NOTICE_HOURS` ·
`ORBITA_BUFFER_MINUTES` · `ORBITA_NOTIFY_EMAIL` · Google option A `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` /
`GOOGLE_REFRESH_TOKEN` (personal Gmail: needed for invites + Meet) · option B `GOOGLE_SERVICE_ACCOUNT_EMAIL` /
`GOOGLE_PRIVATE_KEY` / `GOOGLE_IMPERSONATE_USER` (Workspace domain-wide delegation) · Resend vars as in §1.

### 12.5 New message keys (all 3 locales)
`orbita.launcher.unread`, `orbita.log.{aria,quickReplies}`, `orbita.demo.{note,reply,bookingNote}`, `orbita.script.b6.short`,
`orbita.script.{slotTaken,noSlots,chatError,chatErrorText,refused}`, `orbita.tools.error`, `orbita.projectCards.more`,
`orbita.slots.tzName`, `orbita.contactCard.{consent,consentCallback,sending,errors.*}`,
`orbita.booking.{whenValue,meet,icsTitle,icsDescription}`.

## 13. "Em órbita" layer (hero, stack marquee, stage v4, Órbita live)

Added on top of v3 without changing its contracts. Palette = OrbitMind identity (`orbitmind-platform`
`styles/globals.css` + `landing.css`): light `#F3F1EC / #FBFAF7 / #ECE9E2 / #1A1A17`, dark `#161513 / #1E1D1A /
#2A2824 / #F4F2EC`, accent `#F2541B` in both (text on it `#1A1A17`; accent as text = `--accent-ink`).

### 13.1 Files
```
components/orbita/presence-orb.ts   port of Orbita `prototypes/orbita-presenca/orb.js` (Canvas 2D, ten states, no deps)
components/orbita/LiveOrb.tsx       <LiveOrb mode tone interactive labels pulseKey label> — pauses off-screen / hidden tab;
                                    one still frame with reduced motion; repaints on theme change
components/home/Hero.tsx            hero (server) · hero/HeroOrbit.tsx (orbit system + pointer aura) · hero/AskOrbita.tsx
components/home/StackMarquee.tsx    two strips: ABOUT.stack items · messages `marquee.capabilities`
components/home/OrbitaLab.tsx       #orbita-lab (server) · orbita-lab/LabClient.tsx (live core, ten states, tour)
components/home/stage/OrbitaCore.tsx  live core of stage chapter 01 · stage/stage-bridge.ts (`stage:go`)
components/site/PointerFx.tsx       delegated pointer spotlight for `[data-spot]` (mounted in the layout)
app/styles/sections/orbit.css       marquee · lab · spotlight · contact rings · footer wordmark · header planet/progress
```
Home order: Hero → StackMarquee → ProjectStage → Numbers → Products → OrbitaLab → Services → Process → Leadership →
About → Contact.

### 13.2 Hero
- H1 lines `hero.h1.{l1,l2,l3}` (+ `plain` for screen readers); the third line is accent-coloured with the drawn orbit
  swoosh. `hero.ticker.{label,items[4]}` rotates (CSS, 12s). `hero.lead` and the "Atualmente" strip are unchanged content.
- Orbit system: a 760×760 design canvas scaled by `--k` (`tan(atan2(100cqw, 760px))`, fixed fallbacks). Three rings, the six
  stage chapters as satellites (`ORBITS` in Hero.tsx); satellite metrics are divided by `--k` so labels keep their size.
  A satellite is an `<a href="#projects">` that also calls `goToStageChapter(index)`; StageClient listens to `stage:go`.
  Satellites are hidden below 768px (the orbit becomes a 5:3 band above the byline).
- Ask box: `openOrbita({ source: "hero", ask: { text } | { chip } })`. OrbitaRoot hands the `ask` to OrbitaChat
  (`ask()` on its handle), which sends it once Órbita has greeted and nothing is running. Chips reuse `orbita.chips.*`
  (`SCRIPT.b0.chips`), so demo mode runs their scripted beats.

### 13.3 Órbita live (#orbita-lab)
Copy in `lab.*` (`states.<OrbMode>.{label,status,title,note}`, `features.<id>.{title,text}`, `screens.*`). Numbers on the
cards are the verified ones (102 tools, 86.7% top-5, 7 providers). `marquee` and `lab` are server-only namespaces.

### 13.4 Stage v4 (stronger mechanism choreography)
All additions use the same 6000ms loop and delay as the v3 loops; static style = END frame; new animated parts carry `.loop`
(Pause) and a rule at the end of the block also freezes their pseudo-elements.
- Behind the stack: two orbits with a satellite (`offset-path`), tinted by the active product light.
- Entrance: `ps-back-in` / `ps-front-in` (depth + turn) and a light sweep over the front screen.
- 01 Órbita: `OrbitaCore` reads the progress of the `.ob-bubble` CSS animation (Web Animations API) and maps it to
  listening → thinking → attention → success, so the live core follows request → proposal → approval (and Pause/hold);
  voice bars + the "Aprovar" pill press. · 02 OrbitMind: `.om-hit` per node (times in `OM_PASS_1/2`), veto flash,
  marching loop-back arc, checkpoint ping, typed log. · 03 Nex: channel pulse, lane progress, marching link, typing dots,
  repo rows. · 04 OrbitFinance: staggered rows + trend line. · 05 VibeCoding: per-line caret + stream bar.
  · 06 Vektus: document scan, OCR chips, arrows, graph edges, the three retrieved chunks.

### 13.5 New message keys (all 3 locales)
`hero.h1.{l1,l2,l3}` (replaces `line1/line2`), `hero.ticker.*`, `hero.ask.*`, `hero.orbit.*`,
`stage.chapters.orbita.mech.core.*`, `marquee.*`, `lab.*`.

## 14. CV update + artifact fidelity (Sep 2026)

Source of truth for the person: the owner's CV (`cv_wesley_santos.pdf`, Sep 2026). Visual reference: the Claude Design
artifact "Portfólio em órbita" (https://claude.ai/artifact/DRUHyS8tH2SHRavFNqCkDw). This pass makes the site read like the
artifact and say what the CV says.

### 14.1 Content
- `src/content/leadership.ts` — 7 entries, CV order (Companhia de Estágios · Adalink · ChatGuru · Alura · Revoluna · Love ·
  Melhor do Grão). Copy: `leadership.companies.<id>.{name, role, mode, paragraph, bullets[], stack}`, plus `period` when the CV
  gives only a duration (love) and `roles.<id>.{title,text}` for ladders (adalink: promoted in 4 months; mg: 3 roles).
  `leadership.{h2, bio, meta, linkedin, stackTitle, stack.<group>, educationTitle, education[]}`.
- `src/content/about.ts` — the CV's 8 stack groups (frontend, backend, ai, data, devops, integrations, security, quality) and
  the `marquee` shortlist. The separate "Sobre" section is gone: portrait, H2, bio and LinkedIn live in the sticky column of
  `#experience` (the column carries `id="about"`). `about.paragraphs.*` remain for the Órbita knowledge base only.
- Hero: `hero.eyebrow` (pulse + role), `hero.lead`, `hero.stats.<id>` with `HERO_STATS` (10+ years, 600+ clients, 6 own
  products, 39 OrbitMind integrations). The byline, CTA row and "Atualmente" strip are gone.
- `lib/orbita/knowledge.ts` builds the career block from the same data (bio, entries, bullets, stack groups, education).
- Removed keys: `hero.currently*`, `nav.about`, `about.*` except `paragraphs`, `contact.orbitaCard/orbitaEyebrow`,
  `orbita.launcher.subtitle`. New: `nav.orbita`, `common.actions.{askOrbita, bookCall}`, `contact.{h2a,h2b,linksAria,quoteTitle,quoteLead}`.

### 14.2 Shapes (the artifact's system)
- Fonts: Bricolage Grotesque (display) · Instrument Sans (body) · JetBrains Mono (mono), via next/font.
- `.btn` pills (50px, 600, lift + accent glow on hover), `.chip`/`.tag` pills, cards 20px, inputs 12–14px, header 72px
  translucent + blur with plain nav links (accent underline grows; active = section in view), round PT/EN/ES, round theme
  button (`.tbtn`, turns on hover), "Falar com a Órbita" pill in the header. `.ixbar` has no hairline (labels only).
- Page order: hero · marquee · stage · numbers · products · Órbita live · about & experience · services · process · contact.
- Experience = the artifact's timeline: vertical line that grows with scroll (view timeline), one node per entry
  (accent when open), period | role · company | plus; single-open accordion (`CompanyAccordion`, `.xi*` in leadership.css).
- Contact = centred CTA over three centred rings with glowing satellites (`contact.css`), the two Órbita buttons and the
  direct links; the quote form follows on a `--mat` band (`#cotacao`, heading beside the form).
- Órbita launcher = the artifact's `.fab` (`.orb-launch`: dark pill "Pergunte à Órbita", glowing accent border, breathing
  mini orb). The chat opens as a right-side drawer (470px, scrim with blur, `aria-modal`, focus trap) at ≥768px and as the
  bottom sheet below. The chat header shows the live core (`<LiveOrb>` follows the engine: thinking · searching · speaking ·
  success); bubbles (bot: mat + border, visitor: accent), accent quick-reply pills, pill composer.
- Stray lines removed: the stage's two orbit ellipses (`.ps-orbit`), the off-centre partial rings in contact, the section
  hairlines above every index label.

### 14.3 Dev note
On the owner's machine the dev server hydrates the home ~25s after load (160 dev chunks). Headless screenshots must wait
for the React root (`Object.keys(document).some(k => k.startsWith("__reactContainer"))`) before scrolling, or every
`<Reveal>` section stays on its first frame.

## 15. Second owner pass (Sep 2026): the real core, more products, business numbers

Owner feedback after §14: the core looked nothing like the product, the drawer was weaker than the artifact,
projects were missing (Adaflow, the pipeline), the numbers strip had no business meaning, case pages felt slow
and kept "honest status" blocks, the lab did not look like Órbita, the stack cards and services undersold a
tech lead of two companies, the footer had no icons. Facts for everything below come from a read-only audit of
the repos on 2026-09-30 (orbita, adalink-platform, Adalink-Agents-Pipeline, cg_platform, Houston-IV,
whatsapp-workspace and the CV).

### 15.1 The real Órbita core
`components/orbita/motor-webgl.js` is the product's WebGL engine (`apps/web/src/lib/presenca/motor-webgl.js`,
generated from `prototypes/orbita-presenca/orb-3d.js`), copied verbatim: glass shell, Bézier "neural" veins with
travelling pulses, joint nodes, motes, two hairline rings, ten states with the product's hues. Additions are
marked `PORTFÓLIO:`: the ESTADOS table, the Canvas 2D fallback adapter (`presence-orb.ts`, the product's own
fallback), `{ interactive, tone }` options and `invalidate()`. `motor-webgl.d.ts` types it; `<LiveOrb>` now
mounts `Nucleo` (hero, stage core, lab, chat header). Never "improve" the drawing: identical to the product is the point.

### 15.2 Lab = the product's presence card
`LabClient` rebuilds Órbita's dashboard card with its own tokens (`--o-*` in orbit.css, light "Mineral" / dark
"Floresta"): eyebrow + expand glyph, mint stage with floor shadow and halo, crosses, glass tags (current state ·
"Contexto conectado"), "MOVA / CLIQUE · NEURAL CORE", then status · title · the product's description per state
(`lab.states.<id>.description`) and the actions (Falar com a Órbita · Percorrer uma conversa · Estudo de caso).
The ten state chips and the motion note sit in the side panel.

### 15.3 Drawer
No bars under the header: the AI disclosure + privacy link moved to the composer fine print, demo mode is a
dashed `demo` tag beside the status, per-message "Órbita" labels are screen-reader only, project cards lift on hover.

### 15.4 Products index: 15 rows
New: `waworkspace` (WhatsApp workspace PoC, 800 tests / 27 screens), `adaflow` (Adalink's white-label AI platform:
114 native connectors, 20 microservices; status `inProduction`, link adalink.com.br), `orbitpipeline` (the
OrbitMind delivery pipeline: 8 review axes, A–F grade, auto-merge; 100% A / 0.5 h median), `plantoes` (Revoluna shift
platform rewrite, 121+ endpoints, 175 test files). Employer-built products carry a light "· Adalink" / "· Revoluna"
type line (owner: "produto meu, feito para a Adalink, sem enfatizar"). Still excluded: plataforma-unica (client-
confidential), cg_platform (contribution, not a product), CIA/*, app-revoluna, OpenJarvis, vocacional_sytem.
`Status` gained `inProduction` ("Em produção"); row links use `common.links.<link.kind>` (site vs GitHub).

### 15.5 Numbers = "O que isso entrega"
Four business proofs with a "why" line and a source: 114 native connectors (Adaflow) · 0.5 h issue→merge
(pipeline, last 30 PRs) · 600+ clients served (CV) · 25,937 backend tests in 2,404 suites (Adaflow). Hero stats are
now about the person (10+ years · 2 teams led · 15 projects · 7 companies). Stage dwell is 5 s (was 7).

### 15.6 Services
Four formats: **Liderança técnica (CLT ou PJ)** first (CTA "Marcar uma call" → chat booking chip; also on
/contratar, where its column books a call instead of prefilling the quote), then continuous · project · consulting.
"O que eu construo" = 12 capability cards (`SOLUTIONS` with a `quote` mapping to the 6 quote-form ids): SaaS/apps,
agents with human approval, RAG/OCR, process automation (10 node types), WhatsApp, 114 connectors, security
(RBAC by scope, OIDC SSO, 870 audited write endpoints, DLP, AES-256-GCM), billing/FinOps, agent pipeline,
quality/observability, voice/real time, legacy evolution. Each with stack + proof links.

### 15.7 Stack cards
Each of the 8 CV groups opens with a proof number from the audit (207 pages · 20 services · 102 tools · 402 models
· 16 CI gates · 114 connectors · 870 audited endpoints · 25,937 tests) and lists what the repos add to the CV.

### 15.8 Case pages
No "Status honesto" / "capturas pendentes" / "existe vs. a construir" blocks; em dashes replaced; the Órbita case
ends with "A Órbita neste site" (the visitor mode is live). `app/[locale]/projetos/[slug]/loading.tsx` shows the
stage-dark cover with rings the instant a case link is clicked (the ~20 s wait the owner saw is the dev compile of
the route; production serves the static page). Footer links carry icons.
