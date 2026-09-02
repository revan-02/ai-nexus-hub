'use client';

import React from 'react';
import { Search, Filter, RotateCw, ListFilter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ContentTableToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  authorFilter: string;
  onAuthorFilterChange: (author: string) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function ContentTableToolbar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  filtersOpen,
  onToggleFilters,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  statusFilter,
  onStatusFilterChange,
  authorFilter,
  onAuthorFilterChange,
  onClearFilters,
  onRefresh,
  isRefreshing = false,
}: ContentTableToolbarProps) {
  const tabs = ['All Content', 'Published', 'Drafts', 'Pending Review', 'Archived', 'Rejected'];

  const hasActiveFilters =
    typeFilter !== 'All Types' ||
    categoryFilter !== 'All Categories' ||
    statusFilter !== 'All Status' ||
    authorFilter !== 'All Authors';

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
              placeholder="Search content..."
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

          {/* View Mode Toggle */}
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
            title="Refresh Content"
            className="h-8 w-8 border-[#272730] bg-[#181820] text-zinc-300 hover:bg-[#20202b]"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {filtersOpen && (
        <div className="p-4 bg-[#181820] border border-[#272730] rounded-xl text-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-in fade-in duration-150">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Content Type</label>
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All Types">All Types</option>
              <option value="Course">Course</option>
              <option value="Article">Article</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Dataset">Dataset</option>
              <option value="Video">Video</option>
              <option value="Quiz">Quiz</option>
              <option value="Guide">Guide</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All Categories">All Categories</option>
              <option value="AI & ML">AI & ML</option>
              <option value="Deep Learning">Deep Learning</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Programming">Programming</option>
              <option value="Projects">Projects</option>
              <option value="Assessments">Assessments</option>
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
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Archived">Archived</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Author</label>
            <select
              value={authorFilter}
              onChange={(e) => onAuthorFilterChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All Authors">All Authors</option>
              <option value="Dr. Alex Morgan">Dr. Alex Morgan</option>
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Michael Smith">Michael Smith</option>
              <option value="Emily Davis">Emily Davis</option>
              <option value="David Wilson">David Wilson</option>
              <option value="Jessica Lee">Jessica Lee</option>
              <option value="Daniel Brown">Daniel Brown</option>
              <option value="Olivia Martinez">Olivia Martinez</option>
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
