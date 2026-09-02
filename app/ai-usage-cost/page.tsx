'use client';

import React, { useState, Suspense } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  TrendingUp,
  Download,
  ChevronRight,
  Brain,
  CreditCard,
  PieChart as PieChartIcon,
  Layers,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function AIUsageCostPageInner() {
  const costTrendData = [
    { day: 'May 12', cost: 142.50 },
    { day: 'May 13', cost: 185.20 },
    { day: 'May 14', cost: 210.00 },
    { day: 'May 15', cost: 195.80 },
    { day: 'May 16', cost: 245.10 },
    { day: 'May 17', cost: 230.40 },
    { day: 'May 18', cost: 260.00 },
  ];

  const donutCostByProvider = [
    { name: 'Google Vertex AI', value: 842.50, color: '#8b5cf6' },
    { name: 'OpenAI API', value: 620.00, color: '#3b82f6' },
    { name: 'Anthropic Claude', value: 280.00, color: '#10b981' },
    { name: 'Self-Hosted / Misc', value: 100.00, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link href="/" className="hover:text-zinc-200 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span>AI Control Center</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">AI Usage & Cost</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">AI Usage & Cost Analytics</h1>
            <DollarSign className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track token spend, model billing breakdowns, spending limits and budget forecasts.
          </p>
        </div>

        <Button variant="outline" className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
          <Download className="w-3.5 h-3.5 text-zinc-400" />
          <span>Export Cost Report</span>
        </Button>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#121217] border border-[#272730] p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Spend This Month</span>
          <span className="text-2xl font-bold font-mono text-white mt-2 block">$1,842.50</span>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">12% under budget</span>
        </Card>

        <Card className="bg-[#121217] border border-[#272730] p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Projected EOM Spend</span>
          <span className="text-2xl font-bold font-mono text-white mt-2 block">$3,240.00</span>
          <span className="text-[11px] text-purple-400 font-semibold mt-1 inline-block">Monthly Limit: $4,000</span>
        </Card>

        <Card className="bg-[#121217] border border-[#272730] p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Cost per 1M Tokens</span>
          <span className="text-2xl font-bold font-mono text-white mt-2 block">$2.17</span>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">↓ 8% optimization</span>
        </Card>

        <Card className="bg-[#121217] border border-[#272730] p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Top Cost Provider</span>
          <span className="text-xl font-bold text-purple-400 mt-2 block">Google Vertex AI</span>
          <span className="text-[11px] text-zinc-400 mt-1 inline-block">45.7% of total spend</span>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Trend Chart (Span 2) */}
        <Card className="lg:col-span-2 bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white">Daily Cost Trend ($ USD)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costTrendData}>
                <defs>
                  <linearGradient id="purpleCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#52525b" fontSize={11} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#181820', borderColor: '#272730', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#purpleCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Spend by Provider Donut */}
        <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white">Spend by Provider</h3>
          <div className="relative h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutCostByProvider} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                  {donutCostByProvider.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold font-mono text-white">$1.84K</span>
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Total</span>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-[#23232b]">
            {donutCostByProvider.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-zinc-300">{item.name}</span>
                </div>
                <span className="font-mono text-zinc-400">${item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AIUsageCostPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading AI usage & cost...</div>}>
        <AIUsageCostPageInner />
      </Suspense>
    </AdminShell>
  );
}
