'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Boxes,
  Plus,
  Upload,
  Download,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  Brain,
  Zap,
  DollarSign,
  Activity,
  Cpu,
  Clock,
  Sparkles,
  TrendingUp,
  Sliders,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Bot,
  Settings2,
  Gauge
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { OllamaStudio } from '@/components/ai/ollama-studio';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AIModelRegistryItem {
  id: string;
  name: string;
  family: string;
  provider: string;
  contextWindow: string;
  modality: string;
  rateLimit: string;
  status: 'Deployed' | 'Staging' | 'Fine-Tuning' | 'Deprecated';
  lastDeployed: string;
}

function AIModelsPageInner() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'ollama' | 'registry'>('ollama');
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('tab') || 'All Models');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const models: AIModelRegistryItem[] = [
    { id: 'reg-1', name: 'Gemini 1.5 Pro', family: 'Gemini Series', provider: 'Google DeepMind', contextWindow: '2,000,000 tokens', modality: 'Text, Image, Video, Audio', rateLimit: '10,000 RPM / 2M TPM', status: 'Deployed', lastDeployed: 'May 18, 2025' },
    { id: 'reg-2', name: 'GPT-4o Omnimodal', family: 'GPT-4 Series', provider: 'OpenAI', contextWindow: '128,000 tokens', modality: 'Text, Vision, Audio', rateLimit: '5,000 RPM / 1.5M TPM', status: 'Deployed', lastDeployed: 'May 16, 2025' },
    { id: 'reg-3', name: 'Claude 3.5 Sonnet', family: 'Claude Series', provider: 'Anthropic', contextWindow: '200,000 tokens', modality: 'Text & Code & Vision', rateLimit: '4,000 RPM / 1M TPM', status: 'Deployed', lastDeployed: 'May 14, 2025' },
    { id: 'reg-4', name: 'Llama 3 70B Instruct', family: 'Llama Open Weights', provider: 'Meta AI', contextWindow: '8,192 tokens', modality: 'Text & Code', rateLimit: 'Unlimited (Self-Hosted)', status: 'Deployed', lastDeployed: 'May 12, 2025' },
    { id: 'reg-5', name: 'DeepSeek V2 Chat', family: 'DeepSeek MoE', provider: 'DeepSeek AI', contextWindow: '128,000 tokens', modality: 'Text & Code', rateLimit: '2,000 RPM / 500K TPM', status: 'Staging', lastDeployed: 'May 10, 2025' },
    { id: 'reg-6', name: 'Custom AGY Codebase Model', family: 'Fine-Tuned Llama', provider: 'Internal AGY Engine', contextWindow: '32,768 tokens', modality: 'Code & Refactoring', rateLimit: 'Dedicated GPU Cluster', status: 'Fine-Tuning', lastDeployed: 'May 08, 2025' },
  ];

  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      if (activeTab !== 'All Models' && m.status !== activeTab) return false;
      if (statusFilter !== 'All Status' && m.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.family.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [models, activeTab, statusFilter, searchQuery]);

  const kpis = [
    { title: 'Total Models', value: '32', change: '+4 new', trend: 'up' },
    { title: 'Active Deployments', value: '18', change: 'Live Endpoints', trend: 'up' },
    { title: 'Fine-Tuned Models', value: '8', change: 'Internal Checkpoints', trend: 'up' },
    { title: 'Max Context Window', value: '2.0M', change: 'Gemini 1.5 Pro', trend: 'up' },
    { title: 'Avg Cost / 1k Tokens', value: '$0.002', change: 'Optimized', trend: 'up' },
    { title: 'Endpoint Health', value: '100%', change: 'All Systems Go', trend: 'up' },
  ];

  const donutFamily = [
    { name: 'Gemini Series', value: 10, percentage: '31.2%', color: '#8b5cf6' },
    { name: 'GPT Series', value: 9, percentage: '28.1%', color: '#3b82f6' },
    { name: 'Claude Series', value: 7, percentage: '21.8%', color: '#10b981' },
    { name: 'Open Source / Internal', value: 6, percentage: '18.9%', color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link href="/" className="hover:text-zinc-200 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span>AI Control Center</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">AI Models</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">AI Models & Registry</h1>
            <Boxes className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage deployed foundation models, custom fine-tuned checkpoints, context window limits and routing rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30">
            <Plus className="w-4 h-4" />
            <span>Add AI Model</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </Button>

          <Button variant="outline" className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Deploy Checkpoint</span>
          </Button>

          <Button variant="outline" className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export Registry</span>
          </Button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-[#121217] border border-[#272730] rounded-2xl flex-wrap">
        <button
          onClick={() => setViewMode('ollama')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            viewMode === 'ollama'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-300" />
          <span>🦙 Ollama Local Free LLM Studio (DeepSeek-R1, Llama 3.2, Qwen 2.5)</span>
        </button>
        <button
          onClick={() => setViewMode('registry')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            viewMode === 'registry'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Boxes className="w-4 h-4 text-blue-400" />
          <span>📦 AI Model Registry &amp; Infrastructure</span>
        </button>
      </div>

      {viewMode === 'ollama' ? (
        <OllamaStudio />
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {kpis.map((metric, i) => (
          <Card key={i} className="bg-[#121217] border border-[#272730] p-4 rounded-xl shadow-sm hover:border-[#3b3b47] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{metric.title}</span>
              <div className="w-8 h-8 rounded-lg border bg-purple-500/10 text-purple-400 border-purple-500/20 flex items-center justify-center">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">{metric.value}</span>
              <div className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border text-purple-400 bg-purple-500/10 border-purple-500/20">
                <TrendingUp className="w-3 h-3" />
                <span>{metric.change}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid: Table + Family Share */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Data Table (Span 3) */}
        <Card className="lg:col-span-3 bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#272730] pb-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {['All Models', 'Deployed', 'Staging', 'Fine-Tuning', 'Deprecated'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all relative ${
                    activeTab === tab
                      ? 'text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181820]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-purple-500 rounded-full" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search model name or family..."
                  className="pl-9 pr-4 py-1.5 h-8 text-xs bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#181820] text-zinc-400 font-semibold border-b border-[#272730] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredModels.length > 0 && selectedIds.length === filteredModels.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(filteredModels.map((m) => m.id));
                        else setSelectedIds([]);
                      }}
                      className="rounded border-[#33333d] bg-[#121217] text-purple-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Context Window</th>
                  <th className="p-3">Modality</th>
                  <th className="p-3">Rate Limit</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Deployed</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23232b]">
                {filteredModels.map((m) => {
                  const isSelected = selectedIds.includes(m.id);
                  return (
                    <tr key={m.id} className={`hover:bg-[#181820]/60 transition-colors ${isSelected ? 'bg-purple-950/20' : ''}`}>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds((prev) => [...prev, m.id]);
                            else setSelectedIds((prev) => prev.filter((i) => i !== m.id));
                          }}
                          className="rounded border-[#33333d] bg-[#121217] text-purple-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-zinc-100 text-xs truncate leading-tight">{m.name}</p>
                            <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">{m.family}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap text-zinc-300 font-medium">{m.provider}</td>
                      <td className="p-3 whitespace-nowrap font-mono font-bold text-purple-400">{m.contextWindow}</td>
                      <td className="p-3 whitespace-nowrap text-zinc-300">{m.modality}</td>
                      <td className="p-3 whitespace-nowrap font-mono text-zinc-400 text-[11px]">{m.rateLimit}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          m.status === 'Deployed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                          m.status === 'Staging' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                          m.status === 'Fine-Tuning' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse' :
                          'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono text-zinc-400">{m.lastDeployed}</td>
                      <td className="p-3 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<button className="p-1 text-zinc-400 hover:text-white hover:bg-[#20202b] rounded-md transition-colors" />}>
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-[#121217] border-[#272730] text-zinc-200 rounded-xl p-1">
                            <DropdownMenuItem className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2">
                              <Gauge className="w-3.5 h-3.5 text-purple-400" /> Benchmark Test
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2">
                              <Edit className="w-3.5 h-3.5 text-zinc-400" /> Configure Parameters
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Family Share Donut Card (Span 1) */}
        <div className="space-y-6">
          <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white">Model Families</h3>
            <div className="relative h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutFamily} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                    {donutFamily.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-white">32</span>
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Models</span>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#23232b]">
              {donutFamily.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-zinc-300">{item.name}</span>
                  </div>
                  <span className="font-mono text-zinc-400">{item.percentage}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

export default function AIModelsPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading AI models...</div>}>
        <AIModelsPageInner />
      </Suspense>
    </AdminShell>
  );
}
