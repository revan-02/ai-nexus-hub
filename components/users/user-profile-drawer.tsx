'use client';

import React from 'react';
import { X, ShieldCheck, Mail, Building2, Calendar, Clock, Activity, Key, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleBadge } from './role-badge';
import { StatusBadge } from './status-badge';
import { UserItem } from '@/lib/mock-data/users-data';

interface UserProfileDrawerProps {
  open: boolean;
  user: UserItem | null;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDrawer({ open, user, onOpenChange }: UserProfileDrawerProps) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121217] border-l border-[#272730] text-zinc-100 shadow-2xl flex flex-col justify-between z-10">
          {/* Header */}
          <div className="p-6 border-b border-[#272730] flex items-center justify-between">
            <h3 className="text-base font-bold text-white">User Profile & Activity</h3>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#181820] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* User Hero Info */}
            <div className="flex items-center gap-4 p-4 bg-[#181820] border border-[#272730] rounded-2xl">
              <Avatar className="w-14 h-14 border border-purple-500/30">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg font-bold text-white truncate">{user.name}</h4>
                <p className="text-xs text-zinc-400 font-mono truncate">{user.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>

            {/* Overview Attributes */}
            <div className="space-y-3 text-xs">
              <h5 className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
                Account Details
              </h5>

              <div className="p-3 bg-[#181820] border border-[#23232b] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-purple-400" /> Email
                  </span>
                  <span className="font-semibold text-white font-mono">{user.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" /> Organization
                  </span>
                  <span className="font-medium text-zinc-200">{user.organization}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Email Verification
                  </span>
                  <span className={`font-semibold ${user.emailVerified ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Last Active
                  </span>
                  <span className="font-mono text-zinc-200">{user.lastActive}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" /> Created Date
                  </span>
                  <span className="font-mono text-zinc-200">{user.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="space-y-3 text-xs">
              <h5 className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
                Recent Audit Trail
              </h5>

              <div className="space-y-2">
                <div className="p-2.5 bg-[#181820] border border-[#23232b] rounded-lg">
                  <div className="flex items-center justify-between text-zinc-200 font-medium">
                    <span>Successful SSO Login</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{user.lastActive}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">IP: 192.168.1.104 • Browser: Chrome / Mac OS</p>
                </div>

                <div className="p-2.5 bg-[#181820] border border-[#23232b] rounded-lg">
                  <div className="flex items-center justify-between text-zinc-200 font-medium">
                    <span>Role Updated to {user.role}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">May 16, 2025</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">By Admin Super Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
