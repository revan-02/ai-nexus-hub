'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { mockAnalyticsDataset } from '@/lib/mock-data/admin-data';

export function PlatformAnalytics() {
  const [activeTab, setActiveTab] = useState<'Users' | 'AI Requests' | 'Projects' | 'Revenue'>('Users');
  const data = mockAnalyticsDataset[activeTab] || mockAnalyticsDataset.Users;

  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-xl shadow-sm">
      {/* Card Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Platform Analytics</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Overall growth and usage activity trends</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tab Selector */}
          <div className="flex items-center p-1 bg-[#181820] border border-[#272730] rounded-lg text-xs">
            {(['Users', 'AI Requests', 'Projects', 'Revenue'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#20202b]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181820] border border-[#272730] rounded-lg text-xs text-zinc-300 font-medium">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Last 7 Days</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#23232b" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#23232b' }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#181820',
                borderColor: '#2a2a35',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#c4b5fd' }}
            />
            <Area
              type="monotone"
              dataKey="active"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#purpleGradient)"
              dot={{ r: 4, fill: '#8b5cf6', stroke: '#121217', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#a78bfa', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom KPI Callout Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-[#23232b]">
        <div className="p-3 bg-[#181820]/60 border border-[#23232b] rounded-lg">
          <p className="text-xs text-zinc-400 font-medium">Active Users</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-white font-mono">8,742</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 8.1%
            </span>
          </div>
        </div>

        <div className="p-3 bg-[#181820]/60 border border-[#23232b] rounded-lg">
          <p className="text-xs text-zinc-400 font-medium">New Users</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-white font-mono">1,213</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 15.3%
            </span>
          </div>
        </div>

        <div className="p-3 bg-[#181820]/60 border border-[#23232b] rounded-lg">
          <p className="text-xs text-zinc-400 font-medium">Avg. Session Time</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-white font-mono">3m 24s</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 5.2%
            </span>
          </div>
        </div>

        <div className="p-3 bg-[#181820]/60 border border-[#23232b] rounded-lg">
          <p className="text-xs text-zinc-400 font-medium">Retention Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-white font-mono">73.6%</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 3.7%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
