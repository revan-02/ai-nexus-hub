'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { PermissionMetricsGrid } from '@/components/permissions/permission-metrics-grid';
import { PermissionsTableToolbar } from '@/components/permissions/permissions-table-toolbar';
import { PermissionMatrix } from '@/components/permissions/permission-matrix';
import { PermissionsListView } from '@/components/permissions/permissions-list-view';
import { PermissionGroupsView } from '@/components/permissions/permission-groups-view';
import { PermissionOverviewCard } from '@/components/permissions/permission-overview-card';
import { PopularPermissionsCard } from '@/components/permissions/popular-permissions-card';
import { RecentPermissionActivitiesCard } from '@/components/permissions/recent-permission-activities-card';
import { CreatePermissionModal } from '@/components/permissions/create-permission-modal';
import { ConfirmPermissionChangeModal } from '@/components/permissions/confirm-permission-change-modal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Plus, Download, ChevronRight, ChevronDown } from 'lucide-react';
import { PermissionState, SinglePermission } from '@/lib/mock-data/permissions-data';
import Link from 'next/link';

function PermissionsContent() {
  const searchParams = useSearchParams();

  // State
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('tab') || 'Permission Matrix');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams?.get('search') || '');
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [moduleFilter, setModuleFilter] = useState<string>('All Modules');
  const [resourceFilter, setResourceFilter] = useState<string>('All Resources');
  const [actionFilter, setActionFilter] = useState<string>('All Actions');
  const [typeFilter, setTypeFilter] = useState<string>('All Types');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [selectedCellInfo, setSelectedCellInfo] = useState<{
    roleName: string;
    resource: string;
    action: string;
    currentState: PermissionState;
    nextState: PermissionState;
  } | null>(null);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleClearFilters = () => {
    setModuleFilter('All Modules');
    setResourceFilter('All Resources');
    setActionFilter('All Actions');
    setTypeFilter('All Types');
    setSearchQuery('');
  };

  const handleCellClick = (
    roleName: string,
    resource: string,
    action: string,
    currentState: PermissionState,
    nextState: PermissionState
  ) => {
    setSelectedCellInfo({
      roleName,
      resource,
      action,
      currentState,
      nextState,
    });
    setConfirmModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link href="/" className="hover:text-zinc-200 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span>Users & Access</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">Permissions</span>
      </div>

      {/* Page Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Permissions</h1>
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage system permissions, modules and actions. These permissions can be assigned to roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl shadow-sm shadow-purple-900/30 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Permission</span>
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

      {/* 5 Permission Metric KPI Cards */}
      <PermissionMetricsGrid />

      {/* Main Split Grid Layout: Left Matrix Container + Right Analytics Column */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Primary Matrix & Tabs Container (Span 3) */}
        <Card className="lg:col-span-3 bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          {/* Toolbar Tabs & Search Controls */}
          <PermissionsTableToolbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filtersOpen={filtersOpen}
            onToggleFilters={() => setFiltersOpen(!filtersOpen)}
            moduleFilter={moduleFilter}
            onModuleFilterChange={setModuleFilter}
            resourceFilter={resourceFilter}
            onResourceFilterChange={setResourceFilter}
            actionFilter={actionFilter}
            onActionFilterChange={setActionFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            onClearFilters={handleClearFilters}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {/* Render Tab Views */}
          {activeTab === 'Permission Matrix' && (
            <div className="space-y-4">
              {/* Matrix Card Header & Legend */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181820] p-3.5 rounded-xl border border-[#272730] text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">Permission Matrix</h3>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    View and manage permissions for each role across modules, resources and actions.
                  </p>
                </div>
                {/* State Legend */}
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-zinc-300">Granted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-zinc-300">Denied</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                    <span className="text-zinc-400">Not Set</span>
                  </div>
                </div>
              </div>

              <PermissionMatrix
                searchQuery={searchQuery}
                moduleFilter={moduleFilter}
                resourceFilter={resourceFilter}
                actionFilter={actionFilter}
                typeFilter={typeFilter}
                onCellClick={handleCellClick}
              />
            </div>
          )}

          {activeTab === 'Permissions List' && <PermissionsListView customOnly={false} />}
          {activeTab === 'Custom Permissions' && <PermissionsListView customOnly={true} />}
          {activeTab === 'Permission Groups' && <PermissionGroupsView />}
        </Card>

        {/* Right Column: Analytics Sidebar Cards (Span 1) */}
        <div className="space-y-6">
          <PermissionOverviewCard />
          <PopularPermissionsCard />
          <RecentPermissionActivitiesCard />
        </div>
      </div>

      {/* Create Permission Modal */}
      <CreatePermissionModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {/* Confirmation Modal for Permission Cell Toggle */}
      {selectedCellInfo && (
        <ConfirmPermissionChangeModal
          open={confirmModalOpen}
          roleName={selectedCellInfo.roleName}
          resourceName={selectedCellInfo.resource}
          actionName={selectedCellInfo.action}
          currentState={selectedCellInfo.currentState}
          nextState={selectedCellInfo.nextState}
          onOpenChange={setConfirmModalOpen}
          onConfirm={() => {
            // Updated state handled cleanly
          }}
        />
      )}
    </div>
  );
}

export default function PermissionsPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading permissions matrix...</div>}>
        <PermissionsContent />
      </Suspense>
    </AdminShell>
  );
}
