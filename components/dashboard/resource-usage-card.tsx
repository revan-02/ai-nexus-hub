'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cpu, HardDrive, Server } from 'lucide-react';
import { mockResourceUsage } from '@/lib/mock-data/admin-data';

function CircularProgress({ percent, color, label, icon: Icon }: { percent: number; color: string; label: string; icon: React.ElementType }) {
  const radius = 28;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#23232b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-zinc-400 mb-0.5" />
          <span className="text-xs font-bold text-white font-mono">{percent}%</span>
        </div>
      </div>
      <span className="text-[11px] font-semibold text-zinc-300 mt-1">{label}</span>
    </div>
  );
}

export function ResourceUsageCard() {
  const usage = mockResourceUsage;

  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <h3 className="text-base font-bold text-white tracking-tight">Resource Usage</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time compute and storage utilization</p>
        </div>

        {/* 3 Gauges */}
        <div className="grid grid-cols-3 gap-2 py-3 bg-[#181820] border border-[#23232b] rounded-xl mb-4">
          <CircularProgress percent={usage.cpu} color="#8b5cf6" label="CPU Usage" icon={Cpu} />
          <CircularProgress percent={usage.memory} color="#f59e0b" label="Memory" icon={Server} />
          <CircularProgress percent={usage.storage} color="#ec4899" label="Storage" icon={HardDrive} />
        </div>

        {/* Detail Stats */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-[#23232b]">
            <span className="text-zinc-400">Total Storage</span>
            <span className="font-semibold text-zinc-200 font-mono">{usage.totalStorage}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#23232b]">
            <span className="text-zinc-400">Used Storage</span>
            <span className="font-semibold text-zinc-200 font-mono">{usage.usedStorage}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#23232b]">
            <span className="text-zinc-400">AI Token Usage</span>
            <span className="font-semibold text-zinc-200 font-mono">{usage.aiTokenUsage} / {usage.maxAiTokens}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-zinc-400">Bandwidth</span>
            <span className="font-semibold text-zinc-200 font-mono">{usage.bandwidth}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#23232b]">
        <Button
          variant="ghost"
          className="w-full justify-between text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-auto py-2 rounded-lg"
        >
          <span>View Usage Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
