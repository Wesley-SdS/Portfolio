import { Metadata } from 'next';
import { SEOMetadata } from '../types';

export const generateMetadata = (seo: SEOMetadata): Metadata => {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(', '),
    openGraph: {
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      images: seo.openGraph.images,
      type: seo.openGraph.type,
      siteName: 'Wesley Santos Portfolio'
    },
    twitter: seo.twitter ? {
      card: seo.twitter.card,
      title: seo.twitter.title,
      description: seo.twitter.description,
      images: seo.twitter.images
    } : undefined,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION
    }
  };
};

export const generateStructuredData = (type: 'person' | 'website' | 'project', data: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wesleysantos.dev';

  switch (type) {
    case 'person':
      return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: data.name,
        jobTitle: data.title,
        description: data.bio,
        image: `${baseUrl}${data.profileImage}`,
        url: baseUrl,
        sameAs: data.socialLinks?.map((link: any) => link.url) || [],
        address: {
          '@type': 'PostalAddress',
          addressLocality: data.contact?.location
        }
      };

    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Wesley Santos Portfolio',
        description: data.description,
        url: baseUrl,
        author: {
          '@type': 'Person',
          name: data.name
        }
      };

    case 'project':
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: data.title,
        description: data.description,
        url: data.links?.find((link: any) => link.type === 'live')?.url,
        author: {
          '@type': 'Person',
          name: 'Wesley Santos'
        },
        programmingLanguage: data.technologies
      };

    default:
      return null;
  }
};