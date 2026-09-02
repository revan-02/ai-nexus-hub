'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Course', value: 412, percentage: '32.1%', color: '#8b5cf6' },
  { name: 'Article', value: 356, percentage: '27.7%', color: '#3b82f6' },
  { name: 'Tutorial', value: 198, percentage: '15.4%', color: '#06b6d4' },
  { name: 'Dataset', value: 124, percentage: '9.7%', color: '#10b981' },
  { name: 'Video', value: 98, percentage: '7.6%', color: '#f43f5e' },
  { name: 'Quiz', value: 56, percentage: '4.4%', color: '#f59e0b' },
  { name: 'Guide', value: 40, percentage: '3.1%', color: '#14b8a6' },
];

export function ContentOverviewCard() {
  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-white tracking-tight">Content Overview</h3>

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
          <span className="text-2xl font-bold font-mono text-white">1,284</span>
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
            Total
          </span>
        </div>
      </div>

      {/* Legend & Percentages */}
      <div className="space-y-2 pt-2 border-t border-[#23232b]">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-zinc-300">{item.name}</span>
            </div>
            <span className="font-mono text-zinc-400">
              {item.value} ({item.percentage})
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
