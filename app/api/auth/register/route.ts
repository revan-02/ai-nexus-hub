import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';
import { registerSchema } from '@/schemas/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json(
        { error: firstError, details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, username, email, phone, password } = validation.data;
    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.trim();
    const formattedUsername = cleanUsername.startsWith('@') ? cleanUsername : `@${cleanUsername}`;
    const rawUsername = cleanUsername.replace(/^@/, '');
    const cleanPhone = phone.trim();
    const digitsOnlyPhone = cleanPhone.replace(/[^0-9]/g, '');
    const last10Digits = digitsOnlyPhone.length >= 10 ? digitsOnlyPhone.slice(-10) : digitsOnlyPhone;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanEmail, mode: 'insensitive' } },
          { username: { equals: formattedUsername, mode: 'insensitive' } },
          { username: { equals: rawUsername, mode: 'insensitive' } },
          { phone: cleanPhone },
          ...(digitsOnlyPhone ? [{ phone: digitsOnlyPhone }] : []),
          ...(last10Digits.length >= 10 ? [{ phone: { contains: last10Digits } }] : []),
        ],
      },
    });

    if (existingUser) {
      let field = 'email, username, or phone number';
      if (existingUser.email?.toLowerCase() === cleanEmail) {
        field = 'email address';
      } else if (
        existingUser.username?.toLowerCase() === formattedUsername.toLowerCase() ||
        existingUser.username?.toLowerCase() === rawUsername.toLowerCase()
      ) {
        field = 'username';
      } else if (existingUser.phone) {
        field = 'phone number';
      }

      return NextResponse.json(
        { error: `An account with this ${field} already exists` },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        username: formattedUsername,
        email: cleanEmail,
        phone: cleanPhone,
        password: hashedPassword,
        role: 'User',
        status: 'Active',
        emailVerified: true,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error: any) {
    console.error('[Registration Error]:', error);
    if (error?.code === 'P2002') {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : 'field';
      return NextResponse.json(
        { error: `An account with this ${target} already exists. Please log in or use a different value.` },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message || 'Registration failed. Please check the provided information and try again.' },
      { status: 500 }
    );
  }
}
