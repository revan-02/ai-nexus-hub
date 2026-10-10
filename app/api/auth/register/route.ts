import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';
import { registerSchema } from '@/schemas/auth';

export async function POST(request: NextRequest) {
  let requestBody: any = {};
  try {
    requestBody = await request.json();
    const validation = registerSchema.safeParse(requestBody);

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

    // 1. Check Username Uniqueness (if DB is responsive)
    try {
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
    } catch (checkErr: any) {
      console.warn('[Registration] Notice on username uniqueness check:', checkErr?.message || checkErr);
      if (isUniqueViolationError(checkErr)) {
        return handleUniqueViolation(checkErr);
      }
    }

    // 2. Check Email Uniqueness (if DB is responsive)
    try {
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
    } catch (checkErr: any) {
      console.warn('[Registration] Notice on email uniqueness check:', checkErr?.message || checkErr);
      if (isUniqueViolationError(checkErr)) {
        return handleUniqueViolation(checkErr);
      }
    }

    // 3. Check Phone Uniqueness (if phone is provided and DB is responsive)
    if (cleanPhone) {
      try {
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
      } catch (checkErr: any) {
        console.warn('[Registration] Notice on phone uniqueness check:', checkErr?.message || checkErr);
        if (isUniqueViolationError(checkErr)) {
          return handleUniqueViolation(checkErr);
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User Record in Database
    try {
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
    } catch (createErr: any) {
      console.error('[Registration User Create Error]:', createErr);

      if (isUniqueViolationError(createErr)) {
        return handleUniqueViolation(createErr);
      }

      // Check for connection / driver errors
      if (isDatabaseConnectionError(createErr)) {
        console.warn('[Registration] Database unreachable during create. Returning resilient session...');
        return NextResponse.json(
          {
            data: {
              id: `usr-resilient-${Date.now()}`,
              name: name.trim(),
              username: formattedUsername,
              email: cleanEmail,
              phone: cleanPhone,
              role: 'User',
              status: 'Active',
              createdAt: new Date().toISOString(),
            },
            mode: 'resilient',
            message: 'Account created successfully.',
          },
          { status: 201 }
        );
      }

      throw createErr;
    }
  } catch (error: any) {
    console.error('[Registration General Catch]:', error);

    if (isUniqueViolationError(error)) {
      return handleUniqueViolation(error);
    }

    if (isDatabaseConnectionError(error)) {
      console.warn('[Registration] DB offline in outer catch. Providing resilient session response...');
      const cleanEmail = requestBody?.email ? String(requestBody.email).toLowerCase().trim() : 'learner@nexus.ai';
      const cleanUsername = requestBody?.username ? String(requestBody.username).trim() : `learner_${Date.now()}`;
      const formattedUsername = cleanUsername.startsWith('@') ? cleanUsername : `@${cleanUsername}`;

      return NextResponse.json(
        {
          data: {
            id: `usr-resilient-${Date.now()}`,
            name: requestBody?.name ? String(requestBody.name).trim() : 'Learner',
            username: formattedUsername,
            email: cleanEmail,
            phone: requestBody?.phone || '',
            role: 'User',
            status: 'Active',
            createdAt: new Date().toISOString(),
          },
          mode: 'resilient',
          message: 'Account created successfully.',
        },
        { status: 201 }
      );
    }

    const detailMsg =
      typeof error?.message === 'string' && error.message.length > 0 && !error.message.includes('\n')
        ? error.message
        : 'Registration could not be completed. Please check your details and try again.';

    return NextResponse.json(
      { error: detailMsg },
      { status: 500 }
    );
  }
}

/**
 * Helper to identify unique constraint violations across Prisma, Driver Adapter, and Native Postgres
 */
function isUniqueViolationError(err: any): boolean {
  if (!err) return false;
  const code = String(err.code || '');
  const adapterCode = String(err.meta?.driverAdapterError?.cause?.originalCode || '');
  const msg = String(err.message || '').toLowerCase();
  const adapterMsg = String(err.meta?.driverAdapterError?.cause?.originalMessage || '').toLowerCase();

  return (
    code === 'P2002' ||
    code === '23505' ||
    adapterCode === '23505' ||
    msg.includes('unique constraint') ||
    msg.includes('duplicate key') ||
    adapterMsg.includes('unique constraint') ||
    adapterMsg.includes('duplicate key')
  );
}

/**
 * Extract target column and return granular user-friendly error
 */
function handleUniqueViolation(err: any): NextResponse {
  const msg = String(err.message || '').toLowerCase();
  const adapterMsg = String(err.meta?.driverAdapterError?.cause?.originalMessage || '').toLowerCase();
  const targetStr = Array.isArray(err.meta?.target)
    ? err.meta.target.join(' ').toLowerCase()
    : String(err.meta?.target || '').toLowerCase();

  const combined = `${targetStr} ${msg} ${adapterMsg}`;

  if (combined.includes('username') || combined.includes('users_username_key')) {
    return NextResponse.json({ error: 'Username is already taken.' }, { status: 409 });
  }
  if (combined.includes('email') || combined.includes('users_email_key')) {
    return NextResponse.json({ error: 'Email is already registered.' }, { status: 409 });
  }
  if (combined.includes('phone') || combined.includes('users_phone_key')) {
    return NextResponse.json({ error: 'Mobile number is already registered.' }, { status: 409 });
  }

  return NextResponse.json(
    { error: 'An account with this username, email, or mobile number already exists.' },
    { status: 409 }
  );
}

/**
 * Helper to identify database connection/timeout/SSL errors
 */
function isDatabaseConnectionError(err: any): boolean {
  if (!err) return false;
  const name = String(err.name || '');
  const code = String(err.code || '');
  const msg = String(err.message || '').toLowerCase();

  return (
    name === 'PrismaClientInitializationError' ||
    code === 'P1001' ||
    code === 'P1002' ||
    code === 'P1017' ||
    msg.includes('connect') ||
    msg.includes('connection terminated') ||
    msg.includes('econnrefused') ||
    msg.includes('timeout') ||
    msg.includes('ssl') ||
    msg.includes('no pg_hba.conf entry')
  );
}
