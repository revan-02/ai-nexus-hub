import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth/auth', () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: 'usr-comm-test', name: 'Tester', email: 'test@nexusai.education' },
  }),
}));

vi.mock('@/lib/db/prisma', () => ({
  default: {
    auditLog: {
      create: vi.fn().mockResolvedValue({ id: 'log-1' }),
    },
  },
}));

import {
  buildEmailTemplate,
  buildSMSTemplate,
  sendEmail,
  sendSMS,
  sendWhatsApp,
  sendOmniChannel,
} from '@/services/communication-service';
import { POST as emailRoutePOST } from '@/app/api/notifications/email/route';
import { POST as smsRoutePOST } from '@/app/api/notifications/sms/route';
import { POST as whatsappRoutePOST } from '@/app/api/notifications/whatsapp/route';
import { POST as sendOmniRoutePOST } from '@/app/api/notifications/send/route';
import { POST as settingsPOST } from '@/app/api/settings/email-whatsapp/route';

describe('Multi-Provider Communication Service & Notification APIs', () => {
  describe('1. Email & SMS Template Generators', () => {
    it('generates rich HTML & text invoice email template with tax breakdown', () => {
      const template = buildEmailTemplate('invoice_receipt', {
        customerName: 'Alan Turing',
        invoiceNumber: 'INV-2026-994812',
        courseTitle: 'Full-Stack Agentic AI Engineering',
        amount: 2999,
        taxAmount: 540,
        currency: 'INR',
        gateway: 'Razorpay',
        paymentMethod: 'UPI',
        transactionId: 'TXN-9842187',
      });

      expect(template.subject).toContain('Tax Invoice #INV-2026-994812');
      expect(template.html).toContain('Alan Turing');
      expect(template.html).toContain('Full-Stack Agentic AI Engineering');
      expect(template.html).toContain('₹2,999');
      expect(template.html).toContain('₹540');
      expect(template.html).toContain('Start Learning Now');
      expect(template.text).toContain('INV-2026-994812');
    });

    it('generates 6-digit security OTP email template', () => {
      const template = buildEmailTemplate('auth_otp', {
        code: '849102',
      });

      expect(template.subject).toContain('Security Verification Code');
      expect(template.html).toContain('849102');
      expect(template.html).toContain('expire in 10 minutes');
      expect(template.text).toContain('849102');
    });

    it('generates welcoming onboarding email template', () => {
      const template = buildEmailTemplate('welcome_onboarding', {
        name: 'Grace Hopper',
      });

      expect(template.subject).toContain('Welcome to Nexus AI Hub');
      expect(template.html).toContain('Grace Hopper');
      expect(template.html).toContain('Autonomous AI Agent Collaborative Rooms');
    });

    it('generates SMS verification OTP and order confirmation texts', () => {
      const otpMsg = buildSMSTemplate('otp', { code: '554129' });
      expect(otpMsg).toContain('554129');
      expect(otpMsg).toContain('Nexus AI: Your security verification code');

      const orderMsg = buildSMSTemplate('order_confirmation', {
        amount: 3499,
        currency: 'INR',
        courseTitle: 'LLM Fine-Tuning Bootcamp',
        invoiceNumber: 'INV-2026-102',
      });
      expect(orderMsg).toContain('₹3,499');
      expect(orderMsg).toContain('LLM Fine-Tuning Bootcamp');
      expect(orderMsg).toContain('INV-2026-102');
    });
  });

  describe('2. Direct Communication Dispatchers (Sandbox Simulation & Logging)', () => {
    it('dispatches email and returns simulated delivery receipt', async () => {
      const res = await sendEmail({
        to: 'student@nexusai.education',
        template: 'invoice_receipt',
        templateData: {
          customerName: 'Ada Lovelace',
          courseTitle: 'Deep Reinforcement Learning',
          amount: 1999,
          currency: 'INR',
        },
      });

      expect(res.success).toBe(true);
      expect(res.recipient).toBe('student@nexusai.education');
      expect(res.channel).toBe('email');
      expect(res.status).toBe('simulated');
      expect(res.messageId).toContain('email_sandbox_');
    });

    it('dispatches SMS and returns E.164 simulated delivery receipt', async () => {
      const res = await sendSMS({
        to: '+91 98765 43210',
        template: 'otp',
        templateData: { code: '716253' },
      });

      expect(res.success).toBe(true);
      expect(res.recipient).toBe('+919876543210');
      expect(res.channel).toBe('sms');
      expect(res.status).toBe('simulated');
      expect(res.messageId).toContain('SM_sandbox_');
    });

    it('dispatches WhatsApp notification and returns delivery confirmation', async () => {
      const res = await sendWhatsApp({
        to: '+91 98450 11223',
        templateName: 'payment_reminder_v2',
        templateData: {
          customerName: 'Nikola Tesla',
          courseTitle: 'Quantum AI Systems',
          amount: 4999,
          currency: 'INR',
        },
      });

      expect(res.success).toBe(true);
      expect(res.channel).toBe('whatsapp');
      expect(res.status).toBe('simulated');
      expect(res.messageId).toContain('wamid_sandbox_');
    });

    it('orchestrates multi-channel broadcast across Email, SMS, and WhatsApp', async () => {
      const omniRes = await sendOmniChannel({
        recipient: {
          name: 'Claude Shannon',
          email: 'claude@nexusai.education',
          phone: '+15005550006',
        },
        channels: ['email', 'sms', 'whatsapp'],
        template: 'invoice_receipt',
        data: {
          courseTitle: 'Information Theory & Transformer Entropy',
          amount: 99,
          currency: 'USD',
          invoiceNumber: 'INV-2026-US-01',
        },
      });

      expect(omniRes.success).toBe(true);
      expect(omniRes.results.email.success).toBe(true);
      expect(omniRes.results.sms.success).toBe(true);
      expect(omniRes.results.whatsapp.success).toBe(true);
    });
  });

  describe('3. Notification API Endpoints', () => {
    it('POST /api/notifications/email dispatches transactional email', async () => {
      const req = new NextRequest('http://localhost:3000/api/notifications/email', {
        method: 'POST',
        body: JSON.stringify({
          to: 'engineer@nexusai.education',
          template: 'welcome_onboarding',
          templateData: { name: 'Dev Engineer' },
        }),
      });

      const res = await emailRoutePOST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.message).toContain('engineer@nexusai.education');
      expect(json.data.channel).toBe('email');
    });

    it('POST /api/notifications/email validates required recipient address', async () => {
      const req = new NextRequest('http://localhost:3000/api/notifications/email', {
        method: 'POST',
        body: JSON.stringify({ subject: 'No recipient' }),
      });

      const res = await emailRoutePOST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error).toContain('Recipient email address');
    });

    it('POST /api/notifications/sms dispatches mobile SMS alert', async () => {
      const req = new NextRequest('http://localhost:3000/api/notifications/sms', {
        method: 'POST',
        body: JSON.stringify({
          to: '+919988776655',
          template: 'otp',
          templateData: { code: '918234' },
        }),
      });

      const res = await smsRoutePOST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.message).toContain('+919988776655');
      expect(json.data.channel).toBe('sms');
    });

    it('POST /api/notifications/whatsapp dispatches WhatsApp message', async () => {
      const req = new NextRequest('http://localhost:3000/api/notifications/whatsapp', {
        method: 'POST',
        body: JSON.stringify({
          to: '+919988776655',
          message: 'Your AI agent cluster is ready.',
        }),
      });

      const res = await whatsappRoutePOST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.channel).toBe('whatsapp');
    });

    it('POST /api/notifications/send dispatches unified omnichannel notification', async () => {
      const req = new NextRequest('http://localhost:3000/api/notifications/send', {
        method: 'POST',
        body: JSON.stringify({
          recipient: {
            name: 'Linus Torvalds',
            email: 'linus@nexusai.education',
            phone: '+1 415 555 2671',
          },
          channels: ['email', 'sms'],
          template: 'invoice_receipt',
          data: {
            courseTitle: 'Linux Kernel & C Deep Learning Runtime',
            amount: 4500,
            currency: 'INR',
          },
        }),
      });

      const res = await sendOmniRoutePOST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.email).toBeDefined();
      expect(json.data.sms).toBeDefined();
    });

    it('handles test_sms in /api/settings/email-whatsapp', async () => {
      const req = new NextRequest('http://localhost:3000/api/settings/email-whatsapp', {
        method: 'POST',
        body: JSON.stringify({
          action: 'test_sms',
          targetPhone: '+91 98450 99887',
        }),
      });

      const res = await settingsPOST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.message).toContain('Test SMS verification code successfully sent');
    });
  });
});
