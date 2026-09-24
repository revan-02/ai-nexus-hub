import React from 'react';
import { Flame, ArrowRight, Zap, Code2 } from 'lucide-react';
import Link from 'next/link';

export function DailyChallengeCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 relative overflow-hidden group hover:border-orange-500/40 transition-all shadow-sm">
      {/* Subtle background glow effect */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/15 transition-all" />

      {/* Header: Badge & XP */}
      <div className="flex items-center justify-between gap-2 mb-2.5 relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
            <Flame className="w-3.5 h-3.5 fill-orange-500/20" />
          </div>
          <span className="text-xs font-bold text-foreground tracking-tight">Daily AI Challenge</span>
        </div>
        <span className="text-[11px] font-bold font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
          +50 XP
        </span>
      </div>

      {/* Body: Title & Problem Statement */}
      <div className="space-y-1 relative z-10 mb-3">
        <h4 className="font-bold text-sm text-foreground leading-snug group-hover:text-orange-400 transition-colors">
          Optimize the Loss Function
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          Given a skewed dataset, rewrite the standard MSE loss function to penalize false negatives more heavily.
        </p>
      </div>

      {/* Rearranged Compact Footer: Badges on Left + Action on Right */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-border/60 relative z-10">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary border border-border">
            <Zap className="w-3 h-3 text-amber-400" />
            Intermediate
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary border border-border">
            <Code2 className="w-3 h-3 text-blue-400" />
            PyTorch
          </span>
        </div>

        <Link
          href="/daily-challenge"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm shadow-orange-500/20 hover:shadow-orange-500/30 group/btn"
        >
          <span>Solve</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
