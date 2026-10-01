'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { NexusSidebar } from './nexus-sidebar';
import { NexusHeader } from './nexus-header';
import { NexusFooter } from './nexus-footer';
import { NexusSearchModal } from './nexus-search-modal';
import { Brain } from 'lucide-react';

export function NexusShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#070a14] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <Brain className="w-6 h-6 animate-pulse" />
        </div>
        <div className="text-xs font-mono text-zinc-400">Verifying session credentials...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground antialiased selection:bg-purple-500/30 selection:text-purple-200">
      <NexusSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <NexusHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1800px] w-full mx-auto">
          {children}
        </main>
        <NexusFooter />
      </div>
      <NexusSearchModal />
    </div>
  );
}

