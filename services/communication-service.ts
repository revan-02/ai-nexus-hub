import { createAuditLog } from '@/services/audit-service';

export type EmailProvider = 'resend' | 'sendgrid' | 'smtp' | 'ses';
export type SMSProvider = 'twilio' | 'msg91' | 'fast2sms';
export type WhatsAppProvider = 'meta' | 'twilio' | 'gupshup';

export interface EmailPayload {
  to: string | string[];
  subject?: string;
  html?: string;
  text?: string;
  from?: string;
  template?: 'invoice_receipt' | 'welcome_onboarding' | 'auth_otp' | 'course_enrolled' | 'password_reset' | 'payment_reminder';
  templateData?: Record<string, any>;
  userId?: string;
}

export interface SMSPayload {
  to: string;
  message?: string;
  template?: 'otp' | 'order_confirmation' | 'payment_reminder';
  templateData?: Record<string, any>;
  provider?: SMSProvider;
  userId?: string;
}

export interface WhatsAppPayload {
  to: string;
  message?: string;
  templateName?: string;
  templateData?: Record<string, any>;
  provider?: WhatsAppProvider;
  userId?: string;
}

export interface OmniChannelPayload {
  recipient: {
    email?: string;
    phone?: string;
    name?: string;
    id?: string;
  };
  channels?: Array<'email' | 'sms' | 'whatsapp'>;
  subject?: string;
  template: 'invoice_receipt' | 'auth_otp' | 'welcome_onboarding' | 'course_enrolled' | 'payment_reminder';
  data: Record<string, any>;
}

export interface DispatchResult {
  success: boolean;
  messageId: string;
  channel: 'email' | 'sms' | 'whatsapp';
  provider: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'queued' | 'simulated';
  timestamp: string;
  error?: string;
}

/**
 * 1. Email HTML & Plaintext Template Generator
 */
export function buildEmailTemplate(template: string, data: Record<string, any>): { subject: string; html: string; text: string } {
  const brandName = 'Nexus AI Hub';
  const supportEmail = 'support@nexusai.education';
  const portalUrl = 'https://nexusai.education';

  switch (template) {
    case 'invoice_receipt': {
      const subject = `Payment Confirmation & Tax Invoice #${data.invoiceNumber || 'INV-2026'}`;
      const amountFormatted = `${data.currency === 'INR' ? '₹' : '$'}${Number(data.amount || 0).toLocaleString()}`;
      const taxFormatted = `${data.currency === 'INR' ? '₹' : '$'}${Number(data.taxAmount || 0).toLocaleString()}`;
      
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #090d16; color: #f1f5f9; padding: 24px; margin: 0; }
    .card { max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0; color: #e9d5ff; font-size: 14px; }
    .content { padding: 28px 24px; }
    .receipt-box { background: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px solid #1e293b; }
    .row:last-child { border-bottom: none; font-weight: bold; font-size: 15px; color: #a855f7; }
    .btn { display: inline-block; background: #7c3aed; color: #ffffff; text-decoration: none; font-weight: 700; padding: 14px 28px; border-radius: 10px; margin-top: 24px; text-align: center; }
    .footer { padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>${brandName}</h1>
      <p>Official Payment Receipt & Tax Invoice</p>
    </div>
    <div class="content">
      <p>Hello <strong>${data.customerName || 'Valued Learner'}</strong>,</p>
      <p>Thank you for enrolling in <strong>${data.courseTitle || 'Advanced AI Engineering Certification'}</strong>. Your payment has been successfully captured.</p>
      
      <div class="receipt-box">
        <div class="row"><span>Invoice Number:</span><span><strong>${data.invoiceNumber || 'INV-2026-001'}</strong></span></div>
        <div class="row"><span>Transaction ID:</span><span style="font-family: monospace;">${data.transactionId || data.paymentId || 'TXN-SUCCESS'}</span></div>
        <div class="row"><span>Payment Method:</span><span>${data.gateway || 'Razorpay'} (${data.paymentMethod || 'UPI / Card'})</span></div>
        <div class="row"><span>Course:</span><span>${data.courseTitle || 'AI Course'}</span></div>
        <div class="row"><span>Taxes & GST:</span><span>${taxFormatted}</span></div>
        <div class="row"><span>Total Amount Paid:</span><span>${amountFormatted}</span></div>
      </div>

      <div style="text-align: center;">
        <a href="${portalUrl}/learn/room-1" class="btn">Start Learning Now &rarr;</a>
      </div>
    </div>
    <div class="footer">
      &copy; 2026 ${brandName}. All rights reserved.<br>
      Questions? Contact our billing team at ${supportEmail}
    </div>
  </div>
</body>
</html>`;

      const text = `Official Tax Invoice - ${brandName}\n\n` +
        `Hello ${data.customerName || 'Valued Learner'},\n` +
        `Payment confirmed for: ${data.courseTitle}\n` +
        `Invoice #: ${data.invoiceNumber}\n` +
        `Transaction ID: ${data.transactionId || data.paymentId}\n` +
        `Total Paid: ${amountFormatted}\n\n` +
        `Start learning now: ${portalUrl}/learn/room-1\n` +
        `Support: ${supportEmail}`;

      return { subject, html, text };
    }

    case 'auth_otp': {
      const subject = `Your ${brandName} Security Verification Code`;
      const code = data.code || '123456';
      
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #090d16; color: #f1f5f9; padding: 24px; }
    .card { max-width: 480px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; text-align: center; }
    .code-badge { font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #c084fc; background: #1e1b4b; padding: 16px 24px; border-radius: 12px; border: 1px solid #6b21a8; display: inline-block; margin: 24px 0; font-family: monospace; }
    .footer { font-size: 11px; color: #64748b; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="margin: 0; color: #fff;">Account Verification</h2>
    <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Use the 6-digit one-time passcode below to verify your session.</p>
    <div class="code-badge">${code}</div>
    <p style="color: #94a3b8; font-size: 12px;">This code will expire in 10 minutes. If you did not request this code, you can safely ignore this email.</p>
    <div class="footer">&copy; 2026 ${brandName}. Automated Security System.</div>
  </div>
</body>
</html>`;

      const text = `${brandName} Verification Code: ${code}\nValid for 10 minutes. Do not share this code with anyone.`;
      return { subject, html, text };
    }

    case 'welcome_onboarding': {
      const subject = `Welcome to ${brandName} - Begin Your AI Journey`;
      const name = data.name || 'Pioneer';
      
      const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #090d16; color: #f1f5f9; padding: 24px;">
  <div style="max-width: 540px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px;">
    <h2 style="color: #a855f7; margin-top: 0;">Welcome, ${name}! 🚀</h2>
    <p>You have unlocked full access to the AI Nexus Hub ecosystem, including:</p>
    <ul>
      <li>Autonomous AI Agent Collaborative Rooms</li>
      <li>Local Ollama Deep Math &amp; LLM Studio</li>
      <li>VTU Question Papers &amp; Academic Curricula (Class 5 - PhD)</li>
      <li>Industry Certifications with Cryptographic Anti-Cheat verification</li>
    </ul>
    <p><a href="${portalUrl}/dashboard" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Go to My Dashboard &rarr;</a></p>
  </div>
</body>
</html>`;

      const text = `Welcome to ${brandName}, ${name}!\nAccess your dashboard and courses at ${portalUrl}/dashboard`;
      return { subject, html, text };
    }

    case 'payment_reminder': {
      const subject = `Complete Your Enrollment: ${data.courseTitle || 'Your Course'}`;
      const name = data.customerName || 'Learner';
      const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #090d16; color: #f1f5f9; padding: 24px;">
  <div style="max-width: 540px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px;">
    <h2 style="color: #c084fc; margin-top: 0;">Hi ${name}, your seat is waiting! ⏳</h2>
    <p>We noticed you started enrolling in <strong>${data.courseTitle || 'Advanced AI Engineering'}</strong>. Your scholarship discount is currently reserved.</p>
    <p>Complete your checkout now to secure your certification roadmap:</p>
    <p><a href="${portalUrl}/courses" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Complete Checkout Now &rarr;</a></p>
    <p style="font-size:12px;color:#94a3b8;margin-top:24px;">&copy; 2026 ${brandName}. Dedicated to cutting-edge AI learning.</p>
  </div>
</body>
</html>`;
      const text = `Hi ${name},\nYour enrollment in ${data.courseTitle} is waiting.\nComplete checkout now at ${portalUrl}/courses`;
      return { subject, html, text };
    }

    default: {
      const subject = data.subject || `${brandName} Notification`;
      const html = `<div style="font-family: sans-serif; padding: 20px;"><h2>${brandName}</h2><p>${data.message || ''}</p></div>`;
      const text = `${brandName}: ${data.message || ''}`;
      return { subject, html, text };
    }
  }
}

/**
 * 2. SMS Text Template Generator
 */
export function buildSMSTemplate(template: string, data: Record<string, any>): string {
  switch (template) {
    case 'otp':
      return `Nexus AI: Your security verification code is ${data.code || '123456'}. Valid for 10 mins. Do NOT share with anyone.`;
    case 'order_confirmation': {
      const amt = `${data.currency === 'INR' ? '₹' : '$'}${Number(data.amount || 0).toLocaleString()}`;
      return `Nexus AI: Payment of ${amt} received for ${data.courseTitle || 'Course'}. Order #${data.invoiceNumber || data.orderId}. Start: https://nexusai.education/learn`;
    }
    case 'payment_reminder':
      return `Nexus AI Reminder: Your enrollment in ${data.courseTitle || 'AI Program'} is waiting. Complete checkout to secure your student scholarship: https://nexusai.education`;
    default:
      return data.message || `Nexus AI notification: ${JSON.stringify(data)}`;
  }
}

/**
 * 3. Send Email Dispatcher (Resend / SendGrid / SMTP / Sandbox fallback)
 */
export async function sendEmail(payload: EmailPayload): Promise<DispatchResult> {
  const recipient = Array.isArray(payload.to) ? payload.to.join(', ') : payload.to;
  let subject = payload.subject || 'Nexus AI Notification';
  let html = payload.html || '';
  let text = payload.text || '';

  // Render template if specified
  if (payload.template) {
    const rendered = buildEmailTemplate(payload.template, payload.templateData || {});
    subject = payload.subject || rendered.subject;
    html = rendered.html;
    text = rendered.text;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = payload.from || process.env.EMAIL_FROM || 'Nexus AI <notifications@nexusai.education>';

  // Real HTTP dispatch if Resend key is configured
  if (resendApiKey && !resendApiKey.startsWith('re_mock')) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: Array.isArray(payload.to) ? payload.to : [payload.to],
          subject,
          html,
          text,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Resend API returned error');
      }

      if (payload.userId) {
        await createAuditLog({
          userId: payload.userId,
          action: `Dispatched Email to ${recipient} via Resend (${subject})`,
          target: recipient,
          type: 'security',
        });
      }

      return {
        success: true,
        messageId: data.id || `msg_${Date.now()}`,
        channel: 'email',
        provider: 'resend',
        recipient,
        status: 'delivered',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      console.warn('[CommunicationService] Resend live call failed, falling back to simulated sandbox:', err.message);
    }
  }

  // Real HTTP dispatch if SendGrid key is configured
  if (sendgridApiKey && !sendgridApiKey.startsWith('SG.mock')) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sendgridApiKey}`,
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: (Array.isArray(payload.to) ? payload.to : [payload.to]).map((e) => ({ email: e })),
            },
          ],
          from: { email: 'billing@nexusai.education', name: 'Nexus AI Hub' },
          subject,
          content: [
            { type: 'text/html', value: html },
            { type: 'text/plain', value: text },
          ],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`SendGrid API error: ${errorText}`);
      }

      return {
        success: true,
        messageId: `sg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        channel: 'email',
        provider: 'sendgrid',
        recipient,
        status: 'delivered',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      console.warn('[CommunicationService] SendGrid live call failed, falling back to simulated sandbox:', err.message);
    }
  }

  // Development / Sandbox Simulated Dispatch
  const simulatedId = `email_sandbox_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  console.log(`[Email Sandbox Dispatch] To: ${recipient} | Subject: "${subject}" | ID: ${simulatedId}`);

  if (payload.userId) {
    await createAuditLog({
      userId: payload.userId,
      action: `[Sandbox] Dispatched Email to ${recipient} (${subject})`,
      target: recipient,
      type: 'security',
    });
  }

  return {
    success: true,
    messageId: simulatedId,
    channel: 'email',
    provider: 'sandbox-smtp',
    recipient,
    status: 'simulated',
    timestamp: new Date().toISOString(),
  };
}

/**
 * 4. Send SMS Dispatcher (Twilio / Msg91 / Fast2SMS / Sandbox fallback)
 */
export async function sendSMS(payload: SMSPayload): Promise<DispatchResult> {
  const provider = payload.provider || 'twilio';
  const recipient = payload.to.replace(/\s+/g, '');
  
  let bodyMessage = payload.message || '';
  if (payload.template) {
    bodyMessage = buildSMSTemplate(payload.template, payload.templateData || {});
  }
  if (!bodyMessage) {
    bodyMessage = 'Nexus AI automated notification';
  }

  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER || '+15005550006';

  // Real HTTP dispatch if Twilio is configured
  if (provider === 'twilio' && twilioSid && twilioToken && !twilioSid.startsWith('AC_mock')) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const basicAuth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const formData = new URLSearchParams();
      formData.append('To', recipient);
      formData.append('From', twilioFrom);
      formData.append('Body', bodyMessage);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Twilio API failed');
      }

      return {
        success: true,
        messageId: data.sid || `SM_${Date.now()}`,
        channel: 'sms',
        provider: 'twilio',
        recipient,
        status: 'delivered',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      console.warn('[CommunicationService] Twilio live call failed, falling back to simulated sandbox:', err.message);
    }
  }

  // Development / Sandbox Simulated Dispatch
  const simulatedId = `SM_sandbox_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  console.log(`[SMS Sandbox Dispatch] To: ${recipient} | Msg: "${bodyMessage}" | SID: ${simulatedId}`);

  if (payload.userId) {
    await createAuditLog({
      userId: payload.userId,
      action: `[Sandbox] Dispatched SMS to ${recipient} (Template: ${payload.template || 'custom'})`,
      target: recipient,
      type: 'security',
    });
  }

  return {
    success: true,
    messageId: simulatedId,
    channel: 'sms',
    provider: `${provider}-sandbox`,
    recipient,
    status: 'simulated',
    timestamp: new Date().toISOString(),
  };
}

/**
 * 5. Send WhatsApp Dispatcher (Meta Graph API / Twilio WhatsApp / Sandbox fallback)
 */
export async function sendWhatsApp(payload: WhatsAppPayload): Promise<DispatchResult> {
  const provider = payload.provider || 'meta';
  const recipient = payload.to.replace(/[^\d+]/g, '');

  let messageText = payload.message || '';
  if (payload.templateName === 'payment_reminder_v2' || payload.templateData) {
    const data = payload.templateData || {};
    messageText = `*Nexus AI Alert* 🚀\n\nHello *${data.customerName || 'Learner'}*,\n` +
      `Your course *${data.courseTitle || 'Advanced AI Engineering'}* enrollment is confirmed!\n` +
      `Invoice: #${data.invoiceNumber || 'INV-2026'}\n` +
      `Amount: ${data.currency === 'INR' ? '₹' : '$'}${data.amount || '2,999'}\n\n` +
      `Access portal: https://nexusai.education/learn`;
  }
  if (!messageText) {
    messageText = '*Nexus AI Alert* 🚀\n\nAutomated platform notification from AI Nexus Hub.';
  }

  const metaToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '109824819204918';

  // Live Meta Graph API call
  if (provider === 'meta' && metaToken && !metaToken.startsWith('EAAO9_mock')) {
    try {
      const url = `https://graph.facebook.com/v20.0/${metaPhoneId}/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${metaToken}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipient.replace('+', ''),
          type: 'text',
          text: { body: messageText },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Meta WhatsApp API returned error');
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id || `wamid_${Date.now()}`,
        channel: 'whatsapp',
        provider: 'meta-cloud-api',
        recipient,
        status: 'delivered',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      console.warn('[CommunicationService] Meta WhatsApp call failed, falling back to simulated sandbox:', err.message);
    }
  }

  // Development / Sandbox Simulated Dispatch
  const simulatedId = `wamid_sandbox_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  console.log(`[WhatsApp Sandbox Dispatch] To: ${recipient} | Msg: "${messageText.slice(0, 50)}..." | ID: ${simulatedId}`);

  return {
    success: true,
    messageId: simulatedId,
    channel: 'whatsapp',
    provider: `${provider}-sandbox`,
    recipient,
    status: 'simulated',
    timestamp: new Date().toISOString(),
  };
}

/**
 * 6. OmniChannel Orchestrator
 * Dispatches simultaneous confirmations across Email, SMS, and WhatsApp
 */
export async function sendOmniChannel(payload: OmniChannelPayload): Promise<{
  success: boolean;
  results: Record<string, DispatchResult>;
}> {
  const channels = payload.channels || ['email', 'sms', 'whatsapp'];
  const results: Record<string, DispatchResult> = {};

  const promises: Promise<any>[] = [];

  // Email Channel
  if (channels.includes('email') && payload.recipient.email) {
    promises.push(
      sendEmail({
        to: payload.recipient.email,
        subject: payload.subject,
        template: payload.template as any,
        templateData: { ...payload.data, customerName: payload.recipient.name },
        userId: payload.recipient.id,
      }).then((res) => {
        results.email = res;
      })
    );
  }

  // SMS Channel
  if (channels.includes('sms') && payload.recipient.phone) {
    promises.push(
      sendSMS({
        to: payload.recipient.phone,
        template: payload.template === 'auth_otp' ? 'otp' : 'order_confirmation',
        templateData: { ...payload.data, customerName: payload.recipient.name },
        userId: payload.recipient.id,
      }).then((res) => {
        results.sms = res;
      })
    );
  }

  // WhatsApp Channel
  if (channels.includes('whatsapp') && payload.recipient.phone) {
    promises.push(
      sendWhatsApp({
        to: payload.recipient.phone,
        templateName: 'payment_reminder_v2',
        templateData: { ...payload.data, customerName: payload.recipient.name },
        userId: payload.recipient.id,
      }).then((res) => {
        results.whatsapp = res;
      })
    );
  }

  await Promise.allSettled(promises);

  return {
    success: Object.values(results).some((r) => r.success),
    results,
  };
}
