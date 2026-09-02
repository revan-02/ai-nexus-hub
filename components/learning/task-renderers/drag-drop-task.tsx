'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Zap } from 'lucide-react';
import type { TaskRendererProps } from '../task-renderer';

export function DragDropTask({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  const content = (task.taskContent as any) || {};
  const items: string[] = content.items || ['Data', 'Weights', 'Predictions'];
  const zones: string[] = content.zones || ['Input Layer', 'Hidden Layer', 'Output Layer'];

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleZoneClick = (zone: string) => {
    if (!activeItem) return;
    setPlacements((prev) => ({ ...prev, [activeItem]: zone }));
    setActiveItem(null);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Check className="w-4 h-4 text-purple-400" /> Interactive Drag & Drop / Zone Placement
      </h3>
      <p className="text-xs text-muted-foreground">Select an item from the top, then place it in the target zone below.</p>

      {/* Available Items */}
      <div className="flex items-center gap-2 flex-wrap p-3 bg-secondary/30 rounded-xl border border-border">
        <span className="text-[11px] font-bold text-muted-foreground mr-2">Items:</span>
        {items.map((item) => {
          const isPlaced = !!placements[item];
          const isSelected = activeItem === item;
          return (
            <button
              key={item}
              onClick={() => setActiveItem(item)}
              disabled={task.completed}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                  : isPlaced
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
              }`}
            >
              {item} {placements[item] ? `(${placements[item]})` : ''}
            </button>
          );
        })}
      </div>

      {/* Target Zones */}
      <div className="grid grid-cols-3 gap-3">
        {zones.map((zone) => {
          const placedItems = Object.entries(placements).filter(([, z]) => z === zone).map(([item]) => item);
          return (
            <button
              key={zone}
              onClick={() => handleZoneClick(zone)}
              disabled={task.completed || !activeItem}
              className={`p-4 rounded-xl border text-center transition-all min-h-[100px] flex flex-col justify-between ${
                activeItem
                  ? 'bg-purple-500/10 border-purple-500/50 hover:bg-purple-500/20 cursor-pointer'
                  : 'bg-secondary/20 border-border'
              }`}
            >
              <span className="text-xs font-bold text-foreground">{zone}</span>
              <div className="space-y-1 mt-2">
                {placedItems.map((pi) => (
                  <span key={pi} className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded border border-emerald-500/30">
                    {pi}
                  </span>
                ))}
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
          onClick={() => onSubmit({ placements })}
          disabled={Object.keys(placements).length === 0 || isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40"
        >
          {isSubmitting ? 'Validating...' : 'Submit Placement'}
        </Button>
      )}
    </div>
  );
}
