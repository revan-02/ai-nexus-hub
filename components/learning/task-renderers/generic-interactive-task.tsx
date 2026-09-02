'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Zap, Sparkles } from 'lucide-react';
import type { TaskRendererProps } from '../task-renderer';

export function GenericInteractiveTask({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" /> Interactive Challenge
      </h3>
      <p className="text-xs text-muted-foreground">{task.instructions}</p>

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
          onClick={() => onSubmit({ completed: true, score: 100 })}
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40"
        >
          {isSubmitting ? 'Validating...' : 'Complete Challenge & Claim XP'}
        </Button>
      )}
    </div>
  );
}
