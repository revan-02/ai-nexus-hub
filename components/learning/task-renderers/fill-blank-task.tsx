'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, RotateCcw, Zap } from 'lucide-react';
import type { TaskRendererProps } from '../task-renderer';

export function FillBlankTask({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  const [text, setText] = useState('');

  const promptText = task.questionText || (task.taskContent as any)?.prompt || 'Fill in the missing keyword:';

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Check className="w-4 h-4 text-purple-400" /> Fill in the Blank
      </h3>
      <p className="text-xs font-semibold text-foreground">{promptText}</p>

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={task.completed}
        placeholder="Type your answer here..."
        className="bg-secondary/40 border-border text-foreground text-xs h-10 rounded-xl focus:border-purple-500 font-mono"
      />

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
          onClick={() => onSubmit({ text: text.trim() })}
          disabled={!text.trim() || isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40"
        >
          {isSubmitting ? 'Validating...' : 'Submit Answer'}
        </Button>
      )}
    </div>
  );
}
