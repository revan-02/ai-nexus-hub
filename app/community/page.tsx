'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Plus,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Trophy,
  Sparkles,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  Eye,
  X,
  Send,
  Award,
  Star,
  Flame,
  ArrowUpRight,
  UserPlus,
  Compass,
  Cpu,
  Check,
  ExternalLink,
  Share2,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import Link from 'next/link';

interface Guild {
  id: string;
  name: string;
  badge: string;
  icon: string;
  members: number;
  activity: string;
  desc: string;
  tags: string[];
}

const INITIAL_GUILDS: Guild[] = [
  {
    id: 'guild-agents',
    name: 'Autonomous Agents & ReAct Guild',
    badge: 'Trending 🔥',
    icon: '🤖',
    members: 1420,
    activity: 'Active (42 online)',
    desc: 'Building multi-agent LangGraph workflows, MCP servers, and tool-calling orchestrators.',
    tags: ['ReAct', 'LangGraph', 'MCP', 'Tool-Use'],
  },
  {
    id: 'guild-pytorch',
    name: 'PyTorch & CUDA Kernel Hackers',
    badge: 'High Perf ⚡',
    icon: '⚡',
    members: 980,
    activity: 'Active (28 online)',
    desc: 'Custom Triton kernels, FP8 FlashAttention-3 optimization, and distributed multi-GPU training.',
    tags: ['CUDA', 'Triton', 'PyTorch', 'Distributed'],
  },
  {
    id: 'guild-alignment',
    name: 'LLM Fine-Tuning & Alignment Circle',
    badge: 'Research 🧠',
    icon: '🧠',
    members: 1850,
    activity: 'Active (65 online)',
    desc: 'DPO vs PPO alignment, 4-bit QLoRA instruction tuning, and dataset synthetic generation.',
    tags: ['DPO', 'QLoRA', 'RLHF', 'Llama-3'],
  },
  {
    id: 'guild-rag',
    name: 'Enterprise RAG & Vector Systems',
    badge: 'Applied 🛠️',
    icon: '🛠️',
    members: 2100,
    activity: 'Active (81 online)',
    desc: 'Hybrid BM25 + dense embedding search, graph RAG, and production hallucination defense.',
    tags: ['Qdrant', 'FAISS', 'GraphRAG', 'Ragas'],
  },
];

function CommunityPageInner() {
  const searchParams = useSearchParams();

  // Tab Mapping
  const tabMap: Record<string, string> = useMemo(() => ({
    discussions: 'Discussions',
    questions: 'Questions',
    articles: 'Articles',
    guilds: 'Guilds & Study Circles',
    leaderboard: 'Leaderboard',
  }), []);

  const reverseTabMap: Record<string, string> = useMemo(() => ({
    'Discussions': 'discussions',
    'Questions': 'questions',
    'Articles': 'articles',
    'Guilds & Study Circles': 'guilds',
    'Leaderboard': 'leaderboard',
  }), []);

  // Compute activeTab directly from URL query param
  const activeTab = useMemo(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam && tabMap[tabParam]) {
      return tabMap[tabParam];
    }
    return 'Discussions';
  }, [searchParams, tabMap]);

  // Modal States
  const [showNewModal, setShowNewModal] = useState(false);
  const [modalType, setModalType] = useState<'discussion' | 'question' | 'article'>('discussion');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('LLM Architectures');
  const [newContent, setNewContent] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Join Community Modal State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinStep, setJoinStep] = useState<1 | 2 | 3>(1);
  const [joinedGuilds, setJoinedGuilds] = useState<string[]>(['guild-agents']);
  const [memberHandle, setMemberHandle] = useState('ai_scholar_2026');
  const [selectedSpecialization, setSelectedSpecialization] = useState('Autonomous Agents & ReAct');
  const [discordSync, setDiscordSync] = useState(true);
  const [githubSync, setGithubSync] = useState(true);
  const [isJoinedCommunity, setIsJoinedCommunity] = useState(true);

  // Local Like / Upvote Counters State
  const [discussions, setDiscussions] = useState([
    {
      id: 'post-1',
      author: 'Dr. Elena Rostova',
      role: 'Staff AI Researcher',
      avatar: 'ER',
      title: 'Breakthroughs in FlashAttention-3 & Linear Attention Kernels',
      category: 'Research Paper Breakdown',
      time: '2 hours ago',
      likes: 142,
      replies: 28,
      desc: 'Analyzing how FlashAttention-3 leverages FP8 Tensor Cores on NVIDIA H100 GPUs to achieve 1.8 PFLOPS throughput while minimizing memory bandwidth overhead.',
    },
    {
      id: 'post-2',
      author: 'Marcus Vance',
      role: 'MLOps Lead',
      avatar: 'MV',
      title: 'How we reduced LLM Inference Latency by 64% using vLLM PagedAttention',
      category: 'Production Case Study',
      time: '5 hours ago',
      likes: 98,
      replies: 15,
      desc: 'Detailed benchmarks comparing TensorRT-LLM, TGI, and vLLM under heavy concurrent prompt streaming loads with dynamic KV cache allocation.',
    },
    {
      id: 'post-3',
      author: 'Aria Thorne',
      role: 'NLP Specialist',
      avatar: 'AT',
      title: 'Evaluating Direct Preference Optimization (DPO) vs PPO in Fine-Tuning',
      category: 'RLHF & Alignment',
      time: '1 day ago',
      likes: 85,
      replies: 19,
      desc: 'Why reference-free DPO is fast becoming the standard for open-weight model alignment over complex actor-critic PPO architectures.',
    },
  ]);

  const [questions, setQuestions] = useState([
    {
      id: 'q-1',
      author: 'Liam Davies',
      role: 'AI Engineer',
      avatar: 'LD',
      title: 'How to prevent CUDA Out-Of-Memory (OOM) during LLaMA-3 70B QLoRA fine-tuning?',
      category: 'CUDA & PyTorch',
      time: '3 hours ago',
      upvotes: 46,
      answers: 8,
      isSolved: true,
      desc: 'Getting OOM error on 4x A100 80GB GPUs during backward pass with sequence length 4096. Gradient checkpointing is enabled.',
    },
    {
      id: 'q-2',
      author: 'Sophia Chen',
      role: 'GenAI Developer',
      avatar: 'SC',
      title: 'What is the optimal chunk size & overlap strategy for multi-modal RAG systems?',
      category: 'RAG & Vector DB',
      time: '6 hours ago',
      upvotes: 31,
      answers: 5,
      isSolved: false,
      desc: 'Indexing dense PDF technical manuals with diagrams. Does parent-document retrieval outperform naive 512-token chunking?',
    },
    {
      id: 'q-3',
      author: 'Devon Miller',
      role: 'Robotics Research',
      avatar: 'DM',
      title: 'Difference between RoPE, ALiBi, and YaRN positional embeddings in long-context models?',
      category: 'Transformer Theory',
      time: '12 hours ago',
      upvotes: 24,
      answers: 4,
      isSolved: true,
      desc: 'Looking for mathematical intuition on why Rotary Position Embedding (RoPE) scales better to 128k context windows.',
    },
  ]);

  const [articles, setArticles] = useState([
    {
      id: 'art-1',
      author: 'Dr. Elena Rostova',
      role: 'Staff AI Researcher',
      avatar: 'ER',
      title: 'Building Autonomous Multi-Agent Orchestrators with ReAct and Tool-Calling',
      category: 'Agentic Workflows',
      readTime: '8 min read',
      date: 'Aug 12, 2026',
      bookmarks: 312,
      desc: 'A complete step-by-step guide to designing multi-agent DAGs with plan-and-execute nodes, fallback routing, and persistent memory state.',
    },
    {
      id: 'art-2',
      author: 'Alex Morgan',
      role: 'LLM Architect',
      avatar: 'AM',
      title: 'Understanding Mixture-of-Experts (MoE) Routing Logic & Load Balancing',
      category: 'Model Architecture',
      readTime: '12 min read',
      date: 'Aug 10, 2026',
      bookmarks: 245,
      desc: 'Deep dive into top-k expert gating networks, auxiliary loss functions for load balancing, and expert capacity limits.',
    },
  ]);

  const topContributors = [
    { rank: 1, name: 'Dr. Elena Rostova', badge: 'Top Scholar', points: '14,280', posts: 42, upvotes: 3190 },
    { rank: 2, name: 'Alex Morgan', badge: 'LLM Architect', points: '11,450', posts: 38, upvotes: 2840 },
    { rank: 3, name: 'Sophia Chen', badge: 'GenAI Specialist', points: '9,820', posts: 29, upvotes: 2150 },
    { rank: 4, name: 'Marcus Vance', badge: 'MLOps Lead', points: '8,640', posts: 24, upvotes: 1910 },
    { rank: 5, name: 'Aria Thorne', badge: 'Vector DB Expert', points: '7,320', posts: 19, upvotes: 1450 },
  ];

  const handleLike = (id: string) => {
    setDiscussions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
  };

  const handleUpvoteQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item))
    );
  };

  const toggleGuildMembership = (guildId: string) => {
    setJoinedGuilds((prev) =>
      prev.includes(guildId) ? prev.filter((id) => id !== guildId) : [...prev, guildId]
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (modalType === 'discussion') {
      const newPost = {
        id: `post-${Date.now()}`,
        author: 'Expert Learner',
        role: 'Pro Member',
        avatar: 'EL',
        title: newTitle,
        category: newCategory,
        time: 'Just now',
        likes: 1,
        replies: 0,
        desc: newContent || 'New community discussion thread.',
      };
      setDiscussions([newPost, ...discussions]);
    } else if (modalType === 'question') {
      const newQ = {
        id: `q-${Date.now()}`,
        author: 'Expert Learner',
        role: 'Pro Member',
        avatar: 'EL',
        title: newTitle,
        category: newCategory,
        time: 'Just now',
        upvotes: 1,
        answers: 0,
        isSolved: false,
        desc: newContent || 'Technical community question.',
      };
      setQuestions([newQ, ...questions]);
    } else if (modalType === 'article') {
      const newArt = {
        id: `art-${Date.now()}`,
        author: 'Expert Learner',
        role: 'Pro Member',
        avatar: 'EL',
        title: newTitle,
        category: newCategory,
        readTime: '5 min read',
        date: 'Today',
        bookmarks: 1,
        desc: newContent || 'Community article publication.',
      };
      setArticles([newArt, ...articles]);
    }

    setSuccessMsg('Successfully published to the Global AI Community!');
    setTimeout(() => {
      setSuccessMsg('');
      setShowNewModal(false);
      setNewTitle('');
      setNewContent('');
    }, 2000);
  };

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Community</span>
        </div>

        {/* Header Banner with Join Community Onboarding */}
        <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Global Scholar & Developer Network</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                Global AI & GenAI Community
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Connect with 12,000+ AI researchers, ML engineers, and students. Join specialized research guilds, participate in live ArXiv paper reading circles, and share production LLM architectures.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => {
                  setJoinStep(1);
                  setShowJoinModal(true);
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 h-10 rounded-xl gap-2 shadow-lg shadow-purple-950/50 cursor-pointer border border-purple-400/40"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isJoinedCommunity ? 'View / Manage Community Pass' : 'How to Join Community (Free)'}</span>
              </Button>

              <Button
                onClick={() => { setModalType('discussion'); setShowNewModal(true); }}
                variant="outline"
                className="bg-secondary/80 hover:bg-secondary border-border text-foreground font-semibold text-xs px-4 py-2.5 h-10 rounded-xl gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-purple-400" /> Start Discussion
              </Button>
            </div>
          </div>

          {/* 3-Step "How to Join Community" Quick Guide */}
          <div className="pt-4 border-t border-purple-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/60 border border-border/80 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-purple-600/30 text-purple-300 font-mono font-bold flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <span className="font-bold text-foreground block">Pick Your Research Guild</span>
                <span className="text-[11px] text-zinc-400">Join Agentic Systems, PyTorch Kernels, or RAG Circles.</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-border/80 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-indigo-600/30 text-indigo-300 font-mono font-bold flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <span className="font-bold text-foreground block">Connect Discord & GitHub</span>
                <span className="text-[11px] text-zinc-400">Sync developer handles for verified contributor badges.</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-border/80 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-600/30 text-emerald-300 font-mono font-bold flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <span className="font-bold text-foreground block">Unlock 24/7 Study Rooms</span>
                <span className="text-[11px] text-zinc-400">Access peer hackathons, code reviews & weekly ArXiv sprints.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-border pb-2 overflow-x-auto scrollbar-none">
          {['Discussions', 'Questions', 'Articles', 'Guilds & Study Circles', 'Leaderboard'].map((tab) => {
            const paramKey = reverseTabMap[tab] || 'discussions';
            const isSelected = activeTab === tab;
            return (
              <Link
                key={tab}
                href={`/community?tab=${paramKey}`}
                scroll={false}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40'
                    : 'text-zinc-400 hover:text-foreground hover:bg-secondary'
                }`}
              >
                {tab}
              </Link>
            );
          })}
        </div>

        {/* Main Layout Grid: Feed Content (Left 8 Cols) + Sidebar Leaderboard & Discord (Right 4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">

            {/* ==================== TAB 1: DISCUSSIONS ==================== */}
            {activeTab === 'Discussions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
                  <span className="font-semibold text-foreground">{discussions.length} Active Discussions</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Sort by:</span>
                    <select className="bg-secondary border border-border text-foreground text-xs rounded-lg px-2 py-1 focus:outline-none">
                      <option>Trending</option>
                      <option>Most Liked</option>
                      <option>Latest</option>
                    </select>
                  </div>
                </div>

                {discussions.map((post) => (
                  <Card key={post.id} className="p-6 bg-card border-border rounded-2xl space-y-3 hover:border-purple-500/40 transition-all shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                          {post.avatar}
                        </div>
                        <div>
                          <span className="font-bold text-foreground text-xs block">{post.author}</span>
                          <span className="text-[10px] text-purple-300 font-medium">{post.role}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{post.time}</span>
                    </div>

                    <h3 className="text-base font-bold text-foreground hover:text-purple-300 transition-colors cursor-pointer leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">{post.desc}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                      <span className="px-2.5 py-0.5 bg-purple-950/40 text-purple-200 border border-purple-500/30 text-[10px] font-mono rounded-lg">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-4 text-zinc-300 font-semibold">
                        <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 hover:text-purple-300 transition-colors cursor-pointer">
                          <ThumbsUp className="w-3.5 h-3.5 text-purple-400" /> {post.likes}
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-purple-300 transition-colors cursor-pointer">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> {post.replies}
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* ==================== TAB 2: QUESTIONS ==================== */}
            {activeTab === 'Questions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
                  <span className="font-semibold text-foreground">{questions.length} Technical Questions</span>
                  <Button
                    onClick={() => { setModalType('question'); setShowNewModal(true); }}
                    variant="outline"
                    className="bg-secondary border-border text-foreground text-xs h-7 px-3 rounded-lg flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Ask Question
                  </Button>
                </div>

                {questions.map((q) => (
                  <Card key={q.id} className="p-6 bg-card border-border rounded-2xl space-y-3 hover:border-purple-500/40 transition-all shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {q.isSolved ? (
                          <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Solved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-950/40 text-amber-300 border border-amber-500/40 text-[10px] font-bold rounded-md">
                            Open
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 bg-secondary text-zinc-300 border border-border text-[10px] font-mono rounded-md">
                          {q.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{q.time}</span>
                    </div>

                    <h3 className="text-base font-bold text-foreground hover:text-purple-300 transition-colors cursor-pointer leading-snug">
                      {q.title}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">{q.desc}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 font-bold text-[10px] flex items-center justify-center">
                          {q.avatar}
                        </div>
                        <span className="text-xs font-medium text-foreground">{q.author}</span>
                      </div>

                      <div className="flex items-center gap-3 font-semibold">
                        <button
                          onClick={() => handleUpvoteQuestion(q.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 rounded-lg transition-colors cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-purple-400" />
                          <span>{q.upvotes} Upvotes</span>
                        </button>
                        <span className="flex items-center gap-1 text-zinc-300">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> {q.answers} Answers
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* ==================== TAB 3: ARTICLES ==================== */}
            {activeTab === 'Articles' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
                  <span className="font-semibold text-foreground">{articles.length} Engineering Publications</span>
                  <Button
                    onClick={() => { setModalType('article'); setShowNewModal(true); }}
                    variant="outline"
                    className="bg-secondary border-border text-foreground text-xs h-7 px-3 rounded-lg flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-400" /> Write Article
                  </Button>
                </div>

                {articles.map((art) => (
                  <Card key={art.id} className="p-6 bg-card border-border rounded-2xl space-y-3 hover:border-purple-500/40 transition-all shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 bg-purple-950/40 text-purple-200 border border-purple-500/30 text-[10px] font-mono rounded-lg">
                        {art.category}
                      </span>
                      <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono">
                        <span>{art.readTime}</span>
                        <span>•</span>
                        <span>{art.date}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground hover:text-purple-300 transition-colors cursor-pointer leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">{art.desc}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                          {art.avatar}
                        </div>
                        <div>
                          <span className="font-bold text-foreground block text-xs">{art.author}</span>
                          <span className="text-[10px] text-purple-300 font-medium">{art.role}</span>
                        </div>
                      </div>

                      <button className="flex items-center gap-1.5 px-3 py-1 bg-secondary border border-border rounded-lg text-zinc-300 hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer">
                        <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                        <span>{art.bookmarks} Bookmarks</span>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* ==================== TAB 4: GUILDS & STUDY CIRCLES ==================== */}
            {activeTab === 'Guilds & Study Circles' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
                  <span className="font-semibold text-foreground">Specialized AI Research Guilds</span>
                  <span className="text-purple-400 font-semibold">{joinedGuilds.length} Guilds Joined</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {INITIAL_GUILDS.map((guild) => {
                    const isJoined = joinedGuilds.includes(guild.id);
                    return (
                      <Card key={guild.id} className="p-5 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl">{guild.icon}</span>
                              <div>
                                <h3 className="text-sm font-bold text-foreground">{guild.name}</h3>
                                <span className="text-[10px] text-zinc-400 font-medium">{guild.members} Members • {guild.activity}</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 bg-purple-950/40 text-purple-300 border border-purple-500/30 text-[10px] font-bold rounded-md">
                              {guild.badge}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-300 leading-relaxed">{guild.desc}</p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {guild.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-secondary text-zinc-300 border border-border text-[10px] font-mono rounded-md">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border flex items-center justify-between">
                          <Button
                            onClick={() => toggleGuildMembership(guild.id)}
                            variant={isJoined ? 'outline' : 'default'}
                            className={`text-xs h-8 px-4 rounded-xl gap-1.5 font-bold cursor-pointer ${
                              isJoined
                                ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/40 hover:bg-emerald-950/50'
                                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                            }`}
                          >
                            {isJoined ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" /> Joined Guild
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" /> Join Guild
                              </>
                            )}
                          </Button>

                          <button
                            onClick={() => {
                              setModalType('discussion');
                              setNewCategory(guild.tags[0] || 'LLM Architectures');
                              setShowNewModal(true);
                            }}
                            className="text-xs text-purple-300 hover:text-purple-200 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Post to Guild</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================== TAB 5: LEADERBOARD ==================== */}
            {activeTab === 'Leaderboard' && (
              <div className="space-y-4">
                <Card className="p-6 bg-card border-border rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-amber-400" />
                      <div>
                        <h2 className="text-base font-bold text-foreground">Global Scholar Leaderboard</h2>
                        <p className="text-xs text-zinc-400">Rankings updated daily based on course completions, upvotes, and paper breakdowns.</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-950/40 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold rounded-xl flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> Season 4 Active
                    </span>
                  </div>

                  <div className="space-y-3">
                    {topContributors.map((c) => (
                      <div key={c.name} className="p-4 bg-secondary/50 border border-border rounded-xl flex items-center justify-between text-xs hover:border-purple-500/30 transition-all">
                        <div className="flex items-center gap-4">
                          <span className={`font-mono text-sm font-bold w-6 text-center ${
                            c.rank === 1 ? 'text-amber-400 text-base font-extrabold' :
                            c.rank === 2 ? 'text-zinc-300 font-bold' :
                            c.rank === 3 ? 'text-amber-600 font-bold' : 'text-zinc-400'
                          }`}>
                            #{c.rank}
                          </span>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <span className="font-bold text-foreground text-sm block">{c.name}</span>
                            <span className="text-[10px] text-purple-300 font-semibold">{c.badge} • {c.posts} Contributions</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right font-mono">
                            <span className="text-sm font-bold text-foreground block">{c.points} pts</span>
                            <span className="text-[10px] text-emerald-400 font-medium">{c.upvotes} Upvotes</span>
                          </div>
                          <Button variant="outline" className="bg-secondary border-border text-foreground text-xs h-8 px-3 rounded-xl hover:bg-purple-600 hover:text-white transition-colors">
                            Follow
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

          </div>

          {/* Right Column (4 Cols) Sidebar Summary & Process Channels */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Community Pass Status Card */}
            <Card className="p-5 bg-gradient-to-br from-card via-card to-purple-950/20 border-purple-500/30 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-foreground">Your Community Pass</h3>
                </div>
                <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold rounded-md">
                  Active Member
                </span>
              </div>

              <div className="bg-secondary/60 border border-border p-3.5 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Handle:</span>
                  <span className="font-mono font-bold text-foreground">@{memberHandle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Specialization:</span>
                  <span className="font-semibold text-purple-300">{selectedSpecialization}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Active Guilds:</span>
                  <span className="font-mono text-emerald-400 font-bold">{joinedGuilds.length} Circles</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setJoinStep(2);
                  setShowJoinModal(true);
                }}
                variant="outline"
                className="w-full bg-secondary/80 hover:bg-secondary border-border text-foreground text-xs font-semibold h-8 rounded-xl"
              >
                Manage Profile & Guilds
              </Button>
            </Card>

            {/* Live Study Lounge & Channels */}
            <Card className="p-5 bg-card border-border rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-bold text-foreground">Official Channels</h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-secondary/50 border border-border rounded-xl flex items-center justify-between hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                      💬
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">Global Discord Server</span>
                      <span className="text-[10px] text-zinc-400">3,420 members online</span>
                    </div>
                  </div>
                  <span className="text-purple-300 font-bold text-xs flex items-center gap-1">
                    Open <ExternalLink className="w-3 h-3" />
                  </span>
                </div>

                <div className="p-3 bg-secondary/50 border border-border rounded-xl flex items-center justify-between hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                      📚
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">Weekly ArXiv Sprints</span>
                      <span className="text-[10px] text-zinc-400">Sundays 6 PM UTC</span>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold text-xs">RSVP</span>
                </div>
              </div>
            </Card>

            {/* Top Scholars Widget */}
            <Card className="p-5 bg-card border-border rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-foreground">Top Scholars This Week</h3>
              </div>

              <div className="space-y-3">
                {topContributors.slice(0, 3).map((c) => (
                  <div key={c.name} className="p-3 bg-secondary/50 border border-border rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold font-mono text-purple-400 w-4">#{c.rank}</span>
                      <div>
                        <span className="font-bold text-foreground block">{c.name}</span>
                        <span className="text-[10px] text-zinc-400">{c.badge}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-foreground">{c.points} pts</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community Guidelines */}
            <Card className="p-5 bg-card border-border rounded-2xl space-y-3 text-xs">
              <h3 className="text-sm font-bold text-foreground">Community Guidelines</h3>
              <ul className="space-y-2 text-zinc-300 list-disc pl-4 leading-relaxed text-[11px]">
                <li>Be respectful and constructive in technical discussions.</li>
                <li>Include reproducible code snippets for PyTorch and CUDA errors.</li>
                <li>Cite research paper sources when analyzing model architectures.</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* ==================== JOIN COMMUNITY / PASS MODAL ==================== */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-purple-500/30 w-full max-w-lg rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-foreground rounded-full hover:bg-secondary cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">AI Community Pass & Onboarding</h3>
                <p className="text-xs text-zinc-400">Step {joinStep} of 2 • Instant Free Membership</p>
              </div>
            </div>

            {joinStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-foreground">Choose Your Primary AI Specialization</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Autonomous Agents & ReAct',
                      'PyTorch & CUDA Kernels',
                      'LLM Alignment & Fine-Tuning',
                      'Enterprise RAG & Vectors',
                      'Computer Vision & Diffusion',
                      'AI Math & Foundations'
                    ].map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => setSelectedSpecialization(spec)}
                        className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                          selectedSpecialization === spec
                            ? 'bg-purple-600/20 border-purple-500 text-foreground font-bold shadow-sm'
                            : 'bg-secondary/60 border-border text-zinc-300 hover:border-purple-500/40'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-foreground">Your Community Handle / Alias</label>
                  <Input
                    value={memberHandle}
                    onChange={(e) => setMemberHandle(e.target.value)}
                    placeholder="e.g. ai_scholar_2026"
                    className="bg-secondary border-border text-foreground text-xs h-9"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button
                    type="button"
                    onClick={() => setJoinStep(2)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-9 px-5 rounded-xl shadow-md cursor-pointer"
                  >
                    <span>Next: Connect & Claim Pass</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {joinStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm">Verified Scholar Pass #NEX-8820</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-md">
                      VERIFIED PASS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
                    <div>
                      <span className="text-zinc-400 block">Member:</span>
                      <span className="font-bold text-foreground">@{memberHandle}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block">Focus:</span>
                      <span className="font-bold text-purple-300">{selectedSpecialization}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-foreground">Sync Developer Accounts (Optional)</label>
                  
                  <div
                    onClick={() => setDiscordSync(!discordSync)}
                    className="p-3 bg-secondary/60 border border-border rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-500/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">💬</span>
                      <div>
                        <span className="font-bold text-foreground block">Discord Role Verification</span>
                        <span className="text-[10px] text-zinc-400">Unlock private research voice & text lounges</span>
                      </div>
                    </div>
                    <input type="checkbox" checked={discordSync} readOnly className="rounded text-purple-600" />
                  </div>

                  <div
                    onClick={() => setGithubSync(!githubSync)}
                    className="p-3 bg-secondary/60 border border-border rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-500/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🐙</span>
                      <div>
                        <span className="font-bold text-foreground block">GitHub Profile Sync</span>
                        <span className="text-[10px] text-zinc-400">Display open-source commits and repositories</span>
                      </div>
                    </div>
                    <input type="checkbox" checked={githubSync} readOnly className="rounded text-purple-600" />
                  </div>
                </div>

                <div className="flex justify-between items-center gap-2 pt-2 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setJoinStep(1)}
                    className="bg-secondary border-border text-foreground text-xs h-9 px-4 rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsJoinedCommunity(true);
                      setShowJoinModal(false);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-5 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete & Activate Pass</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== CREATE POST MODAL ==================== */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowNewModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-foreground rounded-full hover:bg-secondary cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground capitalize">Create New {modalType}</h3>
                <p className="text-xs text-zinc-400">Share your insights or ask the global AI community.</p>
              </div>
            </div>

            {successMsg ? (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-foreground mb-1.5">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-9 px-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                  >
                    <option>LLM Architectures</option>
                    <option>CUDA & PyTorch Optimization</option>
                    <option>RAG & Vector Search</option>
                    <option>RLHF & Fine-Tuning</option>
                    <option>Agentic Workflows</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1.5">Title</label>
                  <Input
                    required
                    placeholder="Enter a descriptive title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-secondary border-border text-foreground text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1.5">Content / Code Snippet</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide background context, equations, or code details..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full p-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewModal(false)}
                    className="bg-secondary border-border text-foreground text-xs h-9 px-4 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs h-9 px-5 rounded-xl shadow-md shadow-purple-900/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Post</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </NexusShell>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Community...</div>}>
      <CommunityPageInner />
    </Suspense>
  );
}
