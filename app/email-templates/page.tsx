'use client';

import React from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Plus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function EmailTemplatesPage() {
  return (
    <AdminShell>
      <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <Link href="/" className="hover:text-zinc-200">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span>Communication</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-purple-400 font-semibold">Email Templates</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Email Templates <Mail className="w-6 h-6 text-purple-400" />
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Design and customize transactional & notification emails.</p>
          </div>
          <Button className="bg-purple-600 text-white text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
            <Plus className="w-4 h-4" /> Create Template
          </Button>
        </div>

        <Card className="bg-[#121217] border-[#272730] p-5 rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#181820] text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Template Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23232b]">
                <tr className="hover:bg-[#181820]/60">
                  <td className="p-3 font-bold text-white">Welcome & Verification Email</td>
                  <td className="p-3">Onboarding</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded">Active</span></td>
                  <td className="p-3 font-mono">10 mins ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
