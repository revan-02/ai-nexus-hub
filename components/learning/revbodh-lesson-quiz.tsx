'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { RevBodhQuizQuestion } from '@/types/revbodh-course';

interface RevBodhLessonQuizProps {
  questions: RevBodhQuizQuestion[];
  onComplete?: (score: number, total: number) => void;
  onContinueNextLesson?: () => void;
}

export function RevBodhLessonQuiz({
  questions,
  onComplete,
  onContinueNextLesson,
}: RevBodhLessonQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [answersRecord, setAnswersRecord] = useState<Record<number, { selected: number; isCorrect: boolean }>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Handle clicking an option
  const handleSelectOption = (index: number) => {
    if (isChecked) return; // Prevent changing after checking answer
    setSelectedOption(index);
  };

  // Submit/Check current answer
  const handleCheckAnswer = () => {
    if (selectedOption === null || isChecked) return;

    const isCorrect = selectedOption === currentQ.correctAnswerIndex;
    setIsChecked(true);

    const updated = {
      ...answersRecord,
      [currentIndex]: { selected: selectedOption, isCorrect },
    };
    setAnswersRecord(updated);
  };

  // Move to next question or complete
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Calculate final score
      let correctCount = 0;
      Object.values(answersRecord).forEach((ans) => {
        if (ans.isCorrect) correctCount += 1;
      });

      setQuizFinished(true);
      if (onComplete) {
        onComplete(correctCount, totalQuestions);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
    }
  };

  // Retry entire quiz
  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setAnswersRecord({});
    setQuizFinished(false);
  };

  // Calculate final score stats
  const correctCount = Object.values(answersRecord).filter((a) => a.isCorrect).length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPassed = scorePercent >= 70;

  // ─────────────────────────────────────────────────────────────────────────
  // VIEW: QUIZ COMPLETED SUMMARY SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (quizFinished) {
    return (
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-card via-secondary/20 to-card border-purple-500/30 rounded-2xl space-y-6 shadow-xl text-center">
        <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border shadow-lg ${
          isPassed
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
        }`}>
          <Trophy className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Quiz Assessment Completed
          </span>
          <h3 className="text-2xl font-bold text-foreground">
            {isPassed ? 'Congratulations! You Passed 🎉' : 'Keep Practicing!'}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            {isPassed
              ? `You scored ${scorePercent}% (${correctCount}/${totalQuestions} correct). You have successfully met the 70% passing requirement.`
              : `You scored ${scorePercent}% (${correctCount}/${totalQuestions} correct). Review the explanations below and try again to unlock the next module.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleRetry}
            className="w-full sm:w-auto h-10 px-5 text-xs font-semibold rounded-xl border-border bg-secondary/60 text-foreground cursor-pointer gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Quiz</span>
          </Button>

          {isPassed && onContinueNextLesson && (
            <Button
              type="button"
              onClick={onContinueNextLesson}
              className="w-full sm:w-auto h-10 px-6 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-950/40 cursor-pointer gap-2"
            >
              <span>Continue to Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VIEW: 1-QUESTION-AT-A-TIME SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const isCurrentCorrect = selectedOption === currentQ.correctAnswerIndex;

  return (
    <Card className="p-6 sm:p-7 bg-gradient-to-br from-card via-secondary/20 to-card border-purple-500/20 rounded-2xl space-y-6 shadow-xl">
      {/* Top Header & Step Indicator */}
      <div className="space-y-3 border-b border-border/50 pb-4">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2 text-foreground">
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-400">
              <HelpCircle className="w-4 h-4" />
            </span>
            <span>Interactive Knowledge Check</span>
          </div>
          <span className="text-purple-400 font-mono">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Details */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-sm sm:text-base font-bold text-foreground leading-snug">
            {currentQ.question}
          </h4>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-secondary text-muted-foreground shrink-0 border border-border/40">
            {currentQ.type.replace('_', ' ')}
          </span>
        </div>

        {currentQ.hint && !isChecked && (
          <p className="text-xs text-amber-300/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            💡 <strong>Hint:</strong> {currentQ.hint}
          </p>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {currentQ.options.map((optText, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
          const isSelected = selectedOption === optIdx;
          const isCorrectChoice = optIdx === currentQ.correctAnswerIndex;

          let optionClasses = 'border-border/60 bg-secondary/30 hover:bg-secondary/70 text-foreground';

          if (isChecked) {
            if (isCorrectChoice) {
              optionClasses = 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold ring-1 ring-emerald-500/40';
            } else if (isSelected && !isCorrectChoice) {
              optionClasses = 'border-rose-500 bg-rose-500/15 text-rose-300 line-through ring-1 ring-rose-500/40';
            } else {
              optionClasses = 'border-border/40 opacity-40 text-muted-foreground';
            }
          } else if (isSelected) {
            optionClasses = 'border-purple-500 bg-purple-500/20 text-purple-200 font-semibold ring-1 ring-purple-500/50';
          }

          return (
            <button
              key={optIdx}
              type="button"
              disabled={isChecked}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 transition-all cursor-pointer ${optionClasses}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 border ${
                  isSelected
                    ? isChecked
                      ? isCorrectChoice
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                        : 'border-rose-400 bg-rose-500/20 text-rose-300'
                      : 'border-purple-400 bg-purple-500/30 text-purple-200'
                    : 'border-border bg-card text-muted-foreground'
                }`}>
                  {letter}
                </span>
                <span className="leading-relaxed">{optText}</span>
              </div>

              {isChecked && isCorrectChoice && (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {isChecked && isSelected && !isCorrectChoice && (
                <X className="w-4 h-4 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate Answer Feedback Banner */}
      {isChecked && (
        <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-300 ${
          isCurrentCorrect
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="font-bold flex items-center gap-2">
            {isCurrentCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Correct! Well done.</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Incorrect.</span>
              </>
            )}
          </div>
          {currentQ.explanation && (
            <p className="text-zinc-200 pt-1">
              <strong>Explanation:</strong> {currentQ.explanation}
            </p>
          )}
        </div>
      )}

      {/* Bottom Button Toolbar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="text-xs text-muted-foreground">
          {selectedOption === null && !isChecked && (
            <span>Select an option above to continue</span>
          )}
        </div>

        {!isChecked ? (
          <Button
            type="button"
            disabled={selectedOption === null}
            onClick={handleCheckAnswer}
            className="h-10 px-6 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-950/30 cursor-pointer"
          >
            <span>Submit Answer</span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNextQuestion}
            className="h-10 px-6 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-950/30 cursor-pointer gap-2"
          >
            <span>{isLastQuestion ? 'Complete Quiz & View Score' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
