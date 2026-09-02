'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { mockSystemServices } from '@/lib/mock-data/admin-data';

export function SystemStatusCard() {
  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-white tracking-tight">System Status</h3>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Operational
          </span>
        </div>
        <p className="text-xs text-zinc-400 mb-4">All core systems are operational</p>

        <div className="space-y-2.5">
          {mockSystemServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-2.5 bg-[#181820] border border-[#23232b] rounded-lg text-xs"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-medium text-zinc-200">{service.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-500 font-mono">{service.latency}</span>
                <span className="text-[11px] font-semibold text-emerald-400">Healthy</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#23232b]">
        <Button
          variant="ghost"
          className="w-full justify-between text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-auto py-2 rounded-lg"
        >
          <span>View System Health</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
