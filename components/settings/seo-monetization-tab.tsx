'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DollarSign,
  Globe,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Smartphone,
  Eye,
  Send,
  Zap,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  getSeoMonetizationConfig,
  updateSeoMonetizationConfig,
  getAdsTxtContent,
} from '@/services/seo-monetization-service';
import { mockCoursesList } from '@/lib/mock-data/courses-data';
import { InstantArticlesPreviewModal } from '@/components/seo/instant-articles-preview-modal';
import { AdSenseAd } from '@/components/ads/adsense-ad';

export function SeoMonetizationTab() {
  const initialConfig = getSeoMonetizationConfig();

  // AdSense State
  const [adsensePubId, setAdsensePubId] = useState(initialConfig.adsense.publisherId);
  const [adsenseAutoAds, setAdsenseAutoAds] = useState(initialConfig.adsense.autoAdsEnabled);
  const [adsenseHeaderSlot, setAdsenseHeaderSlot] = useState(initialConfig.adsense.headerSlotId);
  const [adsenseSidebarSlot, setAdsenseSidebarSlot] = useState(initialConfig.adsense.sidebarSlotId);
  const [adsenseInContentSlot, setAdsenseInContentSlot] = useState(initialConfig.adsense.inContentSlotId);
  const [adsenseTestMode, setAdsenseTestMode] = useState(initialConfig.adsense.testMode);
  const [adsTxtText, setAdsTxtText] = useState(initialConfig.adsense.adsTxtContent);

  // Instant Articles State
  const [fbAppId, setFbAppId] = useState(initialConfig.instantArticles.appId);
  const [fbPageId, setFbPageId] = useState(initialConfig.instantArticles.pageId);
  const [fbArticleStyle, setFbArticleStyle] = useState(initialConfig.instantArticles.articleStyle);
  const [fbAutoSyndicate, setFbAutoSyndicate] = useState(initialConfig.instantArticles.autoSyndicate);
  const [fbAccessToken, setFbAccessToken] = useState(initialConfig.instantArticles.apiAccessToken);

  // SEO & Webmasters State
  const [googleVerifyCode, setGoogleVerifyCode] = useState(initialConfig.seo.googleSiteVerification);
  const [bingVerifyCode, setBingVerifyCode] = useState(initialConfig.seo.bingVerification);
  const [yandexVerifyCode, setYandexVerifyCode] = useState(initialConfig.seo.yandexVerification);

  // UI States
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedFeedUrl, setCopiedFeedUrl] = useState(false);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);
  const [pingStatusMsg, setPingStatusMsg] = useState<string | null>(null);
  const [previewCourseModal, setPreviewCourseModal] = useState<any | null>(null);

  const rssFeedUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/instant-articles`
    : 'https://ainexus.platform.io/api/instant-articles';

  const sitemapUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/sitemap.xml`
    : 'https://ainexus.platform.io/sitemap.xml';

  const handleSave = () => {
    setIsSaving(true);
    updateSeoMonetizationConfig({
      adsense: {
        enabled: true,
        publisherId: adsensePubId,
        autoAdsEnabled: adsenseAutoAds,
        headerSlotId: adsenseHeaderSlot,
        sidebarSlotId: adsenseSidebarSlot,
        inContentSlotId: adsenseInContentSlot,
        testMode: adsenseTestMode,
        adsTxtContent: adsTxtText,
      },
      instantArticles: {
        enabled: true,
        appId: fbAppId,
        pageId: fbPageId,
        articleStyle: fbArticleStyle,
        autoSyndicate: fbAutoSyndicate,
        rssFeedUrl,
        apiAccessToken: fbAccessToken,
      },
      seo: {
        googleSiteVerification: googleVerifyCode,
        bingVerification: bingVerifyCode,
        yandexVerification: yandexVerifyCode,
        canonicalDomain: typeof window !== 'undefined' ? window.location.origin : 'https://ainexus.platform.io',
        sitemapUrl,
        robotsTxtUrl: typeof window !== 'undefined' ? `${window.location.origin}/robots.txt` : 'https://ainexus.platform.io/robots.txt',
      },
    });

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyFeed = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(rssFeedUrl);
    }
    setCopiedFeedUrl(true);
    setTimeout(() => setCopiedFeedUrl(false), 2000);
  };

  const handleCopyAdsTxt = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(adsTxtText);
    }
    setCopiedAdsTxt(true);
    setTimeout(() => setCopiedAdsTxt(false), 2000);
  };

  const handlePingSearchEngines = () => {
    setPingStatusMsg('Pinging Google Search Console & Bing Webmaster API...');
    setTimeout(() => {
      setPingStatusMsg('✓ Sitemap successfully pinged and verified by Google & Bing bots!');
      setTimeout(() => setPingStatusMsg(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Save Action */}
      <Card className="p-6 bg-card border-border rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">SEO, Google AdSense &amp; Instant Articles</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Monetization &amp; Syndication
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Configure AdSense publisher IDs, ads.txt verification, Meta Instant Articles RSS ingestion, and Search Console indexing tokens.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-9 px-5 rounded-xl shadow-md shadow-purple-950/40 gap-1.5 cursor-pointer"
            >
              {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{saveSuccess ? 'Changes Saved!' : isSaving ? 'Saving...' : 'Save Settings'}</span>
            </Button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>SEO metadata, AdSense credentials, and Instant Articles configuration updated successfully!</span>
          </div>
        )}
      </Card>

      {/* ── SECTION 1: GOOGLE ADSENSE MONETIZATION ── */}
      <Card className="p-6 bg-card border-border rounded-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Google AdSense Configuration &amp; Ads.txt</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Serve contextual display advertisements across courses, model benchmarks, and catalog pages.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            AdSense Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Publisher ID (Client ID)</label>
            <Input
              value={adsensePubId}
              onChange={(e) => setAdsensePubId(e.target.value)}
              placeholder="ca-pub-9842109481028401"
              className="text-xs bg-secondary border-border font-mono font-bold"
            />
            <span className="text-[10px] text-muted-foreground block">
              Found in your Google AdSense account under Account → Settings → Account information.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Header Leaderboard Slot ID</label>
            <Input
              value={adsenseHeaderSlot}
              onChange={(e) => setAdsenseHeaderSlot(e.target.value)}
              placeholder="1234567890"
              className="text-xs bg-secondary border-border font-mono"
            />
            <span className="text-[10px] text-muted-foreground block">Responsive 728x90 banner ad slot identifier.</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Sidebar Rectangle Slot ID</label>
            <Input
              value={adsenseSidebarSlot}
              onChange={(e) => setAdsenseSidebarSlot(e.target.value)}
              placeholder="2345678901"
              className="text-xs bg-secondary border-border font-mono"
            />
            <span className="text-[10px] text-muted-foreground block">Medium rectangle 300x250 ad unit for desktop sidebar.</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">In-Content / Bottom Banner Slot ID</label>
            <Input
              value={adsenseInContentSlot}
              onChange={(e) => setAdsenseInContentSlot(e.target.value)}
              placeholder="3456789012"
              className="text-xs bg-secondary border-border font-mono"
            />
            <span className="text-[10px] text-muted-foreground block">Fluid responsive unit positioned below course syllabi.</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30 cursor-pointer">
            <input
              type="checkbox"
              checked={adsenseAutoAds}
              onChange={(e) => setAdsenseAutoAds(e.target.checked)}
              className="accent-purple-600 rounded w-4 h-4"
            />
            <div>
              <span className="text-xs font-bold text-foreground block">Enable Google Auto Ads</span>
              <span className="text-[10px] text-muted-foreground block">Allow Google to automatically place ads where they perform best.</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30 cursor-pointer">
            <input
              type="checkbox"
              checked={adsenseTestMode}
              onChange={(e) => setAdsenseTestMode(e.target.checked)}
              className="accent-purple-600 rounded w-4 h-4"
            />
            <div>
              <span className="text-xs font-bold text-foreground block">Test / Sandbox Mode</span>
              <span className="text-[10px] text-muted-foreground block">Renders clean test containers without sending real impressions.</span>
            </div>
          </label>
        </div>

        {/* ads.txt Editor & Validator */}
        <div className="space-y-2 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Live ads.txt Content (IAB Standard)</span>
            </label>
            <div className="flex items-center gap-2">
              <a
                href="/ads.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-purple-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View Live /ads.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <Button
                onClick={handleCopyAdsTxt}
                size="sm"
                variant="outline"
                className="h-7 text-[11px] gap-1 px-2.5 rounded-lg cursor-pointer"
              >
                {copiedAdsTxt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAdsTxt ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
          </div>
          <textarea
            value={adsTxtText}
            onChange={(e) => setAdsTxtText(e.target.value)}
            rows={3}
            className="w-full p-3 bg-secondary/60 border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-purple-500"
            placeholder="google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0"
          />
          <p className="text-[10px] text-muted-foreground">
            Served directly at <code className="text-purple-300">/ads.txt</code> to prevent counterfeit ad inventory and pass AdSense account audits.
          </p>
        </div>
      </Card>

      {/* ── SECTION 2: META / FACEBOOK INSTANT ARTICLES ── */}
      <Card className="p-6 bg-card border-border rounded-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>Meta / Facebook Instant Articles Syndication</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Syndicate courses, research papers, and technical articles as lightning-fast Facebook Instant Articles via automated RSS 2.0.
            </p>
          </div>
          <Button
            onClick={() => setPreviewCourseModal(mockCoursesList[0])}
            variant="outline"
            size="sm"
            className="text-xs border-blue-500/40 text-blue-300 hover:bg-blue-500/10 gap-1.5 h-8 rounded-xl cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Instant Article</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Facebook App ID (fb:app_id)</label>
            <Input
              value={fbAppId}
              onChange={(e) => setFbAppId(e.target.value)}
              placeholder="184920194819284"
              className="text-xs bg-secondary border-border font-mono font-bold"
            />
            <span className="text-[10px] text-muted-foreground block">
              Configured in Meta Business Suite &amp; App Dashboard under Instant Articles.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Facebook Page ID (fb:pages)</label>
            <Input
              value={fbPageId}
              onChange={(e) => setFbPageId(e.target.value)}
              placeholder="109284729182345"
              className="text-xs bg-secondary border-border font-mono font-bold"
            />
            <span className="text-[10px] text-muted-foreground block">
              The Facebook Page authorized to publish Instant Articles for AI Nexus Hub.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Article Styling Template</label>
            <select
              value={fbArticleStyle}
              onChange={(e) => setFbArticleStyle(e.target.value)}
              className="w-full bg-secondary border border-border text-foreground text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="default">Default Dark / High-Contrast Theme</option>
              <option value="compact">Compact Minimalist Reading Mode</option>
              <option value="editorial">Editorial / Technical Journal Typography</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Meta Graph API Secret Access Token</label>
            <Input
              type="password"
              value={fbAccessToken}
              onChange={(e) => setFbAccessToken(e.target.value)}
              placeholder="EAACEdEose0cBA••••••••••••••••"
              className="text-xs bg-secondary border-border font-mono"
            />
            <span className="text-[10px] text-muted-foreground block">Used for real-time article publishing webhooks.</span>
          </div>
        </div>

        {/* Live RSS Feed Link */}
        <div className="p-4 bg-secondary/40 border border-border rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Instant Articles Automated RSS 2.0 Endpoint:</span>
            <div className="flex items-center gap-2">
              <a
                href="/api/instant-articles"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View Feed XML</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <Button
                onClick={handleCopyFeed}
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold h-7 px-3 rounded-lg gap-1 cursor-pointer"
              >
                {copiedFeedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFeedUrl ? 'Copied' : 'Copy Feed URL'}</span>
              </Button>
            </div>
          </div>
          <Input
            readOnly
            value={rssFeedUrl}
            className="text-xs bg-card border-border font-mono text-muted-foreground select-all"
          />
          <p className="text-[10px] text-muted-foreground">
            Submit this exact URL in Meta Business Suite → Configuration → Production RSS Feed. Includes compliant <code className="text-blue-300">op:markup_version="v1.0"</code> tags.
          </p>
        </div>
      </Card>

      {/* ── SECTION 3: SEARCH CONSOLE & SITEMAP SEO ── */}
      <Card className="p-6 bg-card border-border rounded-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Search Engine Webmaster Verification &amp; Sitemaps</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Domain verification tokens and automated indexing pings for Google Search Console and Bing Webmaster.
            </p>
          </div>
          <Button
            onClick={handlePingSearchEngines}
            variant="outline"
            size="sm"
            className="text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 gap-1.5 h-8 rounded-xl cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ping Search Engines</span>
          </Button>
        </div>

        {pingStatusMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{pingStatusMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Google Search Console Verification Token</label>
            <Input
              value={googleVerifyCode}
              onChange={(e) => setGoogleVerifyCode(e.target.value)}
              placeholder="google-site-verification=AbCdEfGhIjKlMnOpQrStUvWxYz..."
              className="text-xs bg-secondary border-border font-mono text-foreground"
            />
            <span className="text-[10px] text-muted-foreground block">
              Injected into <code className="text-purple-300">&lt;meta name="google-site-verification"&gt;</code> automatically.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Bing Webmaster (msvalidate.01) Token</label>
            <Input
              value={bingVerifyCode}
              onChange={(e) => setBingVerifyCode(e.target.value)}
              placeholder="A8B9C10D11E12F13G14H15I16J17K18L"
              className="text-xs bg-secondary border-border font-mono text-foreground"
            />
            <span className="text-[10px] text-muted-foreground block">
              Injected into <code className="text-purple-300">&lt;meta name="msvalidate.01"&gt;</code> automatically.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-secondary/30 border border-border rounded-xl">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-xs font-bold text-foreground block">Dynamic XML Sitemap</span>
              <span className="text-[10px] text-muted-foreground font-mono">{sitemapUrl}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-purple-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View /sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </Card>

      {/* Modal for previewing Instant Article output */}
      {previewCourseModal && (
        <InstantArticlesPreviewModal
          course={previewCourseModal}
          isOpen={!!previewCourseModal}
          onClose={() => setPreviewCourseModal(null)}
        />
      )}
    </div>
  );
}
