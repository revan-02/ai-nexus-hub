import { describe, it, expect } from 'vitest';
import {
  validateCoupon,
  parsePriceToNumber,
  formatNumberToINR,
  createCoupon,
  toggleCouponStatus,
  deleteCoupon,
  getAllCoupons
} from '@/services/coupon-service';

describe('Coupon & Promo Code Discount Engine', () => {
  it('parses price strings correctly into numeric values', () => {
    expect(parsePriceToNumber('₹4,999')).toBe(4999);
    expect(parsePriceToNumber('₹12,500.50')).toBe(12500.5);
    expect(parsePriceToNumber('Free')).toBe(0);
    expect(parsePriceToNumber('')).toBe(0);
  });

  it('formats numeric amounts to clean INR currency strings', () => {
    expect(formatNumberToINR(4999)).toBe('₹4,999');
    expect(formatNumberToINR(0)).toBe('Free');
    expect(formatNumberToINR(-10)).toBe('Free');
  });

  it('validates and applies percentage coupon (NEXUS50 - 50% Off)', () => {
    const res = validateCoupon('NEXUS50', '₹4,000');
    expect(res.isValid).toBe(true);
    expect(res.originalPrice).toBe(4000);
    expect(res.discountAmount).toBe(2000);
    expect(res.finalPrice).toBe(2000);
    expect(res.formattedDiscount).toContain('50% OFF');
  });

  it('validates 100% full scholarship coupon (VTU100)', () => {
    const res = validateCoupon('VTU100', '₹6,999');
    expect(res.isValid).toBe(true);
    expect(res.discountAmount).toBe(6999);
    expect(res.finalPrice).toBe(0);
  });

  it('validates flat discount coupon (EARLYBIRD - ₹1,500 Flat)', () => {
    const res = validateCoupon('EARLYBIRD', '₹5,000');
    expect(res.isValid).toBe(true);
    expect(res.discountAmount).toBe(1500);
    expect(res.finalPrice).toBe(3500);
  });

  it('rejects invalid or non-existent coupon codes', () => {
    const res = validateCoupon('INVALID_CODE_XYZ', '₹3,000');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('is invalid or does not exist');
    expect(res.finalPrice).toBe(3000);
  });

  it('enforces minimum order amount constraint', () => {
    // SUPERAI requires minOrderAmount of 2000
    const res = validateCoupon('SUPERAI', '₹1,500');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('Minimum order amount');
  });

  it('creates, toggles, and deletes coupons dynamically', async () => {
    const created = await createCoupon({
      code: 'TESTHACK90',
      description: 'Hackathon special discount',
      discountType: 'percentage',
      discountValue: 90,
      maxUses: 100,
      expiryDate: '2026-12-31',
      minOrderAmount: 0,
      isActive: true,
    });

    expect(created.code).toBe('TESTHACK90');
    expect(created.discountValue).toBe(90);

    // Verify it validates
    const validRes = validateCoupon('TESTHACK90', '₹10,000');
    expect(validRes.isValid).toBe(true);
    expect(validRes.finalPrice).toBe(1000);

    // Toggle active status to paused
    const toggled = await toggleCouponStatus(created.id);
    expect(toggled?.isActive).toBe(false);

    const pausedRes = validateCoupon('TESTHACK90', '₹10,000');
    expect(pausedRes.isValid).toBe(false);
    expect(pausedRes.error).toContain('has been deactivated');

    // Delete coupon
    const deleted = await deleteCoupon(created.id);
    expect(deleted).toBe(true);
  });
});
