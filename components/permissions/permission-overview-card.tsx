'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Assigned', value: 182, percentage: '97.8%', color: '#8b5cf6' },
  { name: 'Not Assigned', value: 4, percentage: '2.2%', color: '#3b82f6' },
  { name: 'Custom', value: 12, percentage: '6.5%', color: '#10b981' },
  { name: 'System', value: 174, percentage: '93.5%', color: '#f59e0b' },
];

export function PermissionOverviewCard() {
  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-white tracking-tight">Permission Overview</h3>

      <div className="relative h-44 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-mono text-white">186</span>
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
            Total
          </span>
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="space-y-2.5 pt-2 border-t border-[#23232b]">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-zinc-300">{item.name}</span>
            </div>
            <span className="font-mono text-zinc-400">
              {item.percentage} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
