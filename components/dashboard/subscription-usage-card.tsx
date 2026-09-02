'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, ShieldCheck, Users, Brain, HardDrive } from 'lucide-react';
import { mockSubscription } from '@/lib/mock-data/admin-data';

export function SubscriptionUsageCard() {
  const sub = mockSubscription;

  const userPercent = ((sub.usersUsed / sub.usersLimit) * 100).toFixed(1);
  const reqPercent = 23.4; // 2.34M / 10M
  const storagePercent = ((sub.storageUsed / sub.storageLimit) * 100).toFixed(1);

  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-xl shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
        {/* Left Info Column */}
        <div className="lg:border-r lg:border-[#23232b] lg:pr-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-medium">Current Plan</span>
              <h4 className="text-base font-bold text-white leading-tight">{sub.planName}</h4>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> {sub.status}
            </span>
            <span>Valid until {sub.expiryDate}</span>
          </div>

          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold h-8 rounded-lg shadow-sm shadow-purple-900/30">
            Manage Plan
          </Button>
        </div>

        {/* Right 3 Usage Progress Columns */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Metric 1: Users */}
          <div className="space-y-2 p-3 bg-[#181820] border border-[#23232b] rounded-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <Users className="w-3.5 h-3.5 text-purple-400" /> Users Limit
              </span>
              <span className="font-bold text-purple-400 font-mono">{userPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#23232b] rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${userPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 text-right font-mono">
              {sub.usersUsed.toLocaleString()} / {sub.usersLimit.toLocaleString()}
            </p>
          </div>

          {/* Metric 2: AI Requests */}
          <div className="space-y-2 p-3 bg-[#181820] border border-[#23232b] rounded-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <Brain className="w-3.5 h-3.5 text-blue-400" /> AI Requests Limit
              </span>
              <span className="font-bold text-blue-400 font-mono">{reqPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#23232b] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${reqPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 text-right font-mono">
              {sub.requestsUsed} / {sub.requestsLimit}
            </p>
          </div>

          {/* Metric 3: Storage */}
          <div className="space-y-2 p-3 bg-[#181820] border border-[#23232b] rounded-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> Storage Capacity
              </span>
              <span className="font-bold text-emerald-400 font-mono">{storagePercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#23232b] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 text-right font-mono">
              {sub.storageUsed} TB / {sub.storageLimit} TB
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
