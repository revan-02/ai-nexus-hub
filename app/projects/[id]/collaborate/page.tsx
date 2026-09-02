'use client';

import React, { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Clock,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Plus,
  Play,
  Terminal,
  Code,
  FileCode,
  ShieldCheck,
  Award,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Gift,
  Send,
  Zap,
  Layers,
  FolderKanban,
  AlertCircle,
  X
} from 'lucide-react';
import { useProject } from '@/hooks/api/use-projects';
import { useSession } from 'next-auth/react';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

interface KanbanTask {
  id: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'Urgent' | 'High' | 'Normal';
  xp: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'away';
  endorsements: number;
  skills: string[];
}

export default function CollaborativeProjectRoomPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params && typeof (params as any)?.then === 'function' ? use(params as Promise<{ id: string }>) : (params as { id: string });
  const id = resolvedParams?.id || 'prj-1';

  const { data: session } = useSession();
  const { data: projectResponse, isLoading } = useProject(id);

  const project = projectResponse?.data || {
    id,
    name: 'Multimodal Medical Radiography Agent (Team Sprint)',
    description: 'Deploying 3D UNet and ViT models on Kubernetes to automate early cancer screening.',
    category: 'AI & ML',
    technologies: ['PyTorch', 'FastAPI', 'Kubernetes', 'DICOM', 'Docker'],
  };

  // ─── 1. Real-Time Deadline Countdown Timer (Target: 14 Days from now) ───
  const targetDeadline = useMemo(() => {
    return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 22 * 60 * 1000);
  }, []);

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 14,
    hours: 8,
    minutes: 22,
    seconds: 10,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDeadline.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDeadline]);

  // ─── 2. Team Roster State ───
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'usr-1',
      name: session?.user?.name || 'Sarah Johnson',
      role: 'Lead AI Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      endorsements: 18,
      skills: ['PyTorch', 'Distributed Training', 'vLLM'],
    },
    {
      id: 'usr-2',
      name: 'Dr. Alex Morgan',
      role: 'MLOps & Infrastructure Engineer',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      endorsements: 24,
      skills: ['Kubernetes', 'Docker', 'Triton'],
    },
    {
      id: 'usr-3',
      name: 'James Wilson',
      role: 'FastAPI & Frontend Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      endorsements: 12,
      skills: ['FastAPI', 'Next.js', 'WebSockets'],
    },
    {
      id: 'usr-4',
      name: 'Anna Martinez',
      role: 'QA & Model Evaluation Lead',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'busy',
      endorsements: 15,
      skills: ['Ragas', 'TruLens', 'Benchmarking'],
    },
  ]);

  // ─── 3. Collaborative Kanban Board State ───
  const [tasks, setTasks] = useState<KanbanTask[]>([
    { id: 'tsk-1', title: 'Implement 3D UNet Attention Encoder in PyTorch', assignee: 'Sarah Johnson', status: 'done', priority: 'High', xp: 150 },
    { id: 'tsk-2', title: 'Write FastAPI Async DICOM Preprocessing Pipeline', assignee: 'James Wilson', status: 'done', priority: 'Urgent', xp: 100 },
    { id: 'tsk-3', title: 'Configure Kubernetes GPU Node Pool & Autoscaler', assignee: 'Dr. Alex Morgan', status: 'in_progress', priority: 'Urgent', xp: 200 },
    { id: 'tsk-4', title: 'Setup Ragas & TruLens Hallucination Telemetry', assignee: 'Anna Martinez', status: 'review', priority: 'Normal', xp: 120 },
    { id: 'tsk-5', title: 'Optimize FP16 TensorRT Engine for Sub-10ms Inference', assignee: 'Sarah Johnson', status: 'todo', priority: 'High', xp: 180 },
    { id: 'tsk-6', title: 'Finalize Open-Source Documentation & GitHub Release', assignee: 'James Wilson', status: 'todo', priority: 'Normal', xp: 90 },
  ]);

  // ─── 4. Code & Terminal Sandbox State ───
  const [activeCodeFile, setActiveCodeFile] = useState('main.py');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);

  // ─── 5. Social Sharing & Referral State ───
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [githubPublished, setGithubPublished] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const studentReferralCode = `NEXUS-REF-${(session?.user?.name || 'STUDENT').toUpperCase().slice(0, 5)}99`;
  const projectShareUrl = `https://nexus.ai/projects/${id}/showcase`;

  const handleEndorseMember = (memberId: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, endorsements: m.endorsements + 1 } : m))
    );
  };

  const handleMoveTask = (taskId: string, nextStatus: KanbanTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
  };

  const handleRunPipeline = () => {
    setIsRunningPipeline(true);
    setTerminalOutput(['[INFO] Initializing PyTorch CUDA runtime...', '[INFO] Loading 3D UNet model weights (FP16)...']);

    setTimeout(() => {
      setTerminalOutput((prev) => [
        ...prev,
        '[INFO] Processing DICOM 3D volumetric MRI scan (256x256x64)...',
        '[SUCCESS] Lesion detection completed in 8.42ms (GPU SRAM VRAM: 4.1GB).',
        '[SUCCESS] All unit tests & benchmark latency constraints passed (100%).',
      ]);
      setIsRunningPipeline(false);
    }, 1800);
  };

  const handleLinkedInShare = () => {
    const postText = encodeURIComponent(
      `🚀 Excited to announce our team published "${project.name}" on the AI Nexus Industry Platform!\n\nDemonstrated full-stack AI engineering: PyTorch 3D model serving, FastAPI, and Kubernetes GPU orchestration with sub-10ms latency.\n\nCheck out the open-source repository & verified team credentials: ${projectShareUrl}\n\n#AI #MachineLearning #DeepLearning #BuildInPublic #NexusAI`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectShareUrl)}&summary=${postText}`, '_blank');
  };

  const handleTwitterShare = () => {
    const tweet = encodeURIComponent(
      `Just completed "${project.name}" with my engineering team on @AINexusPlatform! ⚡ Full PyTorch 3D pipeline + Kubernetes GPU deployment.\n\nLive demo & repo: ${projectShareUrl}\n\n#AI #BuildInPublic #NexusAI`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Check out our completed collaborative AI project: "${project.name}" on AI Nexus! Live repo & verified certificate: ${projectShareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyShowcaseUrl = () => {
    navigator.clipboard.writeText(projectShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://nexus.ai/join?ref=${studentReferralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 3000);
  };

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <NexusShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16 select-none">
        {/* ── Top Header Navigation & Action Bar ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="p-2 bg-secondary border border-border rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">{project.name}</h1>
                <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold rounded-md">
                  Collaborative Team Room
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold rounded-md flex items-center gap-1">
                  <Users className="w-3 h-3" /> 4 Active Students
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{project.description}</p>
            </div>
          </div>

          {/* Social Publishing & GitHub Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={() => setIsGithubModalOpen(true)}
              className="bg-[#24292f] hover:bg-[#1a1e22] text-white text-xs font-bold rounded-xl gap-1.5 h-9 px-3.5 shadow-md shadow-black/40 cursor-pointer border border-zinc-700"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Publish to GitHub</span>
            </Button>

            <Button
              onClick={() => setIsShareModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl gap-1.5 h-9 px-3.5 shadow-md shadow-purple-900/40 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Achievements</span>
            </Button>

            <Link href="/certificates/cert-1">
              <Button
                variant="outline"
                className="bg-secondary border-border hover:bg-secondary/80 text-amber-400 text-xs font-bold rounded-xl gap-1.5 h-9 px-3.5 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Team Certificate</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Sprint Milestone & Deadline Ticker ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Deadline Countdown Clock (5 Cols) */}
          <Card className="lg:col-span-5 p-5 bg-gradient-to-br from-purple-950/40 via-card to-card border-purple-500/30 rounded-2xl flex flex-col justify-between space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400 animate-pulse" /> Project Submission Deadline
              </span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold rounded">
                Sprint Phase 2
              </span>
            </div>

            {/* Big Ticker Clock */}
            <div className="grid grid-cols-4 gap-2 text-center py-1">
              <div className="p-2.5 bg-secondary/70 border border-border rounded-xl">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-300 block">{timeLeft.days}</span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Days</span>
              </div>
              <div className="p-2.5 bg-secondary/70 border border-border rounded-xl">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-300 block">{timeLeft.hours}</span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Hours</span>
              </div>
              <div className="p-2.5 bg-secondary/70 border border-border rounded-xl">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-300 block">{timeLeft.minutes}</span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Mins</span>
              </div>
              <div className="p-2.5 bg-secondary/70 border border-border rounded-xl">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 block">{timeLeft.seconds}</span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Secs</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Team Milestone Progress</span>
                <span className="font-mono text-purple-400 font-bold">{completedCount} of {tasks.length} Tasks ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Student Referral & Referral Rewards Card (7 Cols) */}
          <Card className="lg:col-span-7 p-5 bg-gradient-to-br from-amber-950/30 via-card to-card border-amber-500/30 rounded-2xl flex flex-col justify-between space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-foreground">Peer Referral & Student Reward Hub</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded">
                +250 XP per Student Referral
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Invite other students or colleagues to join your collaborative project room. Each successful referral unlocks pro tier compute credits and GPU cluster hours!
            </p>

            <div className="flex items-center gap-2 bg-secondary/80 p-2 rounded-xl border border-border">
              <span className="text-[11px] font-mono font-bold text-amber-400 px-2 select-all">
                {studentReferralCode}
              </span>
              <div className="flex-1" />
              <Button
                onClick={handleCopyReferral}
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs h-7 px-3 rounded-lg gap-1 cursor-pointer"
              >
                {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReferral ? 'Copied Link!' : 'Copy Referral Link'}</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* ── Active Team Roster & Endorsements Bar ── */}
        <Card className="p-5 bg-card border-border rounded-2xl space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <Users className="w-4 h-4 text-purple-400" /> Assigned Student Team & Peer Skill Endorsements
            </h3>
            <span className="text-[11px] text-muted-foreground">Click "Endorse" to validate a teammate's skills</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-3.5 bg-secondary/40 border border-border rounded-xl space-y-2.5 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-xl object-cover border border-border" />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${
                        member.status === 'online' ? 'bg-emerald-500' : member.status === 'busy' ? 'bg-amber-500' : 'bg-zinc-500'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{member.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  {member.skills.map((sk) => (
                    <span key={sk} className="px-1.5 py-0.5 bg-secondary text-[9px] font-mono text-purple-300 rounded border border-border">
                      {sk}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => handleEndorseMember(member.id)}
                  variant="outline"
                  className="w-full bg-secondary hover:bg-purple-600 hover:text-white text-foreground text-[11px] font-bold h-7 rounded-lg gap-1 border-border cursor-pointer transition-all"
                >
                  <ThumbsUp className="w-3 h-3 text-amber-400" />
                  <span>Endorse ({member.endorsements})</span>
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Collaborative Kanban Board & Task Sprint ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FolderKanban className="w-4 h-4 text-purple-400" /> Collaborative Sprint Kanban Board
            </h2>
            <span className="text-xs text-muted-foreground">Click arrow buttons on task cards to transition states</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['todo', 'in_progress', 'review', 'done'] as const).map((columnKey) => {
              const columnTitle =
                columnKey === 'todo'
                  ? 'To Do / Backlog'
                  : columnKey === 'in_progress'
                  ? 'In Progress'
                  : columnKey === 'review'
                  ? 'Code Review'
                  : 'Completed';

              const colTasks = tasks.filter((t) => t.status === columnKey);

              return (
                <div key={columnKey} className="p-4 bg-card/80 border border-border rounded-2xl space-y-3 flex flex-col min-h-[260px]">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-bold text-foreground">{columnTitle}</span>
                    <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-[10px] font-mono font-bold rounded">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {colTasks.map((tsk) => (
                      <div
                        key={tsk.id}
                        className="p-3 bg-secondary/50 border border-border rounded-xl space-y-2 hover:border-purple-500/50 transition-all text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                              tsk.priority === 'Urgent'
                                ? 'bg-rose-500/20 text-rose-400'
                                : tsk.priority === 'High'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {tsk.priority}
                          </span>
                          <span className="font-mono text-[10px] text-amber-400 font-bold">+{tsk.xp} XP</span>
                        </div>

                        <p className="font-bold text-foreground text-[11px] leading-snug">{tsk.title}</p>
                        <p className="text-[10px] text-muted-foreground">Assignee: {tsk.assignee}</p>

                        {/* State Transition Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-border/50">
                          {columnKey !== 'todo' && (
                            <button
                              onClick={() =>
                                handleMoveTask(
                                  tsk.id,
                                  columnKey === 'done' ? 'review' : columnKey === 'review' ? 'in_progress' : 'todo'
                                )
                              }
                              className="text-[10px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              ← Back
                            </button>
                          )}
                          <div className="flex-1" />
                          {columnKey !== 'done' && (
                            <button
                              onClick={() =>
                                handleMoveTask(
                                  tsk.id,
                                  columnKey === 'todo' ? 'in_progress' : columnKey === 'in_progress' ? 'review' : 'done'
                                )
                              }
                              className="text-[10px] font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                            >
                              Advance →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Shared Code Editor & Terminal Runner ── */}
        <Card className="p-6 bg-card border-border rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Shared Collaborative Pipeline Code & Test Sandbox
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleRunPipeline}
                disabled={isRunningPipeline}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-3.5 rounded-lg gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunningPipeline ? 'Executing on GPU...' : 'Run Pipeline & Benchmark'}</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* File Selector & Code (7 Cols) */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center gap-1.5 bg-secondary/70 p-1 rounded-xl text-xs">
                {['main.py', 'model.py', 'Dockerfile'].map((file) => (
                  <button
                    key={file}
                    onClick={() => setActiveCodeFile(file)}
                    className={`px-3 py-1 font-mono font-bold text-[11px] rounded-lg transition-all cursor-pointer ${
                      activeCodeFile === file ? 'bg-purple-600 text-white' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {file}
                  </button>
                ))}
              </div>

              <pre className="p-4 bg-black/80 border border-border rounded-2xl font-mono text-xs text-purple-300 overflow-x-auto max-h-64 leading-relaxed">
                <code>
                  {activeCodeFile === 'main.py' &&
                    `# Collaborative Production Inference Endpoint\nfrom fastapi import FastAPI, UploadFile, File\nimport torch\n\napp = FastAPI(title="Radiography 3D Segmentation")\n\n@app.post("/v1/segment")\nasync def segment_mri(scan: UploadFile = File(...)):\n    tensor = preprocess_dicom(await scan.read())\n    with torch.inference_mode():\n        mask, confidence = model(tensor)\n    return {"lesions": int(mask.sum()), "confidence": float(confidence)}`}
                  {activeCodeFile === 'model.py' &&
                    `import torch.nn as nn\n\nclass UNet3D(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.encoder = nn.Sequential(\n            nn.Conv3d(1, 64, kernel_size=3, padding=1),\n            nn.BatchNorm3d(64),\n            nn.ReLU(inplace=True)\n        )\n        self.head = nn.Conv3d(64, 2, kernel_size=1)`}
                  {activeCodeFile === 'Dockerfile' &&
                    `FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`}
                </code>
              </pre>
            </div>

            {/* Live Terminal Output (5 Cols) */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live GPU Cluster Terminal Console</span>
              </div>

              <div className="p-4 bg-black/90 border border-border rounded-2xl font-mono text-[11px] text-emerald-400 h-64 overflow-y-auto space-y-1">
                <p className="text-zinc-500">// Connected to Nexus GPU Node (NVIDIA A100-SXM4-80GB)...</p>
                {terminalOutput.map((line, idx) => (
                  <p key={idx} className={line.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : 'text-purple-300'}>
                    {line}
                  </p>
                ))}
                {terminalOutput.length === 0 && (
                  <p className="text-zinc-600">// Click "Run Pipeline & Benchmark" to execute collaborative test suite...</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* ── MODAL 1: PUBLISH TO GITHUB REPOSITORY ── */}
        {isGithubModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-card border border-border rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-5 h-5 text-white" />
                  <h3 className="text-sm font-bold text-foreground">Publish Project to GitHub</h3>
                </div>
                <button onClick={() => setIsGithubModalOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  This generates a clean open-source repository with full documentation, requirements, Dockerfile, and team contributor credits.
                </p>

                <div className="p-3 bg-secondary/60 rounded-xl border border-border space-y-1 font-mono text-[11px]">
                  <span className="text-purple-400 block font-bold">Repository Target:</span>
                  <span className="text-foreground font-bold">github.com/nexus-student-labs/medical-radiography-agent</span>
                </div>

                <div className="p-3 bg-secondary/40 rounded-xl border border-border space-y-1">
                  <span className="font-bold text-foreground block">Included in Bundle:</span>
                  <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                    <li>3D UNet PyTorch Architecture + Weights</li>
                    <li>FastAPI Asynchronous DICOM Pipeline</li>
                    <li>Kubernetes GPU Deployment Config & Helm Chart</li>
                    <li>Verified Team Badges & Certification Reference</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsGithubModalOpen(false)} className="text-xs h-8">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setGithubPublished(true);
                    setTimeout(() => {
                      setIsGithubModalOpen(false);
                      setGithubPublished(false);
                      window.open('https://github.com/topics/nexus-ai-project', '_blank');
                    }, 1200);
                  }}
                  className="bg-[#24292f] hover:bg-black text-white text-xs font-bold h-8 px-4 rounded-xl gap-1.5 shadow-md cursor-pointer"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>{githubPublished ? 'Publishing Repository...' : 'Confirm & Publish Repo'}</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 2: SOCIAL MEDIA SHARING & ACHIEVEMENT BROADCAST ── */}
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-card border border-border rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-foreground">Share Team Achievements to Social Media</h3>
                </div>
                <button onClick={() => setIsShareModalOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Broadcast your collaborative project milestone to recruiters, peers, and developer communities in 1 click:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={handleLinkedInShare}
                  className="bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs font-bold rounded-xl gap-1.5 h-10 shadow-md shadow-blue-950/40 cursor-pointer"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  <span>LinkedIn Post</span>
                </Button>

                <Button
                  onClick={handleTwitterShare}
                  className="bg-[#1da1f2] hover:bg-[#0c85d0] text-white text-xs font-bold rounded-xl gap-1.5 h-10 shadow-md shadow-sky-950/40 cursor-pointer"
                >
                  <TwitterIcon className="w-4 h-4" />
                  <span>Tweet on X</span>
                </Button>

                <Button
                  onClick={handleWhatsAppShare}
                  className="bg-[#25d366] hover:bg-[#1eb956] text-white text-xs font-bold rounded-xl gap-1.5 h-10 shadow-md shadow-green-950/40 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </Button>
              </div>

              <div className="p-3 bg-secondary/60 rounded-xl border border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono text-[11px] truncate mr-2">{projectShareUrl}</span>
                <Button
                  onClick={handleCopyShowcaseUrl}
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs bg-secondary border-border text-foreground rounded-lg gap-1 cursor-pointer flex-shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NexusShell>
  );
}
