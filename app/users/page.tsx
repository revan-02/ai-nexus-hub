'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { UserMetricsGrid } from '@/components/users/user-metrics-grid';
import { UserTableToolbar } from '@/components/users/user-table-toolbar';
import { UserDataTable } from '@/components/users/user-data-table';
import { BulkActionBar } from '@/components/users/bulk-action-bar';
import { AddUserModal } from '@/components/users/add-user-modal';
import { ConfirmActionModal, ActionType } from '@/components/users/confirm-action-modal';
import { UserProfileDrawer } from '@/components/users/user-profile-drawer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import { mockUsersList, UserMetricData } from '@/lib/mock-data/users-data';
import { UserItem, UserStatus } from '@/types/user';
import { useUsers, useCreateUser, useDeleteUser, useUpdateUser } from '@/hooks/api/use-users';
import Link from 'next/link';

function UsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // API Query & Mutations
  const { data: apiResponse, isLoading, refetch } = useUsers({
    page: 1,
    limit: 100,
  });
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();
  const updateUserMutation = useUpdateUser();

  // State Management & URL Param sync
  const [localUsers, setLocalUsers] = useState<UserItem[] | null>(null);

  const users: UserItem[] = useMemo(() => {
    if (localUsers) return localUsers;
    if (apiResponse?.data && apiResponse.data.length > 0) {
      return apiResponse.data.map((u) => ({
        ...u,
        avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: u.role as any,
        organization: u.organization || 'General',
        status: u.status as any,
      }));
    }
    return mockUsersList;
  }, [apiResponse, localUsers]);

  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('status') || 'All Users');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams?.get('search') || '');
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [roleFilter, setRoleFilter] = useState<string>('All Roles');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [orgFilter, setOrgFilter] = useState<string>('All Organizations');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog & Drawer state
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [modalActionType, setModalActionType] = useState<ActionType>(null);
  const [targetUser, setTargetUser] = useState<UserItem | null>(null);
  const [drawerUser, setDrawerUser] = useState<UserItem | null>(null);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState<boolean>(false);

  // Filter Data
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Tab filter
      if (activeTab !== 'All Users' && user.status !== activeTab) {
        return false;
      }
      // Status dropdown filter
      if (statusFilter !== 'All Status' && user.status !== statusFilter) {
        return false;
      }
      // Role dropdown filter
      if (roleFilter !== 'All Roles' && user.role !== roleFilter) {
        return false;
      }
      // Organization filter
      if (orgFilter !== 'All Organizations' && user.organization !== orgFilter) {
        return false;
      }
      // Email verified filter
      if (verifiedFilter === 'Verified' && !user.emailVerified) return false;
      if (verifiedFilter === 'Not Verified' && user.emailVerified) return false;

      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(q);
        const matchesEmail = user.email.toLowerCase().includes(q);
        const matchesUsername = user.username.toLowerCase().includes(q);
        const matchesRole = user.role.toLowerCase().includes(q);
        const matchesOrg = user.organization.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesUsername && !matchesRole && !matchesOrg) {
          return false;
        }
      }

      return true;
    });
  }, [users, activeTab, searchQuery, roleFilter, statusFilter, orgFilter, verifiedFilter]);

  // Paginated View
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => {
      setTimeout(() => setIsRefreshing(false), 300);
    });
  };

  const handleClearFilters = () => {
    setRoleFilter('All Roles');
    setStatusFilter('All Status');
    setOrgFilter('All Organizations');
    setVerifiedFilter('All');
    setSearchQuery('');
    setActiveTab('All Users');
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedUsers.map((u) => u.id));
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

  const handleAddUser = (newUser: UserItem) => {
    createUserMutation.mutate({
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      role: newUser.role,
      organization: newUser.organization,
      status: newUser.status,
    });
    setLocalUsers((prev) => [{ ...newUser, id: `usr-${Date.now()}` }, ...(prev || users)]);
  };

  const handleAction = (
    actionType: ActionType | 'view-profile' | 'edit' | 'view-activity',
    user: UserItem
  ) => {
    setTargetUser(user);

    if (actionType === 'view-profile' || actionType === 'view-activity') {
      setDrawerUser(user);
      setProfileDrawerOpen(true);
    } else if (actionType === 'edit') {
      setAddUserOpen(true);
    } else {
      setModalActionType(actionType as ActionType);
      setConfirmModalOpen(true);
    }
  };

  const handleConfirmAction = (type: ActionType, user: UserItem) => {
    if (type === 'delete') {
      deleteUserMutation.mutate(user.id);
      setLocalUsers((prev) => (prev || users).filter((u) => u.id !== user.id));
      setSelectedIds((prev) => prev.filter((id) => id !== user.id));
    } else if (type === 'suspend') {
      updateUserMutation.mutate({ id: user.id, data: { status: 'Suspended' } });
      setLocalUsers((prev) =>
        (prev || users).map((u) => (u.id === user.id ? { ...u, status: 'Suspended' as UserStatus } : u))
      );
    }
  };

  const handleBulkAction = (action: string) => {
    if (action === 'delete') {
      setLocalUsers((prev) => (prev || users).filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
    } else if (action === 'suspend') {
      setLocalUsers((prev) =>
        (prev || users).map((u) => (selectedIds.includes(u.id) ? { ...u, status: 'Suspended' as UserStatus } : u))
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
        <span>Users & Access</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">Users</span>
      </div>

      {/* Page Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Users</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage all platform users, their roles, status and permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setAddUserOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl shadow-sm shadow-purple-900/30 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
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

      {/* 6 User Metric KPI Cards */}
      <UserMetricsGrid />

      {/* Primary User Data Table Card Container */}
      <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
        {/* Toolbar Tabs & Filter Controls */}
        <UserTableToolbar
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
          roleFilter={roleFilter}
          onRoleFilterChange={(r) => {
            setRoleFilter(r);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(s) => {
            setStatusFilter(s);
            setCurrentPage(1);
          }}
          orgFilter={orgFilter}
          onOrgFilterChange={(o) => {
            setOrgFilter(o);
            setCurrentPage(1);
          }}
          verifiedFilter={verifiedFilter}
          onVerifiedFilterChange={(v) => {
            setVerifiedFilter(v);
            setCurrentPage(1);
          }}
          onClearFilters={handleClearFilters}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* User Data Table */}
        <UserDataTable
          users={paginatedUsers}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onAction={handleAction}
        />

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#23232b] text-xs text-zinc-400">
          <div>
            Showing <span className="font-semibold text-white font-mono">{filteredUsers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-semibold text-white font-mono">{Math.min(currentPage * pageSize, filteredUsers.length)}</span> of{' '}
            <span className="font-semibold text-white font-mono">12,458</span> users
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

            {[1246, 1247].map((page) => (
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

      {/* Floating Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkAction={handleBulkAction}
      />

      {/* Add User Modal */}
      <AddUserModal
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onAddUser={handleAddUser}
      />

      {/* Confirmation Modal */}
      <ConfirmActionModal
        open={confirmModalOpen}
        actionType={modalActionType}
        user={targetUser}
        onOpenChange={setConfirmModalOpen}
        onConfirm={handleConfirmAction}
      />

      {/* User Profile Drawer */}
      <UserProfileDrawer
        open={profileDrawerOpen}
        user={drawerUser}
        onOpenChange={setProfileDrawerOpen}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading user directory...</div>}>
        <UsersContent />
      </Suspense>
    </AdminShell>
  );
}
