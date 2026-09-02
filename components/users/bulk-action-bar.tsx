'use client';

import React from 'react';
import { ShieldCheck, Download, UserX, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAction: (action: string) => void;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onBulkAction,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#181820] border border-purple-500/40 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center gap-2 pr-2 border-r border-[#272730] text-xs">
        <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
          {selectedCount}
        </span>
        <span className="font-semibold">{selectedCount} users selected</span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkAction('assign-role')}
          className="bg-[#121217] border-[#272730] hover:bg-[#20202b] text-zinc-200 gap-1.5 text-xs h-8"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          Assign Role
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkAction('export')}
          className="bg-[#121217] border-[#272730] hover:bg-[#20202b] text-zinc-200 gap-1.5 text-xs h-8"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          Export
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkAction('suspend')}
          className="bg-[#121217] border-[#272730] hover:bg-rose-500/10 text-rose-300 border-rose-500/30 gap-1.5 text-xs h-8"
        >
          <UserX className="w-3.5 h-3.5" />
          Suspend
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkAction('delete')}
          className="bg-rose-600 hover:bg-rose-700 text-white border-none gap-1.5 text-xs h-8 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>

      <button
        onClick={onClearSelection}
        className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors ml-2"
        title="Clear selection"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
