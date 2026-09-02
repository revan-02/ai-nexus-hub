'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Lock,
  RefreshCw,
  Download,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  ShieldAlert,
  Monitor,
  Smartphone,
  Globe,
  Clock,
  Key,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ArrowRight
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

import { useSessions, useRevokeSession, useRevokeAllSessions } from '@/hooks/api/use-sessions';
import { SessionItem, SessionStatus } from '@/types/session';

function SessionsPageInner() {
  const searchParams = useSearchParams();
  const { data: apiResponse, refetch } = useSessions({ page: 1, limit: 100 });
  const revokeSessionMutation = useRevokeSession();
  const revokeAllSessionsMutation = useRevokeAllSessions();

  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('tab') || 'All Sessions');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [localSessions, setLocalSessions] = useState<SessionItem[] | null>(null);

  const fallbackSessions: SessionItem[] = [
    { id: 'sess-1', userId: 'usr-1', user: { name: 'Sarah Johnson', email: 'sarah@nexus.ai', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }, ip: '192.168.1.10', location: 'Bengaluru, India', device: 'Chrome on macOS', authMethod: '2FA / SSO', duration: '2h 45m', status: 'Active', lastActive: '2 mins ago', createdAt: '', updatedAt: '' },
    { id: 'sess-2', userId: 'usr-9', user: { name: 'John Doe', email: 'john.doe@example.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' }, ip: '104.28.14.2', location: 'New York, USA', device: 'Safari on macOS', authMethod: 'Password + 2FA', duration: '1h 12m', status: 'Active', lastActive: '5 mins ago', createdAt: '', updatedAt: '' },
    { id: 'sess-3', userId: 'usr-2', user: { name: 'Dr. Alex Morgan', email: 'alex@nexus.ai', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }, ip: '82.165.197.1', location: 'Berlin, Germany', device: 'Firefox on Linux', authMethod: 'Password', duration: '4h 20m', status: 'Idle', lastActive: '22 mins ago', createdAt: '', updatedAt: '' },
  ];

  const sessions: SessionItem[] = useMemo(() => {
    if (localSessions) return localSessions;
    if (apiResponse?.data && apiResponse.data.length > 0) {
      return apiResponse.data.map((s: any) => ({
        ...s,
        user: {
          id: s.user?.id || 'usr-1',
          name: s.user?.name || 'Unknown User',
          email: s.user?.email || 'user@nexus.ai',
          avatar: s.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        },
      }));
    }
    return fallbackSessions;
  }, [apiResponse, localSessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (activeTab !== 'All Sessions' && s.status !== activeTab) return false;
      if (statusFilter !== 'All Status' && s.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          s.user.name.toLowerCase().includes(q) ||
          s.user.email.toLowerCase().includes(q) ||
          s.ip.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.device.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sessions, activeTab, statusFilter, searchQuery]);


  const kpis = [
    { title: 'Active Sessions', value: '142', change: '+12 online', trend: 'up' },
    { title: 'Unique Devices', value: '98', change: '65% Desktop', trend: 'up' },
    { title: 'Concurrent Logins', value: '34', change: 'Normal', trend: 'up' },
    { title: 'Flagged Locations', value: '3', change: 'Requires Action', trend: 'down' },
    { title: 'Revoked Today', value: '12', change: 'Security Auto', trend: 'up' },
    { title: 'Avg Session Time', value: '42m', change: 'Optimal', trend: 'up' },
  ];

  const donutDevice = [
    { name: 'Desktop (macOS / Win)', value: 65, percentage: '65%', color: '#8b5cf6' },
    { name: 'Mobile (iOS / Android)', value: 28, percentage: '28%', color: '#3b82f6' },
    { name: 'Tablet / Other', value: 7, percentage: '7%', color: '#10b981' },
  ];

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link href="/" className="hover:text-zinc-200 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span>User & Access</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">Sessions & Access</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Sessions & Access Logs</h1>
            <Lock className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Monitor active user sessions, security access tokens, device footprints and revocation policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-rose-900/30">
            <LogOut className="w-4 h-4" />
            <span>Revoke All Sessions</span>
          </Button>

          <Button variant="outline" className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export Logs</span>
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
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">{metric.value}</span>
              <div className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border text-purple-400 bg-purple-500/10 border-purple-500/20">
                <span>{metric.change}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Table (Span 3) */}
        <Card className="lg:col-span-3 bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#272730] pb-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {['All Sessions', 'Active', 'Idle', 'Flagged', 'Revoked'].map((tab) => (
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
                  placeholder="Search user, IP, location..."
                  className="pl-9 pr-4 py-1.5 h-8 text-xs bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 rounded-lg"
                />
              </div>
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
                      checked={filteredSessions.length > 0 && selectedIds.length === filteredSessions.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(filteredSessions.map((s) => s.id));
                        else setSelectedIds([]);
                      }}
                      className="rounded border-[#33333d] bg-[#121217] text-purple-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">User</th>
                  <th className="p-3">IP Address & Location</th>
                  <th className="p-3">Device / Browser</th>
                  <th className="p-3">Auth Method</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Active</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23232b]">
                {filteredSessions.map((s) => {
                  const isSelected = selectedIds.includes(s.id);
                  return (
                    <tr key={s.id} className={`hover:bg-[#181820]/60 transition-colors ${isSelected ? 'bg-purple-950/20' : ''}`}>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds((prev) => [...prev, s.id]);
                            else setSelectedIds((prev) => prev.filter((i) => i !== s.id));
                          }}
                          className="rounded border-[#33333d] bg-[#121217] text-purple-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-7 h-7 border border-purple-500/30">
                            <AvatarImage src={s.user.avatar} alt={s.user.name} />
                            <AvatarFallback className="bg-purple-950 text-purple-300 font-bold text-xs">{s.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-bold text-zinc-100 text-xs truncate leading-tight">{s.user.name}</p>
                            <p className="text-[10px] text-zinc-500 truncate mt-0.5">{s.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <p className="font-mono text-zinc-200 font-bold">{s.ip}</p>
                        <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Globe className="w-3 h-3 text-purple-400" /> {s.location}
                        </p>
                      </td>
                      <td className="p-3 whitespace-nowrap font-medium text-zinc-300 flex items-center gap-1.5 pt-4">
                        <Monitor className="w-3.5 h-3.5 text-blue-400" />
                        {s.device}
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono text-zinc-300">
                        <span className="px-2 py-0.5 bg-[#181820] border border-[#272730] rounded text-[10px]">
                          {s.authMethod}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono font-bold text-zinc-300">{s.duration}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          s.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                          s.status === 'Idle' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                          s.status === 'Flagged' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse' :
                          'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono text-zinc-400">{s.lastActive}</td>
                      <td className="p-3 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<button className="p-1 text-zinc-400 hover:text-white hover:bg-[#20202b] rounded-md transition-colors" />}>
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-[#121217] border-[#272730] text-zinc-200 rounded-xl p-1">
                            <DropdownMenuItem className="text-xs text-rose-400 focus:bg-rose-500/10 cursor-pointer gap-2">
                              <LogOut className="w-3.5 h-3.5" /> Terminate Session
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs text-zinc-300 focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2">
                              <Globe className="w-3.5 h-3.5 text-zinc-400" /> View IP Geolocation
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
            <h3 className="text-sm font-bold text-white">Device Footprint</h3>
            <div className="relative h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutDevice} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                    {donutDevice.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-white">142</span>
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Sessions</span>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#23232b]">
              {donutDevice.map((item) => (
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
    </div>
  );
}

export default function SessionsPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading sessions & access...</div>}>
        <SessionsPageInner />
      </Suspense>
    </AdminShell>
  );
}
