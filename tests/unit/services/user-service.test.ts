import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '@/services';
import prisma from '@/lib/db/prisma';

vi.mock('@/lib/db/prisma', () => ({
  default: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

describe('UserService Business Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('formats username with leading @ and creates user', async () => {
    const mockCreatedUser = {
      id: 'usr-100',
      name: 'Test User',
      username: '@testuser',
      email: 'test@example.com',
      role: 'User',
      status: 'Active',
    };

    (prisma.user.findFirst as any).mockResolvedValue(null);
    (prisma.user.create as any).mockResolvedValue(mockCreatedUser);

    const user = await UserService.createUser({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
    });

    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    const createArg = (prisma.user.create as any).mock.calls[0][0];
    expect(createArg.data.username).toBe('@testuser');
    expect(user).toEqual(mockCreatedUser);
  });

  it('throws domain error if user email/username already exists', async () => {
    (prisma.user.findFirst as any).mockResolvedValue({ id: 'usr-1', email: 'test@example.com' });

    await expect(
      UserService.createUser({
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
      })
    ).rejects.toThrow('User with this email or username already exists');
  });

  it('performs bulk suspension of users', async () => {
    (prisma.user.updateMany as any).mockResolvedValue({ count: 2 });

    const result = await UserService.bulkSuspendUsers(['usr-1', 'usr-2']);

    expect(prisma.user.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['usr-1', 'usr-2'] } },
      data: { status: 'Suspended' },
    });
    expect(result).toEqual({ success: true, count: 2 });
  });
});
