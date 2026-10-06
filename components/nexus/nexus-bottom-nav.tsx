'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Bot,
  Settings,
} from 'lucide-react';

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  matches: (pathname: string) => boolean;
}

export function NexusBottomNav() {
  const pathname = usePathname();

  const navItems: BottomNavItem[] = [
    {
      label: 'Home',
      href: '/dashboard',
      icon: LayoutDashboard,
      matches: (p) => p === '/dashboard' || p === '/',
    },
    {
      label: 'Learn',
      href: '/roadmap',
      icon: BookOpen,
      matches: (p) => p.startsWith('/roadmap') || p.startsWith('/courses') || p.startsWith('/learn'),
    },
    {
      label: 'Practice',
      href: '/challenges',
      icon: Trophy,
      matches: (p) => p.startsWith('/challenges') || p.startsWith('/quizzes') || p.startsWith('/daily-challenge'),
    },
    {
      label: 'AI Bot',
      href: '/ollama',
      icon: Bot,
      badge: 'Free',
      matches: (p) => p.startsWith('/ollama') || p.startsWith('/create-ai'),
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
      matches: (p) => p.startsWith('/settings') || p.startsWith('/profile'),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/80 px-2 pt-2 pb-[max(env(safe-area-inset-bottom,0px),0.5rem)] lg:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.25)] select-none print:hidden"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = item.matches(pathname || '');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-2xl transition-all relative group cursor-pointer ${
                isActive
                  ? 'text-purple-400 font-bold scale-105'
                  : 'text-muted-foreground hover:text-foreground active:scale-95'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-purple-400 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]' : ''
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 px-1 py-0.2 bg-purple-600 text-white text-[8px] font-mono font-bold rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight leading-none ${
                  isActive ? 'font-extrabold text-foreground' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1 rounded-full bg-purple-500 mt-0.5 animate-in fade-in zoom-in-75 duration-150" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
