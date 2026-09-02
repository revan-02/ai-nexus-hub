'use client';

import React from 'react';
import { ContentType } from '@/lib/mock-data/content-data';
import { cn } from '@/lib/utils';

const typeStyles: Record<ContentType, string> = {
  Course: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Article: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Tutorial: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Dataset: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Video: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Quiz: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Guide: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

export function ContentTypeBadge({ type, className }: { type: ContentType; className?: string }) {
  const style = typeStyles[type] || typeStyles.Article;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide font-mono',
        style,
        className
      )}
    >
      {type}
    </span>
  );
}
