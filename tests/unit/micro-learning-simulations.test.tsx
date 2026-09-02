import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MicroLearningPlayer } from '@/components/learning/micro-learning-player';

// Mock recharts responsive container for jsdom
vi.mock('recharts', async () => {
  const original = await vi.importActual<any>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div style={{ width: 400, height: 200 }}>{children}</div>,
  };
});

describe('Micro-Learning Player & Multi-Level Simulations', () => {
  it('renders Basic Level track with everyday AI tools and 5-min lesson limit', () => {
    render(<MicroLearningPlayer activeDifficulty="BASIC" />);

    expect(screen.getByText(/Basic \/ School \(AI & Tools\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Max 5 Min Lesson \(3:30\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Curated Video Masterclass/i)).toBeInTheDocument();
    expect(screen.getByText(/Step-by-Step Concept Breakdown/i)).toBeInTheDocument();
  });

  it('renders Intermediate Level track with Neural Network Playground and gradient descent', () => {
    render(<MicroLearningPlayer activeDifficulty="INTERMEDIATE" />);

    // Switch to Interactive Simulation tab
    const simTabs = screen.getAllByRole('button', { name: /Interactive Simulation/i });
    fireEvent.click(simTabs[0]);

    expect(screen.getByText(/Intermediate \(Architectures\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Max 5 Min Lesson \(4:15\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Neuron Parameter Controls/i)).toBeInTheDocument();

    // Trigger gradient descent step
    const stepBtn = screen.getByRole('button', { name: /Gradient Step \(SGD\)/i });
    expect(stepBtn).toBeInTheDocument();
    fireEvent.click(stepBtn);

    expect(screen.getByText(/Loss Convergence Graph/i)).toBeInTheDocument();
  });

  it('renders Advanced Level track with RAG Vector Database Simulator and QKV attention', () => {
    render(<MicroLearningPlayer activeDifficulty="ADVANCED" />);

    // Switch to Interactive Simulation tab
    const simTabs = screen.getAllByRole('button', { name: /Interactive Simulation/i });
    fireEvent.click(simTabs[0]);

    expect(screen.getByText(/Advance \(In-Depth ML\/DL\/GenAI\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Max 5 Min Lesson \(4:50\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise RAG Vector Database Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/FlashAttention Paper/i)).toBeInTheDocument();
  });

  it('switches between Curated Video Masterclass and 100% Original AI Canvas with Voice Narrator', () => {
    render(<MicroLearningPlayer activeDifficulty="BASIC" />);

    expect(screen.getByText(/Curated Video Masterclass/i)).toBeInTheDocument();
    expect(screen.getByText(/Sentence Slicing \(Tokens\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Visual Demonstration: How LLMs Slice Words into Tokens/i)).toBeInTheDocument();
    expect(screen.getByText(/Closed Captions \/ Spoken Script/i)).toBeInTheDocument();
  });

  it('allows switching to "Explain Like I\'m 5" tab and Suggested Videos tab', () => {
    render(<MicroLearningPlayer activeDifficulty="BASIC" />);

    // Click ELI5 tab
    const eli5Tab = screen.getByRole('button', { name: /Explain Like I'm 5/i });
    fireEvent.click(eli5Tab);

    expect(screen.getByText(/Visual Analogy \("Explain Like I'm 5"\)/i)).toBeInTheDocument();

    // Click Suggested Videos tab
    const suggestedTab = screen.getByRole('button', { name: /Suggested Videos/i });
    fireEvent.click(suggestedTab);

    expect(screen.getByText(/Suggested 5-Minute Micro-Lessons/i)).toBeInTheDocument();
  });
});
