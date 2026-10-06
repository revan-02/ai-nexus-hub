'use client';

import React, { useEffect, useState } from 'react';
import { getSeoMonetizationConfig } from '@/services/seo-monetization-service';

interface AdSenseAdProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'vertical';
  responsive?: boolean;
  className?: string;
  showPreviewInDev?: boolean;
}

export function AdSenseAd({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
  showPreviewInDev = true,
}: AdSenseAdProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [config] = useState(() => getSeoMonetizationConfig());

  const activePublisherId = config.adsense.publisherId;
  const activeSlotId = slotId || config.adsense.headerSlotId;
  const isEnabled = config.adsense.enabled;
  const isTestMode = config.adsense.testMode;

  useEffect(() => {
    if (!isEnabled) return;
    try {
      if (typeof window !== 'undefined') {
        // Safe push to adsbygoogle queue if available
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        setIsLoaded(true);
      }
    } catch {
      // AdSense or ad-blocker prevented push; fail silently without breaking page UI
      setIsLoaded(true);
    }
  }, [isEnabled, activeSlotId]);

  if (!isEnabled) return null;

  // Render container dimensions based on format to prevent Cumulative Layout Shift (CLS)
  const formatClasses =
    format === 'horizontal'
      ? 'min-h-[90px] max-h-[100px]'
      : format === 'rectangle'
      ? 'min-h-[250px] max-w-[336px]'
      : format === 'vertical'
      ? 'min-h-[600px] max-w-[300px]'
      : 'min-h-[90px] sm:min-h-[120px]';

  return (
    <div className={`w-full my-4 flex flex-col items-center justify-center ${className}`}>
      {/* AdSense Policy Label */}
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 mb-1 select-none font-medium">
        Advertisement
      </span>

      <div
        className={`w-full overflow-hidden rounded-2xl border border-dashed border-border/60 bg-secondary/20 flex flex-col items-center justify-center transition-all ${formatClasses}`}
      >
        {/* Real AdSense Ins Element */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={activePublisherId}
          data-ad-slot={activeSlotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
          data-ad-test={isTestMode ? 'on' : undefined}
        />

        {/* Development / Test Mode Placeholder Preview */}
        {isTestMode && showPreviewInDev && (
          <div className="p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-purple-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Google AdSense Slot · {format.toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              Client: {activePublisherId} | Slot: {activeSlotId}
            </p>
            <p className="text-[10px] text-muted-foreground/75">
              Live ads will serve here in production once AdSense domain audit completes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
