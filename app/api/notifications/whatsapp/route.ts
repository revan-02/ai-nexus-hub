import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { sendWhatsApp } from '@/services/communication-service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { to, message, templateName, templateData, provider } = body;

    if (!to) {
      return NextResponse.json(
        { success: false, error: 'Recipient phone number ("to") is required.' },
        { status: 400 }
      );
    }

    const result = await sendWhatsApp({
      to,
      message,
      templateName,
      templateData,
      provider,
      userId: session?.user?.id || undefined,
    });

    return NextResponse.json({
      success: true,
      message: `WhatsApp message dispatched to ${to}`,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in /api/notifications/whatsapp:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to dispatch WhatsApp message' },
      { status: 500 }
    );
  }
}
