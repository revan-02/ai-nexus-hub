'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, ArrowUp, ArrowDown, Zap } from 'lucide-react';
import type { TaskRendererProps } from '../task-renderer';

export function OrderingTask({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  const content = (task.taskContent as any) || {};
  const initialItems: string[] = content.items || task.options || ['Collect Data', 'Train Model', 'Evaluate', 'Deploy'];

  const [ordered, setOrdered] = useState<string[]>(initialItems);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...ordered];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setOrdered(newOrder);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Check className="w-4 h-4 text-purple-400" /> Arrange in Correct Sequence
      </h3>
      <p className="text-xs text-muted-foreground">Use the arrows to reorder the steps from first to last.</p>

      <div className="space-y-2">
        {ordered.map((item, idx) => (
          <div
            key={item}
            className="p-3.5 bg-secondary/40 border border-border rounded-xl flex items-center justify-between text-xs font-semibold text-foreground"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-400 font-mono font-bold flex items-center justify-center text-xs">
                {idx + 1}
              </span>
              <span>{item}</span>
            </div>

            {!task.completed && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === ordered.length - 1}
                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
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
          onClick={() => onSubmit({ ordered })}
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40"
        >
          {isSubmitting ? 'Validating...' : 'Submit Order'}
        </Button>
      )}
    </div>
  );
}
