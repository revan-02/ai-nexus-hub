import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NexusFooter } from '@/components/nexus/nexus-footer';
import PrivacyPolicyPage from '@/app/privacy-policy/page';
import TermsAndConditionsPage from '@/app/terms-and-conditions/page';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(''),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('Footer, Privacy Policy, Terms & Conditions and Corporate Attribution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders NexusFooter with copyright, AalgoLabs (OPC) PVT.LTD. attribution, and legal links', () => {
    render(<NexusFooter />);
    
    // Check Copyright and Corporate Attribution
    expect(screen.getAllByText(/AI Nexus Platform/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AalgoLabs \(OPC\) PVT\.LTD\./i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Managed and Maintained by/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();

    // Check Legal Links
    expect(screen.getAllByRole('link', { name: /Privacy Policy/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Terms and Conditions/i }).length).toBeGreaterThan(0);
  });

  it('renders PrivacyPolicyPage with enterprise security standards and AalgoLabs attribution', () => {
    render(<PrivacyPolicyPage />);

    expect(screen.getByRole('heading', { level: 1, name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getAllByText(/AalgoLabs \(OPC\) PVT\.LTD\./i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Zero-Data Retention for Local AI & Sandbox Inference/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy@aalgolabs\.com/i)).toBeInTheDocument();
  });

  it('renders TermsAndConditionsPage with governing law in Bengaluru, Karnataka and AalgoLabs attribution', () => {
    render(<TermsAndConditionsPage />);

    expect(screen.getByRole('heading', { level: 1, name: /Terms and Conditions/i })).toBeInTheDocument();
    expect(screen.getAllByText(/AalgoLabs \(OPC\) PVT\.LTD\./i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Intellectual Property & User Code Ownership/i)).toBeInTheDocument();
    expect(screen.getByText(/legal@aalgolabs\.com/i)).toBeInTheDocument();
  });
});
