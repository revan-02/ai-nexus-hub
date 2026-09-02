'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Zap, Sparkles } from 'lucide-react';
import type { TaskRendererProps } from '../task-renderer';

export function MemoryGameTask({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  const content = (task.taskContent as any) || {};
  const cards: Array<{ id: number; text: string; matchId: number }> = content.cards || [
    { id: 1, text: 'AI', matchId: 1 },
    { id: 2, text: 'Artificial Intelligence', matchId: 1 },
    { id: 3, text: 'ML', matchId: 2 },
    { id: 4, text: 'Machine Learning', matchId: 2 },
  ];

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const handleCardClick = (id: number, matchId: number) => {
    if (flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = cards.find((c) => c.id === newFlipped[0]);
      const secondCard = cards.find((c) => c.id === newFlipped[1]);

      if (firstCard && secondCard && firstCard.matchId === secondCard.matchId) {
        setMatched((prev) => [...prev, firstCard.id, secondCard.id]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const isGameComplete = matched.length === cards.length;

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" /> Memory Match Game
      </h3>
      <p className="text-xs text-muted-foreground">Click cards to flip and match AI terms with their definitions.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card) => {
          const isFaceUp = flipped.includes(card.id) || matched.includes(card.id);
          const isMatch = matched.includes(card.id);

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id, card.matchId)}
              disabled={task.completed || isMatch}
              className={`h-24 rounded-xl border font-bold text-xs transition-all flex items-center justify-center p-3 text-center ${
                isMatch
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : isFaceUp
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                  : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              {isFaceUp ? card.text : '❓'}
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
          onClick={() => onSubmit({ completed: true, score: 100 })}
          disabled={!isGameComplete || isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40"
        >
          {isSubmitting ? 'Validating...' : isGameComplete ? 'Complete Game & Claim XP' : 'Match All Pairs to Complete'}
        </Button>
      )}
    </div>
  );
}
