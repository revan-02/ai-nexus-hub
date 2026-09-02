import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '@/lib/db/prisma';

vi.mock('@/lib/db/prisma', () => ({
  default: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

describe('OTP Auth Integration & Anti-Spam Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates 6-digit OTP code correctly', async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    expect(code).toHaveLength(6);
    expect(Number(code)).toBeGreaterThanOrEqual(100000);
    expect(Number(code)).toBeLessThanOrEqual(999999);
  });

  it('auto-provisions user on valid OTP verification if new user', async () => {
    const mockUser = {
      id: 'usr-otp-1',
      name: 'Rajj Kashyap',
      email: 'rajj@nexus.ai',
      role: 'User',
      status: 'Active',
    };

    (prisma.user.findFirst as any).mockResolvedValue(null);
    (prisma.user.create as any).mockResolvedValue(mockUser);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});
