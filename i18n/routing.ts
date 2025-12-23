import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['pt', 'es', 'en'],

  // Used when no locale matches
  defaultLocale: 'pt',

  // The locale prefix strategy
  localePrefix: 'as-needed' // 'as-needed' means /pt is optional, /es and /en are required
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

