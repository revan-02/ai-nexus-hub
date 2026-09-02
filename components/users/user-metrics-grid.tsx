'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, UserCheck, UserX, Clock, ShieldAlert, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockUserMetrics } from '@/lib/mock-data/users-data';

const userMetricIconMap = {
  'total-users': Users,
  'active-users': UserCheck,
  'inactive-users': UserX,
  'pending-users': Clock,
  'suspended-users': ShieldAlert,
  'deleted-users': Trash2,
};

const userVariantStyles = {
  purple: {
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  blue: {
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  green: {
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  orange: {
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  red: {
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    badge: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
};

export function UserMetricsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {mockUserMetrics.map((metric) => {
        const Icon = userMetricIconMap[metric.id as keyof typeof userMetricIconMap] || Users;
        const style = userVariantStyles[metric.variant] || userVariantStyles.purple;

        return (
          <Card key={metric.id} className="bg-[#121217] border border-[#272730] p-4 rounded-xl shadow-sm hover:border-[#3b3b47] transition-all hover:translate-y-[-2px] duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {metric.title}
              </span>
              <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center', style.iconBg)}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">
                {metric.value}
              </span>
              <div className={cn('flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border', style.badge)}>
                {metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                {metric.trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-400" />}
                {metric.trend === 'flat' && <Minus className="w-3 h-3 text-zinc-400" />}
                <span>{metric.change}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 mt-2 font-medium">
              {metric.period}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
