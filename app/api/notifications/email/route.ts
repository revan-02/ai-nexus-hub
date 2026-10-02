import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { sendEmail } from '@/services/communication-service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { to, subject, html, text, template, templateData } = body;

    if (!to) {
      return NextResponse.json(
        { success: false, error: 'Recipient email address ("to") is required.' },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to,
      subject,
      html,
      text,
      template,
      templateData,
      userId: session?.user?.id || undefined,
    });

    return NextResponse.json({
      success: true,
      message: `Email dispatched to ${Array.isArray(to) ? to.join(', ') : to}`,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in /api/notifications/email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to dispatch email' },
      { status: 500 }
    );
  }
}
