import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NexusProvider } from '@/context/nexus-context';
import SettingsPage from '@/app/settings/page';
import { SeoMonetizationTab } from '@/components/settings/seo-monetization-tab';
import { ApiKeysTab } from '@/components/settings/api-keys-tab';
import { AdSenseAd } from '@/components/ads/adsense-ad';
import {
  getSeoMonetizationConfig,
  updateSeoMonetizationConfig,
  generateApiKey,
  regenerateApiKey,
  revokeApiKey,
  getAdsTxtContent,
  generateInstantArticlesRssXml,
} from '@/services/seo-monetization-service';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div data-testid="nexus-shell">{children}</div>,
}));

vi.mock('@/components/layout/admin-shell', () => ({
  AdminShell: ({ children }: any) => <div data-testid="admin-shell">{children}</div>,
}));

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
  useSession: vi.fn(() => ({ data: { user: { role: 'Super Admin', name: 'SuperAdmin' } } })),
}));

describe('SEO, Google AdSense, Facebook Instant Articles & API Keys Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Service Tier: SEO & Monetization Engine', () => {
    it('generates compliant ads.txt content with Google Publisher ID', () => {
      const adsTxt = getAdsTxtContent();
      expect(adsTxt).toContain('google.com');
      expect(adsTxt).toContain('DIRECT');
      expect(adsTxt).toContain('f08c47fec0942fa0');
    });

    it('generates valid Facebook Instant Articles RSS 2.0 XML with op:markup_version="v1.0"', () => {
      const xml = generateInstantArticlesRssXml();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">');
      expect(xml).toContain('<title>AI Nexus Hub - Facebook Instant Articles Feed</title>');
      expect(xml).toContain('property="op:markup_version" content="v1.0"');
      expect(xml).toContain('<figure class="op-ad">');
      expect(xml).toContain('</article>');
    });

    it('generates, regenerates, and revokes API keys correctly', () => {
      // 1. Generate new secret key
      const newKey = generateApiKey('Automation Bot Key', 'secret', ['read:courses']);
      expect(newKey.name).toBe('Automation Bot Key');
      expect(newKey.type).toBe('secret');
      expect(newKey.keyValue).toMatch(/^nexus_sec_live_[a-f0-9]{32}$/);
      expect(newKey.keyMasked).toContain('••••••••••••');

      // 2. Regenerate key
      const oldVal = newKey.keyValue;
      const regen = regenerateApiKey(newKey.id);
      expect(regen).not.toBeNull();
      expect(regen?.keyValue).not.toBe(oldVal);

      // 3. Revoke key
      const revoked = revokeApiKey(newKey.id);
      expect(revoked).toBe(true);
      const conf = getSeoMonetizationConfig();
      expect(conf.apiKeys.some((k) => k.id === newKey.id)).toBe(false);
    });
  });

  describe('Component Tier: Google AdSense Ad Unit', () => {
    it('renders AdSense ins tag with publisher id and slot configuration', () => {
      render(<AdSenseAd slotId="999888777" format="horizontal" />);
      expect(screen.getByText(/Advertisement/i)).toBeInTheDocument();
      expect(screen.getByText(/Google AdSense Slot · HORIZONTAL/i)).toBeInTheDocument();
      expect(screen.getByText(/Slot: 999888777/i)).toBeInTheDocument();
    });
  });

  describe('Settings Portal: SEO, AdSense & Instant Articles Tab', () => {
    it('renders AdSense publisher ID, ads.txt editor, and Instant Articles RSS link', () => {
      render(
        <NexusProvider>
          <SeoMonetizationTab />
        </NexusProvider>
      );

      // AdSense Section
      expect(screen.getByText(/Google AdSense Configuration & Ads.txt/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/ca-pub-9842109481028401/i)).toBeInTheDocument();
      expect(screen.getByText(/Live ads.txt Content/i)).toBeInTheDocument();

      // Instant Articles Section
      expect(screen.getByText(/Meta \/ Facebook Instant Articles Syndication/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/184920194819284/i)).toBeInTheDocument();
      expect(screen.getByText(/Instant Articles Automated RSS 2.0 Endpoint:/i)).toBeInTheDocument();

      // Search Console Section
      expect(screen.getByText(/Search Engine Webmaster Verification & Sitemaps/i)).toBeInTheDocument();
      expect(screen.getByText(/Ping Search Engines/i)).toBeInTheDocument();
    });

    it('allows updating AdSense settings and saving changes', () => {
      render(
        <NexusProvider>
          <SeoMonetizationTab />
        </NexusProvider>
      );

      const saveBtn = screen.getByRole('button', { name: /Save Settings/i });
      fireEvent.click(saveBtn);

      // Verify save feedback
      expect(screen.getByText(/Changes Saved!/i)).toBeInTheDocument();
    });
  });

  describe('Settings Portal: API Keys & Developer Interface Tab', () => {
    it('renders active API credentials table and developer code snippets', () => {
      render(
        <NexusProvider>
          <ApiKeysTab />
        </NexusProvider>
      );

      // Header and Table
      expect(screen.getByText(/API Keys & Developer Interface/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Active API Credentials/i).length).toBeGreaterThan(0);

      // Default keys exist
      expect(screen.getByText(/Default Web Client Public Key/i)).toBeInTheDocument();
      expect(screen.getByText(/Production Server Secret Admin Key/i)).toBeInTheDocument();

      // Code snippets
      expect(screen.getByText(/Developer Quickstart & cURL Snippets/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^curl$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^javascript$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^python$/i })).toBeInTheDocument();
    });

    it('opens create key modal and creates a new API key', () => {
      render(
        <NexusProvider>
          <ApiKeysTab />
        </NexusProvider>
      );

      const createBtn = screen.getByRole('button', { name: /Create New API Key/i });
      fireEvent.click(createBtn);

      // Verify modal opened
      expect(screen.getByText(/Create New API Credential/i)).toBeInTheDocument();

      // Fill name
      const nameInput = screen.getByPlaceholderText(/e\.g\. Mobile App Client/i);
      fireEvent.change(nameInput, { target: { value: 'Frontend Next.js Client' } });

      // Click submit
      const submitBtn = screen.getByRole('button', { name: /Generate Key/i });
      fireEvent.click(submitBtn);

      // Verify new key is in table
      expect(screen.getByText('Frontend Next.js Client')).toBeInTheDocument();
    });
  });

  describe('Dashboard Navigation: Settings Page Tab Routing', () => {
    it('renders SEO, AdSense & Instant Articles tab when defaultTab="SEO, AdSense & Instant Articles"', () => {
      render(
        <NexusProvider>
          <SettingsPage defaultTab="SEO, AdSense & Instant Articles" />
        </NexusProvider>
      );

      expect(screen.getByText(/Google AdSense Configuration & Ads.txt/i)).toBeInTheDocument();
      expect(screen.getByText(/Meta \/ Facebook Instant Articles Syndication/i)).toBeInTheDocument();
    });

    it('renders API Keys tab when defaultTab="API Keys & Developer Portal"', () => {
      render(
        <NexusProvider>
          <SettingsPage defaultTab="API Keys & Developer Portal" />
        </NexusProvider>
      );

      expect(screen.getByText(/API Keys & Developer Interface/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create New API Key/i })).toBeInTheDocument();
    });
  });
});
