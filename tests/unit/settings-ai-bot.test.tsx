import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from '@/app/settings/page';
import { NexusProvider } from '@/context/nexus-context';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === 'tab' ? 'ai-bot' : null),
  }),
  usePathname: () => '/settings',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock next-auth
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
  useSession: () => ({ data: { user: { name: 'Admin', role: 'ADMIN' } } }),
}));

describe('Admin Settings - Enable / Disable AI Bot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders AI Bot Controls (Admin) tab in Settings page', () => {
    render(
      <NexusProvider>
        <SettingsPage />
      </NexusProvider>
    );

    expect(screen.getByText(/AI Bot & Assistant Controls \(Admin Panel\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Master AI Bot & Copilot Availability/i)).toBeInTheDocument();
    expect(screen.getByText(/Disable AI Bot/i)).toBeInTheDocument();
    expect(screen.getByText(/Ollama Q&A Chatbot \(\/ollama\)/i)).toBeInTheDocument();
    expect(screen.getByText(/LoRA Model Fine-Tuning Studio/i)).toBeInTheDocument();
  });

  it('allows admin to toggle master AI bot switch and save settings', async () => {
    render(
      <NexusProvider>
        <SettingsPage />
      </NexusProvider>
    );

    const toggleBtn = screen.getByText(/Disable AI Bot/i);
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/Enable AI Bot/i)).toBeInTheDocument();

    const saveBtn = screen.getByText(/Save AI Bot Settings/i);
    fireEvent.click(saveBtn);

    expect(screen.getByText(/AI Bot admin configuration updated and saved globally!/i)).toBeInTheDocument();
  });
});
