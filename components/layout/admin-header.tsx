'use client';

import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Menu, ChevronDown, CheckCircle2, ShieldCheck, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommandSearchDialog } from '@/components/dashboard/command-dialog';
import { mockAlerts } from '@/lib/mock-data/admin-data';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface AdminHeaderProps {
  onToggleMobileSidebar?: () => void;
}

export function AdminHeader({ onToggleMobileSidebar }: AdminHeaderProps) {
  const { data: session } = useSession();
  const [commandOpen, setCommandOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);


  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-[#09090c] border-b border-[#23232b] sticky top-0 z-20">
      {/* Left Search Bar & Mobile Trigger */}
      <div className="flex items-center gap-3 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMobileSidebar}
          className="lg:hidden text-zinc-400 hover:text-zinc-200 hover:bg-[#14141c]"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <button
          onClick={() => setCommandOpen(true)}
          className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#121217] border border-[#272730] text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 transition-all text-xs w-full max-w-sm group shadow-inner"
        >
          <Search className="w-4 h-4 text-zinc-400 group-hover:text-purple-400 transition-colors" />
          <span className="flex-1 text-left text-zinc-400">Search anywhere...</span>
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-[#1c1c24] text-zinc-400 rounded border border-[#2e2e38]">
            <span>⌘</span>
            <span>K</span>
          </span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle Theme"
          className="text-zinc-400 hover:text-zinc-200 hover:bg-[#14141c] rounded-lg"
        >
          {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>

        {/* Notification Bell Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="relative p-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#14141c] rounded-lg transition-colors" />}>
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-[#09090c] shadow-sm">
              3
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-[#121217] border-[#272730] text-zinc-200 p-0 shadow-xl rounded-xl">
            <div className="p-3 border-b border-[#272730] flex items-center justify-between">
              <span className="font-semibold text-xs text-zinc-100">Notifications & Alerts</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-semibold border border-purple-500/30">
                3 New
              </span>
            </div>
            <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
              {mockAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-2.5 rounded-lg hover:bg-[#181820] transition-colors border border-transparent hover:border-[#2a2a35] cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-semibold text-zinc-200">{alert.title}</span>
                    <span className="text-[10px] text-zinc-400">{alert.time}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">{alert.details}</p>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-[#272730] text-center">
              <button className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                View all notifications →
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="h-5 w-px bg-[#23232b]" />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#14141c] transition-colors text-left group" />}>
            <Avatar className="w-8 h-8 border border-purple-500/30">
              <AvatarImage src={session?.user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} alt={session?.user?.name || "User"} />
              <AvatarFallback className="bg-purple-950 text-purple-300 font-bold text-xs">
                {session?.user?.name ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white leading-none">
                  {session?.user?.name || 'Learner'}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="text-[10px] text-zinc-400 leading-tight mt-0.5 capitalize">
                {(session?.user as { role?: string })?.role || 'Learner'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-[#121217] border-[#272730] text-zinc-200 rounded-2xl shadow-2xl p-2 space-y-1">
            {/* User Profile Card Header */}
            <div className="p-3 bg-[#181820] border border-[#272730] rounded-xl flex items-start gap-3">
              <Avatar className="w-10 h-10 border border-purple-500/40">
                <AvatarImage src={session?.user?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"} alt={session?.user?.name || "User"} />
                <AvatarFallback className="bg-purple-950 text-purple-300 font-bold">
                  {session?.user?.name ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs truncate">{session?.user?.name || 'John Doe'}</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                    {(session?.user as { role?: string })?.role || 'Admin'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">{session?.user?.email || 'admin@nexus.ai'}</p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-[#272730]" />

            {/* Quick Links */}
            <div className="space-y-0.5">
              <DropdownMenuItem className="text-xs text-zinc-300 focus:bg-[#1f1f27] focus:text-white cursor-pointer p-0">
                <Link href="/profile" className="flex items-center gap-2.5 px-2.5 py-1.5 w-full">
                  <User className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">My Profile</span>
                    <span className="text-[10px] text-zinc-500">View and edit your profile</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="text-xs text-zinc-300 focus:bg-[#1f1f27] focus:text-white cursor-pointer p-0">
                <Link href="/settings/account" className="flex items-center gap-2.5 px-2.5 py-1.5 w-full">
                  <Settings className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">Account Settings</span>
                    <span className="text-[10px] text-zinc-500">Manage your account preferences</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="text-xs text-zinc-300 focus:bg-[#1f1f27] focus:text-white cursor-pointer p-0">
                <Link href="/settings/security" className="flex items-center gap-2.5 px-2.5 py-1.5 w-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">Security Settings</span>
                    <span className="text-[10px] text-zinc-500">Password, 2FA and security options</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="text-xs text-zinc-300 focus:bg-[#1f1f27] focus:text-white cursor-pointer p-0">
                <Link href="/settings/notifications" className="flex items-center gap-2.5 px-2.5 py-1.5 w-full">
                  <Bell className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">Notification Preferences</span>
                    <span className="text-[10px] text-zinc-500">Email and system notification settings</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="bg-[#272730]" />

            {/* Active Session Info Box */}
            <div className="p-2.5 bg-[#181820] border border-[#272730] rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Active Session</span>
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-200">Chrome on macOS</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-400 font-bold rounded">Current</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">Bengaluru, India • 192.168.1.10</p>
            </div>

            <DropdownMenuSeparator className="bg-[#272730]" />

            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-xs text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer gap-2 px-2.5 py-1.5 rounded-lg font-medium"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Global Command Dialog Modal */}
      <CommandSearchDialog open={commandOpen} onOpenChange={setCommandOpen} />
    </header>
  );
}
