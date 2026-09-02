'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FolderTree,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers,
  Tag,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Sliders,
  Hash,
  ExternalLink,
  Cpu,
  Brain,
  Database,
  ShieldCheck,
  Server,
  Zap,
  Globe,
  Bot,
  Network,
  Eye,
  Gamepad2,
  Binary,
  Wrench,
  Minimize2,
  Copy,
  Check,
  Grid,
  ListTree,
  Share2,
  ArrowRight,
  Filter,
  CornerDownRight,
  FolderOpen
} from 'lucide-react';
import { MOCK_CATEGORIES, ParentCategory, ChildCategory } from '@/lib/mock-data/categories-data';

// Helper icon resolver
const ICON_MAP: Record<string, React.ElementType> = {
  Brain,
  Sparkles,
  Cpu,
  Layers,
  Database,
  Bot,
  ShieldCheck,
  Server,
  Zap,
  Globe,
  FolderTree,
  Network,
  Eye,
  Gamepad2,
  Binary,
  Wrench,
  Minimize2,
  Tag,
};

const AVAILABLE_ICONS = [
  'Brain',
  'Sparkles',
  'Cpu',
  'Layers',
  'Database',
  'Bot',
  'ShieldCheck',
  'Server',
  'Zap',
  'Network',
  'Eye',
  'Gamepad2',
  'Binary',
  'Wrench',
  'Globe',
  'FolderTree',
];

const PRESET_COLORS = [
  { name: 'Neon Purple', hex: '#8b5cf6' },
  { name: 'Electric Pink', hex: '#ec4899' },
  { name: 'Sapphire Blue', hex: '#3b82f6' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Cyan Wave', hex: '#06b6d4' },
];

export function CategoryManager() {
  const [categories, setCategories] = useState<ParentCategory[]>(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'matrix' | 'graph'>('tree');
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    'cat-1': true,
    'cat-2': true,
    'cat-3': true,
    'cat-4': true,
  });

  // Modal States
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>('cat-1');

  // Form Fields
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#8b5cf6');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Brain');

  // Notification Toast & Copy State
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    categories.forEach((c) => (all[c.id] = true));
    setExpandedParents(all);
  };

  const collapseAll = () => {
    setExpandedParents({});
  };

  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(`https://nexusai.education/courses/category/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Filtered tree
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const q = searchQuery.toLowerCase();
    return categories
      .map((cat) => {
        const matchesParent =
          cat.name.toLowerCase().includes(q) ||
          cat.slug.toLowerCase().includes(q) ||
          cat.description.toLowerCase().includes(q);

        const matchingChildren = cat.children.filter(
          (child) =>
            child.name.toLowerCase().includes(q) ||
            child.slug.toLowerCase().includes(q) ||
            child.description.toLowerCase().includes(q)
        );

        if (matchesParent || matchingChildren.length > 0) {
          return {
            ...cat,
            children: matchingChildren.length > 0 ? matchingChildren : cat.children,
          };
        }
        return null;
      })
      .filter(Boolean) as ParentCategory[];
  }, [categories, searchQuery]);

  const totalParentCount = categories.length;
  const totalChildCount = categories.reduce((sum, c) => sum + c.children.length, 0);
  const totalCourses = categories.reduce((sum, c) => sum + c.courseCount, 0);
  const totalArticles = categories.reduce((sum, c) => sum + c.articleCount, 0);

  // Handle Parent Category Submission
  const handleCreateParentCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName,
          slug: newCategorySlug,
          description: newCategoryDesc,
          color: newCategoryColor,
          icon: newCategoryIcon,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setCategories((prev) => [json.data, ...prev]);
        setExpandedParents((prev) => ({ ...prev, [json.data.id]: true }));
        setNotification({
          type: 'success',
          message: `Parent category "${newCategoryName}" created successfully!`,
        });
        setParentModalOpen(false);
        resetForm();
      } else {
        setNotification({ type: 'error', message: json.error || 'Failed to create category' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Handle Child Category Submission
  const handleCreateChildCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName || !selectedParentId) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName,
          slug: newCategorySlug,
          description: newCategoryDesc,
          parentId: selectedParentId,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === selectedParentId
              ? { ...cat, children: [...cat.children, json.data] }
              : cat
          )
        );
        setExpandedParents((prev) => ({ ...prev, [selectedParentId]: true }));
        setNotification({
          type: 'success',
          message: `Child sub-category "${newCategoryName}" added successfully!`,
        });
        setChildModalOpen(false);
        resetForm();
      } else {
        setNotification({ type: 'error', message: json.error || 'Failed to add sub-category' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      const json = await res.json();

      if (json.success) {
        setCategories((prev) =>
          prev
            .filter((c) => c.id !== id)
            .map((c) => ({
              ...c,
              children: c.children.filter((ch) => ch.id !== id),
            }))
        );
        setNotification({ type: 'success', message: `Category "${name}" deleted.` });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to delete category' });
    } finally {
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const resetForm = () => {
    setNewCategoryName('');
    setNewCategorySlug('');
    setNewCategoryDesc('');
    setNewCategoryColor('#8b5cf6');
    setNewCategoryIcon('Brain');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── NOTIFICATION TOAST ── */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-2xl animate-in slide-in-from-top-3 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50'
              : 'bg-rose-950/70 border-rose-500/50 text-rose-200 shadow-rose-950/50'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── HERO BANNER WITH NEON GLOW & TAXONOMY HUD ── */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#130f26] via-[#100e1c] to-[#0d1527] p-6 sm:p-8 shadow-2xl">
        {/* Background Ambient Glows */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-[11px] font-mono font-bold rounded-full border border-purple-500/40 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Taxonomy &amp; Knowledge Hierarchy Engine
              </span>
              <span className="text-xs font-mono text-zinc-400">v3.4 Production</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Categories &amp; Sub-Taxonomy Manager
              <FolderTree className="w-7 h-7 text-purple-400 inline" />
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
              Design the hierarchical curriculum backbone for AI masterclasses, CMS interactive tutorials, algorithms repository, and proctored certification tracks with instant parent-child relations.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              onClick={() => {
                resetForm();
                setParentModalOpen(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs h-10 px-5 rounded-2xl gap-2 shadow-lg shadow-purple-950/60 cursor-pointer transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>New Main Category</span>
            </Button>

            <Button
              onClick={() => {
                resetForm();
                setSelectedParentId(categories[0]?.id || 'cat-1');
                setChildModalOpen(true);
              }}
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold text-xs h-10 px-5 rounded-2xl gap-2 cursor-pointer transition-all hover:scale-105 backdrop-blur-sm"
            >
              <Tag className="w-4 h-4 text-purple-400" />
              <span>New Child Sub-Category</span>
            </Button>
          </div>
        </div>

        {/* 4 Interactive HUD Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 mt-6 border-t border-white/10">
          <div className="p-3.5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono font-bold uppercase">
              <span>Main Domains</span>
              <FolderTree className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{totalParentCount}</div>
            <p className="text-[10px] text-purple-300 font-medium">Top-Level Categories</p>
          </div>

          <div className="p-3.5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono font-bold uppercase">
              <span>Sub-Specializations</span>
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{totalChildCount}</div>
            <p className="text-[10px] text-emerald-300 font-medium">Child Taxonomies</p>
          </div>

          <div className="p-3.5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono font-bold uppercase">
              <span>Catalog Courses</span>
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{totalCourses}</div>
            <p className="text-[10px] text-blue-300 font-medium">Categorized Tracks</p>
          </div>

          <div className="p-3.5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono font-bold uppercase">
              <span>CMS Articles</span>
              <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{totalArticles}</div>
            <p className="text-[10px] text-pink-300 font-medium">Interactive Tutorials</p>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR: SEARCH & VIEW MODE SWITCHER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories, sub-categories, slugs, keywords..."
            className="pl-10 pr-4 py-2 h-10 text-xs bg-card border-border text-foreground placeholder:text-muted-foreground rounded-2xl shadow-sm focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-secondary/80 rounded-2xl border border-border">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'tree'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>Tree View</span>
            </button>

            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Matrix Table</span>
            </button>

            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'graph'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Knowledge Graph</span>
            </button>
          </div>

          {viewMode === 'tree' && (
            <div className="flex items-center gap-1.5">
              <Button
                onClick={expandAll}
                variant="outline"
                className="bg-card border-border text-xs text-muted-foreground hover:text-foreground h-9 px-3 rounded-xl"
              >
                Expand All
              </Button>
              <Button
                onClick={collapseAll}
                variant="outline"
                className="bg-card border-border text-xs text-muted-foreground hover:text-foreground h-9 px-3 rounded-xl"
              >
                Collapse All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── VIEW MODE 1: VISUAL HIERARCHICAL TREE ── */}
      {viewMode === 'tree' && (
        <div className="space-y-5">
          {filteredCategories.map((parent) => {
            const isExpanded = !!expandedParents[parent.id];
            const ParentIcon = ICON_MAP[parent.icon] || FolderTree;

            return (
              <Card
                key={parent.id}
                className="bg-card border-border rounded-3xl overflow-hidden shadow-xl hover:border-purple-500/40 transition-all duration-200"
                style={{ borderLeft: `4px solid ${parent.color}` }}
              >
                {/* Parent Domain Header Bar */}
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-secondary/40 via-secondary/20 to-transparent">
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Expand/Collapse Toggle */}
                    <button
                      onClick={() => toggleExpand(parent.id)}
                      className="p-2 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground cursor-pointer transition-colors shadow-sm"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-purple-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Domain Icon */}
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-md flex-shrink-0"
                      style={{
                        backgroundColor: `${parent.color}20`,
                        border: `1.5px solid ${parent.color}60`,
                        color: parent.color,
                      }}
                    >
                      <ParentIcon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                          {parent.name}
                        </h3>

                        {/* Slug Pill with Copy */}
                        <button
                          onClick={() => handleCopySlug(parent.slug)}
                          className="px-2.5 py-0.5 rounded-lg bg-secondary text-purple-400 font-mono text-[10px] font-bold border border-border hover:border-purple-500/50 flex items-center gap-1 cursor-pointer transition-all"
                          title="Click to copy full category URL"
                        >
                          <Hash className="w-2.5 h-2.5" />
                          <span>{parent.slug}</span>
                          {copiedSlug === parent.slug ? (
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 opacity-60" />
                          )}
                        </button>

                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                          {parent.children.length} Sub-Specializations
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground max-w-2xl">{parent.description}</p>
                    </div>
                  </div>

                  {/* Right Header Badges & Actions */}
                  <div className="flex items-center gap-3 self-end lg:self-auto">
                    <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground mr-1">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-secondary/80 border border-border">
                        <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                        <strong className="text-foreground">{parent.courseCount}</strong> Courses
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-secondary/80 border border-border">
                        <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                        <strong className="text-foreground">{parent.articleCount}</strong> Articles
                      </span>
                    </div>

                    {/* Quick Add Child to this parent */}
                    <Button
                      onClick={() => {
                        resetForm();
                        setSelectedParentId(parent.id);
                        setChildModalOpen(true);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-8 px-3.5 rounded-xl gap-1.5 cursor-pointer shadow-md shadow-purple-950/40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Child</span>
                    </Button>

                    <Button
                      onClick={() => handleDeleteCategory(parent.id, parent.name)}
                      variant="outline"
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs h-8 px-2.5 rounded-xl cursor-pointer"
                      title="Delete Domain"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Indented Child Category Sub-Taxonomies */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t border-border bg-background/50 space-y-3">
                    {parent.children.length === 0 ? (
                      <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-3xl space-y-2">
                        <FolderOpen className="w-6 h-6 text-purple-400 mx-auto" />
                        <p>No child sub-categories created yet under this domain.</p>
                        <Button
                          onClick={() => {
                            resetForm();
                            setSelectedParentId(parent.id);
                            setChildModalOpen(true);
                          }}
                          variant="outline"
                          className="text-xs font-semibold h-8 rounded-xl"
                        >
                          + Create First Sub-Category
                        </Button>
                      </div>
                    ) : (
                      parent.children.map((child, cIdx) => {
                        const ChildIcon = ICON_MAP[child.icon] || Tag;

                        return (
                          <div
                            key={child.id}
                            className="group p-4 rounded-2xl bg-secondary/30 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/40 hover:bg-secondary/50 transition-all ml-0 sm:ml-8 relative"
                          >
                            {/* Branch Connector indicator */}
                            <div className="hidden sm:block absolute -left-5 top-1/2 -translate-y-1/2 text-purple-500/40">
                              <CornerDownRight className="w-4 h-4" />
                            </div>

                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm"
                                style={{
                                  backgroundColor: `${child.color}20`,
                                  border: `1px solid ${child.color}40`,
                                  color: child.color,
                                }}
                              >
                                <ChildIcon className="w-4 h-4" />
                              </div>

                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-sm font-bold text-foreground group-hover:text-purple-300 transition-colors">
                                    {child.name}
                                  </h4>

                                  <button
                                    onClick={() => handleCopySlug(child.slug)}
                                    className="px-2 py-0.2 rounded bg-secondary text-muted-foreground font-mono text-[10px] hover:text-foreground flex items-center gap-1 cursor-pointer"
                                    title="Copy sub-category URL"
                                  >
                                    <Hash className="w-2.5 h-2.5" />
                                    <span>{child.slug}</span>
                                    {copiedSlug === child.slug ? (
                                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-2.5 h-2.5 opacity-50" />
                                    )}
                                  </button>

                                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold">
                                    {child.status}
                                  </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">{child.description}</p>
                              </div>
                            </div>

                            {/* Stats & Actions */}
                            <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-purple-400 font-bold">{child.courseCount} Courses</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-blue-400 font-bold">{child.articleCount} Articles</span>
                              </div>

                              <Button
                                onClick={() => handleDeleteCategory(child.id, child.name)}
                                variant="outline"
                                className="bg-secondary hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 border-border h-7 px-2 rounded-lg cursor-pointer ml-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ── VIEW MODE 2: MATRIX TABLE VIEW ── */}
      {viewMode === 'matrix' && (
        <Card className="p-5 bg-card border-border rounded-3xl space-y-4 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Grid className="w-4 h-4 text-purple-400" />
              <span>Taxonomy Flat Matrix</span>
            </h3>
            <span className="text-xs font-mono text-muted-foreground">
              {totalChildCount} Sub-Categories across {totalParentCount} Domains
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-foreground">
              <thead className="bg-secondary text-muted-foreground font-semibold border-b border-border uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="p-3">Sub-Category Name</th>
                  <th className="p-3">Parent Domain</th>
                  <th className="p-3">URL Slug</th>
                  <th className="p-3">Linked Courses</th>
                  <th className="p-3">CMS Articles</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCategories.flatMap((parent) =>
                  parent.children.map((child) => (
                    <tr key={child.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="p-3 whitespace-nowrap font-bold text-foreground flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: child.color }} />
                        <span>{child.name}</span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-medium text-purple-400">
                        {parent.name}
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono text-muted-foreground">
                        /{child.slug}
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono font-bold text-foreground">
                        {child.courseCount}
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono font-bold text-foreground">
                        {child.articleCount}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {child.status}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-right space-x-1.5">
                        <Button
                          onClick={() => handleCopySlug(child.slug)}
                          variant="outline"
                          className="bg-secondary border-border hover:bg-secondary/80 text-foreground text-[11px] h-7 px-2 rounded-lg cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCategory(child.id, child.name)}
                          variant="outline"
                          className="bg-rose-500/10 border-rose-500/30 text-rose-400 text-[11px] h-7 px-2 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── VIEW MODE 3: KNOWLEDGE GRAPH VISUALIZER ── */}
      {viewMode === 'graph' && (
        <Card className="p-6 bg-card border-border rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Network className="w-4 h-4 text-purple-400" />
                <span>Interconnected Curriculum Knowledge Graph</span>
              </h3>
              <p className="text-xs text-muted-foreground">Radial cluster mapping of core AI branches and competencies</p>
            </div>
            <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 text-xs font-mono font-bold rounded-xl border border-purple-500/20">
              Interactive Topology
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCategories.map((parent) => (
              <div
                key={parent.id}
                className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-3 relative overflow-hidden"
              >
                <div
                  className="w-1.5 absolute left-0 top-0 bottom-0"
                  style={{ backgroundColor: parent.color }}
                />
                <div className="flex items-center gap-2 pl-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: parent.color }}
                  />
                  <h4 className="text-xs font-bold text-foreground truncate">{parent.name}</h4>
                </div>

                <div className="pl-2 space-y-1.5">
                  {parent.children.map((child) => (
                    <div
                      key={child.id}
                      className="p-2 rounded-xl bg-background/80 border border-border text-[11px] flex items-center justify-between gap-2 font-mono"
                    >
                      <span className="truncate text-foreground">{child.name}</span>
                      <span className="text-purple-400 font-bold flex-shrink-0">{child.courseCount} crs</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── MODAL 1: CREATE PARENT CATEGORY MODAL ── */}
      {parentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-[#0f0e17] border-purple-500/40 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5 text-purple-400 font-bold text-sm">
                <FolderTree className="w-5 h-5" />
                <span>Create Main Parent Category</span>
              </div>
              <button onClick={() => setParentModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateParentCategory} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Category Name *</label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    if (!newCategorySlug) {
                      setNewCategorySlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, '')
                      );
                    }
                  }}
                  placeholder="e.g. Quantum Computing & AI"
                  required
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">URL Slug</label>
                <Input
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  placeholder="e.g. quantum-computing-ai"
                  className="bg-secondary border-border text-foreground font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Description</label>
                <Input
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Brief summary of topics covered in this domain..."
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              {/* Icon Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Select Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {AVAILABLE_ICONS.map((iconKey) => {
                    const IconComp = ICON_MAP[iconKey] || Tag;
                    const isSelected = newCategoryIcon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setNewCategoryIcon(iconKey)}
                        className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-purple-600 border-purple-400 text-white shadow-md scale-105'
                            : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                        }`}
                        title={iconKey}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Theme Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Domain Color Accent</label>
                <div className="flex items-center gap-2.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setNewCategoryColor(c.hex)}
                      className={`w-8 h-8 rounded-xl transition-transform cursor-pointer ${
                        newCategoryColor === c.hex ? 'scale-115 ring-2 ring-white shadow-md' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  onClick={() => setParentModalOpen(false)}
                  variant="outline"
                  className="bg-secondary border-border text-foreground text-xs h-9 px-4 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-5 rounded-xl gap-1.5 cursor-pointer shadow-md shadow-purple-950/40"
                >
                  {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Create Category</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ── MODAL 2: CREATE CHILD SUB-CATEGORY MODAL ── */}
      {childModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-[#0f0e17] border-purple-500/40 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5 text-purple-400 font-bold text-sm">
                <Tag className="w-5 h-5" />
                <span>Create Child Sub-Category</span>
              </div>
              <button onClick={() => setChildModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChildCategory} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Select Parent Category *</label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full bg-secondary border border-border text-foreground text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (/{c.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Child Sub-Category Name *</label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    if (!newCategorySlug) {
                      setNewCategorySlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, '')
                      );
                    }
                  }}
                  placeholder="e.g. GraphRAG & Vector Embeddings"
                  required
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Sub-Category URL Slug</label>
                <Input
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  placeholder="e.g. graphrag-vector-embeddings"
                  className="bg-secondary border-border text-foreground font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Description</label>
                <Input
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Technical description of this sub-topic..."
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  onClick={() => setChildModalOpen(false)}
                  variant="outline"
                  className="bg-secondary border-border text-foreground text-xs h-9 px-4 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-5 rounded-xl gap-1.5 cursor-pointer shadow-md shadow-purple-950/40"
                >
                  {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Create Sub-Category</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
