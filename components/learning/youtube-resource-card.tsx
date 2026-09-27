'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Play,
  Clock,
  Sparkles,
  ShieldCheck,
  Calendar,
  User,
  Info,
  ChevronDown,
  ChevronUp,
  Share2,
  Tv
} from 'lucide-react';
import type { YouTubeLearningResource } from '@/lib/data/youtube-learning-resources';

interface YouTubeResourceCardProps {
  resource: YouTubeLearningResource;
  index?: number;
  onCompletedChange?: (id: string, completed: boolean) => void;
}

export function YouTubeResourceCard({
  resource,
  index = 1,
  onCompletedChange,
}: YouTubeResourceCardProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [forceFallback, setForceFallback] = useState(!resource.embedAllowed);
  const [showFullBio, setShowFullBio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync completion state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`nexus_yt_completed_${resource.id}`);
      if (stored === 'true') {
        setIsCompleted(true);
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, [resource.id]);

  const toggleCompleted = () => {
    const next = !isCompleted;
    setIsCompleted(next);
    try {
      localStorage.setItem(`nexus_yt_completed_${resource.id}`, String(next));
    } catch {
      // ignore
    }
    if (onCompletedChange) {
      onCompletedChange(resource.id, next);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(resource.sourceUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <Card className="overflow-hidden border border-border bg-card/80 backdrop-blur-md rounded-2xl shadow-xl transition-all hover:border-purple-500/40 space-y-0">
      {/* ── CARD HEADER: CREATOR INFO & ACTION BAR ── */}
      <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-secondary/50 via-card to-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
              <Tv className="w-3 h-3 text-purple-400" />
              <span>Video Resource #{index}</span>
            </span>

            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
              resource.difficulty === 'Beginner'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : resource.difficulty === 'Intermediate'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {resource.difficulty}
            </span>

            <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-[10px] font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{resource.duration}</span>
            </span>

            {resource.publishDate && (
              <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-[10px] font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" />
                <span>{resource.publishDate}</span>
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
            {resource.title}
          </h3>

          {/* Creator Attribution Byline */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap pt-0.5">
            <span className="flex items-center gap-1 font-semibold text-purple-300">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Creator / Channel:</span>
            </span>
            <a
              href={resource.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-bold hover:text-purple-400 underline underline-offset-2 flex items-center gap-1 transition-colors"
              title={`Visit ${resource.channelName} on YouTube`}
            >
              <span>{resource.channelName}</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
            <span className="text-border">•</span>
            <span className="text-[11px] text-muted-foreground">Original Source: YouTube</span>
          </div>
        </div>

        {/* Top Action CTAs */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
          <Button
            onClick={toggleCompleted}
            variant="outline"
            size="sm"
            className={`text-xs h-9 rounded-xl font-medium transition-all ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 mr-1.5 ${isCompleted ? 'text-emerald-400' : 'text-muted-foreground'}`} />
            <span>{isCompleted ? 'Completed' : 'Mark Watched'}</span>
          </Button>

          {/* Clickable "Watch on YouTube" Official Direct CTA */}
          <a
            href={resource.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold h-9 px-3.5 rounded-xl gap-1.5 shadow-md shadow-red-950/30 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </Button>
          </a>
        </div>
      </div>

      {/* ── VIDEO PLAYER / FALLBACK CONTAINER ── */}
      <div className="p-4 sm:p-6 space-y-4">
        {!forceFallback && !embedError ? (
          /* Official YouTube Embed Player (Safe youtube-nocookie domain, no controls removed) */
          <div className="space-y-2">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl bg-black">
              <iframe
                src={`${resource.embedUrl}?enablejsapi=1&rel=0&modestbranding=0`}
                title={`${resource.title} - Video by ${resource.channelName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onError={() => setEmbedError(true)}
                className="w-full h-full border-0"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Embedded via official YouTube player with full creator branding &amp; attribution</span>
              </span>

              <button
                onClick={() => setForceFallback(true)}
                className="text-purple-400 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <span>Having playback issues? Switch to direct fallback</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── GRACEFUL FALLBACK CARD (When embedding is disabled, restricted, or offline) ── */
          <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/80 via-card to-purple-950/20 border-2 border-dashed border-purple-500/40 space-y-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* YouTube Thumbnail Preview */}
              <div className="relative w-full sm:w-56 aspect-video rounded-xl overflow-hidden border border-border bg-black flex-shrink-0 group">
                <img
                  src={resource.thumbnailUrl}
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to high-res if hqdefault fails
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${resource.youtubeVideoId}/0.jpg`;
                  }}
                />
                <a
                  href={resource.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </a>
              </div>

              {/* Notice & Direct Legal Watch Link */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start text-amber-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Playback Restricted / Direct YouTube Access</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-foreground">
                  {resource.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Due to creator rights, licensing, or network sandbox restrictions, this video is best experienced directly on YouTube. Please click below to watch on the official platform with complete creator support.
                </p>

                <div className="pt-2 flex items-center gap-3 justify-center sm:justify-start flex-wrap">
                  <a
                    href={resource.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-9 px-4 rounded-xl gap-2 shadow-lg shadow-red-950/40">
                      <Play className="w-3.5 h-3.5 fill-current" /> Watch on YouTube Directly ↗
                    </Button>
                  </a>

                  {resource.embedAllowed && (
                    <Button
                      onClick={() => {
                        setForceFallback(false);
                        setEmbedError(false);
                      }}
                      variant="outline"
                      className="bg-secondary text-foreground text-xs h-9 px-3 rounded-xl border-border hover:bg-secondary/80"
                    >
                      Try Embedding Again
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RELEVANCE REASON & WHAT YOU SHOULD LEARN ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
          {/* Why Relevant Callout */}
          <div className="md:col-span-6 p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Why This Video is Relevant to the Lesson</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {resource.relevanceReason}
            </p>
          </div>

          {/* Creator Information & Bio */}
          <div className="md:col-span-6 p-4 rounded-xl bg-secondary/40 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-foreground font-bold text-xs">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Original Creator Profile: {resource.channelName}</span>
              </span>
              <a
                href={resource.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Channel</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {resource.creatorBio || 'Official YouTube creator and verified educational educator.'}
            </p>
          </div>
        </div>

        {/* ── KEY CONCEPTS & WHAT YOU SHOULD LEARN ── */}
        {resource.keyTakeaways && resource.keyTakeaways.length > 0 && (
          <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2.5">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>What You Should Learn from This Video</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {resource.keyTakeaways.map((takeaway, tIdx) => (
                <div key={tIdx} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-purple-400 font-bold text-xs mt-0.5">•</span>
                  <span className="leading-snug">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LEGAL, COPYRIGHT & ATTRIBUTION FOOTER ── */}
        <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-muted-foreground bg-secondary/10 p-3 rounded-xl">
          <div className="space-y-0.5">
            <p className="text-foreground font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Copyright &amp; Source Attribution</span>
            </p>
            <p className="text-muted-foreground">
              {resource.copyrightNotice}
            </p>
            <p className="text-[10px] text-muted-foreground/80 italic">
              This video is embedded for educational purposes under standard YouTube embed terms. All rights belong to the original creator.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <Share2 className="w-3 h-3 mr-1" />
              <span>{copiedLink ? 'Copied Link!' : 'Share Resource'}</span>
            </Button>

            <a
              href={resource.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-red-400 hover:text-red-300 hover:underline flex items-center gap-1"
            >
              <span>Watch on YouTube ↗</span>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
