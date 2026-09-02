'use client';

import React from 'react';
import { RoleType } from '@/lib/mock-data/roles-data';
import { cn } from '@/lib/utils';

export function RoleTypeBadge({ type, className }: { type: RoleType; className?: string }) {
  const isSystem = type === 'System';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide font-mono',
        isSystem
          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
          : 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        className
      )}
    >
      {type}
    </span>
  );
}
