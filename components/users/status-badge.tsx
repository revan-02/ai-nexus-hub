'use client';

import React from 'react';
import { UserStatus } from '@/lib/mock-data/users-data';
import { cn } from '@/lib/utils';

const statusStyles: Record<UserStatus, string> = {
  Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Inactive: 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60',
  Pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Suspended: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  Deleted: 'bg-zinc-900 text-zinc-500 border-zinc-800',
};

export function StatusBadge({ status, className }: { status: UserStatus; className?: string }) {
  const style = statusStyles[status] || statusStyles.Inactive;

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
