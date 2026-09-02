'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageSquareText,
  Plus,
  Upload,
  Download,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  Brain,
  Sparkles,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Code
} from 'lucide-react';
import Link from 'next/link';

interface PromptItem {
  id: string;
  name: string;
  version: string;
  category: string;
  variables: string[];
  usageCount: string;
  status: 'Published' | 'Draft' | 'Testing';
  updatedAt: string;
}

function PromptManagementPageInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('tab') || 'All Prompts');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const prompts: PromptItem[] = [
    { id: 'prm-1', name: 'System Role & Agent Core', version: 'v2.4.0', category: 'Core System', variables: ['user_role', 'app_context', 'domain'], usageCount: '2,840,100', status: 'Published', updatedAt: 'May 18, 2025' },
    { id: 'prm-2', name: 'Code Generation & Refactoring', version: 'v1.8.2', category: 'Coding', variables: ['code_snippet', 'target_lang', 'style_rules'], usageCount: '1,420,000', status: 'Published', updatedAt: 'May 16, 2025' },
    { id: 'prm-3', name: 'Summarization & Key Points', version: 'v3.0.1', category: 'Text Processing', variables: ['document_text', 'max_length'], usageCount: '950,000', status: 'Published', updatedAt: 'May 14, 2025' },
    { id: 'prm-4', name: 'RAG Context Formatter', version: 'v1.2.0', category: 'RAG Search', variables: ['chunks', 'query'], usageCount: '620,000', status: 'Testing', updatedAt: 'May 12, 2025' },
  ];

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      if (activeTab !== 'All Prompts' && p.status !== activeTab) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.version.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [prompts, activeTab, searchQuery]);

  const kpis = [
    { title: 'Total Prompts', value: '48', change: '+6 new' },
    { title: 'Active Versions', value: '32', change: 'Live' },
    { title: 'Prompt Invocations', value: '5.8M', change: '+24%' },
    { title: 'Template Variables', value: '142', change: 'Shared' },
    { title: 'Avg Tokens / Prompt', value: '340', change: 'Optimized' },
    { title: 'Success Rate', value: '99.9%', change: 'Verified' },
  ];

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link href="/" className="hover:text-zinc-200 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span>AI Control Center</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">Prompt Management</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Prompt Management</h1>
            <MessageSquareText className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create, version, test and optimize system prompts and template variables.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30">
          <Plus className="w-4 h-4" />
          <span>New Prompt Template</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((metric, i) => (
          <Card key={i} className="bg-[#121217] border border-[#272730] p-4 rounded-xl shadow-sm hover:border-[#3b3b47] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{metric.title}</span>
              <div className="w-8 h-8 rounded-lg border bg-purple-500/10 text-purple-400 border-purple-500/20 flex items-center justify-center">
                <MessageSquareText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">{metric.value}</span>
              <span className="text-[11px] font-semibold text-purple-400 font-mono">{metric.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#272730] pb-3">
          <div className="flex items-center gap-1">
            {['All Prompts', 'Published', 'Testing', 'Draft'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181820]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="pl-9 pr-4 py-1.5 h-8 text-xs bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 rounded-lg"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-zinc-300">
            <thead className="bg-[#181820] text-zinc-400 font-semibold border-b border-[#272730] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Template Name</th>
                <th className="p-3">Version</th>
                <th className="p-3">Category</th>
                <th className="p-3">Variables</th>
                <th className="p-3">Invocations</th>
                <th className="p-3">Status</th>
                <th className="p-3">Updated</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23232b]">
              {filteredPrompts.map((p) => (
                <tr key={p.id} className="hover:bg-[#181820]/60 transition-colors">
                  <td className="p-3 font-bold text-zinc-100 max-w-xs truncate">{p.name}</td>
                  <td className="p-3 font-mono text-purple-400 font-bold">{p.version}</td>
                  <td className="p-3 text-zinc-300 font-medium">{p.category}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {p.variables.map((v) => (
                        <span key={v} className="px-1.5 py-0.5 bg-[#181820] border border-[#272730] rounded text-[10px] font-mono text-zinc-300">
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-zinc-200">{p.usageCount}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${p.status === 'Published' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-purple-500/15 text-purple-300 border-purple-500/30'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-zinc-400">{p.updatedAt}</td>
                  <td className="p-3 text-right">
                    <button className="p-1 text-zinc-400 hover:text-white hover:bg-[#20202b] rounded-md"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function PromptManagementPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading prompt management...</div>}>
        <PromptManagementPageInner />
      </Suspense>
    </AdminShell>
  );
}
