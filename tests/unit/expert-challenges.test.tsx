import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpertChallengesPage from '@/app/challenges/page';
import {
  getAllExpertChallenges,
  getExpertChallengeById,
  submitChallengeSolution
} from '@/services/expert-challenges-service';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

describe('Full-Stack AI Expert Challenges & Competitions Hub (with Agriculture AI)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Expert Challenges header, prize pool, and arena cards including Agriculture AI', () => {
    render(<ExpertChallengesPage />);

    expect(screen.getByText(/Take on Expert Real-World AI Challenges/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Edge-Vision Crop Leaf Disease Scanner/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Autonomous Precision Drip Irrigation/i)).toBeInTheDocument();
    expect(screen.getByText(/Satellite Multispectral NDVI/i)).toBeInTheDocument();
  });

  it('filters challenges when selecting Agriculture & Rural AI domain', async () => {
    const agriChallenges = await getAllExpertChallenges({ domain: 'Agriculture & Rural AI' });
    expect(agriChallenges.length).toBeGreaterThanOrEqual(10);
    expect(agriChallenges.some((c) => c.title.includes('Crop Leaf Disease'))).toBe(true);
    expect(agriChallenges.some((c) => c.title.includes('Precision Drip Irrigation'))).toBe(true);
    expect(agriChallenges.some((c) => c.title.includes('Satellite Multispectral NDVI'))).toBe(true);
    expect(agriChallenges.some((c) => c.title.includes('Insect Pest Swarm Trapping'))).toBe(true);
    expect(agriChallenges.some((c) => c.title.includes('Drone Swarm Pathfinding'))).toBe(true);
    expect(agriChallenges.some((c) => c.title.includes('Robotic Fruit Ripeness'))).toBe(true);
    expect(agriChallenges.some((c) => c.title.includes('Fair Mandi (APMC)'))).toBe(true);
    expect(agriChallenges.some((c) => c.title.includes('Micro-Spectrometer Soil Nutrient'))).toBe(true);
    expect(agriChallenges.some((c) => c.title.includes('AI Hydroponic & Vertical Farm'))).toBe(true);
    expect(agriChallenges.some((c) => c.title.includes('Livestock Biometric Muzzle'))).toBe(true);
  });

  it('switches between the 5 Technical Pillars (Data Structures, System Design, DB, AI, Frontend)', { timeout: 15000 }, () => {
    render(<ExpertChallengesPage />);

    // 1. Data Structure Pillar (Default)
    expect(screen.getByText(/Chosen Data Structure:/i)).toBeInTheDocument();

    // 2. System Design Pillar
    const systemTab = screen.getByRole('button', { name: /2. System Design & BL\/HLD/i });
    fireEvent.click(systemTab);
    expect(screen.getByText(/High-Level Dataflow Sequence \(HLD\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Business Logic \(BL\) Validation:/i)).toBeInTheDocument();

    // 3. Database Pillar
    const dbTab = screen.getByRole('button', { name: /3. Database & Query Tuning/i });
    fireEvent.click(dbTab);
    expect(screen.getByText(/Database Schema DDL/i)).toBeInTheDocument();
    expect(screen.getByText(/Indexing Strategy:/i)).toBeInTheDocument();

    // 4. AI Model Pillar
    const aiTab = screen.getByRole('button', { name: /4. AI Model & Inference Pipeline/i });
    fireEvent.click(aiTab);
    expect(screen.getByText(/Mathematical Loss Function & Objective:/i)).toBeInTheDocument();
    expect(screen.getByText(/Inference Pipeline & Execution/i)).toBeInTheDocument();

    // 5. Frontend & Test Bench Pillar
    const feTab = screen.getByRole('button', { name: /5. Front-End Simulator & Test Bench/i });
    fireEvent.click(feTab);
    expect(screen.getByText(/Live Interactive Production Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Challenge Code Solution & Test Benchmark Runner/i)).toBeInTheDocument();
  });

  it('interacts with the vernacular audio speech synthesis in Agriculture Leaf Scanner', () => {
    render(<ExpertChallengesPage />);

    // Switch to Frontend Simulator tab
    const feTab = screen.getByRole('button', { name: /5. Front-End Simulator & Test Bench/i });
    fireEvent.click(feTab);

    // Click Speak Remedy
    const speakBtn = screen.getByRole('button', { name: /Speak Remedy in KANNADA/i });
    fireEvent.click(speakBtn);

    expect(screen.getByText(/ರೈತ ಮಿತ್ರ/i)).toBeInTheDocument();
  });

  it('submits solution to automated test bench and unlocks verified badge', () => {
    const evalResult = submitChallengeSolution('agri-ch-1', 'def scan(): pass');
    expect(evalResult.passed).toBe(true);
    expect(evalResult.score).toBe(100);
    expect(evalResult.badgeEarned).toBeDefined();
    expect(evalResult.badgeEarned?.name).toBe('Agri-Vision Edge Master');
    expect(evalResult.badgeEarned?.verificationId).toContain('CERT-AGRI');
  });
});
