'use client';

import React, { useState } from 'react';
import { Search, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RoleTypeBadge } from '@/components/roles/role-type-badge';
import { StatusBadge } from '@/components/users/status-badge';
import { SinglePermission, mockFlatPermissionsList } from '@/lib/mock-data/permissions-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PermissionsListViewProps {
  customOnly?: boolean;
}

export function PermissionsListView({ customOnly = false }: PermissionsListViewProps) {
  const [items, setItems] = useState<SinglePermission[]>(mockFlatPermissionsList);
  const [search, setSearch] = useState('');

  const filtered = items.filter((item) => {
    if (customOnly && item.type !== 'Custom') return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.key.toLowerCase().includes(q) ||
        item.module.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Search toolbar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name, key, or module..."
          className="pl-9 h-8 text-xs bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 rounded-lg"
        />
      </div>

      {/* List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-zinc-300">
          <thead className="bg-[#181820] text-zinc-400 font-semibold border-b border-[#272730] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3">Permission</th>
              <th className="p-3">Key</th>
              <th className="p-3">Module</th>
              <th className="p-3">Resource</th>
              <th className="p-3">Action</th>
              <th className="p-3">Type</th>
              <th className="p-3">Roles Using</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#23232b]">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#181820]/60 transition-colors">
                  <td className="p-3 font-bold text-white whitespace-nowrap">{item.name}</td>
                  <td className="p-3 font-mono text-purple-300 whitespace-nowrap">{item.key}</td>
                  <td className="p-3 text-zinc-300 whitespace-nowrap">{item.module}</td>
                  <td className="p-3 text-zinc-400 whitespace-nowrap">{item.resource}</td>
                  <td className="p-3 text-zinc-300 whitespace-nowrap">{item.action}</td>
                  <td className="p-3 whitespace-nowrap">
                    <RoleTypeBadge type={item.type} />
                  </td>
                  <td className="p-3 font-mono font-bold text-zinc-200 whitespace-nowrap">
                    {item.rolesUsing} Roles
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="p-3 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<button className="p-1 text-zinc-400 hover:text-white hover:bg-[#20202b] rounded-md transition-colors" />}>
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 bg-[#121217] border-[#272730] text-zinc-200 rounded-xl shadow-xl p-1"
                      >
                        <DropdownMenuItem className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2">
                          <Edit className="w-3.5 h-3.5 text-zinc-400" /> Edit Permission
                        </DropdownMenuItem>
                        {item.type === 'Custom' && (
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="text-xs text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Permission
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-8 text-center text-zinc-400">
                  No permissions found matching search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
