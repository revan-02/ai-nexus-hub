'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNexus } from '@/context/nexus-context';
import {
  Search,
  X,
  BookOpen,
  Code2,
  Database,
  Wrench,
  Briefcase,
  ArrowRight,
  Flame,
  Zap,
  Sparkles,
  Trophy,
  GraduationCap,
  Cpu,
  CornerDownLeft,
  Clock,
  Command,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { hybridSearch, SearchResultItem } from '@/services/search-engine-service';

const CATEGORIES = [
  'All',
  'Daily Challenge',
  'Challenges',
  'Algorithms',
  'Interview Prep',
  'VTU Papers',
  'Tools & Stack',
  'Datasets',
] as const;

const TRENDING_QUERIES = [
  'Transformer Attention',
  'Daily Challenge',
  'Agri Crop Scanner',
  'FinTech Fraud GNN',
  'PyTorch CUDA',
  'Gradient Descent Derivation',
  'VTU Past Papers',
];

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Daily Challenge':
      return Flame;
    case 'Challenges':
      return Trophy;
    case 'Algorithms':
      return Code2;
    case 'Interview Prep':
      return Briefcase;
    case 'VTU Papers':
      return GraduationCap;
    case 'Tools & Stack':
      return Wrench;
    case 'Datasets':
      return Database;
    case 'Architecture':
      return Cpu;
    default:
      return BookOpen;
  }
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;

  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-purple-500/30 text-purple-200 font-bold rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export function NexusSearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen } = useNexus();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultListRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens & reset state
  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Execute advanced hybrid search
  const results: SearchResultItem[] = useMemo(() => {
    return hybridSearch(query, {
      category: selectedCategory,
      limit: 12,
    });
  }, [query, selectedCategory]);

  // Reset selected item index on query or category change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  const handleNavigate = useCallback(
    (href: string) => {
      setIsSearchOpen(false);
      router.push(href);
    },
    [router, setIsSearchOpen]
  );

  // Keyboard navigation inside search results
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleNavigate(results[selectedIndex].href);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchOpen(false);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Cycle through categories
      const currentIdx = CATEGORIES.indexOf(selectedCategory as any);
      const nextIdx = e.shiftKey
        ? (currentIdx - 1 + CATEGORIES.length) % CATEGORIES.length
        : (currentIdx + 1) % CATEGORIES.length;
      setSelectedCategory(CATEGORIES[nextIdx]);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (resultListRef.current) {
      const activeElement = resultListRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isSearchOpen) return null;

  return (
    <div
      onClick={() => setIsSearchOpen(false)}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150 relative"
      >
        {/* ── Search Input Header ── */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/30 relative">
          <Search className="w-5 h-5 text-purple-400 flex-shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search topics, algorithms, challenges, interview Qs, VTU papers..."
            className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-secondary text-[11px] font-mono text-muted-foreground rounded-lg border border-border">
            <span>ESC</span>
          </div>
        </div>

        {/* ── Category Filter Pills ── */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/60 bg-secondary/15 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                    : 'bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── Results List ── */}
        <div ref={resultListRef} className="p-3 overflow-y-auto space-y-1.5 flex-1 min-h-[220px]">
          {results.length > 0 ? (
            results.map((item, index) => {
              const Icon = getCategoryIcon(item.category);
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={item.id}
                  data-index={index}
                  onClick={() => handleNavigate(item.href)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-start justify-between p-3.5 rounded-2xl transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-purple-600/15 border border-purple-500/40 shadow-lg shadow-purple-950/30'
                      : 'hover:bg-secondary/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-secondary text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-foreground truncate">
                          <HighlightText text={item.title} query={query} />
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {item.badge}
                          </span>
                        )}
                        {item.difficulty && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono ${
                              item.difficulty === 'Expert'
                                ? 'text-rose-400 bg-rose-500/15'
                                : item.difficulty === 'Hard'
                                ? 'text-amber-400 bg-amber-500/15'
                                : 'text-emerald-400 bg-emerald-500/15'
                            }`}
                          >
                            {item.difficulty}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed">
                        <HighlightText text={item.subtitle} query={query} />
                      </p>

                      {item.snippet && isSelected && (
                        <p className="text-[10px] text-purple-300/90 line-clamp-2 pt-1 font-mono">
                          {item.snippet}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                    {item.xp && (
                      <span className="text-[11px] font-bold text-amber-400 font-mono flex items-center gap-0.5">
                        <Zap className="w-3 h-3 fill-amber-400" /> +{item.xp}
                      </span>
                    )}
                    <CornerDownLeft
                      className={`w-3.5 h-3.5 transition-all ${
                        isSelected ? 'text-purple-400 opacity-100 translate-x-0' : 'text-muted-foreground opacity-0 -translate-x-1'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/80 border border-border mx-auto flex items-center justify-center text-muted-foreground">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-foreground">No matches found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                Try searching for broad terms like <strong>Transformers</strong>, <strong>Agriculture</strong>, <strong>GNN</strong>, <strong>PyTorch</strong>, or <strong>Interview Prep</strong>.
              </p>
            </div>
          )}
        </div>

        {/* ── Trending Searches Footer ── */}
        {!query && (
          <div className="px-4 py-3 bg-secondary/20 border-t border-border/70 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Trending AI Topics</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {TRENDING_QUERIES.map((tq) => (
                <button
                  key={tq}
                  onClick={() => setQuery(tq)}
                  className="px-2.5 py-1 rounded-xl bg-card border border-border hover:border-purple-500/40 text-[11px] text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  {tq}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Keyboard Shortcut Guide ── */}
        <div className="px-5 py-2.5 bg-secondary/40 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-card rounded border border-border text-foreground">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-card rounded border border-border text-foreground">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-card rounded border border-border text-foreground">↵</kbd> Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-card rounded border border-border text-foreground">Tab</kbd> Switch Pillar
            </span>
          </div>
          <span className="text-purple-400 font-bold">Hybrid BM25 + Vector + LRU</span>
        </div>
      </div>
    </div>
  );
}
