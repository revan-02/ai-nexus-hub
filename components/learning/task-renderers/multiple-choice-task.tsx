'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Zap } from 'lucide-react';
import type { TaskRendererProps } from '../task-renderer';

export function MultipleChoiceTask({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const options = task.options?.length > 0
    ? task.options
    : (task.taskContent as any)?.options || [];

  const question = task.questionText || (task.taskContent as any)?.question || '';

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Check className="w-4 h-4 text-emerald-400" /> Knowledge Check
      </h3>
      {question && <p className="text-xs font-semibold text-foreground">{question}</p>}

      <div className="space-y-2">
        {options.map((opt: string, i: number) => {
          const isSelected = selectedOption === opt;
          return (
            <button
              key={i}
              onClick={() => setSelectedOption(opt)}
              disabled={task.completed}
              className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200 ring-1 ring-purple-500/40'
                  : 'bg-secondary/40 border-border text-foreground hover:bg-secondary'
              } ${task.completed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span>{opt}</span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-purple-400 bg-purple-600' : 'border-muted-foreground'}`}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
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
          onClick={() => onSubmit(selectedOption)}
          disabled={!selectedOption || isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40 gap-2"
        >
          {isSubmitting ? 'Validating...' : 'Submit Answer'}
        </Button>
      )}
    </div>
  );
}
