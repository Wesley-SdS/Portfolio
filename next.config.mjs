import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional isolated build dir (parallel builds/screenshots in one worktree); default .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Dev only: keep compiled routes in memory for an hour. The default (evict after ~60s idle) made
  // every return to a case page recompile it, which takes close to a minute on a slow machine.
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 40,
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config, { isServer }) => {
    // Suppress next-intl dynamic import warning
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
