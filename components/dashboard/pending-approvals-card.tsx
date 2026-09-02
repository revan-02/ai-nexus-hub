'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import { mockPendingApprovals } from '@/lib/mock-data/admin-data';

export function PendingApprovalsCard() {
  const totalCount = mockPendingApprovals.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Pending Approvals</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Tasks awaiting administrator review</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-xs font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{totalCount}</span>
          </div>
        </div>

        <div className="space-y-2">
          {mockPendingApprovals.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 bg-[#181820] border border-[#23232b] rounded-lg text-xs"
            >
              <span className="text-zinc-300 font-medium">{item.category}</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                item.count > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#23232b]">
        <Button
          variant="ghost"
          className="w-full justify-between text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-auto py-2 rounded-lg"
        >
          <span>Review Approvals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
