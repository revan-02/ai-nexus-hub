'use client';

import React from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { FileText, Download, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AuditLogsPage() {
  return (
    <AdminShell>
      <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <Link href="/" className="hover:text-zinc-200">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span>Security & Audit</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-purple-400 font-semibold">Audit Logs</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Audit & Compliance Logs <FileText className="w-6 h-6 text-purple-400" />
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Immutable record of administrator actions, privilege escalations and schema changes.</p>
          </div>
        </div>

        <Card className="bg-[#121217] border-[#272730] p-5 rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#181820] text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23232b]">
                <tr className="hover:bg-[#181820]/60">
                  <td className="p-3 font-mono">May 18, 2025 02:30 PM</td>
                  <td className="p-3 font-bold text-white">Rajj Kashyap</td>
                  <td className="p-3 font-mono text-purple-400">UPDATE_AI_CONFIG</td>
                  <td className="p-3">AI Control Center</td>
                  <td className="p-3 font-mono">192.168.1.10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
