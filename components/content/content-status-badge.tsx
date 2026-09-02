'use client';

import React from 'react';
import { ContentStatus } from '@/lib/mock-data/content-data';
import { cn } from '@/lib/utils';

const statusStyles: Record<ContentStatus, string> = {
  Published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Draft: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Pending Review': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Archived: 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60',
  Rejected: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

export function ContentStatusBadge({ status, className }: { status: ContentStatus; className?: string }) {
  const style = statusStyles[status] || statusStyles.Draft;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide font-mono',
        style,
        className
      )}
    >
      {status}
    </span>
  );
}
