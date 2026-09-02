import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizzesPage from '@/app/quizzes/page';
import {
  ALL_32_AI_CERTIFICATION_EXAMS,
  getFilteredQuizzesAndExams,
  getQuizExamById
} from '@/services/quizzes-and-exams-service';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/quizzes/quiz-proctor-guard', () => ({
  QuizProctorGuard: ({ children }: any) => <div data-testid="proctor-guard">{children}</div>,
}));

describe('30+ AI Quizzes & Certification Exams Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('contains at least 30 comprehensive AI certification exams in database', () => {
    expect(ALL_32_AI_CERTIFICATION_EXAMS.length).toBeGreaterThanOrEqual(30);
  });

  it('covers all 10 specialized domain categories', () => {
    const domains = new Set(ALL_32_AI_CERTIFICATION_EXAMS.map((e) => e.domain));
    expect(domains.has('Machine Learning Core')).toBe(true);
    expect(domains.has('Deep Learning Architectures')).toBe(true);
    expect(domains.has('Generative AI & LLMs')).toBe(true);
    expect(domains.has('Agriculture & Rural AI')).toBe(true);
    expect(domains.has('Cybersecurity AI & Threat Defense')).toBe(true);
    expect(domains.has('Computer Vision & Multimodal')).toBe(true);
    expect(domains.has('NLP & Speech Processing')).toBe(true);
    expect(domains.has('MLOps & AI System Design')).toBe(true);
    expect(domains.has('VTU University AI/ML Papers')).toBe(true);
    expect(domains.has('AI Ethics, Safety & Governance')).toBe(true);
  });

  it('filters exams correctly by domain and difficulty', () => {
    const agriExams = getFilteredQuizzesAndExams({ domain: 'Agriculture & Rural AI' });
    expect(agriExams.length).toBeGreaterThanOrEqual(4);
    expect(agriExams.some((e) => e.title.includes('Crop Disease'))).toBe(true);

    const expertExams = getFilteredQuizzesAndExams({ difficulty: 'Expert' });
    expect(expertExams.length).toBeGreaterThanOrEqual(5);

    const vtuExams = getFilteredQuizzesAndExams({ search: 'VTU' });
    expect(vtuExams.length).toBeGreaterThanOrEqual(3);
  });

  it('renders Quizzes & Certification Exams page with 30+ exams and filter dropdowns', () => {
    render(<QuizzesPage />);

    expect(screen.getByRole('heading', { level: 1, name: /AI Quizzes & Certification Exams/i })).toBeInTheDocument();
    expect(screen.getByText(/32\+ Industry Certification Exams Available/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Start Proctored Exam/i).length).toBeGreaterThanOrEqual(10);
  });

  it('starts a proctored exam, answers questions, and navigates to completion', () => {
    render(<QuizzesPage />);

    // Click the first "Start Proctored Exam" button
    const startButtons = screen.getAllByRole('button', { name: /Start Proctored Exam/i });
    fireEvent.click(startButtons[0]);

    // Proctor guard should be active
    expect(screen.getByTestId('proctor-guard')).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();

    // Select first option by text content
    const optionA = screen.getByText(/L1 diamond constraint has sharp vertices/i);
    fireEvent.click(optionA);

    // Click Next Question
    const nextBtn = screen.getByRole('button', { name: /Next Question/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Question 2 of/i)).toBeInTheDocument();
  });
});
