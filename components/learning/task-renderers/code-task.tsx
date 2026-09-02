'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Zap, Code } from 'lucide-react';
import type { TaskRendererProps } from '../task-renderer';

export function CodeTaskRenderer({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  const initialCode = task.codeSnippet || (task.taskContent as any)?.starterCode || '# Write your Python code here\n';
  const [code, setCode] = useState(initialCode);

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Code className="w-4 h-4 text-purple-400" /> Python Code Execution Lab
        </h3>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          Interactive Code Check
        </span>
      </div>

      <div className="space-y-2">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={task.completed}
          rows={6}
          className="w-full p-4 bg-black/80 border border-border rounded-xl font-mono text-xs text-purple-300 focus:outline-none focus:border-purple-500"
        />
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
          onClick={() => onSubmit({ code })}
          disabled={!code.trim() || isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40"
        >
          {isSubmitting ? 'Evaluating Code...' : 'Run & Validate Code'}
        </Button>
      )}
    </div>
  );
}
