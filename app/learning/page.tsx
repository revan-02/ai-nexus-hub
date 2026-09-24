'use client';
import { NexusShell } from '@/components/nexus/nexus-shell';

export default function LearningPage() {
  return (
    <NexusShell>
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">My Learning</h1>
        <p className="text-muted-foreground">Manage your active and completed courses here.</p>
        <div className="p-12 border border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground">
          Learning workspace under construction.
        </div>
      </div>
    </NexusShell>
  );
}
