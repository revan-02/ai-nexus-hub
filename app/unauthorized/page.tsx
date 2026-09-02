'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Lock, ArrowRight } from 'lucide-react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <NexusShell>
      <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-lg mx-auto text-center">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-xl shadow-rose-950/30">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono rounded-lg">
            HTTP 403 • Access Denied
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Administrative Access Restricted
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You do not have the required role permissions to view this system page. Please contact your organization administrator or upgrade your access credentials.
          </p>
        </div>

        <Card className="w-full p-4 bg-card border-border rounded-2xl text-left space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Required Role Permissions:</span>
          </div>
          <ul className="space-y-1 text-muted-foreground font-mono text-[11px] list-disc list-inside">
            <li>org:super_admin</li>
            <li>system:write_permissions</li>
            <li>security:manage_audit_logs</li>
          </ul>
        </Card>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/dashboard">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-9 px-4 rounded-xl gap-2 shadow-md shadow-purple-900/30">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="bg-secondary border-border text-foreground text-xs h-9 px-4 rounded-xl">
              Switch Account
            </Button>
          </Link>
        </div>
      </div>
    </NexusShell>
  );
}
