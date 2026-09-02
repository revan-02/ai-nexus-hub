'use client';

import React from 'react';
import {
  MoreVertical,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  ShieldCheck,
  Key,
  UserX,
  Trash2,
  Activity,
  UserCheck
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleBadge } from './role-badge';
import { StatusBadge } from './status-badge';
import { UserItem } from '@/lib/mock-data/users-data';
import { ActionType } from './confirm-action-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserDataTableProps {
  users: UserItem[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onAction: (actionType: ActionType | 'view-profile' | 'edit' | 'view-activity', user: UserItem) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
}

export function UserDataTable({
  users,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onAction,
}: UserDataTableProps) {
  const allSelected = users.length > 0 && users.every((u) => selectedIds.includes(u.id));

  return (
    <div className="overflow-x-auto">
      {/* Desktop Data Table */}
      <table className="w-full text-xs text-left text-zinc-300">
        <thead className="bg-[#181820] text-zinc-400 font-semibold border-b border-[#272730] uppercase text-[10px] tracking-wider">
          <tr>
            <th className="p-3 w-10 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-[#33333d] bg-[#121217] text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
              />
            </th>
            <th className="p-3">User</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Organization</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-center">Email Verified</th>
            <th className="p-3">Last Active</th>
            <th className="p-3">Created At</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#23232b]">
          {users.length > 0 ? (
            users.map((user) => {
              const isSelected = selectedIds.includes(user.id);

              return (
                <tr
                  key={user.id}
                  className={`hover:bg-[#181820]/60 transition-colors ${
                    isSelected ? 'bg-purple-950/20' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectRow(user.id, e.target.checked)}
                      className="rounded border-[#33333d] bg-[#121217] text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                    />
                  </td>

                  {/* User Profile */}
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border border-[#2e2e3a] flex-shrink-0">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-purple-950 text-purple-300 font-bold text-xs">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-100 text-xs truncate leading-tight">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 font-mono truncate mt-0.5">
                          {user.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="p-3 whitespace-nowrap font-mono text-zinc-300">
                    {user.email}
                  </td>

                  {/* Role */}
                  <td className="p-3 whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Organization */}
                  <td className="p-3 whitespace-nowrap text-zinc-300 font-medium">
                    {user.organization}
                  </td>

                  {/* Status */}
                  <td className="p-3 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>

                  {/* Email Verified */}
                  <td className="p-3 whitespace-nowrap text-center">
                    {user.emailVerified ? (
                      <span title="Email verified">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      </span>
                    ) : (
                      <span title="Email not verified">
                        <XCircle className="w-4 h-4 text-rose-400 mx-auto" />
                      </span>
                    )}
                  </td>

                  {/* Last Active */}
                  <td className="p-3 whitespace-nowrap font-mono text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      {user.lastActive !== '—' ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      )}
                      <span>{user.lastActive}</span>
                    </div>
                  </td>

                  {/* Created At */}
                  <td className="p-3 whitespace-nowrap font-mono text-zinc-400">
                    {user.createdAt}
                  </td>

                  {/* Row Actions Menu */}
                  <td className="p-3 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<button className="p-1 text-zinc-400 hover:text-white hover:bg-[#20202b] rounded-md transition-colors" />}>
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 bg-[#121217] border-[#272730] text-zinc-200 rounded-xl shadow-xl p-1"
                      >
                        <DropdownMenuItem
                          onClick={() => onAction('view-profile', user)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-400" /> View Profile
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onAction('edit', user)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Edit className="w-3.5 h-3.5 text-zinc-400" /> Edit User
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onAction('edit', user)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> Assign Role
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onAction('reset-password', user)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Key className="w-3.5 h-3.5 text-zinc-400" /> Reset Password
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-[#272730]" />

                        <DropdownMenuItem
                          onClick={() => onAction('impersonate', user)}
                          className="text-xs text-purple-400 focus:bg-purple-500/10 focus:text-purple-300 cursor-pointer gap-2 font-medium"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Impersonate User
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-[#272730]" />

                        <DropdownMenuItem
                          onClick={() => onAction('suspend', user)}
                          className="text-xs text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer gap-2"
                        >
                          <UserX className="w-3.5 h-3.5" /> Suspend User
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onAction('delete', user)}
                          className="text-xs text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete User
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-[#272730]" />

                        <DropdownMenuItem
                          onClick={() => onAction('view-activity', user)}
                          className="text-xs text-zinc-400 focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Activity className="w-3.5 h-3.5" /> View Activity
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={10} className="p-8 text-center text-zinc-400">
                No users match your filters. Try adjusting search or filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
