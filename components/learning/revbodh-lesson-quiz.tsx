'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { RevBodhQuizQuestion } from '@/types/revbodh-course';

interface RevBodhLessonQuizProps {
  questions: RevBodhQuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export function RevBodhLessonQuiz({ questions, onComplete }: RevBodhLessonQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleGradeQuiz = () => {
    setSubmitted(true);
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount += 1;
      }
    });

    if (onComplete) {
      onComplete(correctCount, questions.length);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.filter((q) => selectedAnswers[q.id] === q.correctAnswerIndex).length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPassed = scorePercentage >= 70;

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary/30 border-purple-500/20 rounded-2xl space-y-6 shadow-xl">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
              <HelpCircle className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-foreground">Interactive Knowledge Check</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Test your understanding with {totalQuestions} concept and scenario questions. 70% required to pass.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-3">
            <div className={`px-4 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              isPassed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              <Trophy className="w-4 h-4" />
              <span>Score: {scorePercentage}% ({correctCount}/{totalQuestions})</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleRetry} className="h-8 text-xs gap-1">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground font-mono">
            Answered: {answeredCount}/{totalQuestions}
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = selected !== undefined;
          const isCorrect = selected === q.correctAnswerIndex;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-rose-500/5 border-rose-500/30'
                  : 'bg-secondary/40 border-border/60'
              }`}
            >
              {/* Question Label */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-foreground">
                  {qIndex + 1}. {q.question}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-secondary text-muted-foreground uppercase tracking-wider shrink-0">
                  {q.type.replace('_', ' ')}
                </span>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((option, optIndex) => {
                  const isSelected = selected === optIndex;
                  const isCorrectChoice = optIndex === q.correctAnswerIndex;

                  let optionStyle = 'border-border/60 bg-card hover:bg-secondary/80 text-foreground';

                  if (submitted) {
                    if (isCorrectChoice) {
                      optionStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold';
                    } else if (isSelected && !isCorrectChoice) {
                      optionStyle = 'border-rose-500 bg-rose-500/20 text-rose-300 line-through';
                    } else {
                      optionStyle = 'border-border/40 opacity-50 text-muted-foreground';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-purple-500 bg-purple-500/20 text-purple-200 font-semibold shadow-sm';
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      disabled={submitted}
                      className={`w-full text-left p-3 rounded-lg border text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold bg-secondary/80 border border-border">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {submitted && isCorrectChoice && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {submitted && isSelected && !isCorrectChoice && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown upon submission) */}
              {submitted && (
                <div className={`mt-3 p-3 rounded-lg text-xs space-y-1 ${
                  isCorrect ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                }`}>
                  <div className="font-semibold flex items-center gap-1.5">
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                  </div>
                  <p className="text-foreground/90 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grade Button */}
      {!submitted && (
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleGradeQuiz}
            disabled={answeredCount === 0}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md"
          >
            <span>Submit Quiz & View Results</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}
