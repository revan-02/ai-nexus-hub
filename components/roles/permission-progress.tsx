'use client';

import React from 'react';

interface PermissionProgressProps {
  count: number;
  maxPermissions?: number;
}

export function PermissionProgress({ count, maxPermissions = 186 }: PermissionProgressProps) {
  const percentage = Math.min(100, Math.max(0, (count / maxPermissions) * 100));

  return (
    <div className="w-28 space-y-1">
      <span className="font-mono font-bold text-xs text-zinc-100">{count}</span>
      <div className="w-full h-1 bg-[#1a1a24] rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
