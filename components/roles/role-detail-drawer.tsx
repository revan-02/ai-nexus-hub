'use client';

import React from 'react';
import { X, ShieldCheck, Users, Key, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { RoleTypeBadge } from './role-type-badge';
import { StatusBadge } from '@/components/users/status-badge';
import { RoleItem } from '@/lib/mock-data/roles-data';

interface RoleDetailDrawerProps {
  open: boolean;
  role: RoleItem | null;
  onOpenChange: (open: boolean) => void;
}

export function RoleDetailDrawer({ open, role, onOpenChange }: RoleDetailDrawerProps) {
  if (!open || !role) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121217] border-l border-[#272730] text-zinc-100 shadow-2xl flex flex-col justify-between z-10">
          {/* Header */}
          <div className="p-6 border-b border-[#272730] flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Role Configuration & Specs</h3>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#181820] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Role Header Details */}
            <div className="p-4 bg-[#181820] border border-[#272730] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl ${role.iconBg} ${role.iconColor} border border-white/5 flex items-center justify-center font-bold`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{role.name}</h4>
                    <p className="text-xs text-zinc-400 font-mono">ID: {role.id}</p>
                  </div>
                </div>
                <RoleTypeBadge type={role.type} />
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed bg-[#121217] p-3 rounded-xl border border-[#23232b]">
                {role.description}
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3 text-xs">
              <h5 className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
                Specification Overview
              </h5>

              <div className="p-3 bg-[#181820] border border-[#23232b] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-blue-400" /> Total Users Assigned
                  </span>
                  <span className="font-mono font-bold text-white">
                    {role.usersCount.toLocaleString()} ({role.userPercentage}%)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-purple-400" /> Granted Permissions
                  </span>
                  <span className="font-mono font-bold text-purple-300">
                    {role.permissionsCount} / 186
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Created Date
                  </span>
                  <span className="font-mono text-zinc-200">{role.createdAt}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Last Modified
                  </span>
                  <span className="font-mono text-zinc-200">{role.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Protected Warning if System Role */}
            {role.isProtected && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-purple-400" />
                  Protected System Role
                </div>
                <p className="text-[11px] leading-relaxed text-purple-200">
                  This is a core system role required for application governance and cannot be deleted or restricted.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
