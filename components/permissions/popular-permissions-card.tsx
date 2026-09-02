'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Eye, Edit3, GraduationCap, BarChart2, FolderGit2, ArrowRight } from 'lucide-react';
import { mockPopularPermissions } from '@/lib/mock-data/permissions-data';

const iconMap = {
  Eye,
  Edit3,
  GraduationCap,
  BarChart2,
  FolderGit2,
};

export function PopularPermissionsCard() {
  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-white tracking-tight">Popular Permissions</h3>

      <div className="space-y-3 text-xs">
        {mockPopularPermissions.map((perm) => {
          const Icon = iconMap[perm.iconName as keyof typeof iconMap] || Eye;

          return (
            <div key={perm.id} className="flex items-center justify-between p-2 rounded-lg bg-[#181820] border border-[#23232b] hover:border-[#333342] transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-zinc-200">{perm.title}</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-400 bg-[#121217] px-2 py-0.5 rounded border border-[#272730]">
                {perm.rolesCount}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-[#23232b]">
        <button className="w-full text-center text-xs font-semibold text-zinc-300 hover:text-purple-400 flex items-center justify-center gap-1.5 transition-colors group py-1">
          <span>View All Permissions</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </Card>
  );
}
