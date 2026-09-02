'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowLeft,
  Lock,
  HelpCircle,
  Award,
  ChevronRight,
  Zap,
  BookOpen,
  Check,
  RotateCcw,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useRoom, useSubmitTask } from '@/hooks/api/use-rooms';
import { TaskRenderer } from '@/components/learning/task-renderer';
import { MicroLearningPlayer, DifficultyLevel } from '@/components/learning/micro-learning-player';
import type { SubmitResult } from '@/lib/api/endpoints/rooms';

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { data: roomResponse, isLoading, isError, refetch } = useRoom(roomId);
  const submitTaskMutation = useSubmitTask(roomId);

  const room = roomResponse?.data;
  const tasks = room?.tasks || [];

  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<SubmitResult | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('INTERMEDIATE');

  // Resume at first uncompleted task and sync difficulty
  useEffect(() => {
    if (room) {
      if (room.level === 'Novice') setDifficultyLevel('BASIC');
      else if (room.level === 'Advanced' || room.level === 'Expert') setDifficultyLevel('ADVANCED');
      else setDifficultyLevel('INTERMEDIATE');
    }
    if (tasks.length > 0) {
      const firstUncompleted = tasks.findIndex((t) => !t.completed && !t.locked);
      if (firstUncompleted !== -1) {
        setActiveTaskIndex(firstUncompleted);
      }
    }
  }, [roomResponse]);

  const currentTask = tasks[activeTaskIndex];

  const handleSubmitAnswer = (answerData: unknown) => {
    if (!currentTask) return;
    setFeedback(null);

    submitTaskMutation.mutate(
      { taskId: currentTask.id, answer: answerData },
      {
        onSuccess: (res) => {
          const data = res.data;
          setFeedback(data);

          // Auto advance to next task after 1.5 seconds if answer is correct
          if (data.isCorrect && activeTaskIndex < tasks.length - 1) {
            setTimeout(() => {
              setActiveTaskIndex((prev) => prev + 1);
              setFeedback(null);
              setShowHint(false);
            }, 1500);
          }
        },
        onError: (err) => {
          setFeedback({
            success: false,
            isCorrect: false,
            score: 0,
            xpEarned: 0,
            message: err instanceof Error ? err.message : 'Failed to submit answer. Please try again.',
            alreadyCompleted: false,
            attempts: (currentTask.attempts || 0) + 1,
          });
        },
      }
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (isLoading) {
    return (
      <NexusShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3 text-purple-400 font-semibold animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
            <span>Loading Live Learning Room...</span>
          </div>
        </div>
      </NexusShell>
    );
  }

  if (isError || !room) {
    return (
      <NexusShell>
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
          <AlertTriangle className="w-12 h-12 text-rose-400" />
          <h2 className="text-lg font-bold text-foreground">Unable to load this Learning Room</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            The requested room may not exist or database connection was interrupted.
          </p>
          <Button onClick={() => refetch()} variant="outline" className="bg-secondary border-border text-foreground text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-2" /> Retry Loading
          </Button>
        </div>
      </NexusShell>
    );
  }

  return (
    <NexusShell>
      <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
        {/* Header Navigation */}
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/roadmap"
              className="p-2 bg-secondary border border-border rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{room.title}</h1>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border ${
                  room.level === 'Novice' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  room.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  room.level === 'Advanced' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                  'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {room.level} Level
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg ${
                  room.tier === 'Free' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                }`}>
                  {room.tier} Tier
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{room.description}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary border border-border rounded-xl text-xs font-bold text-amber-400">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>+{room.xpReward} XP Room Reward</span>
            </div>
          </div>
        </div>

        {/* Room Progress Bar */}
        <Card className="p-4 bg-card border-border rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" /> Room Tasks Progress
            </span>
            <span className="text-purple-400 font-mono">
              {completedCount} of {tasks.length} Tasks ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </Card>

        {/* ── 5-Minute Micro-Learning Video & Interactive Simulation Suite ── */}
        <MicroLearningPlayer
          activeDifficulty={difficultyLevel}
          onDifficultyChange={setDifficultyLevel}
        />

        {/* Empty Room State */}
        {tasks.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground bg-card border-border rounded-2xl space-y-3">
            <Layers className="w-12 h-12 text-purple-400 mx-auto" />
            <h3 className="text-base font-bold text-foreground">No learning tasks are available yet</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Tasks for this room are currently being authored and verified. Check back soon or return to the learning roadmap.
            </p>
            <Link href="/roadmap">
              <Button variant="outline" className="bg-secondary border-border text-foreground text-xs px-4 h-9 rounded-xl mt-2">
                Return to Roadmap
              </Button>
            </Link>
          </Card>
        ) : (
          /* Main Split Layout: Task Sidebar (Left) + Interactive Lab (Right) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel: Tasks Navigation List (4 Cols) */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Room Tasks</h2>

              {tasks.map((task, idx) => {
                const isActive = idx === activeTaskIndex;
                const isLocked = task.locked;

                return (
                  <button
                    key={task.id}
                    disabled={isLocked}
                    onClick={() => {
                      setActiveTaskIndex(idx);
                      setFeedback(null);
                      setShowHint(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isLocked
                        ? 'bg-secondary/20 border-border/50 text-muted-foreground cursor-not-allowed opacity-50'
                        : isActive
                        ? 'bg-purple-600/10 border-purple-500/50 text-foreground shadow-lg shadow-purple-950/20 ring-1 ring-purple-500/30'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                        task.completed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isLocked
                          ? 'bg-secondary text-muted-foreground border border-border'
                          : isActive
                          ? 'bg-purple-600 text-white'
                          : 'bg-secondary text-muted-foreground border border-border'
                      }`}>
                        {task.completed ? (
                          <Check className="w-4 h-4" />
                        ) : isLocked ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          task.orderNumber
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-bold text-foreground line-clamp-1">{task.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-medium">+{task.xpReward} XP</span>
                          {task.completed && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform flex-shrink-0 ${isActive ? 'text-purple-400 translate-x-1' : 'text-muted-foreground'}`} />
                  </button>
                );
              })}

              {/* Final Room Mastered Banner */}
              {progressPercent === 100 && (
                <Card className="p-4 bg-gradient-to-br from-purple-900/40 via-card to-card border-purple-500/40 rounded-2xl text-center space-y-3">
                  <Award className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                  <h3 className="text-sm font-bold text-foreground">Room Mastered!</h3>
                  <p className="text-xs text-muted-foreground">You completed all tasks in this room.</p>
                  <Link href="/certificates/cert-1">
                    <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl gap-2 shadow-md shadow-purple-900/30">
                      <Award className="w-4 h-4 text-amber-300" /> View Verified Certificate
                    </Button>
                  </Link>
                </Card>
              )}
            </div>

            {/* Right Panel: Task Instructions & Interactive Lab Playground (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {currentTask ? (
                <Card className="p-6 bg-card border-border rounded-2xl space-y-6 shadow-xl">
                  {/* Task Header */}
                  <div className="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">{currentTask.title}</h2>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono font-bold rounded">
                        {currentTask.taskType}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/30 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{currentTask.xpReward} XP
                    </span>
                  </div>

                  {/* Task Main Image (if present) */}
                  {currentTask.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-border bg-black/40 max-h-64 flex items-center justify-center">
                      <img
                        src={currentTask.imageUrl}
                        alt={currentTask.title}
                        className="object-contain max-h-64 w-full"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Instructions Text */}
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm text-foreground/90 leading-relaxed bg-secondary/30 p-4 rounded-xl border border-border">
                    <p>{currentTask.instructions}</p>
                  </div>

                  {/* Code Snippet Box (if present) */}
                  {currentTask.codeSnippet && (
                    <div className="space-y-2">
                      <pre className="p-4 bg-black/80 border border-border rounded-xl font-mono text-xs text-purple-300 overflow-x-auto">
                        <code>{currentTask.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Hint System */}
                  {currentTask.hint && (
                    <div>
                      <button
                        onClick={() => setShowHint((prev) => !prev)}
                        className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
                      </button>
                      {showHint && (
                        <div className="mt-2 p-3 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-xl font-medium">
                          💡 <strong>Hint:</strong> {currentTask.hint}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Master Task Renderer Router Component */}
                  <TaskRenderer
                    task={currentTask}
                    onSubmit={handleSubmitAnswer}
                    feedback={feedback}
                    isSubmitting={submitTaskMutation.isPending}
                  />
                </Card>
              ) : (
                <Card className="p-12 text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold">Select a task from the left to start learning!</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </NexusShell>
  );
}
