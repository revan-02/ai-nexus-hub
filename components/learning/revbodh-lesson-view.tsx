'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Clock,
  Sparkles,
  AlertTriangle,
  Briefcase,
  Layers,
  Code2,
  HelpCircle,
  Trophy,
  ArrowRight,
  Terminal,
  Lock,
  MessageSquare,
  Bot,
  Copy,
  Check,
  Award
} from 'lucide-react';
import { RevBodhCourse, RevBodhModule, RevBodhLesson } from '@/types/revbodh-course';
import { RevBodhCourseService, UserCourseProgressData } from '@/services/revbodh-course-service';
import { RevBodhCodeSandbox } from '@/components/learning/revbodh-code-sandbox';
import { RevBodhLessonQuiz } from '@/components/learning/revbodh-lesson-quiz';
import { RevBodhAITutor } from '@/components/learning/revbodh-ai-tutor';
import { MarkdownRenderer } from '@/components/ai/markdown-renderer';

interface RevBodhLessonViewProps {
  course: RevBodhCourse;
  initialLessonId?: string;
}

export function RevBodhLessonView({ course, initialLessonId }: RevBodhLessonViewProps) {
  // Find initial lesson or default to first lesson of first module
  const allLessons: { module: RevBodhModule; lesson: RevBodhLesson }[] = [];
  course.modules.forEach((mod) => {
    mod.lessons.forEach((les) => {
      allLessons.push({ module: mod, lesson: les });
    });
  });

  const [activeLessonId, setActiveLessonId] = useState<string>(
    initialLessonId || allLessons[0]?.lesson.id || ''
  );
  const [progress, setProgress] = useState<UserCourseProgressData>(
    RevBodhCourseService.getUserProgress(course.id)
  );
  const [revealedInterviewAnswers, setRevealedInterviewAnswers] = useState<Record<string, boolean>>({});
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);

  // Sync progress from localStorage
  useEffect(() => {
    setProgress(RevBodhCourseService.getUserProgress(course.id));
  }, [course.id, activeLessonId]);

  const activeLessonData = allLessons.find((item) => item.lesson.id === activeLessonId) || allLessons[0];
  const activeIndex = allLessons.findIndex((item) => item.lesson.id === activeLessonId);
  const prevLesson = activeIndex > 0 ? allLessons[activeIndex - 1] : null;
  const nextLesson = activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null;

  if (!activeLessonData) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No lessons available for this course yet.
      </div>
    );
  }

  const { module: activeModule, lesson: currentLesson } = activeLessonData;
  const isLessonCompleted = progress.completedLessons.includes(currentLesson.id);

  const handleCompleteLesson = () => {
    const updated = RevBodhCourseService.markLessonComplete(course.id, currentLesson.id);
    setProgress(updated);
    if (nextLesson) {
      setActiveLessonId(nextLesson.lesson.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuizCompleted = (score: number, total: number) => {
    const updated = RevBodhCourseService.recordQuizScore(course.id, currentLesson.id, score, total);
    setProgress(updated);
  };

  const handleCopyCode = (codeText: string, idx: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedSnippetIndex(idx);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  const totalCourseLessons = allLessons.length;
  const completedLessonsCount = allLessons.filter((item) =>
    progress.completedLessons.includes(item.lesson.id)
  ).length;
  const courseProgressPercent =
    totalCourseLessons > 0 ? Math.round((completedLessonsCount / totalCourseLessons) * 100) : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* ─────────────────────────────────────────────────────────────────
          LEFT COLUMN: STICKY COURSE CURRICULUM DRAWER & PROGRESS
      ───────────────────────────────────────────────────────────────── */}
      <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-20 space-y-4">
        {/* Course Progress Card */}
        <Card className="p-4 bg-card border-border rounded-2xl space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Course Progress</span>
            </span>
            <span className="text-purple-400 font-mono">
              {completedLessonsCount}/{totalCourseLessons} ({courseProgressPercent}%)
            </span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${courseProgressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1">
            <span>{course.level} → Advanced</span>
            <span className="font-semibold text-emerald-400">100% Original RevBodh</span>
          </div>
        </Card>

        {/* Modules & Lessons Navigation Accordion */}
        <div className="p-3 bg-secondary/30 border border-border/70 rounded-2xl space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 pt-1">
            Curriculum Structure
          </div>

          <div className="space-y-3">
            {course.modules.map((mod, modIdx) => {
              const isCurrentModule = mod.id === activeModule.id;
              const completedInModule = mod.lessons.filter((l) =>
                progress.completedLessons.includes(l.id)
              ).length;

              return (
                <div key={mod.id} className="space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-foreground/90">
                    <span className="truncate">
                      {mod.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2 font-mono">
                      {completedInModule}/{mod.lessons.length}
                    </span>
                  </div>

                  <div className="space-y-0.5 pl-2 border-l-2 border-border/60">
                    {mod.lessons.map((les) => {
                      const isSelected = les.id === activeLessonId;
                      const isCompleted = progress.completedLessons.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          onClick={() => {
                            setActiveLessonId(les.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600 text-white font-semibold shadow-md'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isCompleted ? (
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                            ) : (
                              <span className={`w-3.5 h-3.5 rounded-full border shrink-0 flex items-center justify-center text-[9px] ${
                                isSelected ? 'border-white text-white' : 'border-zinc-500 text-zinc-500'
                              }`}>
                                {les.orderNumber}
                              </span>
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className={`text-[10px] shrink-0 font-mono ${isSelected ? 'text-purple-200' : 'text-zinc-500'}`}>
                            {les.durationMinutes}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────────
          RIGHT COLUMN: FULL ORIGINAL REVBODH LESSON CONTENT
      ───────────────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full space-y-8 select-text">
        {/* Lesson Header Banner */}
        <div className="p-6 bg-gradient-to-br from-purple-950/40 via-card to-card border border-purple-500/20 rounded-2xl space-y-3 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold">
              <span>{activeModule.title}</span>
              <span>/</span>
              <span>Lesson {currentLesson.orderNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentLesson.durationMinutes} mins</span>
              </span>
              {isLessonCompleted && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {currentLesson.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {currentLesson.conceptExplanation.summary}
          </p>
        </div>

        {/* ── SECTION A: LEARNING OBJECTIVES ── */}
        <Card className="p-6 bg-card border-border/80 rounded-2xl space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <span className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3>Learning Objectives</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            By the end of this lesson, you will be able to:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {currentLesson.learningObjectives.map((obj, i) => (
              <li
                key={i}
                className="p-3 rounded-xl bg-secondary/40 border border-border/60 text-xs text-foreground flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* ── SECTION B: CONCEPT EXPLANATION ── */}
        <Card className="p-6 bg-card border-border/80 rounded-2xl space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </span>
            <h3>Concept Deep-Dive</h3>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-xs sm:text-sm leading-relaxed">
            <MarkdownRenderer content={currentLesson.conceptExplanation.detailedMarkdown} />
          </div>

          {/* Key Terms */}
          {currentLesson.conceptExplanation.keyTerms.length > 0 && (
            <div className="pt-3 border-t border-border/60 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Key Technical Terms
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentLesson.conceptExplanation.keyTerms.map((term, i) => (
                  <div key={i} className="p-3 rounded-xl bg-secondary/30 border border-border/50 text-xs">
                    <span className="font-bold text-foreground">{term.term}: </span>
                    <span className="text-muted-foreground">{term.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* ── SECTION C: EXAMPLES & CODE WALKTHROUGHS ── */}
        {currentLesson.examples.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Code2 className="w-4 h-4" />
              </span>
              <h3>Practical Code Examples</h3>
            </div>

            <div className="space-y-4">
              {currentLesson.examples.map((ex, idx) => (
                <Card key={idx} className="p-5 bg-zinc-950 border-border rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-foreground">{ex.title}</h4>
                      <p className="text-[11px] text-muted-foreground">{ex.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyCode(ex.code, idx)}
                      className="h-7 text-xs gap-1 border-border bg-secondary/50 text-foreground"
                    >
                      {copiedSnippetIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedSnippetIndex === idx ? 'Copied' : 'Copy'}</span>
                    </Button>
                  </div>

                  <pre className="p-3 rounded-xl bg-black overflow-x-auto text-xs font-mono text-zinc-200 leading-relaxed border border-border/40 select-text">
                    <code>{ex.code}</code>
                  </pre>

                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 text-xs text-muted-foreground">
                    <span className="font-semibold text-purple-300">How it works: </span>
                    {ex.outputExplanation}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION D: COMMON MISTAKES TO AVOID ── */}
        {currentLesson.commonMistakes.length > 0 && (
          <Card className="p-6 bg-card border-rose-500/20 rounded-2xl space-y-4 shadow-md">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <span className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3>Common Mistakes & How to Avoid Them</h3>
            </div>

            <div className="space-y-4">
              {currentLesson.commonMistakes.map((mis, i) => (
                <div key={i} className="p-4 rounded-xl bg-secondary/30 border border-border/60 space-y-2 text-xs">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{mis.mistake}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Why it happens: </strong>
                    {mis.whyItHappens}
                  </p>
                  <p className="text-emerald-300 leading-relaxed">
                    <strong className="text-emerald-400">How to fix it: </strong>
                    {mis.howToAvoid}
                  </p>

                  {(mis.badCodeSnippet || mis.goodCodeSnippet) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      {mis.badCodeSnippet && (
                        <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-200">
                          <div className="text-[10px] font-bold text-rose-400 uppercase pb-1">❌ What to avoid:</div>
                          <code>{mis.badCodeSnippet}</code>
                        </div>
                      )}
                      {mis.goodCodeSnippet && (
                        <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                          <div className="text-[10px] font-bold text-emerald-400 uppercase pb-1">✅ Correct pattern:</div>
                          <code>{mis.goodCodeSnippet}</code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── SECTION E: REAL-WORLD APPLICATION ── */}
        <Card className="p-6 bg-card border-border/80 rounded-2xl space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </span>
            <h3>Real-World Industry Application</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {currentLesson.realWorldApplication.industryContext}
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-purple-300">Where this is used in production:</span>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
              {currentLesson.realWorldApplication.useCases.map((uc, i) => (
                <li key={i}>{uc}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-secondary/40 rounded-xl border border-border/50 text-xs text-foreground">
            <span className="font-semibold text-amber-300">💡 Production Tip: </span>
            {currentLesson.realWorldApplication.productionTip}
          </div>
        </Card>

        {/* ── SECTION F: INTERACTIVE PRACTICE CHALLENGE ── */}
        {currentLesson.practiceChallenge && (
          <div className="space-y-2">
            <RevBodhCodeSandbox
              challenge={currentLesson.practiceChallenge}
              onSuccess={() => {
                const updated = RevBodhCourseService.recordChallengeComplete(
                  course.id,
                  currentLesson.practiceChallenge!.id
                );
                setProgress(updated);
              }}
            />
          </div>
        )}

        {/* ── SECTION G: LESSON QUIZ ── */}
        {currentLesson.quizQuestions.length > 0 && (
          <div className="space-y-2">
            <RevBodhLessonQuiz
              questions={currentLesson.quizQuestions}
              onComplete={handleQuizCompleted}
            />
          </div>
        )}

        {/* ── SECTION H: TECHNICAL INTERVIEW QUESTIONS ── */}
        {currentLesson.interviewQuestions.length > 0 && (
          <Card className="p-6 bg-card border-border/80 rounded-2xl space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Briefcase className="w-4 h-4" />
                </span>
                <h3>Technical Interview Questions</h3>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {currentLesson.interviewQuestions.length} Questions
              </span>
            </div>

            <div className="space-y-3">
              {currentLesson.interviewQuestions.map((iq) => {
                const isRevealed = revealedInterviewAnswers[iq.id];

                return (
                  <div key={iq.id} className="p-4 rounded-xl bg-secondary/30 border border-border/60 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {iq.difficulty} Level
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-foreground pt-1">
                          "{iq.question}"
                        </h4>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setRevealedInterviewAnswers((prev) => ({
                            ...prev,
                            [iq.id]: !prev[iq.id],
                          }))
                        }
                        className="text-xs text-purple-400 hover:text-purple-300 shrink-0"
                      >
                        {isRevealed ? 'Hide Answer' : 'Show Answer'}
                      </Button>
                    </div>

                    {/* Key Concepts Expected */}
                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-foreground">Interview Rubric:</span>
                      {iq.expectedConcepts.map((ec, i) => (
                        <span key={i} className="px-2 py-0.5 bg-secondary text-zinc-300 rounded text-[11px] border border-border/40">
                          {ec}
                        </span>
                      ))}
                    </div>

                    {/* Collapsible Answer */}
                    {isRevealed && (
                      <div className="p-3 bg-secondary/60 rounded-xl border border-purple-500/20 text-xs text-foreground space-y-1.5">
                        <span className="font-semibold text-purple-300">Model Answer:</span>
                        <p className="leading-relaxed text-zinc-200">{iq.exampleAnswer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* ── SECTION I: ASK REVBODH AI TUTOR ── */}
        <RevBodhAITutor lesson={currentLesson} moduleTitle={activeModule.title} />

        {/* ── BOTTOM ACTION BAR: COMPLETION & NAVIGATION ── */}
        <div className="p-6 bg-gradient-to-r from-card via-secondary/40 to-card border border-border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            {prevLesson ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveLessonId(prevLesson.lesson.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="gap-1.5 text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </Button>
            ) : (
              <div />
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleCompleteLesson}
              className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-6 shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLessonCompleted ? 'Next Lesson' : 'Complete Lesson & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
