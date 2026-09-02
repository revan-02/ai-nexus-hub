import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { submitAssessmentAttempt, recordProctorViolation } from '@/services/assessment-service';
import { QuizProctorGuard } from '@/components/quizzes/quiz-proctor-guard';
import prisma from '@/lib/db/prisma';

// Mock prisma
vi.mock('@/lib/db/prisma', () => ({
  default: {
    assessment: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    userQuizAttempt: {
      create: vi.fn(),
    },
    userCertificate: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

// Mock api client
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    post: vi.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

describe('Anti-Cheat Exam Proctoring & Certificate Issuance System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AssessmentService Backend Logic', () => {
    it('records quiz attempt and issues verified certificate when passed', async () => {
      (prisma.assessment.findUnique as any).mockResolvedValue({
        id: 'asm-101',
        name: 'LLM Systems Architecture Exam',
        attempts: '5',
        course: { id: 'crs-1', title: 'Generative AI & LLMs' },
      });

      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'usr-1',
        name: 'Test Student',
      });

      (prisma.userQuizAttempt.create as any).mockResolvedValue({
        id: 'att-1',
        userId: 'usr-1',
        assessmentId: 'asm-101',
        score: 95,
        passed: true,
      });

      (prisma.assessment.update as any).mockResolvedValue({});

      (prisma.userCertificate.create as any).mockResolvedValue({
        id: 'cert-99',
        certificateHash: 'NEXUS-CERT-123456',
        trackName: 'Generative AI & LLMs & LLM Systems Architecture Exam',
        scorePercent: 100,
        user: { id: 'usr-1', name: 'Test Student', email: 'student@nexus.ai' },
      });

      (prisma.auditLog.create as any).mockResolvedValue({});

      const result = await submitAssessmentAttempt('usr-1', 'asm-101', {
        scorePercent: 95,
        passed: true,
        strikes: 0,
        clientIp: '198.51.100.42',
        userAgent: 'Mozilla/5.0 Mac',
      });

      expect(result.success).toBe(true);
      expect(result.passed).toBe(true);
      expect(result.certificate).toBeDefined();
      expect(result.certificate?.certificateHash).toBe('NEXUS-CERT-123456');
      expect(prisma.userQuizAttempt.create).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('supports multiple attempts on failure for all free and paid learners', async () => {
      (prisma.assessment.findUnique as any).mockResolvedValue({
        id: 'asm-102',
        name: 'Classical ML Fundamentals',
        attempts: '1',
        course: { id: 'crs-2', title: 'Machine Learning' },
      });

      (prisma.userQuizAttempt.create as any).mockResolvedValue({
        id: 'att-2',
        userId: 'usr-1',
        assessmentId: 'asm-102',
        score: 40,
        passed: false,
      });

      (prisma.userQuizAttempt.findMany as any) = vi.fn().mockResolvedValue([
        { score: 40 },
        { score: 30 },
      ]);

      (prisma.assessment.update as any).mockResolvedValue({});
      (prisma.auditLog.create as any).mockResolvedValue({});

      const failResult = await submitAssessmentAttempt('usr-1', 'asm-102', {
        scorePercent: 40,
        passed: false,
        strikes: 0,
        clientIp: '127.0.0.1',
      });

      expect(failResult.success).toBe(true);
      expect(failResult.passed).toBe(false);
      expect(failResult.certificate).toBeNull();
      expect(failResult.attemptNumber).toBe(2);
      expect(failResult.bestScore).toBe(40);
    });

    it('logs anti-cheat violations to security audit log with IP and device footprint', async () => {
      (prisma.assessment.findUnique as any).mockResolvedValue({
        id: 'asm-101',
        name: 'LLM Systems Architecture Exam',
      });

      (prisma.auditLog.create as any).mockResolvedValue({});

      const res = await recordProctorViolation(
        'asm-101',
        'usr-1',
        'Tab switched to external window (Strike 1/3)',
        '203.0.113.195',
        'Chrome 128'
      );

      expect(res.success).toBe(true);
      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'usr-1',
            type: 'security',
            action: expect.stringContaining('Anti-Cheat Violation'),
          }),
        })
      );
    });
  });

  describe('QuizProctorGuard Frontend Component', () => {
    it('renders proctor lockdown status with AI Assistant Disabled indicator', () => {
      render(
        <QuizProctorGuard assessmentId="asm-101" assessmentTitle="Transformers Exam">
          <div data-testid="exam-content">Active Exam Question 1</div>
        </QuizProctorGuard>
      );

      expect(screen.getByText('EXAM LOCKDOWN ACTIVE')).toBeInTheDocument();
      expect(screen.getByText('AI Assistant Disabled')).toBeInTheDocument();
      expect(screen.getByText(/Strikes: 0 \/ 3/i)).toBeInTheDocument();
      expect(screen.getByTestId('exam-content')).toBeInTheDocument();
    });

    it('triggers anti-cheat warning modal when window blur event occurs', () => {
      render(
        <QuizProctorGuard assessmentId="asm-101" assessmentTitle="Transformers Exam">
          <div>Exam Question Content</div>
        </QuizProctorGuard>
      );

      // Simulate window blur (switching tabs / windows)
      fireEvent.blur(window);

      expect(screen.getByText('ANTI-CHEAT WARNING')).toBeInTheDocument();
      expect(screen.getByText(/Window lost focus \/ application switch detected/i)).toBeInTheDocument();
      expect(screen.getByText(/Strikes accumulated:/i)).toBeInTheDocument();
    });
  });
});
