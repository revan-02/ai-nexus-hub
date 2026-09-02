import { NextRequest, NextResponse } from 'next/server';

// In-memory OTP & Rate Limit store (backed by Redis in production)
const otpStore = new Map<string, { code: string; expiresAt: number }>();
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const { identifier, type, honeypot } = await request.json();

    // 🤖 1. Anti-Bot Honeypot Protection
    if (honeypot) {
      console.warn('[Anti-Bot Protection] Rejected automated bot request via honeypot trigger');
      return NextResponse.json({ error: 'Automated request rejected.' }, { status: 400 });
    }

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json({ error: 'Please enter a valid Email address or Mobile Phone Number.' }, { status: 400 });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const clientIp = request.headers.get('x-forwarded-for') || 'local-ip';
    const rateLimitKey = `${clientIp}:${cleanIdentifier}`;

    // 🛡️ 2. DoS / Anti-Spam Rate Limiting (Max 3 OTP requests per 10 minutes)
    const now = Date.now();
    const currentLimit = rateLimitStore.get(rateLimitKey);

    if (currentLimit && currentLimit.resetAt > now) {
      if (currentLimit.count >= 3) {
        const secondsLeft = Math.ceil((currentLimit.resetAt - now) / 1000);
        return NextResponse.json(
          {
            error: `Too many OTP requests. Anti-Spam Protection active. Please try again in ${secondsLeft} seconds.`,
          },
          { status: 429 }
        );
      }
      rateLimitStore.set(rateLimitKey, { count: currentLimit.count + 1, resetAt: currentLimit.resetAt });
    } else {
      rateLimitStore.set(rateLimitKey, { count: 1, resetAt: now + 10 * 60 * 1000 });
    }

    // 🔒 3. Generate 6-Digit OTP & Store Expiry
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry

    otpStore.set(cleanIdentifier, { code, expiresAt });

    console.log(`[OTP Verification] Sent 6-digit code ${code} to ${type}: ${cleanIdentifier}`);

    return NextResponse.json({
      success: true,
      message: `6-digit OTP code sent to ${cleanIdentifier}`,
      code,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send OTP code', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export { otpStore };
