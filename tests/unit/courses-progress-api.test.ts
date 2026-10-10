import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/courses/[id]/progress/route';

vi.mock('@/lib/auth/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/db/prisma', () => ({
  default: {
    userLessonProgress: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    userCourseProgress: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    lesson: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    course: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

describe('Courses Progress API Endpoint (/api/courses/[id]/progress)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET returns default progress for unauthenticated request', async () => {
    (auth as any).mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/courses/python-programming/progress');
    const res = await GET(req, { params: Promise.resolve({ id: 'python-programming' }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.authenticated).toBe(false);
    expect(json.completedLessons).toEqual([]);
  });

  it('GET returns user completed lessons and progress when authenticated', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'usr-123' } });
    (prisma.userLessonProgress.findMany as any).mockResolvedValue([
      { lessonId: 'les-1', completed: true },
      { lessonId: 'les-2', completed: true },
    ]);
    (prisma.userCourseProgress.findUnique as any).mockResolvedValue({
      progressPercent: 50,
      status: 'Draft',
    });

    const req = new NextRequest('http://localhost:3000/api/courses/python-programming/progress');
    const res = await GET(req, { params: Promise.resolve({ id: 'python-programming' }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.authenticated).toBe(true);
    expect(json.completedLessons).toEqual(['les-1', 'les-2']);
    expect(json.progressPercent).toBe(50);
  });

  it('POST upserts lesson and course progress when authenticated', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'usr-123' } });
    (prisma.lesson.findUnique as any).mockResolvedValue({ id: 'les-1', courseId: 'python-programming' });
    (prisma.userLessonProgress.upsert as any).mockResolvedValue({ id: 'ulp-1' });
    (prisma.userCourseProgress.upsert as any).mockResolvedValue({ id: 'ucp-1' });

    const req = new NextRequest('http://localhost:3000/api/courses/python-programming/progress', {
      method: 'POST',
      body: JSON.stringify({
        lessonId: 'les-1',
        completed: true,
        progressPercent: 25,
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'python-programming' }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.authenticated).toBe(true);
    expect(prisma.userLessonProgress.upsert).toHaveBeenCalled();
  });
});
