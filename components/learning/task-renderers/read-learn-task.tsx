'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, Video, PlayCircle, Film } from 'lucide-react';
import type { TaskRendererProps } from '../task-renderer';

interface VideoEmbedInfo {
  type: 'youtube' | 'vimeo' | 'mp4';
  src: string;
}

function parseVideoUrl(rawUrl?: string): VideoEmbedInfo {
  if (!rawUrl || !rawUrl.trim()) {
    return { type: 'mp4', src: 'https://www.w3schools.com/html/mov_bbb.mp4' };
  }

  const url = rawUrl.trim();

  // YouTube match: standard watch, short URL (youtu.be), embed, or shorts
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&enablejsapi=1`,
    };
  }

  // Vimeo match: vimeo.com/123456789
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`,
    };
  }

  // Default to direct HTML5 MP4 / WebM / Cloud CDN source
  return { type: 'mp4', src: url };
}

export function ReadLearnTask({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  const content = (task.taskContent as Record<string, any>) || {};
  const isVideo = task.taskType === 'VIDEO_LESSON' || !!content.videoUrl;
  const rawVideoUrl = content.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';
  const videoInfo = parseVideoUrl(rawVideoUrl);

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      {/* Video Player Box if taskType is VIDEO_LESSON */}
      {isVideo && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              {videoInfo.type === 'youtube' ? (
                <Film className="w-4 h-4 text-rose-500" />
              ) : (
                <Video className="w-4 h-4 text-purple-400" />
              )}
              <span>Interactive Educational Video Lesson</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-secondary text-muted-foreground border border-border rounded-md uppercase">
              {videoInfo.type === 'youtube' ? 'YouTube HD' : videoInfo.type === 'vimeo' ? 'Vimeo' : 'Cloud MP4'}
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-border bg-black aspect-video flex items-center justify-center shadow-lg">
            {videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' ? (
              <iframe
                src={videoInfo.src}
                title={task.title || 'Video Lesson'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                controls
                poster={task.imageUrl || undefined}
                className="w-full h-full object-contain"
              >
                <source src={videoInfo.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {content.transcript && (
            <div className="p-3 bg-secondary/30 border border-border rounded-xl text-xs text-muted-foreground">
              <span className="font-bold text-foreground block mb-1">Video Transcript & Objectives:</span>
              <p>{content.transcript}</p>
            </div>
          )}
        </div>
      )}

      {feedback && (
        <div className="p-4 rounded-xl text-xs font-bold flex items-center gap-2 border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{feedback.message}</span>
          {feedback.xpEarned > 0 && (
            <span className="ml-auto flex items-center gap-1 text-amber-400">
              <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{feedback.xpEarned} XP
            </span>
          )}
        </div>
      )}

      {!task.completed && (
        <Button
          onClick={() => onSubmit({ completed: true })}
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40 gap-2 cursor-pointer"
        >
          {isVideo ? <PlayCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {isSubmitting ? 'Recording Progress...' : isVideo ? 'Complete Video Lesson & Claim XP' : 'Mark as Read & Complete'}
        </Button>
      )}
    </div>
  );
}
