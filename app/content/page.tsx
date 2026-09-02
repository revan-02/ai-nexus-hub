'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { ContentMetricsGrid } from '@/components/content/content-metrics-grid';
import { ContentTableToolbar } from '@/components/content/content-table-toolbar';
import { ContentTable } from '@/components/content/content-table';
import { ContentOverviewCard } from '@/components/content/content-overview-card';
import { TopCategoriesCard } from '@/components/content/top-categories-card';
import { RecentContentActivityCard } from '@/components/content/recent-content-activity-card';
import { CreateContentModal } from '@/components/content/create-content-modal';
import { ContentDetailDrawer } from '@/components/content/content-detail-drawer';
import { ContentBulkActionBar } from '@/components/content/content-bulk-action-bar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Download, Upload, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import { mockContentList } from '@/lib/mock-data/content-data';
import { ContentItem, ContentStatus } from '@/types/content';
import { useContents, useCreateContent, useDeleteContent, useUpdateContent } from '@/hooks/api/use-content';
import Link from 'next/link';

function ContentPageInner() {
  const searchParams = useSearchParams();

  // API Query & Mutations
  const { data: apiResponse, refetch } = useContents({ page: 1, limit: 100 });
  const createContentMutation = useCreateContent();
  const deleteContentMutation = useDeleteContent();
  const updateContentMutation = useUpdateContent();


  // State Management
  const [localItems, setLocalItems] = useState<ContentItem[] | null>(null);

  const items: ContentItem[] = useMemo(() => {
    if (localItems) return localItems;
    if (apiResponse?.data && apiResponse.data.length > 0) {
      return apiResponse.data.map((c: any) => ({
        ...c,
        author: {
          id: c.author?.id || 'usr-1',
          name: c.author?.name || 'Unknown Author',
          avatar: c.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        },
        type: c.type || 'Article',
        status: c.status || 'Draft',
        views: c.views || '0',
        thumbnailIcon: c.thumbnailIcon || 'FileText',
        createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently',
      }));
    }
    return mockContentList;
  }, [apiResponse, localItems]);

  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('tab') || 'All Content');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams?.get('search') || '');
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<string>('All Types');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [authorFilter, setAuthorFilter] = useState<string>('All Authors');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog & Drawer state
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [targetItem, setTargetItem] = useState<ContentItem | null>(null);

  // Filter Data
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab filter
      if (activeTab !== 'All Content' && item.status !== activeTab) {
        return false;
      }
      // Type dropdown filter
      if (typeFilter !== 'All Types' && item.type !== typeFilter) {
        return false;
      }
      // Category dropdown filter
      if (categoryFilter !== 'All Categories' && item.category !== categoryFilter) {
        return false;
      }
      // Status dropdown filter
      if (statusFilter !== 'All Status' && item.status !== statusFilter) {
        return false;
      }
      // Author dropdown filter
      if (authorFilter !== 'All Authors' && item.author.name !== authorFilter) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesAuthor = item.author.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [items, activeTab, searchQuery, typeFilter, categoryFilter, statusFilter, authorFilter]);

  // Paginated View
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => {
      setTimeout(() => setIsRefreshing(false), 300);
    });
  };

  const handleClearFilters = () => {
    setTypeFilter('All Types');
    setCategoryFilter('All Categories');
    setStatusFilter('All Status');
    setAuthorFilter('All Authors');
    setSearchQuery('');
    setActiveTab('All Content');
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedItems.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleCreateContent = (newItem: ContentItem) => {
    createContentMutation.mutate({
      title: newItem.title,
      description: newItem.description,
      type: newItem.type,
      category: newItem.category,
      authorId: newItem.author.id || 'usr-1',
      status: newItem.status as any,
    });
    setLocalItems((prev) => [{ ...newItem, id: `cnt-${Date.now()}` }, ...(prev || items)]);
  };

  const handleAction = (
    actionType: 'view' | 'edit' | 'duplicate' | 'publish' | 'archive' | 'delete',
    item: ContentItem
  ) => {
    setTargetItem(item);

    if (actionType === 'view') {
      setDrawerOpen(true);
    } else if (actionType === 'edit') {
      setCreateModalOpen(true);
    } else if (actionType === 'duplicate') {
      const duplicated: ContentItem = {
        ...item,
        id: `cnt-${Date.now()}`,
        title: `${item.title} (Copy)`,
        status: 'Draft',
        views: '—',
      };
      createContentMutation.mutate({
        title: duplicated.title,
        description: duplicated.description,
        type: duplicated.type,
        category: duplicated.category,
        authorId: duplicated.author.id || 'usr-1',
        status: 'Draft',
      });
      setLocalItems((prev) => [duplicated, ...(prev || items)]);
    } else if (actionType === 'publish') {
      updateContentMutation.mutate({ id: item.id, data: { status: 'Published' as any } });
      setLocalItems((prev) =>
        (prev || items).map((i) => (i.id === item.id ? { ...i, status: 'Published' as ContentStatus } : i))
      );
    } else if (actionType === 'archive') {
      updateContentMutation.mutate({ id: item.id, data: { status: 'Archived' as any } });
      setLocalItems((prev) =>
        (prev || items).map((i) => (i.id === item.id ? { ...i, status: 'Archived' as ContentStatus } : i))
      );
    } else if (actionType === 'delete') {
      deleteContentMutation.mutate(item.id);
      setLocalItems((prev) => (prev || items).filter((i) => i.id !== item.id));
      setSelectedIds((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (action === 'delete') {
      setLocalItems((prev) => (prev || items).filter((i) => !selectedIds.includes(i.id)));
      setSelectedIds([]);
    } else if (action === 'publish') {
      setLocalItems((prev) =>
        (prev || items).map((i) => (selectedIds.includes(i.id) ? { ...i, status: 'Published' as ContentStatus } : i))
      );
      setSelectedIds([]);
    } else if (action === 'archive') {
      setLocalItems((prev) =>
        (prev || items).map((i) => (selectedIds.includes(i.id) ? { ...i, status: 'Archived' as ContentStatus } : i))
      );
      setSelectedIds([]);
    } else if (action === 'draft') {
      setLocalItems((prev) =>
        (prev || items).map((i) => (selectedIds.includes(i.id) ? { ...i, status: 'Draft' as ContentStatus } : i))
      );
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link href="/" className="hover:text-zinc-200 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span>Content & Learning</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">Content</span>
      </div>

      {/* Page Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Content</h1>
            <BookOpen className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create, manage and organize all platform content. Review, approve and publish content for users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl shadow-sm shadow-purple-900/30 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Content</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </Button>

          <Button
            variant="outline"
            className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>Import</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </Button>

          <Button
            variant="outline"
            className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </Button>
        </div>
      </div>

      {/* 6 Content Metric KPI Cards */}
      <ContentMetricsGrid />

      {/* Main Split Grid Layout: Left Content Table + Right Analytics Column */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Primary Content Table (Span 3) */}
        <Card className="lg:col-span-3 bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          {/* Toolbar Tabs & Filter Controls */}
          <ContentTableToolbar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            filtersOpen={filtersOpen}
            onToggleFilters={() => setFiltersOpen(!filtersOpen)}
            typeFilter={typeFilter}
            onTypeFilterChange={(t) => {
              setTypeFilter(t);
              setCurrentPage(1);
            }}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={(c) => {
              setCategoryFilter(c);
              setCurrentPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(s) => {
              setStatusFilter(s);
              setCurrentPage(1);
            }}
            authorFilter={authorFilter}
            onAuthorFilterChange={(a) => {
              setAuthorFilter(a);
              setCurrentPage(1);
            }}
            onClearFilters={handleClearFilters}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {/* Content Table */}
          <ContentTable
            items={paginatedItems}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onAction={handleAction}
          />

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#23232b] text-xs text-zinc-400">
            <div>
              Showing <span className="font-semibold text-white font-mono">{filteredItems.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
              <span className="font-semibold text-white font-mono">{Math.min(currentPage * pageSize, filteredItems.length)}</span> of{' '}
              <span className="font-semibold text-white font-mono">1,284</span> content
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-8 w-8 bg-[#181820] border-[#272730] text-zinc-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-lg font-mono font-bold text-xs transition-colors ${
                    currentPage === page
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-[#181820] text-zinc-400 hover:text-zinc-200 border border-[#272730]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <span className="px-1 text-zinc-600">...</span>

              {[129, 130].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="h-8 px-2 rounded-lg font-mono text-xs bg-[#181820] text-zinc-400 hover:text-zinc-200 border border-[#272730]"
                >
                  {page}
                </button>
              ))}

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="h-8 w-8 bg-[#181820] border-[#272730] text-zinc-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 px-2 bg-[#181820] border border-[#272730] rounded-lg text-xs text-zinc-200 focus:outline-none font-mono"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Right Column: Analytics Sidebar Cards (Span 1) */}
        <div className="space-y-6">
          <ContentOverviewCard />
          <TopCategoriesCard />
          <RecentContentActivityCard />
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      <ContentBulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkAction={handleBulkAction}
      />

      {/* Create Content Modal */}
      <CreateContentModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreateContent={handleCreateContent}
      />

      {/* Content Detail Drawer */}
      <ContentDetailDrawer
        open={drawerOpen}
        content={targetItem}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}

export default function ContentPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading content library...</div>}>
        <ContentPageInner />
      </Suspense>
    </AdminShell>
  );
}
