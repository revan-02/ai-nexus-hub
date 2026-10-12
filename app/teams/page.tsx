'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Plus,
  Upload,
  Download,
  ChevronRight,
  Search,
  Filter,
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
  ArrowRight,
  UserPlus,
  Sparkles,
  HelpCircle,
  FolderKanban,
  CheckSquare,
  KeyRound,
  X
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

  // Join Team state
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [joinSuccessMsg, setJoinSuccessMsg] = useState<string>('');

  // Create Team modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCategory, setNewTeamCategory] = useState('AI & Machine Learning');

  const [teams, setTeams] = useState<TeamItem[]>([
    { id: 'team-1', name: 'Core AI Infrastructure', code: 'TEAM-AI-01', org: 'AI Application Platform', lead: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }, membersCount: 34, plan: 'Enterprise', status: 'Active', createdAt: 'Jan 15, 2024' },
    { id: 'team-2', name: 'Frontend Design Systems', code: 'TEAM-UI-02', org: 'AI Application Platform', lead: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }, membersCount: 22, plan: 'Enterprise', status: 'Active', createdAt: 'Feb 02, 2024' },
    { id: 'team-3', name: 'Data Pipeline & ETL', code: 'TEAM-DATA-03', org: 'Data Science Hub', lead: { name: 'Michael Smith', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }, membersCount: 18, plan: 'Enterprise', status: 'Active', createdAt: 'Feb 20, 2024' },
    { id: 'team-4', name: 'Security & Compliance', code: 'TEAM-SEC-04', org: 'Security Operations', lead: { name: 'Jessica Lee', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' }, membersCount: 14, plan: 'Pro', status: 'Active', createdAt: 'Mar 10, 2024' },
    { id: 'team-5', name: 'DevOps & Cloud Infra', code: 'TEAM-OPS-05', org: 'Cloud Operations', lead: { name: 'David Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }, membersCount: 26, plan: 'Enterprise', status: 'Active', createdAt: 'Apr 05, 2024' },
    { id: 'team-6', name: 'Mobile App Engineering', code: 'TEAM-MOB-06', org: 'Product Engineering', lead: { name: 'Olivia Martinez', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' }, membersCount: 12, plan: 'Standard', status: 'Inactive', createdAt: 'May 12, 2024' },
  ]);

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

  const handleJoinTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    const matched = teams.find((t) => t.code.toLowerCase() === joinCodeInput.trim().toLowerCase());
    if (matched) {
      setJoinSuccessMsg(`Successfully joined ${matched.name} (${matched.code})!`);
      setJoinCodeInput('');
      setTimeout(() => setJoinSuccessMsg(''), 4000);
    } else {
      setJoinSuccessMsg(`Invite code "${joinCodeInput.trim()}" registered. Waiting for team lead approval.`);
      setJoinCodeInput('');
      setTimeout(() => setJoinSuccessMsg(''), 4000);
    }
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const newCode = `TEAM-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newTeam: TeamItem = {
      id: `team-${Date.now()}`,
      name: newTeamName.trim(),
      code: newCode,
      org: 'Independent Cohort',
      lead: { name: 'You (Team Lead)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      membersCount: 1,
      plan: 'Standard',
      status: 'Active',
      createdAt: 'Just now',
    };

    setTeams([newTeam, ...teams]);
    setIsCreateModalOpen(false);
    setNewTeamName('');
    setJoinSuccessMsg(`Created team "${newTeam.name}"! Share code ${newTeam.code} with your teammates.`);
    setTimeout(() => setJoinSuccessMsg(''), 6000);
  };

  const kpis = [
    { title: 'Total Teams', value: teams.length.toString(), change: '+4 this mo', trend: 'up' },
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
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-purple-400 font-semibold">Team Room & Organizations</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Team Room & Collaboration Hub</h1>
            <Building2 className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Collaborate on capstone projects, manage sprint backlogs, share virtual terminal workspaces, and submit group assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Team</span>
          </Button>

          <Link href="/projects">
            <Button variant="outline" className="bg-secondary border-border hover:bg-secondary/80 text-foreground text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5 cursor-pointer">
              <FolderKanban className="w-3.5 h-3.5 text-purple-400" />
              <span>Project Marketplace</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* BEGINNER-FRIENDLY QUICKSTART GUIDE */}
      <Card className="p-5 sm:p-6 bg-gradient-to-br from-purple-950/40 via-card to-indigo-950/30 border-purple-500/30 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm font-bold text-foreground">Beginner Guide: How Team Rooms Work</h2>
          </div>
          <span className="text-[11px] font-mono font-bold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
            4-Step Collaboration Workflow
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center font-mono text-[11px]">1</span>
              <span>Create a Team</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Click &quot;Create New Team&quot;, enter your team name, pick your project focus, and generate a unique 6-character team invite code.
            </p>
          </div>

          <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center font-mono text-[11px]">2</span>
              <span>Join a Team</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Have an invite code from a classmate? Enter it below in the &quot;Join by Invite Code&quot; box to be instantly added to their shared room.
            </p>
          </div>

          <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center font-mono text-[11px]">3</span>
              <span>Start a Project</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Browse the Project Marketplace, pick any Free or Premium codebase, and click &quot;Enter Collaborative Team Room&quot; to begin building together.
            </p>
          </div>

          <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center font-mono text-[11px]">4</span>
              <span>Manage Tasks</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Break work into sprint backlog tickets, assign roles, track pull requests, and review expected output before final submission.
            </p>
          </div>
        </div>

        {/* JOIN BY INVITE CODE BAR */}
        <form onSubmit={handleJoinTeam} className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <Input
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              placeholder="Enter 6-character Team Invite Code (e.g., TEAM-AI-01)..."
              className="pl-10 bg-secondary/80 border-border text-foreground text-xs h-10 rounded-xl w-full font-mono uppercase"
            />
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 px-5 rounded-xl gap-2 cursor-pointer shadow-md shadow-purple-900/30"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join Team Room</span>
          </Button>
        </form>

        {joinSuccessMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{joinSuccessMsg}</span>
          </div>
        )}
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((metric, i) => (
          <Card key={i} className="bg-card border-border p-4 rounded-xl shadow-sm hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{metric.title}</span>
              <div className="w-8 h-8 rounded-lg border bg-purple-500/10 text-purple-400 border-purple-500/20 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono">{metric.value}</span>
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
        <Card className="lg:col-span-3 bg-card border-border p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {['All Teams', 'Active', 'Inactive', 'Archived'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all relative cursor-pointer ${
                    activeTab === tab
                      ? 'text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-purple-500 rounded-full" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search teams or invite codes..."
                  className="pl-9 pr-4 py-1.5 h-8 text-xs bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-lg"
                />
              </div>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="h-8 px-2.5 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none"
              >
                <option value="All Plans">All Plans</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Pro">Pro</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          {filteredTeams.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-muted-foreground">
                <thead className="bg-secondary/60 text-muted-foreground font-semibold border-b border-border uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={filteredTeams.length > 0 && selectedIds.length === filteredTeams.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds(filteredTeams.map((t) => t.id));
                          else setSelectedIds([]);
                        }}
                        className="rounded border-border bg-card text-purple-600 cursor-pointer"
                      />
                    </th>
                    <th className="p-3">Team & Code</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Team Lead</th>
                    <th className="p-3">Members</th>
                    <th className="p-3">Plan Tier</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Created</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredTeams.map((t) => {
                    const isSelected = selectedIds.includes(t.id);
                    return (
                      <tr key={t.id} className={`hover:bg-secondary/40 transition-colors ${isSelected ? 'bg-purple-950/20' : ''}`}>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedIds((prev) => [...prev, t.id]);
                              else setSelectedIds((prev) => prev.filter((id) => id !== t.id));
                            }}
                            className="rounded border-border bg-card text-purple-600 cursor-pointer"
                          />
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-foreground text-xs">{t.name}</div>
                          <span className="font-mono text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                            {t.code}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{t.org}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={t.lead.avatar} />
                              <AvatarFallback className="text-[9px]">{t.lead.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-foreground font-medium">{t.lead.name}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-foreground font-semibold">{t.membersCount}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            t.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            t.plan === 'Pro' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {t.plan}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            t.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            t.status === 'Inactive' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-muted text-muted-foreground border-border'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-muted-foreground">{t.createdAt}</td>
                        <td className="p-3 text-right">
                          <Link href={`/projects/prj-1/collaborate`}>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5 rounded-lg border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white cursor-pointer">
                              Enter Room
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* HELPFUL EMPTY STATE */
            <div className="py-12 px-4 text-center space-y-4 bg-secondary/20 rounded-2xl border border-dashed border-border">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">No Teams Found Matching Your Criteria</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  We could not find any teams matching &quot;{searchQuery}&quot;. You can clear your filters, or create a new team to begin collaborating right away!
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  onClick={() => { setSearchQuery(''); setPlanFilter('All Plans'); setActiveTab('All Teams'); }}
                  variant="outline"
                  className="text-xs h-9 px-4 rounded-xl cursor-pointer"
                >
                  Clear Filters
                </Button>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Create Team
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Analytics Card (Span 1) */}
        <div className="space-y-6">
          <Card className="p-5 bg-card border-border rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-3">Plan Distribution</h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs">
              {donutData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                  <span className="font-mono text-muted-foreground">{item.value} ({item.percentage})</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* CREATE TEAM MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" /> Create New Team Room
              </h3>
              <p className="text-xs text-muted-foreground">
                Set up a shared project team for your sprint group or classroom cohort.
              </p>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Team Name</label>
                <Input
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Vision Transformers Research Group"
                  className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Specialization Category</label>
                <select
                  value={newTeamCategory}
                  onChange={(e) => setNewTeamCategory(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl text-xs h-9 px-3 text-foreground focus:outline-none"
                >
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Generative AI & LLMs">Generative AI & LLMs</option>
                  <option value="Web Development & Full-Stack">Web Development & Full-Stack</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="Mobile Applications">Mobile Applications</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 text-xs h-9 rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 rounded-xl cursor-pointer"
                >
                  Create Team
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeamsPage() {
  return (
    <NexusShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading teams & organizations...</div>}>
        <TeamsPageInner />
      </Suspense>
    </NexusShell>
  );
}
