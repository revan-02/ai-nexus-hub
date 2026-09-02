import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MathForAIPage from '@/app/math-for-ai/page';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

describe('Math for AI, ML & Deep Learning Hub', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page header, 4 pillars description and initial Vector simulator', () => {
    render(<MathForAIPage />);

    expect(screen.getByText(/Mathematics for AI, Machine Learning & Deep Learning/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Vector Dot Product & Cosine Similarity/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Calculated Metrics/i)).toBeInTheDocument();
  }, 15000);

  it('switches to Gradient Descent Simulator and steps forward', () => {
    render(<MathForAIPage />);

    const gdBtn = screen.getByRole('button', { name: /Gradient Descent/i });
    fireEvent.click(gdBtn);
    expect(screen.getByText(/Gradient Descent Step Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Optimization Trajectory/i)).toBeInTheDocument();

    const stepBtn = screen.getByRole('button', { name: /Step Forward/i });
    fireEvent.click(stepBtn);
    expect(screen.getByText(/Step 1:/i)).toBeInTheDocument();
  }, 15000);

  it('switches to Activation Curves and Cross-Entropy Loss', () => {
    render(<MathForAIPage />);

    const actBtn = screen.getByRole('button', { name: /Activation Curves/i });
    fireEvent.click(actBtn);
    expect(screen.getByText(/Non-Linearity & Gradient Flow/i)).toBeInTheDocument();
    expect(screen.getByText(/SIGMOID Function/i)).toBeInTheDocument();

    const ceBtn = screen.getByRole('button', { name: /Cross-Entropy Loss/i });
    fireEvent.click(ceBtn);
    expect(screen.getAllByText(/Categorical Cross-Entropy Loss/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Computed Loss:/i)).toBeInTheDocument();
  }, 15000);

  it('filters mathematical formulas by category tabs and search query', () => {
    render(<MathForAIPage />);

    const laFilterBtn = screen.getByRole('button', { name: /Linear Algebra & Tensors/i });
    fireEvent.click(laFilterBtn);
    expect(screen.getByText(/Singular Value Decomposition/i)).toBeInTheDocument();

    const calcFilterBtn = screen.getByRole('button', { name: /Multivariable Calculus & Backprop/i });
    fireEvent.click(calcFilterBtn);
    expect(screen.getByText(/Vectorized Chain Rule for Backpropagation/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search formula, eigenvalue, loss/i);
    fireEvent.change(searchInput, { target: { value: 'Jacobian' } });
    expect(screen.getByText(/Jacobian & Hessian Curvature Matrices/i)).toBeInTheDocument();
  }, 15000);
});
