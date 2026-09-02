import React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-72 min-w-0 w-full">
        <Header />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
