'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mockAIModels } from '@/lib/mock-data/admin-data';

export function TopAIModelsCard() {
  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <h3 className="text-base font-bold text-white tracking-tight">Top AI Models by Usage</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Distribution of LLM & model requests</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 py-2">
          {/* Recharts Donut */}
          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAIModels}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                >
                  {mockAIModels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#121217" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181820',
                    borderColor: '#2a2a35',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Usage']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-zinc-400 font-medium">Total</span>
              <span className="text-sm font-bold text-white font-mono">100%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs">
            {mockAIModels.map((model) => (
              <div key={model.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: model.color }}
                  />
                  <span className="text-zinc-300 font-medium truncate max-w-[90px]">{model.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-mono">{model.percentage}%</span>
                  <span className="text-[10px] text-zinc-500 font-mono">({model.requests})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#23232b]">
        <Button
          variant="ghost"
          className="w-full justify-between text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-auto py-2 rounded-lg"
        >
          <span>View AI Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
