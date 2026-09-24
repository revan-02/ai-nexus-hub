'use client';
import { NexusShell } from '@/components/nexus/nexus-shell';

export default function ProgressPage() {
  return (
    <NexusShell>
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">Progress & Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your stats, XP, and weekly activity.</p>
        <div className="p-12 border border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground">
          Analytics dashboard under construction.
        </div>
      </div>
    </NexusShell>
  );
}
