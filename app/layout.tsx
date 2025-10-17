import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { seoMetadata } from "../src/constants";
import { generateMetadata } from "../src/utils";
import { ThemeProvider } from "../src/providers";
import { Analytics } from "../src/components/Analytics";
import { reportWebVitalsWithAnalytics } from "../src/lib/monitoring";
import { setupGlobalErrorHandling } from "../src/lib/errorTracking";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = generateMetadata(seoMetadata);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Setup global error handling
  if (typeof window !== 'undefined') {
    setupGlobalErrorHandling();
    reportWebVitalsWithAnalytics();
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
