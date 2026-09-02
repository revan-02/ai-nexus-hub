import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoleService } from '@/services';
import prisma from '@/lib/db/prisma';

vi.mock('@/lib/db/prisma', () => ({
  default: {
    role: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

describe('RoleService Business Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prevents deletion of protected system roles', async () => {
    (prisma.role.findUnique as any).mockResolvedValue({
      id: 'role-admin',
      name: 'Super Admin',
      isProtected: true,
    });

    await expect(RoleService.deleteRole('role-admin')).rejects.toThrow(
      "Protected system role 'Super Admin' cannot be deleted"
    );
  });

  it('allows deletion of non-protected custom roles', async () => {
    (prisma.role.findUnique as any).mockResolvedValue({
      id: 'role-custom',
      name: 'Custom Reviewer',
      isProtected: false,
    });
    (prisma.role.delete as any).mockResolvedValue({ id: 'role-custom' });

    const result = await RoleService.deleteRole('role-custom');

    expect(prisma.role.delete).toHaveBeenCalledWith({ where: { id: 'role-custom' } });
    expect(result.success).toBe(true);
  });
});
