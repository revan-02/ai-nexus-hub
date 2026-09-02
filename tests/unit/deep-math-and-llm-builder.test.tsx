import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeepMathAndLLMBuilder } from '@/components/learning/deep-math-and-llm-builder';

describe('Deep Mathematical Foundations & Build Your Own LLM Studio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('renders Math Derivation Lab with 4-pillar structure (Application, Derivation, Where to Use, How to Use)', () => {
    render(<DeepMathAndLLMBuilder />);

    expect(screen.getByText(/Deep Mathematical Lab & LLM Architecture Studio/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Scaled Dot-Product Self-Attention \(Q, K, V\)/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/1\. Real-World Industrial Application/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Step-by-Step Mathematical Derivation/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. How to Use \(PyTorch Implementation\)/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Where & When to Use/i)).toBeInTheDocument();
    expect(screen.getByText(/ELI5 Intuition/i)).toBeInTheDocument();
  });

  it('switches difficulty levels and updates mathematical concepts', () => {
    render(<DeepMathAndLLMBuilder />);

    // Switch to Basic Track
    const basicBtn = screen.getByRole('button', { name: /Basic Track/i });
    fireEvent.click(basicBtn);
    expect(screen.getAllByText(/Gradient Descent & Parameter Optimization/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Parameter update rule at step t/i)).toBeInTheDocument();

    // Switch to Advance Track
    const advanceBtn = screen.getByRole('button', { name: /Advance Track/i });
    fireEvent.click(advanceBtn);
    expect(screen.getAllByText(/Rotary Position Embeddings \(RoPE\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Direct Preference Optimization \(DPO\) Formulation/i).length).toBeGreaterThan(0);
  });

  it('switches to "Build Your Own LLM Studio" and verifies parameter calculations & code export', () => {
    render(<DeepMathAndLLMBuilder />);

    // Switch to LLM Builder tab
    const builderTab = screen.getByRole('button', { name: /Build Your Own LLM Studio/i });
    fireEvent.click(builderTab);

    expect(screen.getByText(/Build Your Own Custom Large Language Model/i)).toBeInTheDocument();
    expect(screen.getByText(/Hyperparameter Configurator/i)).toBeInTheDocument();
    expect(screen.getByText(/Vocabulary Size \(V\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Transformer Layers \(N\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Parameter Size/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete Generated PyTorch Architecture/i)).toBeInTheDocument();

    // Test 8-phase stepper navigation
    const phase3Btn = screen.getByRole('button', { name: /3\. Grouped-Query Attention/i });
    fireEvent.click(phase3Btn);
    expect(screen.getByText(/Phase 3: Grouped-Query Attention \(GQA\) & Causal Mask/i)).toBeInTheDocument();

    const phase7Btn = screen.getByRole('button', { name: /7\. DPO Human Alignment/i });
    fireEvent.click(phase7Btn);
    expect(screen.getByText(/Phase 7: Direct Preference Optimization \(DPO\) Alignment/i)).toBeInTheDocument();

    // Test code export button
    const exportBtn = screen.getByRole('button', { name: /Export PyTorch Code/i });
    expect(exportBtn).toBeInTheDocument();
    fireEvent.click(exportBtn);
  });
});
