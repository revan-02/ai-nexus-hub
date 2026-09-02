import { describe, it, expect, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-sans', className: 'font-sans' }),
  JetBrains_Mono: () => ({ variable: '--font-mono', className: 'font-mono' })
}));

import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import manifest from '@/app/manifest';
import { metadata } from '@/app/layout';

describe('100% SEO Compliance & Metadata Suite', () => {
  it('generates dynamic XML sitemap with all core public routes', () => {
    const sitemapData = sitemap();
    expect(sitemapData.length).toBeGreaterThanOrEqual(20);

    const urls = sitemapData.map((item) => item.url);
    expect(urls.some((u) => u.endsWith('/challenges'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/careers'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/interview-prep'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/vtu-question-papers'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/ai-architecture'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/learning/beginner'))).toBe(true);
  });

  it('generates robots.txt with search crawler allow rules and sitemap reference', () => {
    const robotsData = robots();
    expect(robotsData.sitemap).toContain('/sitemap.xml');
    expect(robotsData.rules).toBeDefined();

    const rules = Array.isArray(robotsData.rules) ? robotsData.rules : [robotsData.rules];
    const defaultRule = rules.find((r) => r.userAgent === '*');
    expect(defaultRule).toBeDefined();
    expect(defaultRule?.allow).toBe('/');
    expect(defaultRule?.disallow).toContain('/api/');
  });

  it('generates valid Web App Manifest for mobile discovery and PWA installation', () => {
    const manifestData = manifest();
    expect(manifestData.name).toContain('AI Nexus Hub');
    expect(manifestData.short_name).toBe('AI Nexus');
    expect(manifestData.theme_color).toBe('#7c3aed');
    expect(manifestData.icons?.length).toBeGreaterThan(0);
  });

  it('provides complete OpenGraph, Twitter card, and canonical metadata', () => {
    expect(metadata.title).toBeDefined();
    expect(metadata.description).toBeDefined();
    expect(metadata.keywords).toBeDefined();
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.twitter).toBeDefined();
    expect(metadata.alternates?.canonical).toBe('/');
  });
});
