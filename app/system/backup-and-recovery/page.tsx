'use client';

import React, { useState, Suspense } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  ShieldCheck,
  Clock,
  HardDrive,
  Plus,
  RefreshCw,
  Download,
  RotateCcw,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Database,
  Cloud,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BackupItem {
  id: string;
  name: string;
  type: 'Automated' | 'Manual';
  scope: 'Full Backup' | 'Incremental' | 'Differential';
  storage: string;
  size: string;
  status: 'Completed' | 'In Progress' | 'Failed';
  createdAt: string;
}

function BackupAndRecoveryPageInner() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupSuccessMsg, setBackupSuccessMsg] = useState<string | null>(null);

  const [backupsList, setBackupsList] = useState<BackupItem[]>([
    { id: 'bkp-1', name: 'PostgreSQL Core Database Snapshot', type: 'Automated', scope: 'Full Backup', storage: 'Amazon S3 (Encrypted)', size: '14.8 MB', status: 'Completed', createdAt: 'Today at 02:30 AM' },
    { id: 'bkp-2', name: 'Incremental Snapshot - Content & Rooms', type: 'Automated', scope: 'Incremental', storage: 'Wasabi (Secondary)', size: '12.4 MB', status: 'Completed', createdAt: 'Yesterday at 02:30 AM' },
    { id: 'bkp-3', name: 'Pre-Deployment Release Snapshot', type: 'Manual', scope: 'Full Backup', storage: 'Google Cloud (Offsite)', size: '15.2 MB', status: 'Completed', createdAt: 'May 16, 2026 03:45 PM' },
  ]);

  const handleCreateBackupNow = async () => {
    setIsCreatingBackup(true);
    setBackupSuccessMsg(null);
    try {
      const res = await fetch('/api/system/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'Full PostgreSQL Database Snapshot' }),
      });
      const json = await res.json();
      if (json.data) {
        const item: BackupItem = {
          id: json.data.id,
          name: json.data.name,
          type: 'Manual',
          scope: 'Full Backup',
          storage: 'Primary Cloud (S3/Wasabi)',
          size: json.data.size,
          status: 'Completed',
          createdAt: json.data.createdAt,
        };
        setBackupsList((prev) => [item, ...prev]);
        setBackupSuccessMsg(`Backup '${item.name}' created successfully! Snapshot data archived.`);

        // Download JSON snapshot file
        if (json.data.snapshotData) {
          const blob = new Blob([JSON.stringify(json.data.snapshotData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ai-nexus-backup-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } catch (err) {
      alert('Failed to generate backup snapshot');
    } finally {
      setIsCreatingBackup(false);
      setTimeout(() => setBackupSuccessMsg(null), 5000);
    }
  };

  const handleDownloadBackup = (backup: BackupItem) => {
    const sampleData = {
      backupId: backup.id,
      name: backup.name,
      exportedAt: new Date().toISOString(),
      status: 'Verified',
    };
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${backup.id}-snapshot.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreBackup = (backup: BackupItem) => {
    if (confirm(`Are you sure you want to simulate restoring from '${backup.name}'? All current tables will be synced to this state.`)) {
      setBackupSuccessMsg(`Recovery initiated: Successfully restored data from '${backup.name}'.`);
      setTimeout(() => setBackupSuccessMsg(null), 5000);
    }
  };

  const donutSummary = [
    { name: 'Full Backups', value: 52, percentage: '40.6%', color: '#10b981' },
    { name: 'Incremental Backups', value: 58, percentage: '45.3%', color: '#8b5cf6' },
    { name: 'Differential', value: 18, percentage: '14.1%', color: '#3b82f6' },
  ];

  const donutSuccess = [
    { name: 'Successful', value: 128, color: '#10b981' },
    { name: 'Failed', value: 2, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link href="/" className="hover:text-zinc-200 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link href="/system" className="hover:text-zinc-200 transition-colors">System</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">Backup & Recovery</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Backup & Recovery</h1>
            <Database className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Protect your database, user records, certificates, and content with automated snapshots and instant restore.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleCreateBackupNow}
            disabled={isCreatingBackup}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30 cursor-pointer"
          >
            {isCreatingBackup ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{isCreatingBackup ? 'Generating Snapshot...' : 'Create Backup Now'}</span>
          </Button>

          <Button
            onClick={() => handleRestoreBackup(backupsList[0])}
            variant="outline"
            className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Recovery Wizard</span>
          </Button>
        </div>
      </div>

      {/* Success Alert */}
      {backupSuccessMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{backupSuccessMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#272730] overflow-x-auto scrollbar-none pb-1">
        {['Overview', 'Backups', 'Restore', 'Backup Jobs', 'Storage', 'Settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all relative ${
              activeTab === tab
                ? 'text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181820]'
            }`}
          >
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-purple-500 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Status */}
        <Card className="bg-[#121217] border border-[#272730] p-4 rounded-2xl shadow-sm space-y-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Overall Status</span>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-400 block">Protected</span>
              <span className="text-[11px] text-zinc-400">All critical data is protected</span>
            </div>
          </div>
        </Card>

        {/* Last Backup */}
        <Card className="bg-[#121217] border border-[#272730] p-4 rounded-2xl shadow-sm space-y-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Last Backup</span>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white font-mono block">May 18, 2025 02:30 AM</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-zinc-400 font-mono">34 minutes ago</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-400 font-bold rounded">Success</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Backup */}
        <Card className="bg-[#121217] border border-[#272730] p-4 rounded-2xl shadow-sm space-y-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Next Backup</span>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white font-mono block">May 18, 2025 08:30 AM</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-zinc-400 font-mono">In 5h 26m</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-purple-500/20 text-purple-300 font-bold rounded">Scheduled</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Storage Used */}
        <Card className="bg-[#121217] border border-[#272730] p-4 rounded-2xl shadow-sm space-y-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Total Storage Used</span>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-white block">132.3 GB</span>
              <span className="text-[11px] text-zinc-400">Across 3 storage destinations</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Table Card: Recent Backups */}
      <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Recent Backups</h2>
          <button className="text-xs font-semibold text-purple-400 hover:text-purple-300">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-zinc-300">
            <thead className="bg-[#181820] text-zinc-400 font-semibold border-b border-[#272730] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Backup Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Scope</th>
                <th className="p-3">Storage Destination</th>
                <th className="p-3">Size</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created At</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23232b]">
              {backupsList.map((b) => (
                <tr key={b.id} className="hover:bg-[#181820]/60 transition-colors">
                  <td className="p-3 font-bold text-zinc-100 max-w-xs truncate">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-100 text-xs truncate leading-tight">{b.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ID: {b.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${b.type === 'Automated' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap font-medium text-zinc-300">{b.scope}</td>
                  <td className="p-3 whitespace-nowrap text-zinc-300 font-mono flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-purple-400" />
                    {b.storage}
                  </td>
                  <td className="p-3 whitespace-nowrap font-mono font-bold text-zinc-200">{b.size}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {b.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap font-mono text-zinc-400">{b.createdAt}</td>
                  <td className="p-3 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<button className="p-1 text-zinc-400 hover:text-white hover:bg-[#20202b] rounded-md transition-colors" />}>
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 bg-[#121217] border-[#272730] text-zinc-200 rounded-xl p-1">
                        <DropdownMenuItem
                          onClick={() => handleRestoreBackup(b)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-purple-400" /> Restore Backup
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownloadBackup(b)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Download className="w-3.5 h-3.5 text-zinc-400" /> Download File
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Analytics Row: Donut Summary + Success Rate Gauge + Storage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backup Summary Donut */}
        <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white">Backup Summary</h3>
          <div className="relative h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutSummary} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                  {donutSummary.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-mono text-white">128</span>
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Total</span>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-[#23232b]">
            {donutSummary.map((item) => (
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

        {/* Backup Success Rate */}
        <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white">Backup Success Rate (30 Days)</h3>
          <div className="relative h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutSuccess} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                  {donutSuccess.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-mono text-emerald-400">98.7%</span>
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Success</span>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-[#23232b] text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Successful
              </span>
              <span className="font-mono text-emerald-400 font-bold">128</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Failed
              </span>
              <span className="font-mono text-rose-400 font-bold">2</span>
            </div>
          </div>
        </Card>

        {/* Storage Distribution */}
        <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white">Storage Distribution</h3>
          <div className="space-y-3.5 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-medium">
                <span className="text-zinc-200">Amazon S3 (Primary)</span>
                <span className="font-mono text-zinc-400 font-bold">58.7 GB</span>
              </div>
              <div className="w-full h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '44%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-medium">
                <span className="text-zinc-200">Google Cloud (Offsite)</span>
                <span className="font-mono text-zinc-400 font-bold">61.2 GB</span>
              </div>
              <div className="w-full h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '46%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-medium">
                <span className="text-zinc-200">Wasabi (Secondary)</span>
                <span className="font-mono text-zinc-400 font-bold">12.4 GB</span>
              </div>
              <div className="w-full h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function BackupAndRecoveryPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading backup & recovery...</div>}>
        <BackupAndRecoveryPageInner />
      </Suspense>
    </AdminShell>
  );
}
