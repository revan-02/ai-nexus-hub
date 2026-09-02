'use client';

import React from 'react';
import { UserRole } from '@/lib/mock-data/users-data';
import { cn } from '@/lib/utils';

const roleStyles: Record<UserRole, string> = {
  Admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Manager: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Editor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Instructor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Analyst: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Moderator: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  User: 'bg-[#1e1e26] text-zinc-300 border-[#2f2f3d]',
};

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  const style = roleStyles[role] || roleStyles.User;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide font-mono',
        style,
        className
      )}
    >
      {role}
    </span>
  );
}
