'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#09090b] text-zinc-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Desktop Fixed Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="hidden lg:flex"
      />

      {/* Mobile Drawer Navigation */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-[#09090c] border-[#23232b]">
          <AdminSidebar collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
