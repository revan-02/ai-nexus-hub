import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/google-sync/route';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';

vi.mock('@/lib/db/prisma', () => ({
  default: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/firebase/firestore', () => ({
  createOrUpdateUserProfile: vi.fn(),
}));

describe('Google / Gmail Authentication & Sync Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects requests with missing or invalid email', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/google-sync', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid-email' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('Valid Gmail or Google email');
  });

  it('syncs existing user and returns account data', async () => {
    const existingUser = {
      id: 'usr-google-existing',
      name: 'Existing Google User',
      username: '@existinguser',
      email: 'existing@gmail.com',
      avatar: null,
      role: 'User',
      status: 'Active',
    };

    (prisma.user.findFirst as any).mockResolvedValue(existingUser);
    (prisma.user.update as any).mockResolvedValue({
      ...existingUser,
      avatar: 'https://lh3.googleusercontent.com/avatar.jpg',
      emailVerified: true,
    });

    const req = new NextRequest('http://localhost:3000/api/auth/google-sync', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@gmail.com',
        name: 'Existing Google User',
        avatar: 'https://lh3.googleusercontent.com/avatar.jpg',
        uid: 'firebase-uid-123',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.email).toBe('existing@gmail.com');
  });

  it('auto-provisions new user account if signing in via Google for the first time', async () => {
    (prisma.user.findFirst as any).mockResolvedValue(null);

    const createdUser = {
      id: 'usr-new-google-user',
      name: 'New Google User',
      username: '@newuser',
      email: 'newuser@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/avatar.jpg',
      role: 'User',
      status: 'Active',
      emailVerified: true,
    };

    (prisma.user.create as any).mockResolvedValue(createdUser);

    const req = new NextRequest('http://localhost:3000/api/auth/google-sync', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@gmail.com',
        name: 'New Google User',
        avatar: 'https://lh3.googleusercontent.com/avatar.jpg',
        uid: 'firebase-uid-456',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.username).toBe('@newuser');
    expect(prisma.user.create).toHaveBeenCalled();
  });
});
