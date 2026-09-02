'use client';

import React, { useState } from 'react';
import { X, Key, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockPermissionModules, PermissionModule, RoleItem } from '@/lib/mock-data/roles-data';

interface ManagePermissionsModalProps {
  open: boolean;
  role: RoleItem | null;
  onOpenChange: (open: boolean) => void;
  onSave?: (roleId: string, updatedModules: PermissionModule[]) => void;
}

export function ManagePermissionsModal({
  open,
  role,
  onOpenChange,
  onSave,
}: ManagePermissionsModalProps) {
  const [modules, setModules] = useState<PermissionModule[]>(mockPermissionModules);

  if (!open || !role) return null;

  const togglePermission = (moduleId: string, permId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        return {
          ...mod,
          permissions: mod.permissions.map((p) =>
            p.id === permId ? { ...p, granted: !p.granted } : p
          ),
        };
      })
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(role.id, modules);
    }
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      <div className="relative w-full max-w-2xl bg-[#121217] border border-[#272730] text-zinc-100 p-6 shadow-2xl rounded-2xl z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#272730] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Manage Permissions: <span className="text-purple-400">{role.name}</span>
              </h3>
              <p className="text-xs text-zinc-400">Configure granular module permissions and scope</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modules Permission Matrix */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {modules.map((mod) => (
            <div key={mod.id} className="p-4 bg-[#181820] border border-[#272730] rounded-xl space-y-3">
              <div>
                <h4 className="text-xs font-bold text-white">{mod.name}</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">{mod.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#23232b]">
                {mod.permissions.map((perm) => (
                  <label
                    key={perm.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      perm.granted
                        ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                        : 'bg-[#121217] border-[#272730] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span>{perm.label}</span>
                    <input
                      type="checkbox"
                      checked={perm.granted}
                      onChange={() => togglePermission(mod.id, perm.id)}
                      className="rounded border-[#33333d] bg-[#121217] text-purple-600 focus:ring-purple-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-[#272730] flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-xs text-zinc-400 hover:text-white hover:bg-[#181820]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2"
          >
            Save Permissions
          </Button>
        </div>
      </div>
    </div>
  );
}
