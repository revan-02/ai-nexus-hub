'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Zap } from 'lucide-react';
import type { TaskRendererProps } from '../task-renderer';

export function MatchingTask({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  const content = (task.taskContent as any) || {};
  const items: string[] = content.items || task.options || ['Neural Net', 'Loss Function', 'Optimizer'];
  const targets: string[] = content.targets || ['Model Brain', 'Measures Error', 'Updates Weights'];

  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleTargetClick = (target: string) => {
    if (!selectedItem) return;
    setMatches((prev) => ({ ...prev, [selectedItem]: target }));
    setSelectedItem(null);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Check className="w-4 h-4 text-purple-400" /> Match the Concepts
      </h3>
      <p className="text-xs text-muted-foreground">Click an item on the left, then click its corresponding definition on the right.</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column - Items */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Concept</p>
          {items.map((item) => {
            const isSelected = selectedItem === item;
            const matchedTarget = matches[item];
            return (
              <button
                key={item}
                onClick={() => setSelectedItem(item)}
                disabled={task.completed}
                className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-purple-600/30 border-purple-500 text-purple-200 ring-2 ring-purple-500'
                    : matchedTarget
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-secondary/40 border-border text-foreground hover:bg-secondary'
                }`}
              >
                <div>{item}</div>
                {matchedTarget && (
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">→ {matchedTarget}</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column - Targets */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Definition</p>
          {targets.map((target) => {
            const isAssigned = Object.values(matches).includes(target);
            return (
              <button
                key={target}
                onClick={() => handleTargetClick(target)}
                disabled={task.completed || !selectedItem}
                className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                  isAssigned
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : selectedItem
                    ? 'bg-purple-500/10 border-purple-500/40 text-foreground hover:bg-purple-500/20 cursor-pointer'
                    : 'bg-secondary/20 border-border text-muted-foreground'
                }`}
              >
                {target}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 border ${
          feedback.isCorrect
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        }`}>
          {feedback.isCorrect ? <Check className="w-5 h-5 text-emerald-400" /> : <RotateCcw className="w-5 h-5 text-rose-400" />}
          <span>{feedback.message}</span>
          {feedback.xpEarned > 0 && (
            <span className="ml-auto flex items-center gap-1 text-amber-400">
              <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{feedback.xpEarned} XP
            </span>
          )}
        </div>
      )}

      {!task.completed && (
        <Button
          onClick={() => onSubmit({ matches })}
          disabled={Object.keys(matches).length === 0 || isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40"
        >
          {isSubmitting ? 'Validating...' : 'Submit Matches'}
        </Button>
      )}
    </div>
  );
}
