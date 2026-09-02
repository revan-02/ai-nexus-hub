'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, Key, UserX, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserItem } from '@/lib/mock-data/users-data';

export type ActionType = 'reset-password' | 'impersonate' | 'suspend' | 'delete' | null;

interface ConfirmActionModalProps {
  open: boolean;
  actionType: ActionType;
  user: UserItem | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (actionType: ActionType, user: UserItem) => void;
}

export function ConfirmActionModal({
  open,
  actionType,
  user,
  onOpenChange,
  onConfirm,
}: ConfirmActionModalProps) {
  const [typedName, setTypedName] = useState('');

  if (!open || !user || !actionType) return null;

  const isDelete = actionType === 'delete';
  const isImpersonate = actionType === 'impersonate';
  const isSuspend = actionType === 'suspend';
  const isReset = actionType === 'reset-password';

  const canConfirmDelete = !isDelete || typedName.trim().toLowerCase() === user.name.toLowerCase();

  const handleConfirm = () => {
    onConfirm(actionType, user);
    setTypedName('');
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      <div className="relative w-full max-w-md bg-[#121217] border border-[#272730] text-zinc-100 p-6 shadow-2xl rounded-2xl z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {isDelete && (
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
            )}
            {isSuspend && (
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                <UserX className="w-5 h-5" />
              </div>
            )}
            {isImpersonate && (
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
            )}
            {isReset && (
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5" />
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-white">
                {isDelete && `Delete User: ${user.name}`}
                {isSuspend && `Suspend User: ${user.name}`}
                {isImpersonate && `Impersonate User: ${user.name}`}
                {isReset && `Reset Password for ${user.name}`}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="text-xs text-zinc-300 space-y-3">
          {isImpersonate && (
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-purple-400" />
                Security Warning
              </div>
              <p className="text-[11px] leading-relaxed text-purple-200">
                You are about to sign in as <strong>{user.name}</strong> ({user.email}). All session actions will be logged to audit logs.
              </p>
            </div>
          )}

          {isDelete && (
            <div className="space-y-3">
              <p className="text-rose-300 leading-relaxed bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                This action is permanent and cannot be undone. All user data, permissions, and session records will be deleted.
              </p>
              <div>
                <label className="block text-zinc-400 font-medium mb-1">
                  Type <strong className="text-white font-mono">{user.name}</strong> to confirm deletion:
                </label>
                <Input
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder={user.name}
                  className="bg-[#181820] border-[#272730] text-xs text-white"
                />
              </div>
            </div>
          )}

          {isSuspend && (
            <p className="text-zinc-300 leading-relaxed">
              Are you sure you want to suspend access for <strong>{user.name}</strong>? They will be immediately signed out and blocked from logging in.
            </p>
          )}

          {isReset && (
            <p className="text-zinc-300 leading-relaxed">
              A temporary password reset link will be sent to <strong>{user.email}</strong>. Active sessions will remain valid until password change.
            </p>
          )}
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
            disabled={!canConfirmDelete}
            onClick={handleConfirm}
            className={`text-xs font-semibold px-4 py-2 ${
              isDelete || isSuspend
                ? 'bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isDelete && 'Confirm Delete'}
            {isSuspend && 'Suspend Account'}
            {isImpersonate && 'Proceed Impersonation'}
            {isReset && 'Send Reset Link'}
          </Button>
        </div>
      </div>
    </div>
  );
}
