'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ChevronRight, RefreshCw, ChevronLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  type: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const TYPE_COLORS: Record<string, string> = {
  LOGIN: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  LOGOUT: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25',
  PROFILE_UPDATE: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  PASSWORD_CHANGE: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  ADMIN_ACTION: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  SECURITY_ACTION: 'bg-red-500/15 text-red-400 border-red-500/25',
  FILE_UPLOAD: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  RESOURCE_ACCESS: 'bg-teal-500/15 text-teal-400 border-teal-500/25',
};

function getTypeColor(type: string): string {
  return TYPE_COLORS[type] || 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25';
}

const ACTION_COLOR: Record<string, string> = {
  LOGIN: 'text-emerald-400',
  LOGOUT: 'text-zinc-400',
  CREATE: 'text-teal-400',
  UPDATE: 'text-blue-400',
  DELETE: 'text-rose-400',
  ADMIN: 'text-purple-400',
  PASSWORD: 'text-orange-400',
  SECURITY: 'text-red-400',
};

function getActionColor(action: string): string {
  for (const [key, color] of Object.entries(ACTION_COLOR)) {
    if (action.toUpperCase().includes(key)) return color;
  }
  return 'text-zinc-300';
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = useCallback(async (page = 1, type = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20', order: 'desc' });
      if (type) params.set('type', type);
      const res = await fetch(`/api/admin/audit-logs?${params}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || `Failed to load audit logs (${res.status})`);
        return;
      }
      const data = await res.json();
      setLogs(data.data || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
    } catch (e) {
      setError('Network error — could not load audit logs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(1, typeFilter);
  }, [fetchLogs, typeFilter]);

  const filteredLogs = searchQuery
    ? logs.filter(l =>
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.target?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : logs;

  return (
    <AdminShell>
      <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <Link href="/users" className="hover:text-zinc-200">Admin</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span>Security &amp; Audit</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-purple-400 font-semibold">Audit Logs</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Audit &amp; Compliance Logs <FileText className="w-6 h-6 text-purple-400" />
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time record of authenticated user activity — {pagination.total} total events.
            </p>
          </div>
          <Button
            onClick={() => fetchLogs(pagination.page, typeFilter)}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-9 px-4 rounded-xl gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by action, user, target..."
              className="pl-9 bg-[#121217] border-[#272730] text-zinc-200 text-xs h-9 rounded-xl"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); fetchLogs(1, e.target.value); }}
            className="bg-[#121217] border border-[#272730] text-zinc-200 text-xs h-9 rounded-xl px-3"
          >
            <option value="">All Types</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="PROFILE_UPDATE">PROFILE_UPDATE</option>
            <option value="PASSWORD_CHANGE">PASSWORD_CHANGE</option>
            <option value="ADMIN_ACTION">ADMIN_ACTION</option>
            <option value="SECURITY_ACTION">SECURITY_ACTION</option>
            <option value="FILE_UPLOAD">FILE_UPLOAD</option>
            <option value="RESOURCE_ACCESS">RESOURCE_ACCESS</option>
          </select>
        </div>

        {/* Error state */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-semibold">
            {error}
          </div>
        )}

        {/* Table */}
        <Card className="bg-[#121217] border-[#272730] p-0 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#181820] text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target / Resource</th>
                  <th className="p-3">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23232b]">
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      <RefreshCw className="w-5 h-5 animate-spin inline mr-2" />
                      Loading audit logs...
                    </td>
                  </tr>
                )}
                {!isLoading && filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      {error ? 'Could not load logs.' : 'No audit logs found. Activity will appear here as users interact with the platform.'}
                    </td>
                  </tr>
                )}
                {!isLoading && filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#181820]/60">
                    <td className="p-3 font-mono text-zinc-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{log.user?.name || 'System'}</div>
                      <div className="text-[10px] text-zinc-500">{log.user?.email || '—'}</div>
                    </td>
                    <td className={`p-3 font-mono font-bold ${getActionColor(log.action)}`}>
                      {log.action}
                    </td>
                    <td className="p-3 text-zinc-400 max-w-[200px] truncate font-mono text-[11px]">
                      {log.target || '—'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${getTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-[#272730] flex items-center justify-between text-xs text-zinc-400">
              <span>
                Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.page <= 1 || isLoading}
                  onClick={() => fetchLogs(pagination.page - 1, typeFilter)}
                  className="h-7 px-2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-mono">Page {pagination.page} / {pagination.totalPages}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  onClick={() => fetchLogs(pagination.page + 1, typeFilter)}
                  className="h-7 px-2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminShell>
  );
}
