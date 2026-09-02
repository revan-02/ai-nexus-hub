import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { createAuditLog } from '@/services/audit-service';

export async function POST(request: NextRequest) {
  try {
    const { identifier, code, type, name } = await request.json();

    if (!identifier || !code) {
      return NextResponse.json({ error: 'Identifier and OTP code are required' }, { status: 400 });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const isEmail = cleanIdentifier.includes('@');

    // Find existing user by email or phone
    let user = await prisma.user.findFirst({
      where: isEmail ? { email: cleanIdentifier } : { phone: cleanIdentifier },
    });

    // If user does not exist, auto-create a simple account
    if (!user) {
      const generatedName = name || (isEmail ? cleanIdentifier.split('@')[0] : `User_${cleanIdentifier.slice(-4)}`);
      const baseUsername = `@${generatedName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const defaultEmail = isEmail ? cleanIdentifier : `${cleanIdentifier.replace(/[^0-9]/g, '')}@nexus-mobile.ai`;
      const hashedPassword = await bcrypt.hash('password123', 10);

      user = await prisma.user.create({
        data: {
          name: generatedName,
          username: `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`,
          email: defaultEmail,
          phone: isEmail ? null : cleanIdentifier,
          password: hashedPassword,
          role: 'User',
          status: 'Active',
          emailVerified: true,
        },
      });

      await createAuditLog({
        userId: user.id,
        action: `Registered new account via 1-click ${type === 'phone' ? 'Mobile Phone' : 'Email'} OTP verification`,
        target: user.id,
        type: 'user',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'OTP verification failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
