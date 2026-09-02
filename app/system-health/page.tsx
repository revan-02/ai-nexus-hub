'use client';

import React from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SystemHealthPage() {
  return (
    <AdminShell>
      <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <Link href="/" className="hover:text-zinc-200">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span>System</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-purple-400 font-semibold">System Health</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              System Health & Uptime <Activity className="w-6 h-6 text-purple-400" />
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Real-time status of APIs, databases, microservices and background workers.</p>
          </div>
          <Button variant="outline" className="bg-[#181820] border-[#272730] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" /> Refresh Now
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#121217] border-[#272730] p-4 rounded-xl">
            <span className="text-xs text-zinc-400 uppercase font-semibold">Overall Uptime</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 block mt-2">99.98%</span>
          </Card>
          <Card className="bg-[#121217] border-[#272730] p-4 rounded-xl">
            <span className="text-xs text-zinc-400 uppercase font-semibold">Response Time</span>
            <span className="text-2xl font-bold font-mono text-purple-400 block mt-2">42ms</span>
          </Card>
          <Card className="bg-[#121217] border-[#272730] p-4 rounded-xl">
            <span className="text-xs text-zinc-400 uppercase font-semibold">Error Rate</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 block mt-2">0.02%</span>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
