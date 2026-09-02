'use client';

import React from 'react';
import {
  MoreVertical,
  ShieldAlert,
  Shield,
  Users,
  FileText,
  GraduationCap,
  BarChart2,
  Headphones,
  Eye,
  Lock,
  UserX,
  Edit,
  Key,
  Copy,
  Trash2
} from 'lucide-react';
import { RoleTypeBadge } from './role-type-badge';
import { StatusBadge } from '@/components/users/status-badge';
import { PermissionProgress } from './permission-progress';
import { RoleItem } from '@/lib/mock-data/roles-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const roleIconMap: Record<string, React.ElementType> = {
  ShieldAlert,
  Shield,
  Users,
  FileText,
  GraduationCap,
  BarChart2,
  Headphones,
  Eye,
  Lock,
  UserX,
};

interface RolesTableProps {
  roles: RoleItem[];
  onAction: (actionType: 'view' | 'edit' | 'permissions' | 'duplicate' | 'delete', role: RoleItem) => void;
}

export function RolesTable({ roles, onAction }: RolesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left text-zinc-300">
        <thead className="bg-[#181820] text-zinc-400 font-semibold border-b border-[#272730] uppercase text-[10px] tracking-wider">
          <tr>
            <th className="p-3">Role</th>
            <th className="p-3">Type</th>
            <th className="p-3">Users</th>
            <th className="p-3">Permissions</th>
            <th className="p-3">Description</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#23232b]">
          {roles.length > 0 ? (
            roles.map((role) => {
              const Icon = roleIconMap[role.iconName] || Shield;

              return (
                <tr key={role.id} className="hover:bg-[#181820]/60 transition-colors">
                  {/* Role Name & Icon */}
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${role.iconBg} ${role.iconColor} border border-white/5 flex items-center justify-center flex-shrink-0 font-bold`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-zinc-100 text-xs">
                        {role.name}
                      </span>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="p-3 whitespace-nowrap">
                    <RoleTypeBadge type={role.type} />
                  </td>

                  {/* Users Count & Percentage */}
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="font-mono font-bold text-zinc-100">{role.usersCount.toLocaleString()}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">({role.userPercentage}%)</span>
                    </div>
                  </td>

                  {/* Permissions Progress */}
                  <td className="p-3 whitespace-nowrap">
                    <PermissionProgress count={role.permissionsCount} />
                  </td>

                  {/* Description */}
                  <td className="p-3 text-zinc-400 max-w-xs truncate">
                    {role.description}
                  </td>

                  {/* Status */}
                  <td className="p-3 whitespace-nowrap">
                    <StatusBadge status={role.status} />
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
                          onClick={() => onAction('view', role)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-400" /> View Role
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onAction('edit', role)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Edit className="w-3.5 h-3.5 text-zinc-400" /> Edit Role
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onAction('permissions', role)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Key className="w-3.5 h-3.5 text-purple-400" /> Manage Permissions
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onAction('duplicate', role)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Copy className="w-3.5 h-3.5 text-zinc-400" /> Duplicate Role
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-[#272730]" />

                        <DropdownMenuItem
                          disabled={role.isProtected}
                          onClick={() => !role.isProtected && onAction('delete', role)}
                          className={`text-xs focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer gap-2 ${
                            role.isProtected ? 'opacity-40 text-zinc-500 cursor-not-allowed' : 'text-rose-400'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {role.isProtected ? 'Protected System Role' : 'Delete Role'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="p-8 text-center text-zinc-400">
                No roles match your search or filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
