'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Flame, Trophy, Timer, Zap, ChevronRight,
  CheckCircle2, XCircle, Clock, BarChart3, Sparkles,
  Brain, Lock, Copy, Check, Target,
  ChevronUp, Swords,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  xpReward: number;
  streakBonus: number;
  timeLimit: number;
  questionPrompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  codeSnippet?: string;
  tags: string[];
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  timeMs: number;
  streak: number;
  isYou?: boolean;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const TODAYS_CHALLENGE: DailyChallenge = {
  id: 'dc-2026-09-02',
  date: 'Sep 02, 2026',
  title: 'Transformer Self-Attention Complexity',
  category: 'Deep Learning',
  difficulty: 'Hard',
  xpReward: 150,
  streakBonus: 50,
  timeLimit: 90,
  questionPrompt:
    "In a standard Transformer's self-attention mechanism with sequence length n and model dimension d, what is the time AND memory complexity of computing the full attention matrix?",
  options: [
    'O(n·d) time, O(n) memory — linear in sequence length',
    'O(n²·d) time, O(n²) memory — quadratic bottleneck',
    'O(n·d²) time, O(d²) memory — quadratic in dimension',
    'O(n log n·d) time, O(n log n) memory — log-linear',
  ],
  correctIndex: 1,
  explanation:
    'Self-attention computes QKᵀ where Q, K ∈ ℝⁿˣᵈ, producing an n×n attention matrix. This requires O(n²·d) multiply-accumulate operations and O(n²) memory to store all pairwise attention scores. This quadratic bottleneck is exactly why Flash Attention and Longformer were invented — to reduce memory from O(n²) to O(n) using kernel tiling and sparse patterns respectively.',
  codeSnippet: `# Standard Self-Attention — O(n²·d) time, O(n²) memory
import torch, math

def self_attention(Q, K, V):
    d_k = Q.size(-1)
    # (n × n) attention matrix — the quadratic bottleneck
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    attn   = torch.softmax(scores, dim=-1)   # O(n²) memory
    return torch.matmul(attn, V)             # (n, d) output`,
  tags: ['Transformers', 'Attention', 'Complexity', 'NLP'],
};

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Priya Sharma',  avatar: 'PS', score: 200, timeMs: 12340, streak: 47 },
  { rank: 2, name: 'Arjun Mehta',   avatar: 'AM', score: 200, timeMs: 15890, streak: 31 },
  { rank: 3, name: 'You',           avatar: 'ME', score: 200, timeMs: 18500, streak: 12, isYou: true },
  { rank: 4, name: 'Divya Nair',    avatar: 'DN', score: 150, timeMs: 22100, streak: 8  },
  { rank: 5, name: 'Rahul Gupta',   avatar: 'RG', score: 150, timeMs: 28400, streak: 5  },
  { rank: 6, name: 'Sneha Iyer',    avatar: 'SI', score: 100, timeMs: 35600, streak: 22 },
  { rank: 7, name: 'Karan Patel',   avatar: 'KP', score: 100, timeMs: 41200, streak: 3  },
];

const HISTORY = [
  { date: 'Sep 01', title: 'Backpropagation Chain Rule',       difficulty: 'Medium', done: true,  score: 150 },
  { date: 'Aug 31', title: 'Redis Cache Invalidation',          difficulty: 'Hard',   done: true,  score: 200 },
  { date: 'Aug 30', title: 'BST Balancing & AVL Rotations',     difficulty: 'Easy',   done: true,  score: 100 },
  { date: 'Aug 29', title: 'Docker Multi-Stage Builds',         difficulty: 'Medium', done: false, score: 0   },
  { date: 'Aug 28', title: 'RAG Pipeline Architecture',         difficulty: 'Expert', done: true,  score: 250 },
  { date: 'Aug 27', title: 'SQL Window Functions & CTEs',       difficulty: 'Medium', done: true,  score: 150 },
  { date: 'Aug 26', title: 'GAN Training Instability & WGAN',   difficulty: 'Hard',   done: true,  score: 200 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function diffBadge(d: string) {
  const map: Record<string, string> = {
    Easy:   'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    Medium: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    Hard:   'text-rose-400 bg-rose-500/15 border-rose-500/30',
    Expert: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
  };
  return map[d] ?? 'text-muted-foreground bg-secondary border-border';
}

function medal(rank: number) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

function fmtMs(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

// ─── Countdown widget ─────────────────────────────────────────────────────────

function NextChallengeClock() {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now  = new Date();
      const next = new Date(now); next.setHours(24, 0, 0, 0);
      const d    = next.getTime() - now.getTime();
      setT({ h: Math.floor(d / 3_600_000), m: Math.floor((d % 3_600_000) / 60_000), s: Math.floor((d % 60_000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <Clock className="w-3.5 h-3.5 text-purple-400" />
      <span>Next challenge in</span>
      <span className="text-foreground font-bold">{pad(t.h)}:{pad(t.m)}:{pad(t.s)}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DailyChallengePage() {
  const ch = TODAYS_CHALLENGE;
  const [phase, setPhase]     = useState<'landing' | 'active' | 'result'>('landing');
  const [picked, setPicked]   = useState<number | null>(null);
  const [submitted, setSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ch.timeLimit);
  const [elapsedMs, setElapsed] = useState(0);
  const [showExp, setShowExp]  = useState(false);
  const [copied, setCopied]    = useState(false);
  const [tab, setTab]          = useState<'board' | 'history'>('board');
  const startRef = useRef<number | null>(null);
  const ivRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  const correct = submitted && picked === ch.correctIndex;

  const beginChallenge = useCallback(() => {
    setPhase('active');
    setTimeLeft(ch.timeLimit);
    startRef.current = Date.now();
    ivRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(ivRef.current!);
          setElapsed(Date.now() - (startRef.current ?? Date.now()));
          setSubmit(true);
          setTimeout(() => setPhase('result'), 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [ch.timeLimit]);

  const submitAnswer = useCallback(() => {
    if (picked === null || submitted) return;
    clearInterval(ivRef.current!);
    setElapsed(Date.now() - (startRef.current ?? Date.now()));
    setSubmit(true);
    setTimeout(() => setPhase('result'), 700);
  }, [picked, submitted]);

  useEffect(() => () => { if (ivRef.current) clearInterval(ivRef.current); }, []);

  const pct   = (timeLeft / ch.timeLimit) * 100;
  const tClr  = pct > 50 ? '#10b981' : pct > 20 ? '#f59e0b' : '#ef4444';
  const bonus = correct ? Math.floor((timeLeft / ch.timeLimit) * ch.streakBonus) : 0;
  const xpEarned = correct ? ch.xpReward + bonus : 0;

  const share = () => {
    const txt = [
      `🔥 Daily AI Challenge — ${ch.date}`,
      `${correct ? '✅ Solved' : '❌ Missed'} "${ch.title}" in ${fmtMs(elapsedMs)}`,
      `🏅 12-day streak · +${xpEarned} XP`,
      `💡 ai-nexus.app/daily`,
    ].join('\n');
    navigator.clipboard.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  // ── LANDING ────────────────────────────────────────────────────────────────
  if (phase === 'landing') return (
    <NexusShell>
      <div className="space-y-8 max-w-5xl mx-auto pb-20">

        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-400 font-semibold">Daily AI Challenge</span>
        </div>

        {/* hero */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/60 via-card to-orange-950/40 p-8 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl animate-pulse pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-orange-500/8 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1.2s' }} />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 animate-pulse" /> LIVE TODAY
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${diffBadge(ch.difficulty)}`}>{ch.difficulty}</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">{ch.category}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-foreground">Daily AI Challenge</h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                One focused question. 90 seconds. Compete with thousands of learners worldwide.
                Build your streak — come back every day to climb the global leaderboard.
              </p>

              <div className="flex items-center gap-5 flex-wrap text-sm font-semibold">
                <span className="flex items-center gap-1.5 text-amber-300"><Flame className="w-4 h-4" /> 12-day streak</span>
                <span className="flex items-center gap-1.5 text-purple-300"><Zap className="w-4 h-4" /> +{ch.xpReward} XP correct</span>
                <span className="flex items-center gap-1.5 text-emerald-300"><Timer className="w-4 h-4" /> {ch.timeLimit}s limit</span>
              </div>

              <Button
                id="start-daily-challenge-btn"
                onClick={beginChallenge}
                className="w-fit bg-amber-500 hover:bg-amber-400 text-zinc-900 font-extrabold text-base px-8 h-12 rounded-2xl shadow-lg shadow-amber-900/40 gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <Swords className="w-5 h-5" /> Start Today&apos;s Challenge
              </Button>
            </div>

            {/* stat tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 flex-shrink-0">
              {[
                { label: 'Current Streak', val: '12 🔥', c: 'text-amber-400'   },
                { label: 'Global Rank',    val: '#3',    c: 'text-purple-400'  },
                { label: 'Completed',      val: '47',    c: 'text-emerald-400' },
                { label: 'Accuracy',       val: '78%',   c: 'text-blue-400'    },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-2xl bg-card/80 border border-border flex items-center justify-between gap-4 min-w-[180px]">
                  <span className="text-xs text-muted-foreground font-mono">{s.label}</span>
                  <span className={`text-sm font-extrabold font-mono ${s.c}`}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-border/50">
            <NextChallengeClock />
          </div>
        </div>

        {/* locked preview */}
        <Card className="p-6 bg-card border-border rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" /> Today&apos;s Question Preview
            </h2>
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-secondary/50 border border-border/70 p-5">
            {/* blur overlay */}
            <div className="absolute inset-0 backdrop-blur-sm bg-card/70 flex flex-col items-center justify-center z-10 rounded-2xl gap-2">
              <Lock className="w-6 h-6 text-amber-400" />
              <p className="text-sm font-bold text-foreground">Locked until you start</p>
              <p className="text-xs text-muted-foreground">The timer begins the moment you reveal the question</p>
            </div>
            <p className="text-sm text-foreground opacity-10 select-none">{ch.questionPrompt}</p>
            <div className="mt-3 space-y-2 opacity-5 select-none">
              {ch.options.map((o, i) => (
                <div key={i} className="p-3 rounded-xl bg-card border border-border text-xs">{String.fromCharCode(65+i)}. {o}</div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {ch.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-secondary text-muted-foreground border border-border">#{tag}</span>
            ))}
          </div>
        </Card>

        {/* tabs: leaderboard / history */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            {[
              { id: 'board',   label: "Today's Leaderboard", icon: Trophy   },
              { id: 'history', label: 'Your History',         icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`daily-tab-${id}`}
                onClick={() => setTab(id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  tab === id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          {tab === 'board' && (
            <Card className="p-4 bg-card border-border rounded-3xl divide-y divide-border/50">
              {LEADERBOARD.map(e => (
                <div key={e.rank} id={`lb-${e.rank}`} className={`flex items-center gap-3 py-3 first:pt-0 last:pb-0 rounded-xl px-2 transition-all ${e.isYou ? 'bg-amber-500/8' : ''}`}>
                  <span className="text-base w-8 text-center font-bold">{medal(e.rank)}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0">{e.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${e.isYou ? 'text-amber-300' : 'text-foreground'}`}>{e.name}</span>
                      {e.isYou && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">YOU</span>}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5">
                      <Flame className="w-3 h-3 text-amber-400" />{e.streak}d streak · {fmtMs(e.timeMs)}
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-purple-300 font-mono">+{e.score} XP</span>
                </div>
              ))}
            </Card>
          )}

          {tab === 'history' && (
            <Card className="p-4 bg-card border-border rounded-3xl space-y-1">
              {HISTORY.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/40 transition-all">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${h.done ? 'bg-emerald-500/15 border-emerald-500/30' : 'bg-rose-500/15 border-rose-500/30'}`}>
                    {h.done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{h.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                      <span>{h.date}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${diffBadge(h.difficulty)}`}>{h.difficulty}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-extrabold font-mono ${h.done ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    {h.done ? `+${h.score} XP` : 'Missed'}
                  </span>
                </div>
              ))}
              {/* streak heatmap */}
              <div className="pt-4 border-t border-border mt-2">
                <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> 7-Day Streak Map
                </p>
                <div className="flex items-center gap-2">
                  {[...HISTORY].reverse().map((h, i) => (
                    <div key={i} title={h.date} className={`w-9 h-9 rounded-xl border flex items-center justify-center hover:scale-110 transition-transform cursor-default ${h.done ? 'bg-amber-500/25 border-amber-500/50' : 'bg-secondary border-border'}`}>
                      <span className="text-sm">{h.done ? '🔥' : '💤'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </NexusShell>
  );

  // ── ACTIVE ─────────────────────────────────────────────────────────────────
  if (phase === 'active') return (
    <NexusShell>
      <div className="max-w-3xl mx-auto pb-20 space-y-5">

        {/* timer bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" />Time Remaining</span>
            <span className="font-extrabold" style={{ color: tClr }}>{timeLeft}s</span>
          </div>
          <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000 ease-linear" style={{ width: `${pct}%`, backgroundColor: tClr }} />
          </div>
        </div>

        {/* question card */}
        <Card className="p-6 bg-card border-border rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Daily Challenge
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${diffBadge(ch.difficulty)}`}>{ch.difficulty}</span>
              </div>
              <h2 className="text-lg font-extrabold text-foreground">{ch.title}</h2>
              <p className="text-xs text-muted-foreground">{ch.category}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] text-muted-foreground font-mono">Max XP</div>
              <div className="text-2xl font-extrabold text-amber-400 font-mono">+{ch.xpReward + ch.streakBonus}</div>
            </div>
          </div>

          {/* prompt */}
          <div className="p-5 rounded-2xl bg-secondary/60 border border-border flex items-start gap-3">
            <Brain className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground leading-relaxed font-medium">{ch.questionPrompt}</p>
          </div>

          {/* code */}
          {ch.codeSnippet && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">Reference (Python)</span>
              <pre className="p-4 rounded-2xl bg-zinc-950 text-purple-200 text-xs font-mono overflow-x-auto border border-purple-500/20 leading-relaxed">{ch.codeSnippet}</pre>
            </div>
          )}

          {/* options */}
          <div className="space-y-3">
            {ch.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const sel    = picked === i;
              return (
                <button
                  key={i}
                  id={`opt-${letter}`}
                  onClick={() => !submitted && setPicked(i)}
                  disabled={submitted}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all cursor-pointer flex items-start gap-3 ${
                    sel
                      ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-900/20'
                      : 'bg-secondary/40 border-border hover:border-amber-500/40 hover:bg-secondary/60'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-colors ${sel ? 'bg-amber-500 text-zinc-900' : 'bg-secondary text-muted-foreground'}`}>
                    {letter}
                  </span>
                  <span className={sel ? 'text-foreground' : 'text-muted-foreground'}>{opt}</span>
                </button>
              );
            })}
          </div>

          <Button
            id="submit-answer-btn"
            onClick={submitAnswer}
            disabled={picked === null || submitted}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-extrabold h-12 rounded-2xl text-base shadow-lg shadow-amber-900/30 gap-2 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <Zap className="w-5 h-5" /> Submit Answer
          </Button>
        </Card>
      </div>
    </NexusShell>
  );

  // ── RESULT ─────────────────────────────────────────────────────────────────
  return (
    <NexusShell>
      <div className="max-w-3xl mx-auto pb-20 space-y-6">

        {/* result hero */}
        <Card className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden text-center space-y-5 ${
          correct
            ? 'bg-gradient-to-br from-emerald-950/60 via-card to-teal-950/40 border-emerald-500/30'
            : 'bg-gradient-to-br from-rose-950/60 via-card to-red-950/40 border-rose-500/30'
        }`}>
          <div className={`absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none ${correct ? 'bg-emerald-400' : 'bg-rose-400'}`} />

          <div className={`relative z-10 w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl border-2 shadow-xl ${correct ? 'bg-emerald-500/20 border-emerald-400' : 'bg-rose-500/20 border-rose-400'}`}>
            {correct ? '🎯' : '💡'}
          </div>

          <div className="relative z-10 space-y-1">
            <h2 className="text-2xl font-extrabold text-foreground">{correct ? 'Nailed it! 🔥' : 'Not quite — but you\'re learning!'}</h2>
            <p className="text-sm text-muted-foreground">
              {correct ? `Solved in ${fmtMs(elapsedMs)} · Speed bonus +${bonus} XP` : `The correct answer was ${String.fromCharCode(65 + ch.correctIndex)}`}
            </p>
          </div>

          {/* score tiles */}
          <div className="relative z-10 grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {[
              { label: 'XP Earned',  val: `+${xpEarned}`, c: 'text-amber-400'  },
              { label: 'New Streak', val: `${12 + (correct ? 1 : 0)} 🔥`, c: 'text-orange-400' },
              { label: 'Your Rank',  val: correct ? '#3' : '—', c: 'text-purple-400' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-2xl bg-card/80 border border-border">
                <div className={`text-xl font-extrabold font-mono ${s.c}`}>{s.val}</div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* correct answer */}
          <div className={`relative z-10 p-4 rounded-2xl border text-left ${correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className={`w-4 h-4 ${correct ? 'text-emerald-400' : 'text-amber-400'}`} />
              Correct: {String.fromCharCode(65 + ch.correctIndex)}. {ch.options[ch.correctIndex]}
            </p>
          </div>

          {/* explanation toggle */}
          <button
            id="toggle-explanation-btn"
            onClick={() => setShowExp(v => !v)}
            className="relative z-10 flex items-center gap-1.5 mx-auto text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showExp ? 'Hide' : 'Show'} Expert Explanation
            {showExp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {showExp && (
            <div className="relative z-10 p-5 rounded-2xl bg-secondary/60 border border-purple-500/20 text-left space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-xs text-foreground leading-relaxed">{ch.explanation}</p>
              {ch.codeSnippet && (
                <pre className="p-3 rounded-xl bg-zinc-950 text-purple-200 text-xs font-mono overflow-x-auto border border-purple-500/20 leading-relaxed">{ch.codeSnippet}</pre>
              )}
            </div>
          )}

          {/* actions */}
          <div className="relative z-10 flex items-center gap-3 justify-center flex-wrap">
            <Button id="share-result-btn" onClick={share} className="bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs h-10 rounded-2xl gap-2 border border-border cursor-pointer">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to clipboard!' : 'Share Result'}
            </Button>
            <Link href="/challenges">
              <Button id="try-expert-btn" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 rounded-2xl gap-2 cursor-pointer">
                <Swords className="w-4 h-4" /> Try Expert Challenges
              </Button>
            </Link>
          </div>

          <div className="relative z-10"><NextChallengeClock /></div>
        </Card>

        {/* post-result leaderboard */}
        <Card className="p-5 bg-card border-border rounded-3xl space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" /> Today&apos;s Leaderboard
          </h3>
          <div className="divide-y divide-border/50">
            {LEADERBOARD.map(e => (
              <div key={e.rank} className={`flex items-center gap-3 py-3 first:pt-0 last:pb-0 px-2 rounded-xl ${e.isYou ? 'bg-amber-500/8' : ''}`}>
                <span className="text-base w-8 text-center font-bold">{medal(e.rank)}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0">{e.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${e.isYou ? 'text-amber-300' : 'text-foreground'}`}>{e.name}</span>
                    {e.isYou && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">YOU</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">{e.streak}d streak · {fmtMs(e.timeMs)}</p>
                </div>
                <span className="text-xs font-extrabold text-purple-300 font-mono">+{e.score} XP</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </NexusShell>
  );
}
