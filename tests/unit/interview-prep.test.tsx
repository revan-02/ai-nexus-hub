import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InterviewPrepPage from '@/app/interview-prep/page';
import { evaluateMockInterviewAnswer, getInterviewQuestions } from '@/services/interview-prep-service';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

describe('Interview Preparation Hub (0-4 Years Experience)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders interview prep hero and experience tier cards', () => {
    render(<InterviewPrepPage />);

    expect(screen.getByText(/AI & ML Engineering Interview Mastery \(0–4 Yrs\)/i)).toBeInTheDocument();
    expect(screen.getByText(/0–1 Yrs \(Entry \/ Freshers\)/i)).toBeInTheDocument();
    expect(screen.getByText(/1–2 Yrs \(Junior \/ Applied\)/i)).toBeInTheDocument();
    expect(screen.getByText(/3–4 Yrs \(Mid-Senior \/ Arch\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Launch AI Mock Interviewer/i })).toBeInTheDocument();
  });

  it('filters question bank when clicking experience tier buttons', () => {
    render(<InterviewPrepPage />);

    // Filter by 0-1y
    const fresherTier = screen.getByText(/0–1 Yrs \(Entry \/ Freshers\)/i);
    fireEvent.click(fresherTier);
    expect(screen.getByText(/Explain Gradient Descent and Derive the Weight Update Step/i)).toBeInTheDocument();

    // Filter by 3-4y
    const seniorTier = screen.getByText(/3–4 Yrs \(Mid-Senior \/ Arch\)/i);
    fireEvent.click(seniorTier);
    expect(screen.getByText(/System Design: Multi-Tenant Enterprise RAG at 10,000 QPS/i)).toBeInTheDocument();
  });

  it('launches AI Mock Interview Simulator and accepts answers', () => {
    render(<InterviewPrepPage />);

    const launchBtn = screen.getByRole('button', { name: /Launch AI Mock Interviewer/i });
    fireEvent.click(launchBtn);

    expect(screen.getByText(/Interactive AI Technical Interview Simulator/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type your structured engineering answer here/i)).toBeInTheDocument();

    // Enter answer
    const textarea = screen.getByPlaceholderText(/Type your structured engineering answer here/i);
    fireEvent.change(textarea, { target: { value: 'Gradient descent computes partial derivatives dL/dw and updates weights in negative slope direction.' } });

    const submitBtn = screen.getByRole('button', { name: /Submit to AI Interviewer/i });
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);
  });

  it('service evaluates mock answers and returns multi-dimensional scorecard', async () => {
    const questions = await getInterviewQuestions({ experienceBracket: '1-2y' });
    expect(questions.length).toBeGreaterThan(0);

    const result = evaluateMockInterviewAnswer(
      questions[0],
      'Scaled dot-product attention computes QK^T / sqrt(d_k) to prevent vanishing gradients in softmax due to variance scaling.'
    );

    expect(result.overallScore).toBeGreaterThanOrEqual(60);
    expect(result.technicalAccuracy).toBeGreaterThan(0);
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.suggestedAnswerReview).toBeDefined();
  });
});
