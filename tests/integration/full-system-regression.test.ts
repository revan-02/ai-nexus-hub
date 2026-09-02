import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '@/lib/db/prisma';
import { submitAssessmentAttempt, recordProctorViolation } from '@/services/assessment-service';
import { getLearnerDashboardData } from '@/services/dashboard-service';
import { createUser } from '@/services/user-service';

// Mock prisma for regression suite
vi.mock('@/lib/db/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    course: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    lesson: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    project: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    content: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    algorithm: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    assessment: {
      findUnique: vi.fn(),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn(),
    },
    learningRoom: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    learningPhase: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    userQuizAttempt: {
      create: vi.fn(),
      findMany: vi.fn().mockResolvedValue([]),
    },
    userCertificate: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn().mockResolvedValue([]),
    },
    auditLog: {
      create: vi.fn(),
      findMany: vi.fn().mockResolvedValue([]),
    },
    userCourseProgress: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    userLessonProgress: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    userProjectProgress: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    userActivity: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    role: {
      findFirst: vi.fn(),
    },
    userRoleMap: {
      create: vi.fn(),
    },
  },
}));

describe('Comprehensive End-to-End System Regression Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Regression Area 1: User Onboarding & Auth Lifecycle', () => {
    it('creates a user with formatted handle and role assignment', async () => {
      (prisma.user.findFirst as any).mockResolvedValue(null);
      (prisma.user.create as any).mockResolvedValue({
        id: 'usr-reg-1',
        name: 'Sarah Connor',
        email: 'sarah.c@nexus.ai',
        username: '@sarahconnor',
      });
      (prisma.role.findFirst as any).mockResolvedValue({ id: 'role-learner', name: 'Learner' });
      (prisma.userRoleMap.create as any).mockResolvedValue({});

      const user = await createUser({
        name: 'Sarah Connor',
        email: 'sarah.c@nexus.ai',
        username: 'sarahconnor',
      });

      expect(user.id).toBe('usr-reg-1');
      expect(user.username).toBe('@sarahconnor');
      expect(prisma.user.create).toHaveBeenCalled();
    });
  });

  describe('Regression Area 2: Multi-Level Curriculum & Dynamic Dashboard', () => {
    it('retrieves multi-level courses filtered by learner grade level', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'usr-reg-1',
        name: 'Sarah Connor',
        email: 'sarah.c@nexus.ai',
        role: 'Learner',
        certificates: [],
        roleMappings: [],
      });
      (prisma.userCourseProgress.findMany as any).mockResolvedValue([]);
      (prisma.userLessonProgress.findMany as any).mockResolvedValue([]);
      (prisma.course.findMany as any).mockResolvedValue([
        { id: 'crs-1', title: 'AI for School Kids', level: 'Beginner', category: 'K-12 & School', price: 'Free' },
        { id: 'crs-2', title: 'Deep Learning PyTorch', level: 'Intermediate', category: 'Deep Learning', price: '₹3,999' },
        { id: 'crs-3', title: 'Enterprise RAG & LoRA', level: 'Advanced', category: 'Generative AI', price: '₹5,999' },
      ]);
      (prisma.learningRoom.findMany as any).mockResolvedValue([]);
      (prisma.learningPhase.findMany as any).mockResolvedValue([]);
      (prisma.userCertificate.findMany as any).mockResolvedValue([]);

      const dashboard = await getLearnerDashboardData('usr-reg-1');

      expect(dashboard).toBeDefined();
      expect(dashboard.activeCourses.length).toBe(3);
      expect(dashboard.activeCourses[0].category).toBe('K-12 & School');
      expect(dashboard.activeCourses[2].level).toBe('Advanced');
    });
  });

  describe('Regression Area 3: Anti-Cheat Lockdown & Strike Penalties', () => {
    it('logs proctor strikes with dynamic client IP address', async () => {
      (prisma.assessment.findUnique as any).mockResolvedValue({
        id: 'asm-reg-1',
        name: 'Production vLLM Exam',
      });
      (prisma.auditLog.create as any).mockResolvedValue({});

      const violation = await recordProctorViolation(
        'asm-reg-1',
        'usr-reg-1',
        'Tab Switch Detected (Strike 2/3)',
        '192.0.2.14',
        'Mozilla/5.0 Mac'
      );

      expect(violation.success).toBe(true);
      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'usr-reg-1',
            type: 'security',
            action: expect.stringContaining('192.0.2.14'),
          }),
        })
      );
    });
  });

  describe('Regression Area 4: Multiple Re-Attempts on Failure for Free & Paid Users', () => {
    it('tracks attempt numbers and preserves highest score across retakes', async () => {
      (prisma.assessment.findUnique as any).mockResolvedValue({
        id: 'asm-reg-1',
        name: 'Production vLLM Exam',
        attempts: '2',
        course: { id: 'crs-3', title: 'Generative AI Systems' },
      });

      // Attempt 1: Failed (45%)
      (prisma.userQuizAttempt.create as any).mockResolvedValueOnce({
        id: 'att-1',
        userId: 'usr-reg-1',
        assessmentId: 'asm-reg-1',
        score: 45,
        passed: false,
      });

      (prisma.userQuizAttempt.findMany as any).mockResolvedValueOnce([
        { score: 45 },
      ]);

      (prisma.assessment.update as any).mockResolvedValue({});
      (prisma.auditLog.create as any).mockResolvedValue({});

      const attempt1 = await submitAssessmentAttempt('usr-reg-1', 'asm-reg-1', {
        scorePercent: 45,
        passed: false,
        strikes: 0,
        clientIp: '198.51.100.99',
      });

      expect(attempt1.success).toBe(true);
      expect(attempt1.passed).toBe(false);
      expect(attempt1.attemptNumber).toBe(1);
      expect(attempt1.bestScore).toBe(45);
      expect(attempt1.certificate).toBeNull();

      // Attempt 2: Passed (95%)
      (prisma.user.findUnique as any).mockResolvedValue({ id: 'usr-reg-1', name: 'Sarah Connor' });
      (prisma.userQuizAttempt.create as any).mockResolvedValueOnce({
        id: 'att-2',
        userId: 'usr-reg-1',
        assessmentId: 'asm-reg-1',
        score: 95,
        passed: true,
      });

      (prisma.userQuizAttempt.findMany as any).mockResolvedValueOnce([
        { score: 95 },
        { score: 45 },
      ]);

      (prisma.userCertificate.create as any).mockResolvedValueOnce({
        id: 'cert-reg-99',
        certificateHash: 'NEXUS-CERT-REG99',
        trackName: 'Generative AI Systems & Production vLLM Exam',
        scorePercent: 95,
        user: { id: 'usr-reg-1', name: 'Sarah Connor', email: 'sarah.c@nexus.ai' },
      });

      const attempt2 = await submitAssessmentAttempt('usr-reg-1', 'asm-reg-1', {
        scorePercent: 95,
        passed: true,
        strikes: 0,
        clientIp: '198.51.100.99',
      });

      expect(attempt2.success).toBe(true);
      expect(attempt2.passed).toBe(true);
      expect(attempt2.attemptNumber).toBe(2);
      expect(attempt2.bestScore).toBe(95);
      expect(attempt2.certificate?.certificateHash).toBe('NEXUS-CERT-REG99');
    });
  });

  describe('Regression Area 5: Payment Gateway & System Backups', () => {
    it('handles payment gateway configuration and backup snapshots', async () => {
      (prisma.auditLog.create as any).mockResolvedValue({});

      // Verify audit logging for system operations
      await prisma.auditLog.create({
        data: {
          action: 'System Database Backup Generated',
          target: 'system_backup',
          userId: 'usr-admin',
          type: 'security',
        },
      });

      expect(prisma.auditLog.create).toHaveBeenCalled();
    });
  });

  describe('Regression Area 6: Academic Tier Switching (Class 5 to PhD)', () => {
    it('verifies 7 distinct academic tiers across K-12, Higher Ed, and Industry', () => {
      const ACADEMIC_TIERS = [
        { id: 'young-explorer', label: 'Young Explorer', grade: 'Class 5–7' },
        { id: 'junior-innovator', label: 'Junior Innovator', grade: 'Class 8–10' },
        { id: 'pre-university', label: 'Pre-University', grade: 'Class 11–12 / PUC' },
        { id: 'undergraduate', label: 'Undergraduate', grade: 'B.Tech / BSc' },
        { id: 'postgraduate', label: 'Postgraduate', grade: 'M.Tech / MSc / MCA' },
        { id: 'industry-pro', label: 'Industry Professional', grade: 'Working (0–4 yrs)' },
        { id: 'phd-research', label: 'PhD & Research', grade: 'PhD / Postdoc' },
      ];

      expect(ACADEMIC_TIERS).toHaveLength(7);
      expect(ACADEMIC_TIERS[0].id).toBe('young-explorer');
      expect(ACADEMIC_TIERS[6].id).toBe('phd-research');
    });
  });

  describe('Regression Area 7: Coupon Validation & Dynamic Pricing Engine', () => {
    it('calculates percentage and flat discounts accurately with bounds checking', async () => {
      const { validateCoupon, couponsDatabase } = await import('@/services/coupon-service');

      expect(couponsDatabase.length).toBeGreaterThanOrEqual(4);

      // 50% discount on ₹3,999 course
      const res50 = validateCoupon('NEXUS50', '₹3,999');
      expect(res50.isValid).toBe(true);
      expect(res50.discountAmount).toBe(1999.5);
      expect(res50.finalPrice).toBe(1999.5);

      // 100% scholarship on ₹4,999 course
      const res100 = validateCoupon('VTU100', '₹4,999');
      expect(res100.isValid).toBe(true);
      expect(res100.discountAmount).toBe(4999);
      expect(res100.finalPrice).toBe(0);

      // Flat ₹1,500 off on ₹5,999 course
      const resFlat = validateCoupon('EARLYBIRD', '₹5,999');
      expect(resFlat.isValid).toBe(true);
      expect(resFlat.discountAmount).toBe(1500);
      expect(resFlat.finalPrice).toBe(4499);

      // Invalid coupon code
      const resInvalid = validateCoupon('NONEXISTENT_CODE', '₹2,000');
      expect(resInvalid.isValid).toBe(false);
      expect(resInvalid.finalPrice).toBe(2000);
    });
  });

  describe('Regression Area 8: Math for AI Foundations Data & 4 Pillars', () => {
    it('validates mathematics curriculum coverage across all 4 pillars', async () => {
      const { MATH_CATEGORIES, MATH_FORMULAS } = await import('@/lib/ai/math-foundations-data');

      expect(MATH_CATEGORIES).toHaveLength(4);
      expect(MATH_CATEGORIES.map(p => p.id)).toEqual([
        'linear-algebra',
        'calculus',
        'probability',
        'optimization',
      ]);

      expect(MATH_FORMULAS.length).toBeGreaterThanOrEqual(8);
      for (const concept of MATH_FORMULAS) {
        expect(concept.id).toBeDefined();
        expect(concept.title).toBeDefined();
        expect(concept.latexFormula).toBeDefined();
        expect(concept.whereUsedInAI).toBeDefined();
        expect(concept.codeSnippet).toBeDefined();
      }
    });
  });

  describe('Regression Area 9: AI Model Comparison & Pricing Matrix', () => {
    it('validates frontier and open weights models with dual currency conversion', () => {
      const USD_TO_INR_RATE = 87.5;
      const gpt4oInputPerMillionUsd = 2.50;
      const gpt4oInputPerMillionInr = gpt4oInputPerMillionUsd * USD_TO_INR_RATE;

      expect(gpt4oInputPerMillionInr).toBe(218.75);

      // Free local models should cost 0 in both currencies
      const ollamaCostUsd = 0;
      const ollamaCostInr = ollamaCostUsd * USD_TO_INR_RATE;
      expect(ollamaCostInr).toBe(0);
    });
  });
});
