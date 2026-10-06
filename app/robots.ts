import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ainexus.platform.io';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/settings/',
          '/access/',
          '/_next/',
          '/forgot-password',
          '/reset-password',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Google AdSense Crawler Optimization (Needs full content access to serve contextual ads)
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      // Google Display Ads Crawler
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
      // Meta Facebook Instant Articles & OpenGraph Scraper
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
