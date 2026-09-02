'use client';

import React from 'react';
import { Search, Filter, RotateCw, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PermissionsTableToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  moduleFilter: string;
  onModuleFilterChange: (mod: string) => void;
  resourceFilter: string;
  onResourceFilterChange: (res: string) => void;
  actionFilter: string;
  onActionFilterChange: (act: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function PermissionsTableToolbar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  filtersOpen,
  onToggleFilters,
  moduleFilter,
  onModuleFilterChange,
  resourceFilter,
  onResourceFilterChange,
  actionFilter,
  onActionFilterChange,
  typeFilter,
  onTypeFilterChange,
  onClearFilters,
  onRefresh,
  isRefreshing = false,
}: PermissionsTableToolbarProps) {
  const tabs = ['Permission Matrix', 'Permissions List', 'Custom Permissions', 'Permission Groups'];

  const hasActiveFilters =
    moduleFilter !== 'All Modules' ||
    resourceFilter !== 'All Resources' ||
    actionFilter !== 'All Actions' ||
    typeFilter !== 'All Types';

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
              placeholder="Search modules or permissions..."
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

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            title="Refresh Permissions Data"
            className="h-8 w-8 border-[#272730] bg-[#181820] text-zinc-300 hover:bg-[#20202b]"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filter Panel (Collapsible) */}
      {filtersOpen && (
        <div className="p-4 bg-[#181820] border border-[#272730] rounded-xl text-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-in fade-in duration-150">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Module</label>
            <select
              value={moduleFilter}
              onChange={(e) => onModuleFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All Modules">All Modules</option>
              <option value="User Management">User Management</option>
              <option value="Content Management">Content Management</option>
              <option value="Courses">Courses</option>
              <option value="Projects">Projects</option>
              <option value="Assessments">Assessments</option>
              <option value="AI">AI Control Center</option>
              <option value="Communication">Communication</option>
              <option value="System">System</option>
              <option value="Security">Security</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Resource</label>
            <select
              value={resourceFilter}
              onChange={(e) => onResourceFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All Resources">All Resources</option>
              <option value="Users">Users</option>
              <option value="Roles">Roles</option>
              <option value="Permissions">Permissions</option>
              <option value="Sessions">Sessions</option>
              <option value="Content">Content</option>
              <option value="Courses">Courses</option>
              <option value="Projects">Projects</option>
              <option value="Reports">Reports</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => onActionFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All Actions">All Actions</option>
              <option value="View">View</option>
              <option value="Create">Create</option>
              <option value="Edit">Edit</option>
              <option value="Delete">Delete</option>
              <option value="Manage">Manage</option>
              <option value="Export">Export</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Permission Type</label>
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All Types">All Types</option>
              <option value="System">System</option>
              <option value="Custom">Custom</option>
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
