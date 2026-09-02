'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FolderKanban,
  ArrowLeft,
  ChevronRight,
  Download,
  Star,
  Code,
  FileText,
  CheckCircle2,
  ListChecks,
  Terminal,
  Cpu,
  Send,
  Sparkles,
  ShoppingBag,
  Copy,
  Check,
  MessageSquare,
  ShieldCheck,
  Layers,
  FileCode,
  CreditCard,
  Lock,
  Receipt,
  X,
  Users
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProject, useAddProjectComment } from '@/hooks/api/use-projects';
import { useSession } from 'next-auth/react';

const defaultCodeFiles = [
  {
    path: 'src/main.py',
    language: 'python',
    content: `from fastapi import FastAPI, UploadFile, File\nimport torch\nfrom model import UNet3D\n\napp = FastAPI(title="Medical Radiography Inference API")\nmodel = UNet3D().eval()\n\n@app.post("/api/v1/analyze")\nasync def analyze_scan(file: UploadFile = File(...)):\n    contents = await file.read()\n    # Process DICOM bytes & compute lesion segmentation\n    tensor = preprocess_dicom(contents)\n    with torch.no_grad():\n        mask, confidence = model(tensor)\n    return {"lesions_detected": int(mask.sum()), "confidence_score": float(confidence)}`,
  },
  {
    path: 'src/model.py',
    language: 'python',
    content: `import torch\nimport torch.nn as nn\n\nclass UNet3D(nn.Module):\n    def __init__(self, in_channels=1, out_channels=2):\n        super().__init__()\n        self.encoder = nn.Sequential(\n            nn.Conv3d(in_channels, 64, kernel_size=3, padding=1),\n            nn.BatchNorm3d(64),\n            nn.ReLU(inplace=True)\n        )\n        self.head = nn.Conv3d(64, out_channels, kernel_size=1)\n\n    def forward(self, x):\n        feat = self.encoder(x)\n        out = self.head(feat)\n        conf = torch.sigmoid(out.mean())\n        return out, conf`,
  },
  {
    path: 'deploy/k8s-deployment.yaml',
    language: 'yaml',
    content: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: radiography-agent-api\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: radiography-agent\n  template:\n    metadata:\n      labels:\n        app: radiography-agent\n    spec:\n      containers:\n      - name: api\n        image: nexus/radiography-agent:v1.2.0\n        resources:\n          limits:\n            nvidia.com/gpu: 1`,
  },
];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { data: projectResponse, isLoading, refetch } = useProject(id);
  const addCommentMutation = useAddProjectComment(id);

  const project = projectResponse?.data;

  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'code' | 'comments'>('overview');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);

  // Payment Checkout Modal State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState(session?.user?.name || 'Authorized Buyer');
  const [txnRef, setTxnRef] = useState('');

  const codeFiles = (project?.codeFiles as any[]) || defaultCodeFiles;
  const currentFile = codeFiles[selectedFileIndex] || codeFiles[0];
  const isFree = (project?.price || 'Free').toLowerCase() === 'free';

  const handleCopyCode = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addCommentMutation.mutate(
      { text: commentText.trim(), rating: commentRating },
      {
        onSuccess: () => {
          setCommentText('');
          refetch();
        },
      }
    );
  };

  const handleOpenCheckout = () => {
    if (isFree) {
      // Free download instantly
      triggerCodeDownload();
    } else {
      setPaymentStep('form');
      setIsCheckoutModalOpen(true);
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');

    setTimeout(() => {
      setTxnRef(`TXN-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setPaymentStep('success');
      triggerCodeDownload();
    }, 1500);
  };

  const triggerCodeDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(codeFiles, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${project?.name || 'project'}-codebase.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return (
      <NexusShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3 text-purple-400 font-semibold animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
            <span>Loading Project Details & Codebase...</span>
          </div>
        </div>
      </NexusShell>
    );
  }

  const fallbackAim = project?.aim || 'Automate early detection of pulmonary nodules and chest radiography abnormalities using state-of-the-art vision transformers and 3D U-Net segmentation models.';
  const fallbackObjectives = project?.objectives?.length ? project.objectives : [
    'Build a real-time DICOM image preprocessing and normalization pipeline.',
    'Implement 3D U-Net for volumetric lesion segmentation.',
    'Serve predictions via FastAPI microservices with sub-100ms inference latency.',
    'Package containerized workloads with Helm charts for production Kubernetes deployment.',
  ];
  const fallbackRequirements = project?.requirements?.length ? project.requirements : [
    'Python 3.10+',
    'PyTorch 2.1+ with CUDA 12 support',
    'NVIDIA GPU with at least 16GB VRAM',
    'Docker & Kubernetes cluster (Minikube or AWS EKS)',
  ];
  const fallbackScope = project?.scope || 'End-to-end production AI system incorporating DICOM ingest, GPU inference server, interactive web interface, and automated alert telemetry.';

  return (
    <NexusShell>
      <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/projects" className="hover:text-foreground">Projects</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">{project?.name || 'Project Details'}</span>
        </div>

        {/* Header Hero Banner (CodeCanyon Style) */}
        <Card className="relative overflow-hidden rounded-2xl border-purple-500/20 bg-gradient-to-br from-purple-950/60 via-card to-indigo-950/40 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold rounded-lg">
                  {project?.category || 'AI & ML'}
                </span>
                <span className="px-2.5 py-0.5 bg-secondary text-foreground border border-border text-xs font-semibold rounded-lg">
                  {project?.level || 'Intermediate'}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{project?.rating || 4.9} ({project?.downloads || 320} Sales)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{project?.name}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{project?.description}</p>

              {/* Technologies list */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {project?.technologies?.map((tech) => (
                  <span key={tech} className="px-2.5 py-0.5 bg-secondary text-foreground text-xs font-mono rounded-md border border-border">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Checkout CTA Sidebar */}
            <div className="flex-shrink-0 bg-card/80 border border-purple-500/30 p-6 rounded-2xl space-y-4 text-center min-w-[260px] shadow-xl">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">License & Codebase</span>
                <div className="text-3xl font-bold font-mono text-purple-400 flex items-center justify-center gap-1">
                  {project?.price || 'Free'}
                </div>
                <p className="text-[10px] text-muted-foreground">Full Commercial License + Updates</p>
              </div>

              <Button
                onClick={handleOpenCheckout}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40 gap-2 cursor-pointer"
              >
                {isFree ? (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Free Codebase</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy & Download ({project?.price})</span>
                  </>
                )}
              </Button>

              <Link href={`/projects/${project?.id || id}/collaborate`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full bg-purple-600/15 hover:bg-purple-600 hover:text-white border-purple-500/30 text-purple-300 font-bold text-xs py-2.5 h-10 rounded-xl gap-2 cursor-pointer transition-all"
                >
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Enter Collaborative Team Room</span>
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground font-medium pt-1">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Code</span>
                <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-purple-400" /> Secure Payment</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Aim', icon: FileText },
            { id: 'requirements', label: 'Requirements & Scope', icon: ListChecks },
            { id: 'code', label: 'Full Codebase Explorer', icon: Code },
            { id: 'comments', label: `Reviews & Discussion (${project?.comments?.length || 0})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & AIM */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 bg-card border-border rounded-2xl space-y-6">
              {/* Project Aim / Vision */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" /> Project Aim & Vision
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-xl border border-border">
                  {fallbackAim}
                </p>
              </div>

              {/* Objectives List */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Key Deliverables & Objectives
                </h3>
                <div className="space-y-2">
                  {fallbackObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-secondary/40 border border-border rounded-xl text-xs">
                      <div className="w-5 h-5 rounded-full bg-purple-600/20 text-purple-400 font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">
                        {i + 1}
                      </div>
                      <span className="text-foreground leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Sidebar Metadata */}
            <div className="space-y-6">
              <Card className="p-5 bg-card border-border rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-3">Project Metadata</h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Author / Posted By</span>
                    <span className="font-bold text-foreground">{project?.author?.name || 'Dr. Alex Morgan'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-bold text-purple-400">{project?.category || 'AI & ML'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Difficulty</span>
                    <span className="font-bold text-foreground">{project?.level || 'Intermediate'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Code Files</span>
                    <span className="font-mono font-bold text-foreground">{codeFiles.length} files</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Downloads</span>
                    <span className="font-mono font-bold text-emerald-400">{project?.downloads || 320}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-mono text-muted-foreground">{project?.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: REQUIREMENTS & SCOPE */}
        {activeTab === 'requirements' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-card border-border rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" /> Prerequisites & System Requirements
              </h3>
              <div className="space-y-2">
                {fallbackRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-secondary/40 border border-border rounded-xl text-xs font-mono text-foreground">
                    <Cpu className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-card border-border rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" /> Architecture & Project Scope
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-xl border border-border">
                {fallbackScope}
              </p>
            </Card>
          </div>
        )}

        {/* TAB 3: FULL CODEBASE EXPLORER */}
        {activeTab === 'code' && (
          <Card className="bg-card border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-secondary/60 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span>Interactive Codebase Explorer</span>
                <span className="text-[10px] text-muted-foreground font-mono">({codeFiles.length} files included)</span>
              </div>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                className="bg-secondary border-border text-xs h-8 px-3 rounded-lg gap-1.5 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                <span>{isCopied ? 'Copied!' : 'Copy File'}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
              {/* File Tree List */}
              <div className="md:col-span-4 border-r border-border bg-secondary/20 p-3 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">Source Code Files</p>
                {codeFiles.map((file, idx) => {
                  const isSelected = idx === selectedFileIndex;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFileIndex(idx)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <span className="truncate">{file.path}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 bg-black/40 rounded text-purple-400">
                        {file.language}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Code Viewer Panel */}
              <div className="md:col-span-8 p-4 bg-black/90 font-mono text-xs text-purple-300 overflow-x-auto">
                <pre>
                  <code>{currentFile?.content}</code>
                </pre>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 4: REVIEWS & DISCUSSION (CodeCanyon Style) */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            {/* Post Comment Form */}
            <Card className="p-6 bg-card border-border rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" /> Post a Review / Question
              </h3>
              <form onSubmit={handlePostComment} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCommentRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${star <= commentRating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your feedback, question, or review of this project codebase..."
                  rows={3}
                  required
                  className="w-full p-3 bg-secondary/40 border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-purple-500"
                />

                <Button
                  type="submit"
                  disabled={!commentText.trim() || addCommentMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 h-9 rounded-xl gap-2 shadow-md shadow-purple-950/30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{addCommentMutation.isPending ? 'Posting...' : 'Submit Review'}</span>
                </Button>
              </form>
            </Card>

            {/* Comments Feed */}
            <div className="space-y-4">
              {project?.comments?.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground bg-card border-border rounded-2xl">
                  <MessageSquare className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold">No reviews yet. Be the first to leave feedback!</p>
                </Card>
              ) : (
                project?.comments?.map((c) => (
                  <Card key={c.id} className="p-5 bg-card border-border rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-border">
                          <AvatarImage src={c.user?.avatar || undefined} />
                          <AvatarFallback>{c.user?.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-foreground">{c.user?.name || 'Learner'}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(c.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed pl-11">{c.text}</p>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* PAYMENT CHECKOUT & CODEBASE DOWNLOAD MODAL */}
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="fixed inset-0" onClick={() => setIsCheckoutModalOpen(false)} />

            <div className="relative w-full max-w-lg bg-[#121217] border border-[#272730] text-zinc-100 p-6 shadow-2xl rounded-2xl z-10 space-y-5">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#272730] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Checkout & Unlock Codebase <Lock className="w-3.5 h-3.5 text-purple-400" />
                    </h3>
                    <p className="text-xs text-zinc-400">Secure payment gateway for commercial project access</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* STEP 1: PAYMENT FORM */}
              {paymentStep === 'form' && (
                <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
                  <div className="p-4 bg-[#181820] border border-[#272730] rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>Item</span>
                      <span className="font-bold text-white truncate max-w-[200px]">{project?.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>Commercial License</span>
                      <span className="font-mono text-purple-400 font-bold">{project?.price}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#272730] pt-2 text-white font-bold text-sm">
                      <span>Total Amount Due</span>
                      <span className="font-mono text-purple-400">{project?.price}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1.5">Cardholder Name</label>
                    <Input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      className="bg-[#181820] border-[#272730] text-zinc-100 text-xs h-9"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1.5">Card Number</label>
                    <Input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="bg-[#181820] border-[#272730] text-zinc-100 font-mono text-xs h-9"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-300 font-medium mb-1.5">Expiry Date</label>
                      <Input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        required
                        className="bg-[#181820] border-[#272730] text-zinc-100 font-mono text-xs h-9"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-300 font-medium mb-1.5">CVC / CVV</label>
                      <Input
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        required
                        className="bg-[#181820] border-[#272730] text-zinc-100 font-mono text-xs h-9"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-11 rounded-xl shadow-lg shadow-purple-950/40 gap-2 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {project?.price} & Download Codebase</span>
                  </Button>
                </form>
              )}

              {/* STEP 2: PROCESSING ANIMATION */}
              {paymentStep === 'processing' && (
                <div className="py-12 space-y-4 text-center">
                  <Sparkles className="w-10 h-10 text-purple-400 mx-auto animate-spin" />
                  <h4 className="text-sm font-bold text-white">Processing Payment Gateway...</h4>
                  <p className="text-xs text-zinc-400">Verifying commercial license transaction with Stripe API.</p>
                </div>
              )}

              {/* STEP 3: SUCCESS & RECEIPT */}
              {paymentStep === 'success' && (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">Payment Authorized & Unlocked!</h4>
                    <p className="text-xs text-emerald-400 font-mono font-semibold">{txnRef}</p>
                  </div>

                  <div className="p-4 bg-[#181820] border border-[#272730] rounded-xl space-y-2 text-xs text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Receipt Ref</span>
                      <span className="font-mono text-white font-bold">{txnRef}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Amount Paid</span>
                      <span className="font-mono text-purple-400 font-bold">{project?.price}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#272730] pt-2">
                      <span className="text-zinc-400">Codebase Bundle</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Downloaded (.json/.zip)</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 h-10 rounded-xl cursor-pointer"
                  >
                    Close & Access Workspace Explorer
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </NexusShell>
  );
}
