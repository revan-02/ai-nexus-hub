'use client';

import React from 'react';
import { NexusSidebar } from './nexus-sidebar';
import { NexusHeader } from './nexus-header';
import { NexusFooter } from './nexus-footer';
import { NexusSearchModal } from './nexus-search-modal';

export function NexusShell({ children }: { children: React.ReactNode }) {
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
