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

    // 1. Check Username Uniqueness
    const existingUsername = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: formattedUsername, mode: 'insensitive' } },
          { username: { equals: rawUsername, mode: 'insensitive' } },
        ],
      },
    });
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username is already taken.' },
        { status: 409 }
      );
    }

    // 2. Check Email Uniqueness
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: { equals: cleanEmail, mode: 'insensitive' },
      },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email is already registered.' },
        { status: 409 }
      );
    }

    // 3. Check Phone Uniqueness (if phone is provided)
    if (cleanPhone) {
      const existingPhone = await prisma.user.findFirst({
        where: {
          OR: [
            { phone: cleanPhone },
            ...(digitsOnlyPhone ? [{ phone: digitsOnlyPhone }] : []),
            ...(last10Digits.length >= 10 ? [{ phone: { contains: last10Digits } }] : []),
          ],
        },
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: 'Mobile number is already registered.' },
          { status: 409 }
        );
      }
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
      const targetStr = Array.isArray(error.meta?.target) ? error.meta.target.join(' ') : String(error.meta?.target || '');
      if (targetStr.includes('username')) {
        return NextResponse.json({ error: 'Username is already taken.' }, { status: 409 });
      }
      if (targetStr.includes('email')) {
        return NextResponse.json({ error: 'Email is already registered.' }, { status: 409 });
      }
      if (targetStr.includes('phone')) {
        return NextResponse.json({ error: 'Mobile number is already registered.' }, { status: 409 });
      }
      return NextResponse.json(
        { error: 'An account with this information already exists. Please log in or use different details.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Registration could not be completed. Please try again.' },
      { status: 500 }
    );
  }
}
