import { NextRequest, NextResponse } from 'next/server';
import { generateInstantArticlesRssXml, getSeoMonetizationConfig } from '@/services/seo-monetization-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');
  const config = getSeoMonetizationConfig();

  // If json format requested for debugging or dashboard inspection
  if (format === 'json') {
    return NextResponse.json({
      success: true,
      enabled: config.instantArticles.enabled,
      appId: config.instantArticles.appId,
      pageId: config.instantArticles.pageId,
      articleStyle: config.instantArticles.articleStyle,
      feedUrl: config.instantArticles.rssFeedUrl,
      generatedAt: new Date().toISOString(),
    });
  }

  // Standard Facebook Instant Articles RSS Feed
  const xml = generateInstantArticlesRssXml();
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
    },
  });
}
