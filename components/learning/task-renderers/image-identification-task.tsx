'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Zap } from 'lucide-react';
import type { TaskRendererProps } from '../task-renderer';

export function ImageIdentificationTask({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  const content = (task.taskContent as any) || {};
  const images: Array<{ id: string; label: string; url: string }> = content.images || [
    { id: 'img-1', label: 'Robot Dog', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&auto=format&fit=crop&q=80' },
    { id: 'img-2', label: 'Apple Fruit', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&auto=format&fit=crop&q=80' },
    { id: 'img-3', label: 'Humanoid Bot', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80' },
    { id: 'img-4', label: 'Wooden Table', url: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=300&auto=format&fit=crop&q=80' },
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Check className="w-4 h-4 text-purple-400" /> Visual Identification
      </h3>
      <p className="text-xs text-muted-foreground">{task.questionText || 'Select all pictures that represent AI or Robots:'}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img) => {
          const isSelected = selected.includes(img.id);
          return (
            <button
              key={img.id}
              onClick={() => toggleSelect(img.id)}
              disabled={task.completed}
              className={`group relative rounded-xl overflow-hidden border transition-all text-left ${
                isSelected
                  ? 'border-purple-500 ring-2 ring-purple-500/50'
                  : 'border-border hover:border-purple-500/40'
              }`}
            >
              <div className="aspect-square bg-secondary relative overflow-hidden">
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-purple-900/40 flex items-center justify-center">
                    <Check className="w-8 h-8 text-white font-bold" />
                  </div>
                )}
              </div>
              <div className="p-2 bg-secondary/80 text-[11px] font-bold text-foreground truncate text-center">
                {img.label}
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
          onClick={() => onSubmit({ selected })}
          disabled={selected.length === 0 || isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40"
        >
          {isSubmitting ? 'Validating...' : 'Submit Selections'}
        </Button>
      )}
    </div>
  );
}
