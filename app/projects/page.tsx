'use client';

import React, { useState, useMemo } from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderKanban, Plus, ChevronRight, Star, Download, ArrowRight, FolderPlus, ShoppingBag, ShieldCheck, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { useProjects } from '@/hooks/api/use-projects';
import { CreateProjectModal } from '@/components/projects/create-project-modal';

export default function ProjectsPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: apiResponse, isLoading, refetch } = useProjects({ page: 1, limit: 100 });

  const projectsList = useMemo(() => {
    if (apiResponse?.data && apiResponse.data.length > 0) {
      return apiResponse.data.map((p: any) => ({
        id: p.id,
        title: p.name,
        desc: p.description,
        category: p.category || 'AI & ML',
        level: p.level || 'Intermediate',
        price: p.price || 'Free',
        rating: p.rating || 4.9,
        downloads: p.downloads || 320,
        updated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Just now',
        tech: p.technologies || ['React', 'TypeScript'],
        authorName: p.author?.name || 'Dr. Alex Morgan',
      }));
    }
    return [
      {
        id: 'prj-1',
        title: 'Multimodal Medical Radiography Agent',
        desc: 'Deploying 3D UNet and ViT models on Kubernetes to automate early cancer screening.',
        category: 'AI & ML',
        level: 'Advanced',
        price: '$49',
        rating: 4.9,
        downloads: 320,
        updated: 'Just now',
        tech: ['PyTorch', 'FastAPI', 'Kubernetes', 'DICOM'],
        authorName: 'Sarah Johnson',
      },
      {
        id: 'prj-2',
        title: 'High-Frequency Fraud Detection Pipeline',
        desc: 'Real-time GNN inference engine analyzing 12.5M financial transactions under 15ms.',
        category: 'AI & ML',
        level: 'Advanced',
        price: '$79',
        rating: 5.0,
        downloads: 415,
        updated: 'Yesterday',
        tech: ['PyTorch Geometric', 'vLLM', 'Qdrant'],
        authorName: 'Dr. Alex Morgan',
      },
      {
        id: 'prj-3',
        title: 'Autonomous Code Refactoring Agent',
        desc: 'Fine-tuning LLaMA 3 70B on internal repository commits for automated PR reviews.',
        category: 'Generative AI',
        level: 'Intermediate',
        price: '$39',
        rating: 4.8,
        downloads: 180,
        updated: '2 days ago',
        tech: ['LangChain', 'LoRA', 'GitHub API'],
        authorName: 'James Wilson',
      },
      {
        id: 'prj-4',
        title: 'Real-time Video Sentiment & Eye Tracking',
        desc: 'Computer vision pipeline detecting facial micro-expressions and gaze direction.',
        category: 'Computer Vision',
        level: 'Beginner',
        price: 'Free',
        rating: 4.7,
        downloads: 512,
        updated: '3 days ago',
        tech: ['OpenCV', 'MediaPipe', 'TensorFlow'],
        authorName: 'Anna Martinez',
      },
    ];
  }, [apiResponse]);

  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'All') return projectsList;
    if (selectedFilter === 'Free Projects') return projectsList.filter((p) => p.price.toLowerCase() === 'free');
    if (selectedFilter === 'Premium Projects') return projectsList.filter((p) => p.price.toLowerCase() !== 'free');
    return projectsList.filter((p) => p.category.toLowerCase().includes(selectedFilter.toLowerCase()));
  }, [projectsList, selectedFilter]);

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">AI Projects Marketplace</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">AI Project Workspaces & Codebase Marketplace</h1>
              <FolderKanban className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Explore verified production AI projects, architecture documentation, complete codebases, and commercial licenses.
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30 cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Post Project
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 border-b border-border pb-3 overflow-x-auto scrollbar-none">
          {['All', 'Free Projects', 'Premium Projects', 'AI & ML', 'Generative AI', 'Computer Vision'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 bg-card border-border rounded-2xl animate-pulse space-y-4">
                <div className="h-4 bg-secondary rounded w-1/2" />
                <div className="h-3 bg-secondary rounded w-full" />
                <div className="h-3 bg-secondary rounded w-3/4" />
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground bg-card border-border rounded-2xl space-y-3">
            <FolderPlus className="w-12 h-12 text-purple-400 mx-auto" />
            <h3 className="text-base font-bold text-foreground">No projects found in this category</h3>
            <p className="text-xs text-muted-foreground">Click &quot;Post Project&quot; above to publish an AI codebase to the marketplace.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((p) => {
              const isFree = p.price.toLowerCase() === 'free';
              return (
                <Card key={p.id} className="p-6 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between group">
                  <div className="space-y-3">
                    {/* Top Pricing & Rating Badges */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                        isFree
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      }`}>
                        {p.price}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{p.rating} ({p.downloads})</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{p.category}</span>
                      <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-purple-300 transition-colors mt-0.5">
                        {p.title}
                      </h3>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{p.desc}</p>

                    {/* Tech Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {p.tech.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 bg-secondary text-foreground text-[10px] font-mono rounded border border-border">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action Bar */}
                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs gap-2 flex-wrap">
                    <Link href={`/projects/${p.id}/collaborate`}>
                      <Button variant="outline" className="bg-purple-600/10 border-purple-500/30 hover:bg-purple-600 hover:text-white text-purple-300 text-xs h-8 px-2.5 rounded-xl gap-1 cursor-pointer transition-all">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>Team Room</span>
                      </Button>
                    </Link>

                    <Link href={`/projects/${p.id}`}>
                      <Button variant="outline" className="bg-secondary border-border hover:bg-purple-600 hover:text-white hover:border-purple-500 text-foreground text-xs h-8 px-3 rounded-xl gap-1.5 cursor-pointer transition-all">
                        <span>Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-white" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Admin Post Project Modal */}
        <CreateProjectModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSuccess={() => refetch()}
        />
      </div>
    </NexusShell>
  );
}
