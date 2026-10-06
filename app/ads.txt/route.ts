import { NextResponse } from 'next/server';
import { getAdsTxtContent } from '@/services/seo-monetization-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const content = getAdsTxtContent();
  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
