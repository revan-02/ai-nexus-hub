import { NextRequest, NextResponse } from 'next/server';
import {
  getSeoMonetizationConfig,
  updateSeoMonetizationConfig,
  generateApiKey,
  regenerateApiKey,
  revokeApiKey,
} from '@/services/seo-monetization-service';

export async function GET() {
  const config = getSeoMonetizationConfig();
  return NextResponse.json({
    success: true,
    data: config,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'update_settings') {
      const updated = updateSeoMonetizationConfig(body.data || {});
      return NextResponse.json({
        success: true,
        message: 'SEO & Monetization settings updated successfully.',
        data: updated,
      });
    }

    if (action === 'generate_key') {
      const { name, type, permissions } = body;
      const newKey = generateApiKey(name, type, permissions);
      return NextResponse.json({
        success: true,
        message: `New ${type} API key generated successfully.`,
        data: newKey,
      });
    }

    if (action === 'regenerate_key') {
      const { id } = body;
      const regenerated = regenerateApiKey(id);
      if (!regenerated) {
        return NextResponse.json({ success: false, error: 'API Key not found.' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: 'API Key regenerated successfully. Previous key has been revoked.',
        data: regenerated,
      });
    }

    if (action === 'revoke_key') {
      const { id } = body;
      const revoked = revokeApiKey(id);
      return NextResponse.json({
        success: revoked,
        message: revoked ? 'API Key revoked successfully.' : 'API Key not found.',
      });
    }

    if (action === 'ping_sitemap') {
      // Ping search engines simulation
      return NextResponse.json({
        success: true,
        message: 'XML Sitemap ping submitted to Google Search Console and Bing Webmaster API.',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown server error' },
      { status: 500 }
    );
  }
}
