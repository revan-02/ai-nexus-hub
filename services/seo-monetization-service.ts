import { mockCoursesList } from '@/lib/mock-data/courses-data';

export interface AdSenseConfig {
  enabled: boolean;
  publisherId: string; // e.g. ca-pub-9842109481028401
  autoAdsEnabled: boolean;
  headerSlotId: string;
  sidebarSlotId: string;
  inContentSlotId: string;
  testMode: boolean;
  adsTxtContent: string;
}

export interface InstantArticlesConfig {
  enabled: boolean;
  appId: string; // Facebook App ID (fb:app_id)
  pageId: string; // Facebook Page ID (fb:pages)
  articleStyle: string; // 'default'
  autoSyndicate: boolean;
  rssFeedUrl: string;
  apiAccessToken: string;
}

export interface SeoConfig {
  googleSiteVerification: string;
  bingVerification: string;
  yandexVerification: string;
  canonicalDomain: string;
  sitemapUrl: string;
  robotsTxtUrl: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  keyMasked: string;
  keyValue: string; // full key
  type: 'public' | 'secret' | 'webhook';
  permissions: string[];
  rateLimitDaily: number;
  usedToday: number;
  lastUsedAt: string;
  createdAt: string;
  isActive: boolean;
}

export interface SeoMonetizationConfig {
  adsense: AdSenseConfig;
  instantArticles: InstantArticlesConfig;
  seo: SeoConfig;
  apiKeys: ApiKeyItem[];
}

// In-Memory / Default Production Configuration
let currentConfig: SeoMonetizationConfig = {
  adsense: {
    enabled: true,
    publisherId: 'ca-pub-9842109481028401',
    autoAdsEnabled: true,
    headerSlotId: '1234567890',
    sidebarSlotId: '2345678901',
    inContentSlotId: '3456789012',
    testMode: true,
    adsTxtContent: `google.com, pub-9842109481028401, DIRECT, f08c47fec0942fa0\ngoogle.com, pub-1234567890123456, RESELLER, f08c47fec0942fa0`,
  },
  instantArticles: {
    enabled: true,
    appId: '184920194819284',
    pageId: '109284729182345',
    articleStyle: 'default',
    autoSyndicate: true,
    rssFeedUrl: 'https://ainexus.platform.io/api/instant-articles',
    apiAccessToken: 'EAACEdEose0cBA••••••••••••••••••••••••••••',
  },
  seo: {
    googleSiteVerification: 'google-site-verification=AbCdEfGhIjKlMnOpQrStUvWxYz123456789',
    bingVerification: 'A8B9C10D11E12F13G14H15I16J17K18L',
    yandexVerification: 'yandex-verification-9876543210abcdef',
    canonicalDomain: 'https://ainexus.platform.io',
    sitemapUrl: 'https://ainexus.platform.io/sitemap.xml',
    robotsTxtUrl: 'https://ainexus.platform.io/robots.txt',
  },
  apiKeys: [
    {
      id: 'key-1',
      name: 'Default Web Client Public Key',
      keyPrefix: 'nexus_pub',
      keyMasked: 'nexus_pub_live_7a9f••••••••••••4838',
      keyValue: 'nexus_pub_live_7a9f4c82b1e048386b51029c',
      type: 'public',
      permissions: ['read:courses', 'read:challenges', 'read:metadata', 'submit:evaluations'],
      rateLimitDaily: 50000,
      usedToday: 8420,
      lastUsedAt: 'Just now',
      createdAt: '2026-01-10',
      isActive: true,
    },
    {
      id: 'key-2',
      name: 'Production Server Secret Admin Key',
      keyPrefix: 'nexus_sec',
      keyMasked: 'nexus_sec_live_99d4••••••••••••f4b0',
      keyValue: 'nexus_sec_live_99d4e21a7c83f4b0c67e891a234b567c',
      type: 'secret',
      permissions: ['*'],
      rateLimitDaily: 100000,
      usedToday: 12430,
      lastUsedAt: '2 mins ago',
      createdAt: '2026-01-10',
      isActive: true,
    },
    {
      id: 'key-3',
      name: 'Instant Articles & CMS Syndication Webhook',
      keyPrefix: 'whsec',
      keyMasked: 'whsec_live_8832••••••••••••e51a',
      keyValue: 'whsec_live_8832a4b910e51ad37c89f012',
      type: 'webhook',
      permissions: ['syndicate:instant-articles', 'webhook:receive', 'ping:sitemap'],
      rateLimitDaily: 20000,
      usedToday: 310,
      lastUsedAt: '15 mins ago',
      createdAt: '2026-02-14',
      isActive: true,
    },
  ],
};

export function getSeoMonetizationConfig(): SeoMonetizationConfig {
  return JSON.parse(JSON.stringify(currentConfig));
}

export function updateSeoMonetizationConfig(updates: Partial<SeoMonetizationConfig>): SeoMonetizationConfig {
  if (updates.adsense) {
    currentConfig.adsense = { ...currentConfig.adsense, ...updates.adsense };
  }
  if (updates.instantArticles) {
    currentConfig.instantArticles = { ...currentConfig.instantArticles, ...updates.instantArticles };
  }
  if (updates.seo) {
    currentConfig.seo = { ...currentConfig.seo, ...updates.seo };
  }
  if (updates.apiKeys) {
    currentConfig.apiKeys = updates.apiKeys;
  }
  return getSeoMonetizationConfig();
}

// Generate New API Key
export function generateApiKey(name: string, type: 'public' | 'secret' | 'webhook', permissions?: string[]): ApiKeyItem {
  const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const prefix = type === 'public' ? 'nexus_pub' : type === 'secret' ? 'nexus_sec' : 'whsec';
  const fullKey = `${prefix}_live_${randomHex}`;
  const masked = `${prefix}_live_${randomHex.slice(0, 4)}••••••••••••${randomHex.slice(-4)}`;

  const newKey: ApiKeyItem = {
    id: `key-${Date.now()}`,
    name: name.trim() || `${type.toUpperCase()} API Key`,
    keyPrefix: prefix,
    keyMasked: masked,
    keyValue: fullKey,
    type,
    permissions: permissions && permissions.length > 0 ? permissions : type === 'secret' ? ['*'] : ['read:courses', 'read:challenges'],
    rateLimitDaily: type === 'secret' ? 100000 : 25000,
    usedToday: 0,
    lastUsedAt: 'Never',
    createdAt: new Date().toISOString().split('T')[0],
    isActive: true,
  };

  currentConfig.apiKeys.unshift(newKey);
  return newKey;
}

// Revoke / Delete API Key
export function revokeApiKey(id: string): boolean {
  const initial = currentConfig.apiKeys.length;
  currentConfig.apiKeys = currentConfig.apiKeys.filter((k) => k.id !== id);
  return currentConfig.apiKeys.length < initial;
}

// Regenerate existing API Key value
export function regenerateApiKey(id: string): ApiKeyItem | null {
  const target = currentConfig.apiKeys.find((k) => k.id === id);
  if (!target) return null;

  const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const fullKey = `${target.keyPrefix}_live_${randomHex}`;
  target.keyValue = fullKey;
  target.keyMasked = `${target.keyPrefix}_live_${randomHex.slice(0, 4)}••••••••••••${randomHex.slice(-4)}`;
  target.usedToday = 0;
  target.lastUsedAt = 'Just regenerated';
  return target;
}

// Generate Compliant ads.txt String
export function getAdsTxtContent(): string {
  return currentConfig.adsense.adsTxtContent.trim() || `google.com, ${currentConfig.adsense.publisherId}, DIRECT, f08c47fec0942fa0`;
}

// Generate Compliant Facebook Instant Articles RSS Feed XML
export function generateInstantArticlesRssXml(): string {
  const baseUrl = currentConfig.seo.canonicalDomain || 'https://ainexus.platform.io';
  const now = new Date().toUTCString();
  const publishedCourses = mockCoursesList.filter((c) => c.status === 'Published');

  const itemsXml = publishedCourses
    .map((c) => {
      const pubDate = new Date(c.updatedAt ? `${c.updatedAt} 2026` : Date.now()).toUTCString();
      const courseUrl = `${baseUrl}/courses?id=${c.id}`;
      const subtitle = c.description.replace(/[<>&]/g, ' ');
      const cleanTitle = c.title.replace(/[<>&]/g, ' ');

      return `    <item>
      <title><![CDATA[${cleanTitle}]]></title>
      <link>${courseUrl}</link>
      <guid isPermaLink="true">${courseUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author><![CDATA[${c.instructor?.name || 'AI Nexus Research Staff'}]]></author>
      <description><![CDATA[${subtitle}]]></description>
      <content:encoded>
        <![CDATA[
        <!doctype html>
        <html lang="en" prefix="op: http://media.facebook.com/op#">
          <head>
            <meta charset="utf-8">
            <link rel="canonical" href="${courseUrl}">
            <meta property="op:markup_version" content="v1.0">
            <meta property="fb:article_style" content="${currentConfig.instantArticles.articleStyle}">
          </head>
          <body>
            <article>
              <header>
                <h1>${cleanTitle}</h1>
                <h2>${subtitle}</h2>
                <h3 class="op-kicker">${c.category} · ${c.level} Masterclass</h3>
                <address>
                  <a>${c.instructor?.name || 'Dr. Alex Morgan'}</a>
                  AI Nexus Engineering & Research Labs
                </address>
                <time class="op-published" datetime="${new Date().toISOString()}">${pubDate}</time>
                <figure>
                  <img src="${baseUrl}/robot-3d.png" />
                  <figcaption>AI Nexus Engineering Architecture Diagram</figcaption>
                </figure>
              </header>

              <p>Welcome to <strong>${cleanTitle}</strong> on AI Nexus Hub. This curriculum offers rigorous first-principles engineering, GPU vectorized operations, and production deployment.</p>

              <h2>Curriculum Objectives</h2>
              <p>Students will master theory, implement models in pure PyTorch, and benchmark inference latency across real-world workloads.</p>

              <blockquote>
                "Engineering AI requires precision in mathematical formulations, clean containerization, and continuous evaluation."
              </blockquote>

              <figure class="op-ad">
                <iframe src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" width="300" height="250"></iframe>
              </figure>

              <h2>Certification & Industry Validation</h2>
              <p>Earn an ISO/IEC 17024 and Open Badges 3.0 verified certificate recognized by global engineering organizations.</p>

              <footer>
                <aside>Published by AI Nexus Education Consortium. All Rights Reserved.</aside>
                <small>© 2026 AI Nexus Hub.</small>
              </footer>
            </article>
          </body>
        </html>
        ]]>
      </content:encoded>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>AI Nexus Hub - Facebook Instant Articles Feed</title>
    <link>${baseUrl}</link>
    <description>Production-grade AI Knowledge, Masterclasses, Agriculture AI, Cybersecurity Defense, and Solved Engineering Papers.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;
}
