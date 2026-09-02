'use client';

import React, { useState } from 'react';
import { X, ShieldPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RoleType, RoleItem } from '@/lib/mock-data/roles-data';

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRole?: (role: any) => void;
}

export function CreateRoleModal({ open, onOpenChange, onCreateRole }: CreateRoleModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RoleType>('Custom');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (onCreateRole) {
      onCreateRole({
        name,
        description: description || 'Custom platform role',
        type,
        usersCount: 0,
        userPercentage: 0,
        permissionsCount: 24,
        status: 'Active',
        iconName: 'Shield',
        iconBg: 'bg-purple-600/20',
        iconColor: 'text-purple-400',
        isProtected: false,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        updatedAt: 'Just now',
      });
    }

    setName('');
    setDescription('');
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
              <ShieldPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Role</h3>
              <p className="text-xs text-zinc-400">Define role permissions and access level</p>
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
            <label className="block text-zinc-300 font-medium mb-1.5">Role Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Data Scientist / Security Analyst"
              required
              className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of role responsibilities..."
              className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Role Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as RoleType)}
              className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="Custom">Custom Role</option>
              <option value="System">System Role (Protected)</option>
            </select>
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
              Create Role
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
