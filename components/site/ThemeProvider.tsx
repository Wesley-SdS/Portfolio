"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * next-themes with the v3 contract: attribute `data-theme` on <html>,
 * follows the OS by default ("system"), user choice persisted in localStorage.
 * Never forced dark.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem themes={["light", "dark"]} {...props}>
      {children}
    </NextThemesProvider>
  );
}
