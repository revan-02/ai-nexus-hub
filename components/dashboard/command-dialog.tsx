'use client';

import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Sliders, Shield, Brain, Database, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandSearchDialog({ open, onOpenChange }: CommandDialogProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const quickLinks = [
    { label: 'Add New User', category: 'User Management', icon: UserPlus },
    { label: 'Configure AI Models', category: 'AI Control', icon: Brain },
    { label: 'System Settings', category: 'Configuration', icon: Sliders },
    { label: 'Upload Dataset', category: 'Content', icon: Database },
    { label: 'Manage Roles & Permissions', category: 'Security', icon: Shield },
    { label: 'Prompt Engineering Playground', category: 'AI Tools', icon: Sparkles },
  ];

  const filtered = quickLinks.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => onOpenChange(false)}
      />
      
      <div className="relative w-full max-w-xl bg-[#121217] border border-[#272730] text-zinc-100 p-0 shadow-2xl rounded-2xl overflow-hidden z-10">
        <div className="flex items-center px-4 border-b border-[#272730] py-3 gap-3">
          <Search className="w-5 h-5 text-zinc-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, users, datasets, AI models... (ESC to exit)"
            className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-zinc-100 placeholder:text-zinc-500 h-8 flex-1"
            autoFocus
          />
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 text-zinc-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto space-y-1">
          <p className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Quick Actions & Commands
          </p>
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onOpenChange(false)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs hover:bg-[#1c1c24] transition-colors group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-zinc-200 font-medium">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 bg-[#18181f] px-2 py-0.5 rounded border border-[#272730]">
                    {item.category}
                  </span>
                </button>
              );
            })
          ) : (
            <p className="px-3 py-6 text-center text-xs text-zinc-400">
              No matching commands or actions found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
