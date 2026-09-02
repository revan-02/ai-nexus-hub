import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AIOverviewPage from '@/app/ai-overview/page';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

describe('Comprehensive AI Overview & Mathematical Foundations Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders AI Overview header, fundamental equation, and 6 cognitive pillars', () => {
    render(<AIOverviewPage />);

    expect(screen.getByRole('heading', { level: 1, name: /What is Artificial Intelligence\?/i })).toBeInTheDocument();
    expect(screen.getByText(/Fundamental Equation/i)).toBeInTheDocument();
    expect(screen.getByText(/The 6 Core Cognitive Pillars of AI/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Learning/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Reasoning/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches between the AI Hierarchy layers (AI, ML, DL, GenAI, LLMs)', () => {
    render(<AIOverviewPage />);

    // Click Machine Learning layer
    const mlTab = screen.getByRole('button', { name: /2. Machine Learning \(ML\)/i });
    fireEvent.click(mlTab);
    expect(screen.getByText(/Statistical Learning Subfield/i)).toBeInTheDocument();

    // Click Deep Learning layer
    const dlTab = screen.getByRole('button', { name: /3. Deep Learning \(DL\)/i });
    fireEvent.click(dlTab);
    expect(screen.getByText(/Multi-Layer Neural Networks/i)).toBeInTheDocument();

    // Click Generative AI layer
    const genAiTab = screen.getByRole('button', { name: /4. Generative AI \(GenAI\)/i });
    fireEvent.click(genAiTab);
    expect(screen.getByText(/Generative Distribution Modeling/i)).toBeInTheDocument();

    // Click LLMs layer
    const llmTab = screen.getByRole('button', { name: /5. Large Language Models \(LLMs\)/i });
    fireEvent.click(llmTab);
    expect(screen.getByText(/Transformer Foundation Scale/i)).toBeInTheDocument();
  });

  it('computes linear combinations and non-linear activations in the Weights & Bias simulator', () => {
    render(<AIOverviewPage />);

    expect(screen.getByText(/Mathematical Mechanics: Weights \(\$W\$\), Bias \(\$b\$\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Linear Pre-Activation Combination \(z\):/i)).toBeInTheDocument();

    // Switch activation function to Sigmoid
    const sigmoidBtn = screen.getByRole('button', { name: /SIGMOID/i });
    fireEvent.click(sigmoidBtn);
    expect(screen.getByText(/Non-Linear Activation Function \(SIGMOID\):/i)).toBeInTheDocument();
  });
});
