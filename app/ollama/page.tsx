'use client';

import React from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { OllamaStudio } from '@/components/ai/ollama-studio';

export default function OllamaPage() {
  return (
    <NexusShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <OllamaStudio />
      </div>
    </NexusShell>
  );
}
