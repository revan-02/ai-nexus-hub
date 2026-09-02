'use client';

import React from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Activity, BarChart3, Clock, ChevronRight, Download, Brain, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Platform Analytics</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Analytics & Platform Metrics</h1>
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Real-time insights into active learners, course completions, GPU compute utilization, and API token usage.
            </p>
          </div>

          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30">
            <Download className="w-4 h-4" /> Export Analytics PDF
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-card border-border rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Monthly Active Learners</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-foreground">54,820</span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">↑ +18.4% vs last month</span>
          </Card>

          <Card className="p-5 bg-card border-border rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Total API Token Requests</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-foreground">14.2M</span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">↑ +24.1% latency efficiency</span>
          </Card>

          <Card className="p-5 bg-card border-border rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Quizzes & Certifications</span>
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-foreground">128,400</span>
            <span className="text-[11px] font-mono text-purple-400 font-semibold">92.4% Pass Rate</span>
          </Card>

          <Card className="p-5 bg-card border-border rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Average Study Streak</span>
              <Clock className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-foreground">14.2 Days</span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">↑ +3.5 days engagement</span>
          </Card>
        </div>

        {/* Detailed Chart Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-card border-border rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-foreground">Daily Active Users & Model Inferences</h3>
            <div className="h-48 bg-secondary/50 border border-border rounded-xl flex items-center justify-center text-xs text-purple-300 font-mono">
              [Real-time Time Series Metrics Visualization Engine]
            </div>
          </Card>

          <Card className="p-6 bg-card border-border rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-foreground">Category Engagement Distribution</h3>
            <div className="h-48 bg-secondary/50 border border-border rounded-xl flex items-center justify-center text-xs text-emerald-300 font-mono">
              [Deep Learning: 42% • GenAI: 35% • ML Ops: 23%]
            </div>
          </Card>
        </div>
      </div>
    </NexusShell>
  );
}
