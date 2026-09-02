'use client';

import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PermissionState } from '@/lib/mock-data/permissions-data';

interface ConfirmPermissionChangeModalProps {
  open: boolean;
  roleName: string;
  resourceName: string;
  actionName: string;
  currentState: PermissionState;
  nextState: PermissionState;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmPermissionChangeModal({
  open,
  roleName,
  resourceName,
  actionName,
  currentState,
  nextState,
  onOpenChange,
  onConfirm,
}: ConfirmPermissionChangeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      <div className="relative w-full max-w-md bg-[#121217] border border-[#272730] text-zinc-100 p-6 shadow-2xl rounded-2xl z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Confirm Permission Change</h3>
              <p className="text-xs text-zinc-400">Security Access Update</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Change Details */}
        <div className="p-4 bg-[#181820] border border-[#272730] rounded-xl space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-400">Target Role:</span>
            <span className="font-bold text-white">{roleName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Permission:</span>
            <span className="font-semibold text-purple-300">
              {resourceName} → {actionName}
            </span>
          </div>
          <div className="flex justify-between border-t border-[#23232b] pt-2">
            <span className="text-zinc-400">Current Access:</span>
            <span className="font-mono uppercase text-zinc-300">{currentState}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">New Access:</span>
            <span className="font-mono uppercase font-bold text-purple-400">{nextState}</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Updating this permission will immediately affect access rights for users assigned to the <strong>{roleName}</strong> role.
        </p>

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
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2"
          >
            Confirm Change
          </Button>
        </div>
      </div>
    </div>
  );
}
