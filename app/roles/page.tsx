'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { RoleMetricsGrid } from '@/components/roles/role-metrics-grid';
import { RolesTableToolbar } from '@/components/roles/roles-table-toolbar';
import { RolesTable } from '@/components/roles/roles-table';
import { RoleDistributionCard } from '@/components/roles/role-distribution-card';
import { PermissionOverviewCard } from '@/components/roles/permission-overview-card';
import { RecentRoleActivitiesCard } from '@/components/roles/recent-role-activities-card';
import { CreateRoleModal } from '@/components/roles/create-role-modal';
import { ManagePermissionsModal } from '@/components/roles/manage-permissions-modal';
import { RoleDetailDrawer } from '@/components/roles/role-detail-drawer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Plus, Download, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import { mockRolesList } from '@/lib/mock-data/roles-data';
import { RoleItem } from '@/types/role';
import { useRoles, useCreateRole, useDeleteRole } from '@/hooks/api/use-roles';
import Link from 'next/link';

function RolesContent() {
  const searchParams = useSearchParams();

  // API Query & Mutations
  const { data: apiResponse, refetch } = useRoles({ page: 1, limit: 100 });
  const createRoleMutation = useCreateRole();
  const deleteRoleMutation = useDeleteRole();

  // State Management
  const [localRoles, setLocalRoles] = useState<RoleItem[] | null>(null);

  const roles: RoleItem[] = useMemo(() => {
    if (localRoles) return localRoles;
    if (apiResponse?.data && apiResponse.data.length > 0) {
      return apiResponse.data.map((r: any) => ({
        ...r,
        type: r.type || 'Custom',
        usersCount: r._count?.userRoles || 0,
        userPercentage: 0,
        permissionsCount: r.rolePermissions?.length || 0,
        status: r.status || 'Active',
        iconName: r.iconName || 'Shield',
        iconBg: r.iconBg || 'bg-[#23232f]',
        iconColor: r.iconColor || 'text-purple-400',
        createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recently',
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Recently',
      }));
    }
    return mockRolesList;
  }, [apiResponse, localRoles]);

  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('tab') || 'All Roles');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams?.get('search') || '');
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<string>('All Types');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Dialog & Drawer state
  const [createRoleOpen, setCreateRoleOpen] = useState<boolean>(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState<boolean>(false);
  const [roleDetailOpen, setRoleDetailOpen] = useState<boolean>(false);
  const [targetRole, setTargetRole] = useState<RoleItem | null>(null);

  // Filter Data
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      // Tab filter
      if (activeTab === 'System Roles' && role.type !== 'System') return false;
      if (activeTab === 'Custom Roles' && role.type !== 'Custom') return false;
      if (activeTab === 'Inactive Roles' && role.status !== 'Inactive') return false;

      // Type dropdown filter
      if (typeFilter !== 'All Types' && role.type !== typeFilter) return false;

      // Status dropdown filter
      if (statusFilter !== 'All Status' && role.status !== statusFilter) return false;

      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = role.name.toLowerCase().includes(q);
        const matchesDesc = role.description.toLowerCase().includes(q);
        const matchesType = role.type.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesType) return false;
      }

      return true;
    });
  }, [roles, activeTab, searchQuery, typeFilter, statusFilter]);

  // Paginated View
  const totalPages = Math.ceil(filteredRoles.length / pageSize) || 1;
  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRoles.slice(start, start + pageSize);
  }, [filteredRoles, currentPage, pageSize]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => {
      setTimeout(() => setIsRefreshing(false), 300);
    });
  };

  const handleClearFilters = () => {
    setTypeFilter('All Types');
    setStatusFilter('All Status');
    setSearchQuery('');
    setActiveTab('All Roles');
    setCurrentPage(1);
  };

  const handleCreateRole = (newRole: RoleItem) => {
    createRoleMutation.mutate({
      name: newRole.name,
      type: newRole.type,
      description: newRole.description,
      status: newRole.status,
    });
    setLocalRoles((prev) => [{ ...newRole, id: `role-${Date.now()}` }, ...(prev || roles)]);
  };

  const handleAction = (
    actionType: 'view' | 'edit' | 'permissions' | 'duplicate' | 'delete',
    role: RoleItem
  ) => {
    setTargetRole(role);

    if (actionType === 'view') {
      setRoleDetailOpen(true);
    } else if (actionType === 'permissions') {
      setPermissionsModalOpen(true);
    } else if (actionType === 'edit') {
      setCreateRoleOpen(true);
    } else if (actionType === 'duplicate') {
      const duplicated: RoleItem = {
        ...role,
        id: `role-${Date.now()}`,
        name: `${role.name} (Copy)`,
        type: 'Custom',
        isProtected: false,
      };
      createRoleMutation.mutate({
        name: duplicated.name,
        type: 'Custom',
        description: duplicated.description,
        status: duplicated.status,
      });
      setLocalRoles((prev) => [duplicated, ...(prev || roles)]);
    } else if (actionType === 'delete' && !role.isProtected) {
      deleteRoleMutation.mutate(role.id);
      setLocalRoles((prev) => (prev || roles).filter((r) => r.id !== role.id));
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
        <span>Users & Access</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">Roles</span>
      </div>

      {/* Page Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Roles</h1>
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create and manage roles and their permissions across the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setCreateRoleOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl shadow-sm shadow-purple-900/30 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Role</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
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

      {/* 6 Role Metric KPI Cards */}
      <RoleMetricsGrid />

      {/* Main Grid: Left Table Container + Right Analytics Column */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Primary Roles Table (Span 3) */}
        <Card className="lg:col-span-3 bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          {/* Toolbar Tabs & Search Controls */}
          <RolesTableToolbar
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
            statusFilter={statusFilter}
            onStatusFilterChange={(s) => {
              setStatusFilter(s);
              setCurrentPage(1);
            }}
            onClearFilters={handleClearFilters}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {/* Roles Table */}
          <RolesTable roles={paginatedRoles} onAction={handleAction} />

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#23232b] text-xs text-zinc-400">
            <div>
              Showing <span className="font-semibold text-white font-mono">{filteredRoles.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
              <span className="font-semibold text-white font-mono">{Math.min(currentPage * pageSize, filteredRoles.length)}</span> of{' '}
              <span className="font-semibold text-white font-mono">12</span> roles
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

              {[1, 2].map((page) => (
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
              </select>
            </div>
          </div>
        </Card>

        {/* Right Column: Analytics Sidebar Cards (Span 1) */}
        <div className="space-y-6">
          <RoleDistributionCard />
          <PermissionOverviewCard />
          <RecentRoleActivitiesCard />
        </div>
      </div>

      {/* Create Role Dialog */}
      <CreateRoleModal
        open={createRoleOpen}
        onOpenChange={setCreateRoleOpen}
        onCreateRole={handleCreateRole}
      />

      {/* Manage Permissions Modal */}
      <ManagePermissionsModal
        open={permissionsModalOpen}
        role={targetRole}
        onOpenChange={setPermissionsModalOpen}
      />

      {/* Role Detail Drawer */}
      <RoleDetailDrawer
        open={roleDetailOpen}
        role={targetRole}
        onOpenChange={setRoleDetailOpen}
      />
    </div>
  );
}

export default function RolesPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading roles management...</div>}>
        <RolesContent />
      </Suspense>
    </AdminShell>
  );
}
