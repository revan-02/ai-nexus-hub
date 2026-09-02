'use client';

import React from 'react';
import { Search, Filter, RotateCw, ListFilter, X, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserRole, UserStatus } from '@/lib/mock-data/users-data';

interface UserTableToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  orgFilter: string;
  onOrgFilterChange: (org: string) => void;
  verifiedFilter: string;
  onVerifiedFilterChange: (verified: string) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function UserTableToolbar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  filtersOpen,
  onToggleFilters,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  orgFilter,
  onOrgFilterChange,
  verifiedFilter,
  onVerifiedFilterChange,
  onClearFilters,
  onRefresh,
  isRefreshing = false,
}: UserTableToolbarProps) {
  const tabs = ['All Users', 'Active', 'Inactive', 'Pending', 'Suspended', 'Deleted'];

  const hasActiveFilters =
    roleFilter !== 'All Roles' ||
    statusFilter !== 'All Status' ||
    orgFilter !== 'All Organizations' ||
    verifiedFilter !== 'All';

  return (
    <div className="space-y-4">
      {/* Top Toolbar Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#272730] pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all relative ${
                  isActive
                    ? 'text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181820]'
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-purple-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Search & Controls */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-4 py-1.5 h-8 text-xs bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-purple-500 rounded-lg"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filters Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            className={`h-8 text-xs gap-1.5 border-[#272730] bg-[#181820] hover:bg-[#20202b] ${
              filtersOpen || hasActiveFilters ? 'border-purple-500/40 text-purple-300' : 'text-zinc-300'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            )}
          </Button>

          {/* View Toggle Icon */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-[#272730] bg-[#181820] text-zinc-300 hover:bg-[#20202b]"
          >
            <ListFilter className="w-3.5 h-3.5" />
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            title="Refresh Users List"
            className="h-8 w-8 border-[#272730] bg-[#181820] text-zinc-300 hover:bg-[#20202b]"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Advanced Filter Bar (Collapsible) */}
      {filtersOpen && (
        <div className="p-4 bg-[#181820] border border-[#272730] rounded-xl text-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-in fade-in duration-150">
          {/* Role Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All Roles">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Editor">Editor</option>
              <option value="Instructor">Instructor</option>
              <option value="Analyst">Analyst</option>
              <option value="Moderator">Moderator</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Deleted">Deleted</option>
            </select>
          </div>

          {/* Organization Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Organization</label>
            <select
              value={orgFilter}
              onChange={(e) => onOrgFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All Organizations">All Organizations</option>
              <option value="AI Research Lab">AI Research Lab</option>
              <option value="Data Science Team">Data Science Team</option>
              <option value="Content Team">Content Team</option>
              <option value="AI Learning Program">AI Learning Program</option>
              <option value="Analytics Team">Analytics Team</option>
              <option value="Community Team">Community Team</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Email Verified Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Email Verified</label>
            <select
              value={verifiedFilter}
              onChange={(e) => onVerifiedFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All</option>
              <option value="Verified">Verified</option>
              <option value="Not Verified">Not Verified</option>
            </select>
          </div>

          {/* Clear Button */}
          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="w-full h-8 text-xs border-[#272730] bg-[#121217] hover:bg-[#20202b] text-zinc-300"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
