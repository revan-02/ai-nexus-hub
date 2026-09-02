import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from '@/app/api/settings/email-whatsapp/route';
import { NextRequest } from 'next/server';

describe('Email & WhatsApp Business Communication Settings API', () => {
  it('GET returns default SendGrid and Meta WhatsApp settings', async () => {
    const res = await GET();
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data.email.provider).toBe('SendGrid');
    expect(json.data.email.senderEmail).toBe('billing@nexusai.education');
    expect(json.data.whatsapp.provider).toBe('Meta WhatsApp Cloud API');
    expect(json.data.whatsapp.phoneNumberId).toBe('109824819204918');
  });

  it('POST handles test email and test whatsapp dispatch triggers', async () => {
    const testEmailReq = new NextRequest('http://localhost:3000/api/settings/email-whatsapp', {
      method: 'POST',
      body: JSON.stringify({ action: 'test_email', targetEmail: 'admin@nexusai.education' }),
    });
    const emailRes = await POST(testEmailReq);
    const emailJson = await emailRes.json();

    expect(emailJson.success).toBe(true);
    expect(emailJson.message).toContain('Test invoice email successfully sent');

    const testWhatsAppReq = new NextRequest('http://localhost:3000/api/settings/email-whatsapp', {
      method: 'POST',
      body: JSON.stringify({ action: 'test_whatsapp', targetPhone: '+91 98450 12345' }),
    });
    const waRes = await POST(testWhatsAppReq);
    const waJson = await waRes.json();

    expect(waJson.success).toBe(true);
    expect(waJson.message).toContain('Test WhatsApp payment reminder template dispatched');
  });

  it('POST updates email and whatsapp API keys and credentials', async () => {
    const updateReq = new NextRequest('http://localhost:3000/api/settings/email-whatsapp', {
      method: 'POST',
      body: JSON.stringify({
        email: { senderName: 'Nexus Global Billing' },
        whatsapp: { senderPhoneNumber: '+91 80 1234 5678' },
      }),
    });
    const res = await POST(updateReq);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data.email.senderName).toBe('Nexus Global Billing');
    expect(json.data.whatsapp.senderPhoneNumber).toBe('+91 80 1234 5678');
  });
});
