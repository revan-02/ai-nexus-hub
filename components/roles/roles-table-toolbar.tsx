'use client';

import React from 'react';
import { Search, Filter, RotateCw, ListFilter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RolesTableToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function RolesTableToolbar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  filtersOpen,
  onToggleFilters,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  onRefresh,
  isRefreshing = false,
}: RolesTableToolbarProps) {
  const tabs = ['All Roles', 'System Roles', 'Custom Roles', 'Inactive Roles'];

  const hasActiveFilters = typeFilter !== 'All Types' || statusFilter !== 'All Status';

  return (
    <div className="space-y-4">
      {/* Top Toolbar Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#272730] pb-3">
        {/* Role Tabs */}
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
              placeholder="Search roles..."
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

          {/* Filters Toggle */}
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

          {/* View Toggle */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-[#272730] bg-[#181820] text-zinc-300 hover:bg-[#20202b]"
          >
            <ListFilter className="w-3.5 h-3.5" />
          </Button>

          {/* Refresh */}
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            title="Refresh Roles List"
            className="h-8 w-8 border-[#272730] bg-[#181820] text-zinc-300 hover:bg-[#20202b]"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="p-4 bg-[#181820] border border-[#272730] rounded-xl text-xs grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Role Type</label>
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All Types">All Types</option>
              <option value="System">System Roles</option>
              <option value="Custom">Custom Roles</option>
            </select>
          </div>

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
            </select>
          </div>

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
