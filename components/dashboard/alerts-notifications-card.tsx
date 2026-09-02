'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, AlertOctagon, ArrowRight } from 'lucide-react';
import { mockAlerts } from '@/lib/mock-data/admin-data';

const alertTypeMap = {
  warning: {
    icon: AlertTriangle,
    badge: 'Warning',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  info: {
    icon: Info,
    badge: 'Information',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  error: {
    icon: AlertOctagon,
    badge: 'Error',
    color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
};

export function AlertsNotificationsCard() {
  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <h3 className="text-base font-bold text-white tracking-tight">Alerts & Notifications</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Critical system warnings and notices</p>
        </div>

        <div className="space-y-2.5">
          {mockAlerts.map((alert) => {
            const config = alertTypeMap[alert.type] || alertTypeMap.info;
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className="p-3 bg-[#181820] border border-[#23232b] rounded-lg text-xs space-y-1 hover:border-[#2f2f3d] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${config.color}`}>
                      <Icon className="w-3 h-3" />
                      {config.badge}
                    </span>
                    <span className="font-semibold text-zinc-200">{alert.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{alert.time}</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-1">{alert.details}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#23232b]">
        <Button
          variant="ghost"
          className="w-full justify-between text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-auto py-2 rounded-lg"
        >
          <span>View All Alerts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
