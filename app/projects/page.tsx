'use client';

import React, { useState, useMemo } from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { AdminShell } from '@/components/layout/admin-shell';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderKanban, Plus, ChevronRight, Star, Download, ArrowRight, FolderPlus, ShoppingBag, ShieldCheck, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { useProjects } from '@/hooks/api/use-projects';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { mockProjectsList } from '@/lib/mock-data/projects-data';

export default function ProjectsPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role || 'User';
  const isAdmin = ['Admin', 'Manager', 'Super Admin'].includes(userRole);
  const Shell = isAdmin ? AdminShell : NexusShell;

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: apiResponse, isLoading, refetch } = useProjects({ page: 1, limit: 100 });

  const projectsList = useMemo(() => {
    if (apiResponse?.data && apiResponse.data.length > 0) {
      return apiResponse.data.map((p: any) => ({
        id: p.id,
        title: p.name,
        desc: p.description,
        category: p.category || 'AI/ML',
        level: p.level || 'Intermediate',
        price: p.price || 'Free',
        isFree: (p.price || 'Free').toLowerCase() === 'free',
        rating: p.rating || 4.9,
        downloads: p.downloads || 320,
        updated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Just now',
        tech: p.technologies || ['Python', 'PyTorch'],
        prerequisites: p.prerequisites || ['Basic programming knowledge'],
        expectedOutput: p.expectedOutput || 'Production deployment code',
        whatYouReceive: p.whatYouReceive || 'Full commercial source code and deployment guide',
        authorName: p.author?.name || 'Dr. Alex Morgan',
      }));
    }
    return mockProjectsList.map((p) => ({
      id: p.id,
      title: p.name,
      desc: p.description,
      category: p.category,
      level: p.level,
      price: p.price,
      isFree: p.isFree,
      rating: p.rating,
      downloads: p.downloads,
      updated: p.updatedAt,
      tech: p.technologies,
      prerequisites: p.prerequisites,
      expectedOutput: p.expectedOutput,
      whatYouReceive: p.whatYouReceive,
      authorName: p.author.name,
    }));
  }, [apiResponse]);

  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'All') return projectsList;
    if (selectedFilter === 'Free Projects') return projectsList.filter((p) => p.isFree || p.price.toLowerCase() === 'free');
    if (selectedFilter === 'Premium Projects') return projectsList.filter((p) => !p.isFree && p.price.toLowerCase() !== 'free');
    return projectsList.filter((p) =>
      p.category.toLowerCase().replace(/[^a-z0-9]/g, '').includes(selectedFilter.toLowerCase().replace(/[^a-z0-9]/g, ''))
    );
  }, [projectsList, selectedFilter]);

  return (
    <Shell>
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
          {['All', 'Free Projects', 'Premium Projects', 'AI/ML', 'Generative AI', 'Web Development', 'Mobile Apps', 'Data Visualization', 'Blockchain', 'IoT'].map((filter) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => {
              const isFree = p.isFree || p.price.toLowerCase() === 'free';
              return (
                <Card key={p.id} className="p-6 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-sm">
                  <div className="space-y-3">
                    {/* Top Pricing & Rating Badges */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                        isFree
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      }`}>
                        {isFree ? '100% Free' : `${p.price} License`}
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

                    {/* Free vs Premium Specifics */}
                    {isFree ? (
                      <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/80 text-[11px] space-y-1">
                        <div className="text-muted-foreground font-mono">
                          <strong className="text-foreground">Prereqs:</strong> {p.prerequisites?.[0] || 'Basic programming knowledge'}
                        </div>
                        <div className="text-muted-foreground font-mono truncate">
                          <strong className="text-foreground">Output:</strong> {p.expectedOutput || 'Runnable sandbox code'}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-[11px] space-y-1">
                        <div className="text-purple-300 font-bold flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3 text-purple-400" />
                          <span>Commercial License: {p.price}</span>
                        </div>
                        <p className="text-zinc-400 text-[10px] line-clamp-2">
                          {p.whatYouReceive || 'Full audited source code, deployment guide & commercial usage license.'}
                        </p>
                      </div>
                    )}

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
                        <span>{isFree ? 'Start Project' : 'View & Buy'}</span>
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
    </Shell>
  );
}
