'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Zap } from 'lucide-react';
import type { TaskRendererProps } from '../task-renderer';

export function TrueFalseTask({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  const [selected, setSelected] = useState<'True' | 'False' | ''>('');

  const question = task.questionText || (task.taskContent as any)?.question || 'Is the statement above true or false?';

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Check className="w-4 h-4 text-emerald-400" /> True or False
      </h3>
      <p className="text-xs font-semibold text-foreground">{question}</p>

      <div className="grid grid-cols-2 gap-3">
        {(['True', 'False'] as const).map((opt) => {
          const isSelected = selected === opt;
          return (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              disabled={task.completed}
              className={`p-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200 ring-1 ring-purple-500/40'
                  : 'bg-secondary/40 border-border text-foreground hover:bg-secondary'
              } ${task.completed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span>{opt}</span>
            </button>
          );
        })}
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
          onClick={() => onSubmit(selected)}
          disabled={!selected || isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40"
        >
          {isSubmitting ? 'Validating...' : 'Submit Answer'}
        </Button>
      )}
    </div>
  );
}
