import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CertificatePage from '@/app/certificates/[id]/page';
import PublicVerificationPage from '@/app/verify/[id]/page';
import { MicroLearningPlayer } from '@/components/learning/micro-learning-player';

// Mock hooks
vi.mock('@/hooks/api/use-rooms', () => ({
  useCertificate: vi.fn().mockReturnValue({
    data: {
      data: {
        id: 'cert-101',
        certificateHash: 'NEXUS-CERT-948210',
        trackName: 'Enterprise Generative AI, Hybrid RAG & Production MLOps Systems',
        scorePercent: 100,
        issuedAt: '2026-08-31T00:00:00.000Z',
        user: {
          name: 'Sarah Johnson',
          email: 'sarah.j@techcorp.io',
        },
      },
    },
    isLoading: false,
  }),
}));

vi.mock('next-auth/react', () => ({
  useSession: vi.fn().mockReturnValue({
    data: { user: { name: 'Sarah Johnson', email: 'sarah.j@techcorp.io' } },
  }),
}));

// Mock recharts for micro learning player
vi.mock('recharts', async () => {
  const original = await vi.importActual<any>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

describe('Industry-Standard Recognized Credentials & Verification Ledger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CertificatePage with Open Badges 3.0, ISO 17024 and Verified Skills Matrix', () => {
    render(<CertificatePage params={{ id: 'cert-101' }} />);

    expect(screen.getByText(/Industry-Recognized AI Professional Credential/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Badges 3.0 Standard/i)).toBeInTheDocument();
    expect(screen.getByText(/AI NEXUS CREDENTIALING COUNCIL/i)).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText(/Enterprise Generative AI, Hybrid RAG & Production MLOps Systems/i)).toBeInTheDocument();
    expect(screen.getByText(/Production PyTorch & GPU Tensors/i)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise Hybrid RAG/i)).toBeInTheDocument();
    expect(screen.getByText(/4-Bit QLoRA & Parameter-Efficient Fine-Tuning/i)).toBeInTheDocument();
    expect(screen.getByText(/Add to LinkedIn/i)).toBeInTheDocument();
    expect(screen.getByText(/Copy for Resume/i)).toBeInTheDocument();
  });

  it('renders PublicVerificationPage (/verify/[id]) with cryptographic ledger and JSON-LD export', () => {
    render(<PublicVerificationPage params={{ id: 'NEXUS-CERT-948210' }} />);

    expect(screen.getByText(/Official Public Verification Ledger/i)).toBeInTheDocument();
    expect(screen.getByText(/VERIFIED & ACTIVE/i)).toBeInTheDocument();
    expect(screen.getByText(/Cryptographically Valid Credential/i)).toBeInTheDocument();
    expect(screen.getByText(/W3C Verifiable Credential \/ Open Badges 3.0 JSON-LD/i)).toBeInTheDocument();
    expect(screen.getByText(/Copy JSON/i)).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
  });

  it('renders "Industry vs Academic Gap" comparison in MicroLearningPlayer', () => {
    render(<MicroLearningPlayer activeDifficulty="ADVANCED" />);

    const gapTab = screen.getByRole('button', { name: /Industry vs Academic Gap/i });
    expect(gapTab).toBeInTheDocument();
    fireEvent.click(gapTab);

    expect(screen.getByText(/Why Standard Academic Courses Fail in Production/i)).toBeInTheDocument();
    expect(screen.getByText(/Traditional Academic Approach \(Theory Only\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Industry Engineering Reality \(Nexus Standards\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Streaming Data & Drift/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Throughput vLLM/i)).toBeInTheDocument();
  });
});
