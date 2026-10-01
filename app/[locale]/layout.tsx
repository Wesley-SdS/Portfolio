import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { HTML_LANG, languageAlternates, localePath } from "@/i18n/paths";
import { SITE } from "@/src/content/site";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { SkipLink } from "@/components/site/SkipLink";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { OrbitaRoot } from "@/components/orbita/OrbitaRoot";
import { PointerFx } from "@/components/site/PointerFx";
import { Analytics } from "@/src/components/Analytics";

import "../globals.css";
/* Section stylesheets — one per parallel owner (see docs/REDESIGN.md). */
import "../styles/sections/hero.css";
import "../styles/sections/stage.css";
import "../styles/sections/numbers.css";
import "../styles/sections/products.css";
import "../styles/sections/services.css";
import "../styles/sections/process.css";
import "../styles/sections/leadership.css";
import "../styles/sections/contact.css";
import "../styles/sections/quote.css";
import "../styles/sections/orbita.css";
import "../styles/sections/hire.css";
import "../styles/sections/case-orbita.css";
import "../styles/sections/privacy.css";
import "../styles/sections/orbit.css";

/* Fonts (the artifact's trio): variable files via next/font/google, self-hosted at build. */
const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-display",
  display: "swap",
});
const body = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--ff-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-mono",
  display: "swap",
});

/** Message namespaces used only on the server (case pages, /privacidade, metadata). Add a namespace
 *  here only if no client component (or component imported by one) reads it. */
const SERVER_ONLY_NAMESPACES = new Set([
  "meta",
  "marquee",
  "lab",
  "privacy",
  "caseCommon",
  "caseOrbita",
  "caseOrbitmind",
  "caseNex",
  "caseOrbitfinance",
  "caseVektus",
]);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F1EC" },
    { media: "(prefers-color-scheme: dark)", color: "#161513" },
  ],
  colorScheme: "light dark",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE.url),
    title: t("title"),
    description: t("description"),
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: SITE.github }],
    creator: SITE.name,
    alternates: {
      canonical: localePath(locale),
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: t("title"),
      description: t("description"),
      locale: HTML_LANG[locale]?.replace("-", "_") ?? "pt_BR",
      url: localePath(locale),
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  // Namespaces read only by server components (getTranslations) stay out of the client payload:
  // ~40% of the catalog that would otherwise be serialized into every page and RSC prefetch.
  const clientMessages = Object.fromEntries(Object.entries(messages).filter(([ns]) => !SERVER_ONLY_NAMESPACES.has(ns)));

  return (
    <html
      lang={HTML_LANG[locale] ?? locale}
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        {/* enables the reveal-on-view gate (globals.css §7) only when JS runs */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="cb">
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <ThemeProvider>
            <SkipLink />
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <OrbitaRoot />
            <PointerFx />
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
