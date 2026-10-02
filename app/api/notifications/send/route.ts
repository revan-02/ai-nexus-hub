import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { sendOmniChannel } from '@/services/communication-service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { recipient, channels, subject, template, data } = body;

    if (!recipient || (!recipient.email && !recipient.phone)) {
      return NextResponse.json(
        { success: false, error: 'Recipient with at least an email or phone number is required.' },
        { status: 400 }
      );
    }

    const payload = {
      recipient: {
        id: session?.user?.id || recipient.id,
        name: recipient.name || session?.user?.name || 'Learner',
        email: recipient.email,
        phone: recipient.phone,
      },
      channels: channels || ['email', 'sms'],
      subject,
      template: template || 'invoice_receipt',
      data: data || {},
    };

    const result = await sendOmniChannel(payload);

    return NextResponse.json({
      success: result.success,
      message: 'Omnichannel notification processed',
      data: result.results,
    });
  } catch (error: any) {
    console.error('Error in /api/notifications/send:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to dispatch omnichannel notification' },
      { status: 500 }
    );
  }
}
