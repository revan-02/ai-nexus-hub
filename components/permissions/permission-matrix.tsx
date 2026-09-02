'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Users,
  FileText,
  GraduationCap,
  FolderGit2,
  ClipboardCheck,
} from 'lucide-react';
import { RoleTypeBadge } from '@/components/roles/role-type-badge';
import { PermissionStateIcon } from './permission-state-icon';
import {
  mockPermissionModulesData,
  mockRoleColumns,
  PermissionModuleGroup,
  PermissionState,
} from '@/lib/mock-data/permissions-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const moduleIconMap: Record<string, React.ElementType> = {
  Users,
  FileText,
  GraduationCap,
  FolderGit2,
  ClipboardCheck,
};

interface PermissionMatrixProps {
  searchQuery?: string;
  moduleFilter?: string;
  resourceFilter?: string;
  actionFilter?: string;
  typeFilter?: string;
  onCellClick?: (
    roleName: string,
    resource: string,
    action: string,
    currentState: PermissionState,
    nextState: PermissionState
  ) => void;
}

export function PermissionMatrix({
  searchQuery = '',
  moduleFilter = 'All Modules',
  resourceFilter = 'All Resources',
  actionFilter = 'All Actions',
  typeFilter = 'All Types',
  onCellClick,
}: PermissionMatrixProps) {
  const [modules, setModules] = useState<PermissionModuleGroup[]>(mockPermissionModulesData);

  const toggleExpand = (id: string) => {
    setModules((prev) =>
      prev.map((mod) => (mod.id === id ? { ...mod, isExpanded: !mod.isExpanded } : mod))
    );
  };

  const cycleState = (state: PermissionState): PermissionState => {
    if (state === 'granted') return 'denied';
    if (state === 'denied') return 'not-set';
    return 'granted';
  };

  const handleCellToggle = (
    moduleId: string,
    rowId: string,
    roleId: string,
    roleName: string,
    resource: string,
    action: string,
    currentState: PermissionState
  ) => {
    const nextState = cycleState(currentState);

    if (onCellClick) {
      onCellClick(roleName, resource, action, currentState, nextState);
    } else {
      // Direct local state update fallback
      setModules((prev) =>
        prev.map((mod) => {
          if (mod.id !== moduleId) return mod;
          return {
            ...mod,
            rows: mod.rows.map((row) => {
              if (row.id !== rowId) return row;
              return {
                ...row,
                roleStates: {
                  ...row.roleStates,
                  [roleId]: nextState,
                },
              };
            }),
          };
        })
      );
    }
  };

  return (
    <div className="overflow-x-auto border border-[#272730] rounded-xl bg-[#121217]">
      <table className="w-full text-xs text-left border-collapse min-w-[900px]">
        {/* Table Header */}
        <thead className="bg-[#181820] text-zinc-300 font-semibold border-b border-[#272730]">
          <tr>
            <th className="p-3 w-56">Module</th>
            <th className="p-3 w-36">Resource</th>
            <th className="p-3 w-40">Actions</th>
            {mockRoleColumns.map((role) => (
              <th key={role.id} className="p-3 text-center w-28 whitespace-nowrap">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-bold text-white text-xs">{role.name}</span>
                  <RoleTypeBadge type={role.type} className="text-[9px] px-1.5 py-0" />
                </div>
              </th>
            ))}
            <th className="p-3 text-right w-12">Actions</th>
          </tr>
        </thead>

        {/* Table Body Modules */}
        <tbody className="divide-y divide-[#23232b]">
          {modules.map((mod) => {
            const ModuleIcon = moduleIconMap[mod.iconName] || Users;
            const isExpanded = mod.isExpanded;

            return (
              <React.Fragment key={mod.id}>
                {/* Module Group Header Row */}
                <tr className="bg-[#181820]/80 font-semibold hover:bg-[#1f1f2a] transition-colors border-t border-[#272730]">
                  <td colSpan={3} className="p-3">
                    <button
                      onClick={() => toggleExpand(mod.id)}
                      className="flex items-center gap-2 text-white hover:text-purple-400 focus:outline-none transition-colors w-full text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-purple-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      )}
                      <div className="w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                        <ModuleIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{mod.name}</span>
                      {!isExpanded && (
                        <span className="text-[11px] font-mono text-zinc-500 font-normal ml-2">
                          ({mod.resourceCount} Resources)
                        </span>
                      )}
                    </button>
                  </td>

                  {/* Aggregate Summary metrics when collapsed */}
                  {!isExpanded &&
                    mockRoleColumns.map((role) => {
                      const agg = mod.roleAggregates[role.id] || { granted: 0, denied: 0, notSet: 0 };
                      return (
                        <td key={role.id} className="p-3 text-center whitespace-nowrap font-mono text-[11px]">
                          <div className="flex items-center justify-center gap-1">
                            {agg.granted > 0 && (
                              <span className="text-emerald-400 font-semibold">● {agg.granted}</span>
                            )}
                            {agg.denied > 0 && (
                              <span className="text-rose-400 font-semibold">⊗ {agg.denied}</span>
                            )}
                            {agg.granted === 0 && agg.denied === 0 && (
                              <span className="text-zinc-600">⊖ {agg.notSet}</span>
                            )}
                          </div>
                        </td>
                      );
                    })}

                  {/* Module header right chevron */}
                  {!isExpanded && (
                    <td className="p-3 text-right">
                      <button onClick={() => toggleExpand(mod.id)} className="text-zinc-500 hover:text-white">
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </button>
                    </td>
                  )}
                </tr>

                {/* Module Rows (if Expanded) */}
                {isExpanded &&
                  mod.rows.map((row) => (
                    <tr key={row.id} className="hover:bg-[#181820]/50 transition-colors">
                      <td className="p-3 pl-9">
                        <div className="font-semibold text-zinc-200">{row.resource}</div>
                        <div className="text-[11px] text-zinc-500">{row.resourceDesc}</div>
                      </td>

                      <td className="p-3 text-zinc-300 font-medium">
                        <span className="bg-[#181820] px-2 py-0.5 rounded border border-[#272730] font-mono text-[11px]">
                          {row.action}
                        </span>
                      </td>

                      <td className="p-3 text-zinc-400 text-[11px]">{row.actionDesc}</td>

                      {/* Permission State Icons for each role */}
                      {mockRoleColumns.map((role) => {
                        const state = row.roleStates[role.id] || 'not-set';

                        return (
                          <td key={role.id} className="p-3 text-center">
                            <PermissionStateIcon
                              state={state}
                              onClick={() =>
                                handleCellToggle(
                                  mod.id,
                                  row.id,
                                  role.id,
                                  role.name,
                                  row.resource,
                                  row.action,
                                  state
                                )
                              }
                            />
                          </td>
                        );
                      })}

                      {/* Row Action Menu */}
                      <td className="p-3 text-right whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<button className="p-1 text-zinc-400 hover:text-white hover:bg-[#20202b] rounded-md transition-colors" />}>
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-44 bg-[#121217] border-[#272730] text-zinc-200 rounded-xl shadow-xl p-1"
                          >
                            <DropdownMenuItem className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer">
                              Grant All Roles
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer">
                              Deny All Roles
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer">
                              Reset All Roles
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
