'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileCheck,
  Plus,
  Upload,
  Download,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  ClipboardCheck,
  Code,
  FileText,
  HelpCircle,
  Database,
  Network,
  Calculator,
  BarChart,
  Cpu,
  Bot,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import {
  mockAssessmentsMetrics,
  mockAssessmentsList,
  AssessmentItem,
  AssessmentType,
  AssessmentDifficulty,
  AssessmentStatus
} from '@/lib/mock-data/assessments-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const iconMap: Record<string, React.ElementType> = {
  ClipboardCheck,
  Code,
  FileText,
  HelpCircle,
  Database,
  Network,
  Calculator,
  BarChart,
  Cpu,
  Bot,
};

const typeBadgeStyles: Record<AssessmentType, string> = {
  Quiz: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Assignment: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Test: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Practical: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
};

const difficultyBadgeStyles: Record<AssessmentDifficulty, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Hard: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const statusStyles: Record<AssessmentStatus, string> = {
  Published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Draft: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'In Review': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Archived: 'bg-zinc-800 text-zinc-400 border-zinc-700',
};

function AssessmentsPageInner() {
  const searchParams = useSearchParams();
  const [assessments, setAssessments] = useState<AssessmentItem[]>(mockAssessmentsList);
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('tab') || 'All Assessments');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All Types');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((a) => {
      if (activeTab !== 'All Assessments' && a.status !== activeTab) return false;
      if (typeFilter !== 'All Types' && a.type !== typeFilter) return false;
      if (categoryFilter !== 'All Categories' && a.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.course.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [assessments, activeTab, typeFilter, categoryFilter, searchQuery]);

  const donutData = [
    { name: 'Published', value: 312, percentage: '59.5%', color: '#10b981' },
    { name: 'Drafts', value: 126, percentage: '24.0%', color: '#f59e0b' },
    { name: 'In Review', value: 48, percentage: '9.2%', color: '#3b82f6' },
    { name: 'Archived', value: 38, percentage: '7.3%', color: '#ef4444' },
  ];

  const byTypeProgress = [
    { name: 'Quiz', count: 236, percentage: '45.0%', width: 100 },
    { name: 'Test', count: 162, percentage: '30.9%', width: 68 },
    { name: 'Assignment', count: 116, percentage: '22.1%', width: 49 },
    { name: 'Practical', count: 10, percentage: '1.9%', width: 5 },
  ];

  const topCategories = [
    { name: 'AI / ML', count: 142, percentage: '27.1%', width: 100 },
    { name: 'Data Science', count: 128, percentage: '24.4%', width: 90 },
    { name: 'Programming', count: 96, percentage: '18.3%', width: 67 },
    { name: 'DSA', count: 82, percentage: '15.6%', width: 57 },
    { name: 'Database', count: 40, percentage: '7.6%', width: 28 },
  ];

  const recentActivities = [
    { id: 'act-1', text: 'Assessment "ML Basics Quiz" published by Sarah Johnson', time: '2 hours ago', color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'act-2', text: 'Assessment "Deep Learning MCQ" moved to In Review by Dr. Alex Morgan', time: '4 hours ago', color: 'text-amber-400 bg-amber-500/10' },
    { id: 'act-3', text: 'Assessment "SQL Query Assignment" created by Michael Smith', time: '6 hours ago', color: 'text-purple-400 bg-purple-500/10' },
    { id: 'act-4', text: 'Assessment "Computer Networks Test" archived by Olivia Martinez', time: '1 day ago', color: 'text-rose-400 bg-rose-500/10' },
  ];

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link href="/" className="hover:text-zinc-200 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span>Content & Learning</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">Assessments</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Assessments</h1>
            <FileCheck className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create, manage and evaluate quizzes, tests and assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30">
            <Plus className="w-4 h-4" />
            <span>Create Assessment</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </Button>

          <Button variant="outline" className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>Import</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </Button>

          <Button variant="outline" className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {mockAssessmentsMetrics.map((metric) => (
          <Card key={metric.id} className="bg-[#121217] border border-[#272730] p-4 rounded-xl shadow-sm hover:border-[#3b3b47] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{metric.title}</span>
              <div className="w-8 h-8 rounded-lg border bg-purple-500/10 text-purple-400 border-purple-500/20 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">{metric.value}</span>
              <div className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border text-purple-400 bg-purple-500/10 border-purple-500/20">
                {metric.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                <span>{metric.change}</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 mt-2 font-medium">{metric.period}</p>
          </Card>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Table (Span 3) */}
        <Card className="lg:col-span-3 bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#272730] pb-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {['All Assessments', 'Published', 'Drafts', 'In Review', 'Archived'].map((tab) => (
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
                  placeholder="Search assessments..."
                  className="pl-9 pr-4 py-1.5 h-8 text-xs bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 rounded-lg"
                />
              </div>

              <Button variant="outline" size="sm" className="h-8 text-xs border-[#272730] bg-[#181820] text-zinc-300 gap-1.5">
                <Filter className="w-3.5 h-3.5 text-purple-400" />
                <span>Filters</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-3 bg-[#181820] border border-[#272730] rounded-xl text-xs flex flex-wrap items-center gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none"
            >
              <option value="All Types">All Types</option>
              <option value="Quiz">Quiz</option>
              <option value="Assignment">Assignment</option>
              <option value="Test">Test</option>
              <option value="Practical">Practical</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none"
            >
              <option value="All Categories">All Categories</option>
              <option value="AI / ML">AI / ML</option>
              <option value="DSA">DSA</option>
              <option value="Programming">Programming</option>
              <option value="Database">Database</option>
              <option value="Data Science">Data Science</option>
            </select>

            <button
              onClick={() => {
                setTypeFilter('All Types');
                setCategoryFilter('All Categories');
                setSearchQuery('');
              }}
              className="text-xs text-zinc-400 hover:text-white ml-auto"
            >
              Clear
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#181820] text-zinc-400 font-semibold border-b border-[#272730] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredAssessments.length > 0 && selectedIds.length === filteredAssessments.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(filteredAssessments.map((a) => a.id));
                        else setSelectedIds([]);
                      }}
                      className="rounded border-[#33333d] bg-[#121217] text-purple-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">Assessment</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Questions</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Attempts</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Updated</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23232b]">
                {filteredAssessments.map((a) => {
                  const Icon = iconMap[a.iconName] || FileCheck;
                  const isSelected = selectedIds.includes(a.id);

                  return (
                    <tr key={a.id} className={`hover:bg-[#181820]/60 transition-colors ${isSelected ? 'bg-purple-950/20' : ''}`}>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds((prev) => [...prev, a.id]);
                            else setSelectedIds((prev) => prev.filter((i) => i !== a.id));
                          }}
                          className="rounded border-[#33333d] bg-[#121217] text-purple-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-zinc-100 text-xs truncate leading-tight">{a.name}</p>
                            <p className="text-[11px] text-zinc-500 truncate mt-0.5">{a.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${typeBadgeStyles[a.type]}`}>
                          {a.type}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="bg-[#181820] text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 text-[11px] font-medium">
                          {a.category}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-zinc-300 font-medium">{a.course}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${difficultyBadgeStyles[a.difficulty]}`}>
                          {a.difficulty}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono font-bold text-zinc-300">{a.questionsCount}</td>
                      <td className="p-3 whitespace-nowrap font-mono text-zinc-400">{a.duration}</td>
                      <td className="p-3 whitespace-nowrap font-mono font-bold text-zinc-200">{a.attempts}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[a.status]}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono text-zinc-400">{a.updatedAt}</td>
                      <td className="p-3 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<button className="p-1 text-zinc-400 hover:text-white hover:bg-[#20202b] rounded-md transition-colors" />}>
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-[#121217] border-[#272730] text-zinc-200 rounded-xl p-1">
                            <DropdownMenuItem className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2">
                              <Eye className="w-3.5 h-3.5 text-zinc-400" /> View Questions
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2">
                              <Edit className="w-3.5 h-3.5 text-zinc-400" /> Edit Assessment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#272730]" />
                            <DropdownMenuItem className="text-xs text-emerald-400 focus:bg-emerald-500/10 cursor-pointer gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Publish
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs text-rose-400 focus:bg-rose-500/10 cursor-pointer gap-2">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
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

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#23232b] text-xs text-zinc-400">
            <div>
              Showing <span className="font-semibold text-white font-mono">1</span> to{' '}
              <span className="font-semibold text-white font-mono">{filteredAssessments.length}</span> of{' '}
              <span className="font-semibold text-white font-mono">524</span> assessments
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-[#181820] border-[#272730] text-zinc-300">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <button className="h-8 w-8 rounded-lg font-mono font-bold text-xs bg-purple-600 text-white">1</button>
              <button className="h-8 w-8 rounded-lg font-mono text-xs bg-[#181820] text-zinc-400 border border-[#272730]">2</button>
              <button className="h-8 w-8 rounded-lg font-mono text-xs bg-[#181820] text-zinc-400 border border-[#272730]">3</button>
              <span className="px-1 text-zinc-600">...</span>
              <button className="h-8 px-2 rounded-lg font-mono text-xs bg-[#181820] text-zinc-400 border border-[#272730]">53</button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-[#181820] border-[#272730] text-zinc-300">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          {/* Overview Donut */}
          <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white">Assessment Overview</h3>
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
                <span className="text-2xl font-bold font-mono text-white">524</span>
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Total</span>
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

          {/* By Type */}
          <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">By Type</h3>
              <button className="text-xs font-semibold text-purple-400 hover:text-purple-300">View All</button>
            </div>
            <div className="space-y-3.5 text-xs">
              {byTypeProgress.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-zinc-200">{item.name}</span>
                    <span className="font-mono text-zinc-400 font-bold">{item.count} ({item.percentage})</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${item.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Categories */}
          <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Top Categories</h3>
              <button className="text-xs font-semibold text-purple-400 hover:text-purple-300">View All</button>
            </div>
            <div className="space-y-3.5 text-xs">
              {topCategories.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-zinc-200">{cat.name}</span>
                    <span className="font-mono text-zinc-400 font-bold">{cat.count} ({cat.percentage})</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${cat.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Recent Activity</h3>
              <button className="text-xs font-semibold text-purple-400 hover:text-purple-300">View All</button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/5 mt-0.5 ${act.color}`}>
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-zinc-200 leading-snug">{act.text}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-[#23232b]">
              <button className="w-full text-center text-xs font-semibold text-zinc-300 hover:text-purple-400 flex items-center justify-center gap-1.5 transition-colors group">
                <span>Go to Assessment Analytics</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentsPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading assessments...</div>}>
        <AssessmentsPageInner />
      </Suspense>
    </AdminShell>
  );
}
