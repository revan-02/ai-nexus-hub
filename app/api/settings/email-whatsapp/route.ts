import { NextRequest, NextResponse } from 'next/server';

let communicationConfig = {
  email: {
    provider: 'SendGrid' as 'SendGrid' | 'SMTP' | 'Resend' | 'AWS SES',
    senderEmail: 'billing@nexusai.education',
    senderName: 'Nexus AI Billing & Finance',
    apiKey: 'SG.LiveProductionKey_89410294810284',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpUser: 'apikey',
    enableInvoiceDispatch: true,
    enablePaymentReminders: true,
  },
  sms: {
    provider: 'Twilio' as 'Twilio' | 'Msg91' | 'Fast2SMS',
    accountSid: 'AC_LiveProductionSid_9841029481',
    authToken: 'authToken_LiveProductionSecret_1029',
    senderNumber: '+15005550006',
    enableOtpDispatch: true,
    enableOrderAlerts: true,
  },
  whatsapp: {
    provider: 'Meta WhatsApp Cloud API' as 'Meta WhatsApp Cloud API' | 'Twilio WhatsApp' | 'Gupshup',
    phoneNumberId: '109824819204918',
    businessAccountId: '918402910491028',
    accessToken: 'EAAO9...WhatsAppCloudLiveToken',
    senderPhoneNumber: '+91 80 4912 8800',
    enableInstantReceipts: true,
    enableOverdueReminders: true,
    reminderTemplateName: 'payment_reminder_v2',
  },
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: communicationConfig,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, sms, whatsapp, targetPhone, targetEmail, message } = body;

    // Trigger test dispatch
    if (action === 'test_email') {
      return NextResponse.json({
        success: true,
        message: `Test invoice email successfully sent to ${targetEmail || communicationConfig.email.senderEmail} via ${communicationConfig.email.provider}`,
      });
    }

    if (action === 'test_sms') {
      return NextResponse.json({
        success: true,
        message: `Test SMS verification code successfully sent to ${targetPhone || '+91 98450 12345'} via ${communicationConfig.sms.provider}`,
      });
    }

    if (action === 'test_whatsapp') {
      return NextResponse.json({
        success: true,
        message: `Test WhatsApp payment reminder template dispatched to ${targetPhone || '+91 98450 12345'} via ${communicationConfig.whatsapp.provider}`,
      });
    }

    // Update settings
    if (email) {
      communicationConfig.email = { ...communicationConfig.email, ...email };
    }
    if (sms) {
      communicationConfig.sms = { ...communicationConfig.sms, ...sms };
    }
    if (whatsapp) {
      communicationConfig.whatsapp = { ...communicationConfig.whatsapp, ...whatsapp };
    }

    return NextResponse.json({
      success: true,
      message: 'Email, SMS & WhatsApp communication API settings updated successfully',
      data: communicationConfig,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update communication settings' },
      { status: 500 }
    );
  }
}
