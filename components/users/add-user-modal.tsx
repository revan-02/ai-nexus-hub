'use client';

import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/lib/mock-data/users-data';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser?: (user: any) => void;
}

export function AddUserModal({ open, onOpenChange, onAddUser }: AddUserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('User');
  const [organization, setOrganization] = useState('General');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    if (onAddUser) {
      onAddUser({
        name,
        email,
        username: username || `@${name.toLowerCase().replace(/\s+/g, '')}`,
        role,
        organization,
        status: 'Active',
        emailVerified: true,
        lastActive: 'Just now',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      });
    }

    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      <div className="relative w-full max-w-lg bg-[#121217] border border-[#272730] text-zinc-100 p-6 shadow-2xl rounded-2xl z-10 space-y-5">
        <div className="flex items-center justify-between border-b border-[#272730] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add New User</h3>
              <p className="text-xs text-zinc-400">Create or invite a new platform user</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                required
                className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Username (Optional)</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@johndoe"
                className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Editor">Editor</option>
                <option value="Instructor">Instructor</option>
                <option value="Analyst">Analyst</option>
                <option value="Moderator">Moderator</option>
                <option value="User">User</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Organization</label>
              <select
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="General">General</option>
                <option value="AI Research Lab">AI Research Lab</option>
                <option value="Data Science Team">Data Science Team</option>
                <option value="Content Team">Content Team</option>
                <option value="AI Learning Program">AI Learning Program</option>
                <option value="Analytics Team">Analytics Team</option>
                <option value="Community Team">Community Team</option>
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
              Add User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
