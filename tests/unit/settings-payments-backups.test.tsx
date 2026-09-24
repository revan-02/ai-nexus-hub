import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { GET as getPaymentSettings, POST as postPaymentSettings } from '@/app/api/settings/payment-gateways/route';
import { GET as getBackups, POST as postBackup } from '@/app/api/system/backup/route';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';

vi.mock('@/lib/auth/auth', () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: 'usr-admin-1', email: 'admin@nexus.ai', role: 'Admin' } }),
}));

vi.mock('@/services/audit-service', () => ({
  createAuditLog: vi.fn().mockResolvedValue({ id: 'log-1' }),
}));

vi.mock('@/lib/db/prisma', () => ({
  default: {
    user: { findMany: vi.fn().mockResolvedValue([{ id: 'u1', name: 'Alice' }]) },
    course: { findMany: vi.fn().mockResolvedValue([{ id: 'c1', title: 'AI for Kids' }]) },
    assessment: { findMany: vi.fn().mockResolvedValue([{ id: 'a1', name: 'ML Exam' }]) },
    learningRoom: { findMany: vi.fn().mockResolvedValue([{ id: 'r1', title: 'Intro Room' }]) },
    userCertificate: { findMany: vi.fn().mockResolvedValue([{ id: 'cert1', certificateHash: 'NEXUS-123' }]) },
  },
}));

describe('Payment Gateways & System Backup APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Payment Gateways API (/api/settings/payment-gateways)', () => {
    it('returns Razorpay and Stripe gateway configuration', async () => {
      const res = await getPaymentSettings();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.razorpay).toBeDefined();
      expect(json.data.razorpay.keyId).toBeDefined();
      expect(json.data.stripe).toBeDefined();
      expect(json.data.general.taxPercentage).toBe(18);
    });

    it('updates Razorpay API settings and environment mode', async () => {
      const req = new NextRequest('http://localhost:3000/api/settings/payment-gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay: {
            keyId: 'rzp_live_customKey123',
            mode: 'live',
            currency: 'INR',
          },
        }),
      });

      const res = await postPaymentSettings(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.razorpay.keyId).toBe('rzp_live_customKey123');
      expect(json.data.razorpay.mode).toBe('live');
    });
  });

  describe('System Backup & Recovery API (/api/system/backup)', () => {
    it('returns list of available backups', async () => {
      const res = await getBackups();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
    });

    it('generates a full database snapshot including users, courses, and certificates', async () => {
      const req = new NextRequest('http://localhost:3000/api/system/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'Full System Snapshot' }),
      });

      const res = await postBackup(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.snapshotData).toBeDefined();
      expect(json.data.snapshotData.stats.coursesCount).toBe(1);
      expect(json.data.snapshotData.stats.certificatesCount).toBe(1);
      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(prisma.course.findMany).toHaveBeenCalled();
    });
  });
});
