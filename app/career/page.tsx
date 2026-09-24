'use client';
import { NexusShell } from '@/components/nexus/nexus-shell';

export default function CareerPage() {
  return (
    <NexusShell>
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">Career Hub</h1>
        <p className="text-muted-foreground">Skills readiness, interview prep, and career paths.</p>
        <div className="p-12 border border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground">
          Career Hub under construction.
        </div>
      </div>
    </NexusShell>
  );
}
