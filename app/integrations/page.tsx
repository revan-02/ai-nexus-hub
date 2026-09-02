'use client';

import React from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle, Plus, ChevronRight, ExternalLink, ShieldCheck, CheckCircle2, Sliders } from 'lucide-react';
import Link from 'next/link';

export default function IntegrationsPage() {
  const integrations = [
    {
      name: 'Razorpay Payment Gateway',
      category: 'Billing & Checkout',
      status: 'Connected',
      mode: 'Test / Live Ready',
      lastSync: 'Live',
      configUrl: '/settings?tab=payment-gateways',
    },
    {
      name: 'Stripe International Gateway',
      category: 'Billing & Checkout',
      status: 'Connected',
      mode: 'Active (USD/EUR)',
      lastSync: 'Live',
      configUrl: '/settings?tab=payment-gateways',
    },
    {
      name: 'Google Workspace OAuth 2.0',
      category: 'Authentication',
      status: 'Connected',
      mode: 'Enterprise SSO',
      lastSync: '1 min ago',
      configUrl: '/settings?tab=accounts',
    },
    {
      name: 'Amazon S3 & Wasabi Encrypted Storage',
      category: 'Backup & Recovery',
      status: 'Connected',
      mode: 'AES-256 Storage',
      lastSync: '34 mins ago',
      configUrl: '/system/backup-and-recovery',
    },
    {
      name: 'Hugging Face Model Hub',
      category: 'AI Models & Datasets',
      status: 'Connected',
      mode: 'Read / Sync',
      lastSync: '2 hours ago',
      configUrl: '/settings?tab=accounts',
    },
  ];

  return (
    <AdminShell>
      <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <Link href="/" className="hover:text-zinc-200">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span>System</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-purple-400 font-semibold">Integrations & Payment APIs</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Third-Party Integrations & Payment Gateways <Puzzle className="w-6 h-6 text-purple-400" />
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Connect Razorpay, Stripe, Cloud Storage backups, OAuth providers, and automated webhooks.
            </p>
          </div>
          <Link href="/settings?tab=payment-gateways">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5 shadow-md shadow-purple-900/30">
              <Sliders className="w-4 h-4" /> Manage Payment Settings
            </Button>
          </Link>
        </div>

        <Card className="bg-[#121217] border-[#272730] p-5 rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#181820] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-[#272730]">
                <tr>
                  <th className="p-3">Integration Service</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Operation Mode</th>
                  <th className="p-3">Last Sync</th>
                  <th className="p-3 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23232b]">
                {integrations.map((item) => (
                  <tr key={item.name} className="hover:bg-[#181820]/60 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{item.name}</span>
                    </td>
                    <td className="p-3 font-mono text-zinc-400">{item.category}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-purple-300">{item.mode}</td>
                    <td className="p-3 font-mono text-zinc-400">{item.lastSync}</td>
                    <td className="p-3 text-right">
                      <Link
                        href={item.configUrl}
                        className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold text-xs"
                      >
                        <span>Configure</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
