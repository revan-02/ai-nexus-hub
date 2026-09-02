'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Shield,
  Key,
  Building2,
  Lock,
  BookOpen,
  GraduationCap,
  Cpu,
  Database,
  FolderKanban,
  FileCheck,
  Brain,
  Boxes,
  Wrench,
  MessageSquareText,
  DollarSign,
  Sliders,
  Bell,
  Megaphone,
  Mail,
  Radio,
  Settings,
  Puzzle,
  Flag,
  Activity,
  Archive,
  ShieldAlert,
  FileText,
  ChevronRight,
  ChevronLeft,
  Bot,
  Receipt,
  CreditCard,
  FolderTree,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { usePathname } from 'next/navigation';

type NavItem = {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navigationSections: NavSection[] = [
  {
    title: 'USER & ACCESS',
    items: [
      { label: 'Users', icon: Users, href: '/users' },
      { label: 'Roles', icon: Shield, href: '/roles' },
      { label: 'Permissions', icon: Key, href: '/permissions' },
      { label: 'Teams / Organizations', icon: Building2, href: '/teams' },
      { label: 'Sessions & Access', icon: Lock, href: '/sessions' },
    ],
  },
  {
    title: 'CONTENT & LEARNING',
    items: [
      { label: 'Content', icon: BookOpen, href: '/content' },
      { label: 'Categories', icon: FolderTree, href: '/categories' },
      { label: 'Courses', icon: GraduationCap, href: '/courses' },
      { label: 'Algorithms', icon: Cpu, href: '/algorithms' },
      { label: 'Datasets', icon: Database, href: '/datasets' },
      { label: 'Projects', icon: FolderKanban, href: '/projects' },
      { label: 'Assessments', icon: FileCheck, href: '/assessments' },
    ],
  },
  {
    title: 'REVENUE & FINANCE',
    items: [
      { label: 'Payment Reports', icon: Receipt, href: '/payment-reports', badge: 'Live' },
    ],
  },
  {
    title: 'AI CONTROL CENTER',
    items: [
      { label: 'AI Overview', icon: Brain, href: '/ai-overview' },
      { label: 'AI Models', icon: Boxes, href: '/ai-models' },
      { label: 'AI Tools', icon: Wrench, href: '/ai-tools' },
      { label: 'Prompt Management', icon: MessageSquareText, href: '/prompt-management' },
      { label: 'AI Usage & Cost', icon: DollarSign, href: '/ai-usage-cost' },
      { label: 'AI Configuration', icon: Sliders, href: '/ai-configuration' },
    ],
  },
  {
    title: 'COMMUNICATION',
    items: [
      { label: 'Notifications', icon: Bell, href: '/settings/notifications', badge: '3' },
      { label: 'Announcements', icon: Megaphone, href: '/announcements' },
      { label: 'Email Templates', icon: Mail, href: '/email-templates' },
      { label: 'Broadcasts', icon: Radio, href: '/broadcasts' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Settings', icon: Settings, href: '/settings/account' },
      { label: 'Integrations', icon: Puzzle, href: '/integrations' },
      { label: 'Feature Flags', icon: Flag, href: '/feature-flags' },
      { label: 'System Health', icon: Activity, href: '/system-health', badge: '99.9%' },
      { label: 'Backup & Recovery', icon: Archive, href: '/system/backup-and-recovery' },
    ],
  },
  {
    title: 'SECURITY & AUDIT',
    items: [
      { label: 'Security Center', icon: ShieldAlert, href: '/security-center' },
      { label: 'Audit Logs', icon: FileText, href: '/audit-logs' },
    ],
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function AdminSidebar({
  collapsed = false,
  onToggleCollapse,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex flex-col bg-[#09090c] border-r border-[#23232b] h-screen sticky top-0 transition-all duration-300 z-30 select-none',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Sidebar Header / Branding */}
      <div className="h-16 flex items-center px-4 border-b border-[#23232b] justify-between">
        <Link href="/users" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 shadow-sm shadow-purple-900/30">
            <Bot className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-100 text-sm tracking-tight truncate">
                AI Control Center
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">
                Admin Console
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Top Active Dashboard Button */}
        <div>
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
              pathname === '/'
                ? 'bg-purple-600/15 text-purple-400 border border-purple-500/30 shadow-sm shadow-purple-950/50'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14141c]'
            )}
          >
            <LayoutDashboard
              className={cn(
                'w-4 h-4 flex-shrink-0 transition-colors',
                pathname === '/'
                  ? 'text-purple-400'
                  : 'text-zinc-400 group-hover:text-zinc-200'
              )}
            />
            {!collapsed && <span className="flex-1 truncate">Dashboard</span>}
          </Link>
        </div>

        {/* Grouped Sections */}
        {navigationSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                {section.title}
              </h4>
            )}
            <div className="space-y-1">
              {section.items.map((item, iIdx) => {
                const Icon = item.icon;
                const isActive = item.href !== '#' && pathname?.startsWith(item.href);
                return (
                  <Link
                    key={iIdx}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative',
                      isActive
                        ? 'bg-purple-600/15 text-purple-400 border border-purple-500/30 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14141c]'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 flex-shrink-0 transition-colors',
                        isActive
                          ? 'text-purple-400'
                          : 'text-zinc-400 group-hover:text-zinc-300'
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity text-zinc-500" />
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Collapse Toggle */}
      <div className="p-3 border-t border-[#23232b]">
        <Button
          variant="ghost"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-[#14141c] rounded-lg"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
