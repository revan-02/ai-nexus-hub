'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Layers, ShieldCheck, Key } from 'lucide-react';
import { mockPermissionModulesData } from '@/lib/mock-data/permissions-data';

export function PermissionGroupsView() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockPermissionModulesData.map((mod) => (
        <Card
          key={mod.id}
          className="bg-[#181820] border border-[#272730] p-5 rounded-2xl space-y-3 hover:border-purple-500/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{mod.name}</h4>
                <p className="text-xs text-zinc-400 font-mono">{mod.resourceCount} Resources</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#23232b] flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-purple-400" />
              {mod.resourceCount * 4} Permissions
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              7 Active Roles
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
