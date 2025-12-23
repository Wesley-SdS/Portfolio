import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wesley-santos.dev';
  
  const routes = ['', '/about', '/experience', '/projects', '/solutions', '/gallery', '/contact'];
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale
  routing.locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = locale === routing.defaultLocale && route === ''
        ? baseUrl
        : `${baseUrl}/${locale}${route}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((loc) => [
              loc,
              loc === routing.defaultLocale && route === ''
                ? baseUrl
                : `${baseUrl}/${loc}${route}`
            ])
          ),
        },
      });
    });
  });

  return sitemapEntries;
}

