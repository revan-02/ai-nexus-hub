'use client';

import React from 'react';
import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { PermissionState } from '@/lib/mock-data/permissions-data';
import { cn } from '@/lib/utils';

interface PermissionStateIconProps {
  state: PermissionState;
  onClick?: () => void;
  className?: string;
}

export function PermissionStateIcon({ state, onClick, className }: PermissionStateIconProps) {
  if (state === 'granted') {
    return (
      <button
        onClick={onClick}
        title="Granted"
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none mx-auto',
          className
        )}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
      </button>
    );
  }

  if (state === 'denied') {
    return (
      <button
        onClick={onClick}
        title="Denied"
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none mx-auto',
          className
        )}
      >
        <XCircle className="w-4 h-4 text-rose-500 fill-rose-500/20" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      title="Not Set"
      className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none mx-auto',
        className
      )}
    >
      <MinusCircle className="w-4 h-4 text-zinc-500 fill-zinc-800" />
    </button>
  );
}
