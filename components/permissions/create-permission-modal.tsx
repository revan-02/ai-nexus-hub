'use client';

import React, { useState } from 'react';
import { X, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SinglePermission } from '@/lib/mock-data/permissions-data';

interface CreatePermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePermission?: (permission: SinglePermission) => void;
}

export function CreatePermissionModal({
  open,
  onOpenChange,
  onCreatePermission,
}: CreatePermissionModalProps) {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [module, setModule] = useState('User Management');
  const [resource, setResource] = useState('Users');
  const [action, setAction] = useState('View');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !key) return;

    if (onCreatePermission) {
      onCreatePermission({
        id: `perm-${Date.now()}`,
        key: key.toLowerCase().replace(/\s+/g, '.'),
        name,
        module,
        resource,
        action,
        type: 'Custom',
        rolesUsing: 1,
        status: 'Active',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      });
    }

    setName('');
    setKey('');
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      <div className="relative w-full max-w-lg bg-[#121217] border border-[#272730] text-zinc-100 p-6 shadow-2xl rounded-2xl z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#272730] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Custom Permission</h3>
              <p className="text-xs text-zinc-400">Define a custom system or module permission</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Permission Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Export Reports"
              required
              className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Permission Key (module.resource.action)</label>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="reports.export"
              required
              className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Module</label>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="w-full h-9 px-2.5 bg-[#181820] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="User Management">User Management</option>
                <option value="Content Management">Content Management</option>
                <option value="Courses">Courses</option>
                <option value="Projects">Projects</option>
                <option value="Assessments">Assessments</option>
                <option value="AI Control Center">AI Control Center</option>
                <option value="Analytics">Analytics</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Resource</label>
              <Input
                value={resource}
                onChange={(e) => setResource(e.target.value)}
                placeholder="Reports"
                required
                className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Action</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full h-9 px-2.5 bg-[#181820] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="View">View</option>
                <option value="Create">Create</option>
                <option value="Edit">Edit</option>
                <option value="Delete">Delete</option>
                <option value="Manage">Manage</option>
                <option value="Export">Export</option>
              </select>
            </div>
          </div>

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
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2"
            >
              Create Permission
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
