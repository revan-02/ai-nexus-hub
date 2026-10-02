import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { CheckoutModal } from '@/components/payments/checkout-modal';
import {
  calculatePricingBreakdown,
  createPaymentOrder,
  verifyPaymentAndEnroll,
} from '@/services/payment-service';
import { POST as createOrderRoute } from '@/app/api/payments/create-order/route';
import { POST as verifyPaymentRoute } from '@/app/api/payments/verify/route';
import { NextRequest } from 'next/server';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/courses',
}));

vi.mock('@/lib/auth/auth', () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: 'usr-1', name: 'Dr. Alex Morgan', email: 'alex@nexus.ai', role: 'User' },
  }),
}));

vi.mock('@/lib/db/prisma', () => ({
  default: {
    userCourseProgress: {
      upsert: vi.fn().mockResolvedValue({ id: 'ucp-1', status: 'Published' }),
    },
  },
}));

vi.mock('@/services/audit-service', () => ({
  createAuditLog: vi.fn().mockResolvedValue({ id: 'audit-1' }),
}));

describe('Payment Gateway Integration & Checkout Flow Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Payment Service & Pricing Engine', () => {
    it('calculates correct pricing breakdown without coupon', () => {
      const pricing = calculatePricingBreakdown(5000, undefined, 'INR');
      expect(pricing.originalPrice).toBe(5000);
      expect(pricing.discountAmount).toBe(0);
      expect(pricing.subtotal).toBe(5000);
      expect(pricing.taxAmount).toBe(900); // 18% of 5000
      expect(pricing.totalAmount).toBe(5900);
    });

    it('applies 50% discount coupon correctly (NEXUS50)', () => {
      const pricing = calculatePricingBreakdown(4000, 'NEXUS50', 'INR');
      expect(pricing.originalPrice).toBe(4000);
      expect(pricing.discountAmount).toBe(2000);
      expect(pricing.subtotal).toBe(2000);
      expect(pricing.taxAmount).toBe(360); // 18% of 2000
      expect(pricing.totalAmount).toBe(2360);
    });

    it('creates Razorpay payment order with keyId', async () => {
      const order = await createPaymentOrder({
        courseId: 'course-dl-1',
        courseTitle: 'Deep Learning Specialization',
        amount: 3000,
        currency: 'INR',
        gateway: 'razorpay',
        user: { id: 'usr-1', name: 'Alex', email: 'alex@nexus.ai' },
      });

      expect(order.orderId).toContain('order_rzp_');
      expect(order.currency).toBe('INR');
      expect(order.gateway).toBe('razorpay');
      expect(order.keyId).toBeDefined();
    });

    it('creates Stripe checkout session order with publishableKey', async () => {
      const order = await createPaymentOrder({
        courseId: 'course-dl-1',
        courseTitle: 'Deep Learning Specialization',
        amount: 49,
        currency: 'USD',
        gateway: 'stripe',
        user: { id: 'usr-1', name: 'Alex', email: 'alex@nexus.ai' },
      });

      expect(order.orderId).toContain('cs_test_');
      expect(order.currency).toBe('USD');
      expect(order.gateway).toBe('stripe');
      expect(order.publishableKey).toBeDefined();
    });

    it('verifies payment and returns tax invoice receipt', async () => {
      const receipt = await verifyPaymentAndEnroll({
        orderId: 'order_rzp_123',
        paymentId: 'pay_98765',
        gateway: 'razorpay',
        courseId: 'course-dl-1',
        courseTitle: 'Deep Learning Specialization',
        amount: 3540,
        currency: 'INR',
        paymentMethod: 'UPI / GPay',
        user: { id: 'usr-1', name: 'Alex Morgan', email: 'alex@nexus.ai' },
      });

      expect(receipt.invoiceNumber).toMatch(/^INV-\d{4}-\d+/);
      expect(receipt.status).toBe('Captured');
      expect(receipt.gateway).toBe('Razorpay');
      expect(receipt.amount).toBe(3540);
    });

    it('calculates 100% discount with zero tax for VTU100 promo code', () => {
      const pricing = calculatePricingBreakdown(2999, 'VTU100', 'INR');
      expect(pricing.discountAmount).toBe(2999);
      expect(pricing.subtotal).toBe(0);
      expect(pricing.taxAmount).toBe(0);
      expect(pricing.totalAmount).toBe(0);
    });

    it('handles invalid coupon gracefully by maintaining full price', () => {
      const pricing = calculatePricingBreakdown(2000, 'INVALID_CODE', 'INR');
      expect(pricing.discountAmount).toBe(0);
      expect(pricing.subtotal).toBe(2000);
      expect(pricing.totalAmount).toBe(2360); // 2000 + 18% GST (360)
    });
  });

  describe('2. Payment Gateway API Routes', () => {
    it('creates an order via /api/payments/create-order', async () => {
      const req = new NextRequest('http://localhost:3000/api/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          courseId: 'course-test-1',
          courseTitle: 'AI Agents Architecture',
          amount: 2500,
          currency: 'INR',
          gateway: 'razorpay',
        }),
      });

      const res = await createOrderRoute(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.orderId).toContain('order_rzp_');
    });

    it('rejects order creation without courseId with 400 status', async () => {
      const req = new NextRequest('http://localhost:3000/api/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          amount: 2500,
        }),
      });

      const res = await createOrderRoute(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error).toContain('courseId is required');
    });

    it('verifies payment via /api/payments/verify', async () => {
      const req = new NextRequest('http://localhost:3000/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          orderId: 'order_test_123',
          paymentId: 'pay_test_999',
          gateway: 'razorpay',
          courseId: 'course-test-1',
          amount: 2950,
          currency: 'INR',
        }),
      });

      const res = await verifyPaymentRoute(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.invoiceNumber).toBeDefined();
    });

    it('rejects verification with missing paymentId with 400 status', async () => {
      const req = new NextRequest('http://localhost:3000/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          orderId: 'order_test_123',
        }),
      });

      const res = await verifyPaymentRoute(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error).toContain('required for payment verification');
    });
  });

  describe('3. CheckoutModal Frontend Component', () => {
    const mockCourse = {
      id: 'course-llm-101',
      title: 'LLM Fine-Tuning & Quantization Masterclass',
      price: '₹3,999',
      level: 'Advanced',
      duration: '32h Masterclass',
    };

    it('renders course details, price breakdown, and payment methods in CheckoutModal', () => {
      render(
        <CheckoutModal
          isOpen={true}
          onClose={vi.fn()}
          course={mockCourse}
        />
      );

      expect(screen.getByText('LLM Fine-Tuning & Quantization Masterclass')).toBeInTheDocument();
      expect(screen.getByText('Razorpay (India / UPI)')).toBeInTheDocument();
      expect(screen.getByText('Stripe (Global Cards)')).toBeInTheDocument();
      expect(screen.getByText(/UPI & QR Code/i)).toBeInTheDocument();
      expect(screen.getByText(/Instant Sandbox Test Payment/i)).toBeInTheDocument();
    });

    it('allows switching to Stripe Global Cards tab', () => {
      render(
        <CheckoutModal
          isOpen={true}
          onClose={vi.fn()}
          course={mockCourse}
        />
      );

      const stripeTabBtn = screen.getByText('Stripe (Global Cards)');
      fireEvent.click(stripeTabBtn);

      expect(screen.getByText('Cardholder Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('4242 •••• •••• 4242')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('MM/YY')).toBeInTheDocument();
    });

    it('executes sandbox test payment and displays confirmed receipt screen', async () => {
      // Mock global fetch for order and verification calls
      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          json: async () => ({
            success: true,
            data: { orderId: 'order_rzp_mock_123', totalAmount: 4718 },
          }),
        })
        .mockResolvedValueOnce({
          json: async () => ({
            success: true,
            data: {
              invoiceNumber: 'INV-2026-884219',
              transactionId: 'TXN-9824XJA',
              orderId: 'order_rzp_mock_123',
              paymentId: 'pay_sandbox_123',
              gateway: 'Razorpay',
              paymentMethod: 'UPI / GPay',
              courseTitle: mockCourse.title,
              amount: 4718,
              currency: 'INR',
              timestamp: 'Oct 2, 2026, 10:45 PM',
              status: 'Captured',
            },
          }),
        });

      global.fetch = mockFetch as unknown as typeof fetch;

      const handleSuccess = vi.fn();

      render(
        <CheckoutModal
          isOpen={true}
          onClose={vi.fn()}
          course={mockCourse}
          onSuccess={handleSuccess}
        />
      );

      const sandboxBtn = screen.getByText(/⚡ Instant Sandbox Test Payment/i);
      fireEvent.click(sandboxBtn);

      await waitFor(() => {
        expect(screen.getByText('Payment Confirmed!')).toBeInTheDocument();
      }, { timeout: 3500 });

      expect(screen.getByText('INV-2026-884219')).toBeInTheDocument();
      expect(screen.getByText('TXN-9824XJA')).toBeInTheDocument();
      expect(screen.getByText('Download Invoice PDF / TXT')).toBeInTheDocument();
      expect(screen.getByText('Start Learning Now')).toBeInTheDocument();
      expect(handleSuccess).toHaveBeenCalled();
    });
  });
});
