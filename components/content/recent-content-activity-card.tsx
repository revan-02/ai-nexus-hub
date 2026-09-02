'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { PlusCircle, FileEdit, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { mockRecentContentActivities } from '@/lib/mock-data/content-data';
import { cn } from '@/lib/utils';

const iconMap = {
  PlusCircle,
  FileEdit,
  Clock,
  CheckCircle2,
};

export function RecentContentActivityCard() {
  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Recent Activity</h3>
        <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {mockRecentContentActivities.map((act) => {
          const Icon = iconMap[act.iconName as keyof typeof iconMap] || CheckCircle2;

          return (
            <div key={act.id} className="flex items-start gap-3 text-xs">
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/5 mt-0.5', act.iconColor)}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-200 leading-snug">{act.title}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                  by {act.author} • {act.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-[#23232b]">
        <button className="w-full text-center text-xs font-semibold text-zinc-300 hover:text-purple-400 flex items-center justify-center gap-1.5 transition-colors group py-1">
          <span>Go to Content Workflow</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </Card>
  );
}
