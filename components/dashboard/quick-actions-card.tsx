'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { UserPlus, ShieldCheck, Upload, Sliders, Settings, FileText } from 'lucide-react';
import { mockQuickActions } from '@/lib/mock-data/admin-data';

const actionIconMap: Record<string, React.ElementType> = {
  UserPlus,
  ShieldPlus: ShieldCheck,
  Upload,
  Sliders,
  Settings,
  FileText,
};

export function QuickActionsCard() {
  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-xl shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-white tracking-tight">Quick Actions</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Frequent enterprise administration workflows</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {mockQuickActions.map((action) => {
          const Icon = actionIconMap[action.iconName] || UserPlus;

          return (
            <button
              key={action.id}
              className="flex flex-col items-center justify-center p-3.5 bg-[#181820] border border-[#23232b] rounded-xl hover:border-purple-500/40 hover:bg-[#1f1f2a] transition-all group cursor-pointer text-center relative"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-purple-500/20 transition-all">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                {action.label}
              </span>

              {action.shortcut && (
                <span className="absolute top-2 right-2 text-[9px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  ⌥{action.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
