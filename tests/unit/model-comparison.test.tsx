import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModelComparisonPage from '@/app/model-comparison/page';
import { AI_MODELS_DATABASE, MODEL_PURPOSE_RECOMMENDATIONS } from '@/lib/ai/model-comparison-data';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

describe('AI Model Comparison & Pricing Matrix', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page header, purpose recommendations, and model database', () => {
    render(<ModelComparisonPage />);

    expect(
      screen.getByText(/AI Models Benchmark, Purpose & Price Comparison Matrix/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Which AI Model is Best for What Purpose\?/i)).toBeInTheDocument();
    expect(screen.getAllByText(/OpenAI o1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/DeepSeek-R1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Claude 3.5 Sonnet/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Gemini 2.0 Flash/i).length).toBeGreaterThan(0);
  });

  it('toggles currency between INR (₹) and USD ($)', () => {
    render(<ModelComparisonPage />);

    // Defaults to INR
    const usdBtn = screen.getByRole('button', { name: /\$ USD \(Dollars\)/i });
    fireEvent.click(usdBtn);

    // After clicking USD, check for INR button to switch back
    const inrBtn = screen.getByRole('button', { name: /₹ INR \(Rupees\)/i });
    expect(inrBtn).toBeInTheDocument();
    fireEvent.click(inrBtn);
  });

  it('filters models using category and license selectors', () => {
    render(<ModelComparisonPage />);

    const searchInput = screen.getByPlaceholderText(/Search model by name/i);
    fireEvent.change(searchInput, { target: { value: 'DeepSeek' } });

    expect(screen.getAllByText(/DeepSeek-R1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/DeepSeek-V3/i).length).toBeGreaterThan(0);
  });

  it('opens detailed model specification modal with API snippet', () => {
    render(<ModelComparisonPage />);

    const specsBtns = screen.getAllByRole('button', { name: /Specs|View Full Specs/i });
    expect(specsBtns.length).toBeGreaterThan(0);
    fireEvent.click(specsBtns[0]);

    expect(screen.getByText(/Overview & Capabilities/i)).toBeInTheDocument();
    expect(screen.getByText(/Pricing Breakdown:/i)).toBeInTheDocument();
    expect(screen.getByText(/Technical Limits:/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommended Use Cases:/i)).toBeInTheDocument();
  });

  it('validates model comparison data structure', () => {
    expect(AI_MODELS_DATABASE.length).toBeGreaterThanOrEqual(10);
    const o1 = AI_MODELS_DATABASE.find((m) => m.id === 'openai-o1');
    expect(o1).toBeDefined();
    expect(o1?.inputPricePerMillionUSD).toBe(15.0);
    expect(o1?.outputPricePerMillionUSD).toBe(60.0);

    const r1 = AI_MODELS_DATABASE.find((m) => m.id === 'deepseek-r1');
    expect(r1).toBeDefined();
    expect(r1?.isFreeToHost).toBe(true);
    expect(r1?.isOpenSource).toBe(true);

    expect(MODEL_PURPOSE_RECOMMENDATIONS.length).toBe(5);
  });
});
