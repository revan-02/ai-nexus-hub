'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Network, 
  BookOpen, 
  Map, 
  Cpu, 
  Briefcase,
  Globe2,
  Database,
  Wrench,
  Wand2,
  FolderOpen,
  Users,
  FileQuestion,
  ChevronDown,
  ChevronRight,
  UserCheck,
  GraduationCap,
  FlaskConical,
  Target,
  Trophy,
  Scale,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  items: {
    icon: React.ElementType;
    label: string;
    href: string;
    active?: boolean;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    id: 'core',
    title: 'Overview & Hub',
    icon: LayoutDashboard,
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
      { icon: BookOpen, label: 'AI Overview', href: '/ai-overview' },
      { icon: Map, label: 'Roadmap', href: '/roadmap' },
    ]
  },
  {
    id: 'architecture',
    title: 'AI Architecture & Labs',
    icon: Network,
    items: [
      { icon: Scale, label: 'Model Comparison & Pricing', href: '/model-comparison', badge: 'Compare' },
      { icon: Network, label: 'AI Architecture', href: '/ai-architecture', badge: 'Studio' },
      { icon: Cpu, label: 'Algorithms', href: '/algorithms' },
      { icon: Wand2, label: 'Create Your Own AI', href: '/create-ai' },
      { icon: Wrench, label: 'AI Tools', href: '/ai-tools' },
      { icon: Shield, label: 'Security & Crypto Lab', href: '/security-center', badge: 'Audit' },
    ]
  },
  {
    id: 'careers',
    title: 'Careers',
    icon: Target,
    items: [
      { icon: UserCheck, label: 'Interview Prep (0-4y)', href: '/interview-prep', badge: '0-4y' },
      { icon: Briefcase, label: 'Careers & Job Portal', href: '/careers', badge: 'Jobs' },
      { icon: GraduationCap, label: 'VTU Old Papers (AI/ML/DL)', href: '/vtu-question-papers', badge: 'VTU' },
    ]
  },
  {
    id: 'applied',
    title: 'Applied AI & Datasets',
    icon: FlaskConical,
    items: [
      { icon: Briefcase, label: 'Use Cases', href: '/use-cases' },
      { icon: Globe2, label: 'Real-world Problems', href: '/real-world-problems' },
      { icon: Database, label: 'Datasets', href: '/datasets' },
    ]
  },
  {
    id: 'community',
    title: 'Collab & Certifications',
    icon: Users,
    items: [
      { icon: Trophy, label: 'Expert Challenges', href: '/challenges', badge: 'Prizes' },
      { icon: FolderOpen, label: 'Projects', href: '/projects', badge: 'Collab' },
      { icon: FileQuestion, label: 'Quizzes & Assessments', href: '/quizzes' },
      { icon: Users, label: 'Community', href: '/community' },
    ]
  }
];

export function SidebarContent() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    core: true,
    architecture: true,
    careers: true,
    applied: false,
    community: false,
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className="p-5 flex items-center gap-3 border-b">
        <div className="bg-purple-100 text-purple-600 p-2 rounded-xl">
          <Network className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-none">AI KNOWLEDGE HUB</h1>
          <p className="text-xs text-muted-foreground mt-1">From Concepts to Creations</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.id];
          const GroupIcon = group.icon;

          return (
            <div key={group.id} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-muted-foreground uppercase tracking-wider hover:bg-slate-100 hover:text-foreground cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <GroupIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>{group.title}</span>
                </div>
                {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {isOpen && (
                <div className="space-y-0.5 pl-2 border-l border-slate-200 ml-3">
                  {group.items.map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        item.active 
                          ? 'bg-purple-100 text-purple-700 font-bold' 
                          : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-50 text-purple-600 border border-purple-200 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Learn by level */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between px-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            <span>Learn by level</span>
          </div>
          {[
            { label: 'Beginner (Std 5–10)', href: '/learning/beginner' },
            { label: 'Intermediate (Std 11–12)', href: '/learning/intermediate' },
            { label: 'Advanced (Undergraduate)', href: '/learning/advanced' },
            { label: 'Expert (Postgraduate)', href: '/learning/expert' }
          ].map((lvl, i) => (
            <Link key={i} href={lvl.href} className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-slate-100 rounded-lg">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lvl.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="w-72 hidden lg:flex flex-col border-r bg-white h-screen fixed left-0 top-0 overflow-y-auto">
      <SidebarContent />
    </aside>
  );
}
