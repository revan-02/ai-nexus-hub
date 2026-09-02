'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Plus,
  Upload,
  Download,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  Users,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  Layers,
  Globe,
  Lock,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamItem {
  id: string;
  name: string;
  code: string;
  org: string;
  lead: { name: string; avatar: string };
  membersCount: number;
  plan: 'Enterprise' | 'Pro' | 'Standard';
  status: 'Active' | 'Inactive' | 'Archived';
  createdAt: string;
}

function TeamsPageInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('tab') || 'All Teams');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [planFilter, setPlanFilter] = useState<string>('All Plans');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const teams: TeamItem[] = [
    { id: 'team-1', name: 'Core AI Infrastructure', code: 'TEAM-AI-01', org: 'AI Application Platform', lead: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }, membersCount: 34, plan: 'Enterprise', status: 'Active', createdAt: 'Jan 15, 2024' },
    { id: 'team-2', name: 'Frontend Design Systems', code: 'TEAM-UI-02', org: 'AI Application Platform', lead: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }, membersCount: 22, plan: 'Enterprise', status: 'Active', createdAt: 'Feb 02, 2024' },
    { id: 'team-3', name: 'Data Pipeline & ETL', code: 'TEAM-DATA-03', org: 'Data Science Hub', lead: { name: 'Michael Smith', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }, membersCount: 18, plan: 'Enterprise', status: 'Active', createdAt: 'Feb 20, 2024' },
    { id: 'team-4', name: 'Security & Compliance', code: 'TEAM-SEC-04', org: 'Security Operations', lead: { name: 'Jessica Lee', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' }, membersCount: 14, plan: 'Pro', status: 'Active', createdAt: 'Mar 10, 2024' },
    { id: 'team-5', name: 'DevOps & Cloud Infra', code: 'TEAM-OPS-05', org: 'Cloud Operations', lead: { name: 'David Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }, membersCount: 26, plan: 'Enterprise', status: 'Active', createdAt: 'Apr 05, 2024' },
    { id: 'team-6', name: 'Mobile App Engineering', code: 'TEAM-MOB-06', org: 'Product Engineering', lead: { name: 'Olivia Martinez', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' }, membersCount: 12, plan: 'Standard', status: 'Inactive', createdAt: 'May 12, 2024' },
  ];

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      if (activeTab !== 'All Teams' && t.status !== activeTab) return false;
      if (planFilter !== 'All Plans' && t.plan !== planFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.org.toLowerCase().includes(q) ||
          t.lead.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [teams, activeTab, planFilter, searchQuery]);

  const kpis = [
    { title: 'Total Teams', value: '24', change: '+4 this mo', trend: 'up' },
    { title: 'Organizations', value: '6', change: 'Active', trend: 'up' },
    { title: 'Total Members', value: '1,284', change: '+84 new', trend: 'up' },
    { title: 'Enterprise Seats', value: '500', change: '84% used', trend: 'up' },
    { title: 'Active Projects', value: '142', change: '+12 new', trend: 'up' },
    { title: 'Compliance Rate', value: '99.4%', change: 'Verified', trend: 'up' },
  ];

  const donutData = [
    { name: 'Enterprise', value: 16, percentage: '66.7%', color: '#8b5cf6' },
    { name: 'Pro Plan', value: 5, percentage: '20.8%', color: '#3b82f6' },
    { name: 'Standard', value: 3, percentage: '12.5%', color: '#10b981' },
  ];

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link href="/" className="hover:text-zinc-200 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span>User & Access</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">Teams / Organizations</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Teams & Organizations</h1>
            <Building2 className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage enterprise organization units, team memberships, resource allocations and hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30">
            <Plus className="w-4 h-4" />
            <span>Create Team</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </Button>

          <Button variant="outline" className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>Import</span>
          </Button>

          <Button variant="outline" className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((metric, i) => (
          <Card key={i} className="bg-[#121217] border border-[#272730] p-4 rounded-xl shadow-sm hover:border-[#3b3b47] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{metric.title}</span>
              <div className="w-8 h-8 rounded-lg border bg-purple-500/10 text-purple-400 border-purple-500/20 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
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

      {/* Main Grid: Table + Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Table (Span 3) */}
        <Card className="lg:col-span-3 bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#272730] pb-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {['All Teams', 'Active', 'Inactive', 'Archived'].map((tab) => (
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
                  placeholder="Search teams or orgs..."
                  className="pl-9 pr-4 py-1.5 h-8 text-xs bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 rounded-lg"
                />
              </div>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="h-8 px-2.5 bg-[#181820] border border-[#272730] rounded-lg text-xs text-zinc-200 focus:outline-none"
              >
                <option value="All Plans">All Plans</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Pro">Pro</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#181820] text-zinc-400 font-semibold border-b border-[#272730] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredTeams.length > 0 && selectedIds.length === filteredTeams.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(filteredTeams.map((t) => t.id));
                        else setSelectedIds([]);
                      }}
                      className="rounded border-[#33333d] bg-[#121217] text-purple-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">Team</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Team Lead</th>
                  <th className="p-3">Members</th>
                  <th className="p-3">Plan tier</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23232b]">
                {filteredTeams.map((t) => {
                  const isSelected = selectedIds.includes(t.id);
                  return (
                    <tr key={t.id} className={`hover:bg-[#181820]/60 transition-colors ${isSelected ? 'bg-purple-950/20' : ''}`}>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds((prev) => [...prev, t.id]);
                            else setSelectedIds((prev) => prev.filter((i) => i !== t.id));
                          }}
                          className="rounded border-[#33333d] bg-[#121217] text-purple-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-zinc-100 text-xs truncate leading-tight">{t.name}</p>
                            <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">{t.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap text-zinc-300 font-medium">{t.org}</td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 border border-[#2e2e3a]">
                            <AvatarImage src={t.lead.avatar} alt={t.lead.name} />
                            <AvatarFallback>{t.lead.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-zinc-200 text-xs">{t.lead.name}</span>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono font-bold text-purple-400">
                        {t.membersCount} members
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30 text-[10px] font-bold">
                          {t.plan}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${t.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono text-zinc-400">{t.createdAt}</td>
                      <td className="p-3 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<button className="p-1 text-zinc-400 hover:text-white hover:bg-[#20202b] rounded-md transition-colors" />}>
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-[#121217] border-[#272730] text-zinc-200 rounded-xl p-1">
                            <DropdownMenuItem className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2">
                              <Eye className="w-3.5 h-3.5 text-zinc-400" /> View Team
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2">
                              <UserPlus className="w-3.5 h-3.5 text-purple-400" /> Add Members
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#272730]" />
                            <DropdownMenuItem className="text-xs text-rose-400 focus:bg-rose-500/10 cursor-pointer gap-2">
                              <Trash2 className="w-3.5 h-3.5" /> Delete Team
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

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white">Tier Breakdown</h3>
            <div className="relative h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                    {donutData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-white">24</span>
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Teams</span>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#23232b]">
              {donutData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-zinc-300">{item.name}</span>
                  </div>
                  <span className="font-mono text-zinc-400">{item.value} ({item.percentage})</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function TeamsPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading teams & organizations...</div>}>
        <TeamsPageInner />
      </Suspense>
    </AdminShell>
  );
}
