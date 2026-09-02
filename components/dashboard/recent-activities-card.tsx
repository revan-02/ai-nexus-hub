'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Brain, Database, GraduationCap, ShieldAlert, ArrowRight } from 'lucide-react';
import { mockRecentActivities } from '@/lib/mock-data/admin-data';

const activityIconMap = {
  user: { icon: UserPlus, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  ai: { icon: Brain, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  dataset: { icon: Database, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  course: { icon: GraduationCap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  security: { icon: ShieldAlert, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
};

export function RecentActivitiesCard() {
  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <h3 className="text-base font-bold text-white tracking-tight">Recent Activities</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Audit log of system events & changes</p>
        </div>

        <div className="space-y-3">
          {mockRecentActivities.map((act) => {
            const config = activityIconMap[act.type] || activityIconMap.user;
            const Icon = config.icon;

            return (
              <div
                key={act.id}
                className="flex items-start gap-3 p-2.5 bg-[#181820] border border-[#23232b] rounded-lg text-xs"
              >
                <div className={`w-7 h-7 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 ${config.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-200 font-medium leading-snug">
                    <span className="font-semibold text-white">{act.user}</span> {act.action}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1 font-mono">{act.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#23232b]">
        <Button
          variant="ghost"
          className="w-full justify-between text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-auto py-2 rounded-lg"
        >
          <span>View All Activities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
