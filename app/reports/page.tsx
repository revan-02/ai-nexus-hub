'use client';

import React from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ChevronRight, Calendar, Filter, Eye, CheckCircle2, Receipt, ArrowRight, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const reports = [
    { title: 'Monthly AI Token Usage & Infrastructure Costs', date: 'May 2026', size: '2.4 MB', format: 'PDF / CSV', status: 'Generated' },
    { title: 'Quarterly User Assessment & Certification Summary', date: 'Q1 2026', size: '4.8 MB', format: 'PDF', status: 'Generated' },
    { title: 'Enterprise Security & Audit Trail Logs', date: 'May 12, 2026', size: '18.2 MB', format: 'JSON / Parquet', status: 'Generated' },
    { title: 'Model Training Loss & Benchmark Evaluation Summary', date: 'May 10, 2026', size: '1.2 MB', format: 'PDF', status: 'Generated' },
  ];

  return (
    <NexusShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Reports</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Platform Reports &amp; Audits</h1>
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Download automated system reports, billing breakdowns, audit trail logs, and benchmark summaries.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/payment-reports">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 h-9 rounded-xl gap-2 shadow-md shadow-purple-950/40 cursor-pointer">
                <Receipt className="w-4 h-4" />
                <span>Payment &amp; Revenue Reports</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Financial Revenue Banner */}
        <Card className="p-6 bg-gradient-to-r from-purple-950/50 via-secondary/70 to-indigo-950/40 border border-purple-500/30 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold rounded">
                  Live Finance Engine
                </span>
                <span className="text-xs font-mono text-muted-foreground">Razorpay • Stripe</span>
              </div>
              <h3 className="text-base font-bold text-foreground mt-1">Payment Reports &amp; Tax Invoices</h3>
              <p className="text-xs text-muted-foreground">
                View real-time transactions, GST breakdowns, gateway settlements, and issue instant refunds.
              </p>
            </div>
          </div>
          <Link href="/payment-reports">
            <Button className="bg-secondary border border-border hover:bg-secondary/80 text-foreground text-xs font-semibold h-9 px-4 rounded-xl gap-1.5 whitespace-nowrap">
              <span>Open Payment Reports</span>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </Button>
          </Link>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((r) => (
            <Card key={r.title} className="p-6 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold rounded border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {r.status}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">{r.date}</span>
                </div>
                <h3 className="text-base font-bold text-foreground">{r.title}</h3>
                <span className="text-xs font-mono text-purple-400">File Size: {r.size} • Format: {r.format}</span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button variant="outline" className="bg-secondary border-border text-foreground text-xs h-8 px-3 rounded-xl gap-1">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 px-3 rounded-xl gap-1 shadow-sm shadow-purple-900/30">
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </NexusShell>
  );
}
