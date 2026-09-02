'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNexus, UserLevel, ACADEMIC_TIERS } from '@/context/nexus-context';
import {
  LayoutDashboard,
  Cpu,
  Brain,
  Compass,
  Code2,
  Briefcase,
  AlertCircle,
  Database,
  Wrench,
  Wand2,
  FolderKanban,
  Users,
  Award,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronDown,
  UserCheck,
  Building2,
  Layers,
  FlaskConical,
  Target,
  Trophy,
  Scale,
  Shield,
  Activity,
  Flame,
  Bot,
  X
} from 'lucide-react';

interface NavSubItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  items: NavSubItem[];
}

export function NexusSidebar() {
  const pathname = usePathname();
  const { userLevel, setUserLevel, sidebarCollapsed, setSidebarCollapsed, academicTier, setAcademicTier } = useNexus();

  const navGroups: NavGroup[] = [
    {
      id: 'core',
      title: 'Overview & Hub',
      icon: LayoutDashboard,
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Daily AI Challenge', href: '/daily-challenge', icon: Flame, badge: '🔥Today' },
        { label: 'AI Overview', href: '/ai-overview', icon: Brain },
        { label: 'Roadmap & Milestones', href: '/roadmap', icon: Compass },
      ]
    },
    {
      id: 'architecture',
      title: 'AI Architecture & Labs',
      icon: Cpu,
      items: [
        { label: 'Prompt Engineering (0-100%)', href: '/prompt-engineering', icon: Sparkles, badge: '100% 🚀' },
        { label: 'Ollama Chat & Train AI', href: '/ollama', icon: Bot, badge: 'Local 🦙' },
        { label: 'Math for AI & ML', href: '/math-for-ai', icon: Activity, badge: 'Math' },
        { label: 'Model Comparison', href: '/model-comparison', icon: Scale, badge: 'Compare' },
        { label: 'Architecture & LLMs', href: '/ai-architecture', icon: Cpu, badge: 'Studio' },
        { label: 'Algorithms & Derivations', href: '/algorithms', icon: Code2 },
        { label: 'Create Your Own AI', href: '/create-ai', icon: Wand2 },
        { label: 'AI Tools & Stack', href: '/ai-tools', icon: Wrench },
        { label: 'Security & Crypto Lab', href: '/security-center', icon: Shield, badge: 'Audit' },
      ]
    },
    {
      id: 'careers',
      title: 'Careers',
      icon: Target,
      items: [
        { label: 'Interview Prep', href: '/interview-prep', icon: UserCheck, badge: '0-4y' },
        { label: 'Careers & Job Portal', href: '/careers', icon: Briefcase, badge: 'Jobs' },
        { label: 'VTU Exam Papers', href: '/vtu-question-papers', icon: GraduationCap, badge: 'VTU' },
      ]
    },
    {
      id: 'applied',
      title: 'Applied AI & Datasets',
      icon: FlaskConical,
      items: [
        { label: 'Industrial Use Cases', href: '/use-cases', icon: Briefcase },
        { label: 'Real-World Problems', href: '/real-world-problems', icon: AlertCircle },
        { label: 'Datasets & Benchmarks', href: '/datasets', icon: Database },
      ]
    },
    {
      id: 'community',
      title: 'Community & Projects',
      icon: Users,
      items: [
        { label: 'Project Workspaces', href: '/projects', icon: FolderKanban },
        { label: 'Community & Peer Forum', href: '/community', icon: Users },
      ]
    },
    {
      id: 'credentials',
      title: 'Credentials & Verification',
      icon: Award,
      items: [
        { label: 'Assessments & Quizzes', href: '/quizzes', icon: Trophy },
        { label: 'Certifications & Badges', href: '/certificates/cert-1', icon: Award, badge: 'ISO' },
      ]
    },
    {
      id: 'system',
      title: 'Management & System',
      icon: Layers,
      items: [
        { label: '10,000 Users Stress Test', href: '/performance-test', icon: Activity, badge: '10k VUs 🔥' },
        { label: 'Categories Management', href: '/categories', icon: Layers },
        { label: 'Payment Reports', href: '/payment-reports', icon: Building2, badge: 'Tax' },
      ]
    },
  ];

  // Accordion state for nav groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    core: true,
    architecture: true,
    careers: true,
    applied: false,
    community: false,
    credentials: false,
    system: false,
  });

  // Auto-expand the group containing the active path
  useEffect(() => {
    navGroups.forEach((group) => {
      const hasActive = group.items.some(
        (item) => pathname === item.href || (item.href === '/dashboard' && pathname === '/')
      );
      if (hasActive) {
        setOpenGroups((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [pathname]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleLinkClick = () => {
    // On smaller screens, close the mobile drawer upon navigation
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <>
      {/* ── MOBILE BACKDROP OVERLAY (Only visible on mobile when sidebar is expanded) ── */}
      {!sidebarCollapsed && (
        <div
          onClick={() => setSidebarCollapsed(true)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* ── SIDEBAR CONTAINER (Responsive Drawer on Mobile, Sticky Column on Desktop) ── */}
      <aside
        className={`bg-sidebar border-r border-sidebar-border flex flex-col select-none transition-all duration-300 flex-shrink-0 z-50 print:hidden ${
          sidebarCollapsed
            ? 'hidden lg:flex lg:w-16 h-screen sticky top-0 py-4 items-center space-y-6 overflow-y-auto scrollbar-none'
            : 'fixed inset-y-0 left-0 w-72 max-w-[85vw] lg:static lg:w-72 h-screen sticky top-0 overflow-y-auto scrollbar-none shadow-2xl lg:shadow-none'
        }`}
      >
        {/* Collapsed Rail View (Desktop Only) */}
        {sidebarCollapsed ? (
          <div className="w-full flex flex-col items-center space-y-4">
            <Link
              href="/dashboard"
              className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Brain className="w-5 h-5" />
            </Link>
            <div className="w-full space-y-1.5 px-2">
              {navGroups.map((g) => {
                const firstItem = g.items[0];
                const isGroupActive = g.items.some((i) => pathname === i.href || (i.href === '/dashboard' && pathname === '/'));
                const Icon = g.icon;
                return (
                  <Link
                    key={g.id}
                    href={firstItem.href}
                    title={g.title}
                    className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all ${
                      isGroupActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          /* Expanded Full Menu View */
          <div className="flex flex-col h-full">
            {/* Brand Header */}
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 truncate">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-900/30 flex-shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h1 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1 truncate">
                    AI Nexus Hub
                  </h1>
                  <p className="text-[10px] text-muted-foreground font-medium truncate">Intelligence. Amplified.</p>
                </div>
              </div>

              {/* Close Button for Mobile Drawer */}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent lg:hidden cursor-pointer"
                title="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Groups (Main Menus & Submenus) */}
            <div className="flex-1 py-3 px-3 space-y-3.5 overflow-y-auto scrollbar-none">
              {navGroups.map((group) => {
                const isOpen = openGroups[group.id];
                const hasActiveChild = group.items.some(
                  (item) => pathname === item.href || (item.href === '/dashboard' && pathname === '/')
                );
                const GroupIcon = group.icon;

                return (
                  <div key={group.id} className="space-y-1">
                    {/* Main Menu Header */}
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer min-h-[36px] ${
                        hasActiveChild
                          ? 'text-purple-400 bg-purple-500/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <GroupIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{group.title}</span>
                      </div>
                      <div className="p-0.5 flex-shrink-0">
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </div>
                    </button>

                    {/* Submenus List */}
                    {isOpen && (
                      <div className="space-y-0.5 pl-2.5 pt-0.5 border-l border-border/40 ml-3 animate-in fade-in duration-150">
                        {group.items.map((subItem) => {
                          const isActive = pathname === subItem.href || (subItem.href === '/dashboard' && pathname === '/');
                          const SubIcon = subItem.icon;

                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={handleLinkClick}
                              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
                                isActive
                                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/30 font-bold'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <SubIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                                <span className="truncate">{subItem.label}</span>
                              </div>

                              {subItem.badge && (
                                <span
                                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ml-1 ${
                                    isActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                                  }`}
                                >
                                  {subItem.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ── ACADEMIC TIER SELECTOR ── */}
              <div className="space-y-1.5 pt-3 border-t border-sidebar-border">
                <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase px-2.5 block">
                  🎯 ACADEMIC TIER
                </span>
                <div className="space-y-0.5">
                  {ACADEMIC_TIERS.map((tier) => {
                    const isSelected = academicTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => {
                          setAcademicTier(tier.id);
                          handleLinkClick();
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[40px] text-left ${
                          isSelected
                            ? 'bg-purple-600/15 text-purple-400 border border-purple-500/30 font-bold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm flex-shrink-0">{tier.emoji}</span>
                          <div className="flex flex-col items-start truncate">
                            <span className="truncate leading-tight">{tier.label}</span>
                            <span className={`text-[9px] leading-tight truncate ${isSelected ? 'text-purple-400/70' : 'text-muted-foreground/60'}`}>
                              {tier.gradeLabel} · {tier.ageRange}
                            </span>
                          </div>
                        </div>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse flex-shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
