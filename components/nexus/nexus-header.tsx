'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNexus } from '@/context/nexus-context';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Globe,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  ShoppingCart,
  Heart,
  BookOpen,
  CheckCircle2,
  Award,
  GraduationCap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession, signOut } from 'next-auth/react';


export function NexusHeader() {
  const { data: session } = useSession();
  const {
    theme,
    setTheme,
    userLevel,
    levelMeta,
    setIsSearchOpen,
    setSidebarCollapsed,
    notificationCount
  } = useNexus();


  const [language, setLanguage] = useState('EN');

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else setTheme('dark');
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6 select-none print:hidden safe-top">
      {/* Left: Collapse Button + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-2xl min-w-0">
        <button
          type="button"
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
          title="Toggle Sidebar Navigation"
          aria-label="Toggle Sidebar Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 sm:gap-3 w-full max-w-md px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-muted-foreground hover:text-foreground hover:border-purple-500/30 transition-all cursor-pointer group min-h-[40px] truncate"
          aria-label="What do you want to learn?"
        >
          <Search className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 transition-colors flex-shrink-0" />
          <span className="truncate flex-1 text-left">What do you want to learn?</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono text-muted-foreground flex-shrink-0">⌘K</kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        {/* Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors" />}>
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{language}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border text-foreground rounded-xl p-1 w-28 text-xs">
            <DropdownMenuItem onClick={() => setLanguage('EN')} className="cursor-pointer">English (EN)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ES')} className="cursor-pointer">Español (ES)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('FR')} className="cursor-pointer">Français (FR)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('DE')} className="cursor-pointer">Deutsch (DE)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative">
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
            )}
          </button>
        </div>

        {/* User Profile Badge */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-xl hover:bg-secondary transition-colors" />}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-purple-900/30">
              {session?.user?.name ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'L'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-foreground leading-tight">{session?.user?.name || 'Learner Account'}</span>
              <span className="text-[10px] font-semibold text-purple-400 capitalize">{(session?.user as { role?: string })?.role || userLevel} Level</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border text-foreground rounded-2xl p-2 space-y-1 shadow-xl">
            <div className="px-3 py-2 bg-secondary rounded-xl">
              <p className="text-xs font-bold text-foreground">{session?.user?.name || 'Learner Account'}</p>
              <p className="text-[11px] text-muted-foreground font-mono">{session?.user?.email || 'learner@nexus.ai'}</p>
              <span className="mt-1 inline-block px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-bold rounded-md capitalize">
                {(session?.user as { role?: string })?.role || userLevel}
              </span>
            </div>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem className="p-0">
              <Link href="/profile?tab=learning" className="flex items-center justify-between px-3 py-2 w-full text-xs font-semibold text-foreground hover:bg-secondary rounded-xl transition-colors">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>My Learning</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 rounded-lg">
                  3 Active
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="p-0">
              <Link href="/profile?tab=completed" className="flex items-center justify-between px-3 py-2 w-full text-xs font-semibold text-foreground hover:bg-secondary rounded-xl transition-colors">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Finished Courses</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 rounded-lg">
                  5 Done
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="p-0">
              <Link href="/profile?tab=certificates" className="flex items-center justify-between px-3 py-2 w-full text-xs font-semibold text-foreground hover:bg-secondary rounded-xl transition-colors">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>My Certificates</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 rounded-lg">
                  4 ISO
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem className="p-0">
              <Link href="/profile?tab=cart" className="flex items-center justify-between px-3 py-2 w-full text-xs font-semibold text-foreground hover:bg-secondary rounded-xl transition-colors">
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>My Cart</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30 rounded-lg">
                  2 Items
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="p-0">
              <Link href="/profile?tab=wishlist" className="flex items-center justify-between px-3 py-2 w-full text-xs font-semibold text-foreground hover:bg-secondary rounded-xl transition-colors">
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Wishlist</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 rounded-lg">
                  4 Saved
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem className="p-0">
              <Link href="/profile?tab=overview" className="flex items-center gap-2.5 px-3 py-2 w-full text-xs font-semibold text-foreground hover:bg-secondary rounded-xl">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="p-0">
              <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 w-full text-xs font-semibold text-foreground hover:bg-secondary rounded-xl">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer flex items-center gap-2.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
