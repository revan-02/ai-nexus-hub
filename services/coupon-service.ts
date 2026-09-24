export type DiscountType = 'percentage' | 'flat';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number; // e.g. 50 for 50%, or 1500 for ₹1,500
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  minOrderAmount: number; // in INR
  applicableTier?: string; // 'All' or specific tier
  isActive: boolean;
  createdAt: string;
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  error?: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  formattedDiscount: string;
}

// Initial Database of Coupons
export let couponsDatabase: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'NEXUS50',
    description: 'Flat 50% discount on all certification masterclasses',
    discountType: 'percentage',
    discountValue: 50,
    maxUses: 1000,
    usedCount: 428,
    expiryDate: '2026-12-31',
    minOrderAmount: 0,
    applicableTier: 'All',
    isActive: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'cpn-2',
    code: 'SUPERAI',
    description: 'Exclusive 70% Super Early-Bird discount on Generative AI & Deep Learning tracks',
    discountType: 'percentage',
    discountValue: 70,
    maxUses: 500,
    usedCount: 312,
    expiryDate: '2026-12-31',
    minOrderAmount: 2000,
    applicableTier: 'All',
    isActive: true,
    createdAt: '2026-02-01',
  },
  {
    id: 'cpn-3',
    code: 'VTU100',
    description: '100% Full Scholarship waiver for VTU Engineering Students & Faculty',
    discountType: 'percentage',
    discountValue: 100,
    maxUses: 2500,
    usedCount: 1845,
    expiryDate: '2026-12-31',
    minOrderAmount: 0,
    applicableTier: 'Undergraduate',
    isActive: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'cpn-4',
    code: 'EARLYBIRD',
    description: 'Flat ₹1,500 instant discount on professional certifications',
    discountType: 'flat',
    discountValue: 1500,
    maxUses: 300,
    usedCount: 142,
    expiryDate: '2026-11-30',
    minOrderAmount: 1999,
    applicableTier: 'All',
    isActive: true,
    createdAt: '2026-03-10',
  },
  {
    id: 'cpn-5',
    code: 'KIDSFREE',
    description: 'Free access to Young Explorer & Junior Innovator foundational tracks',
    discountType: 'percentage',
    discountValue: 100,
    maxUses: 5000,
    usedCount: 1240,
    expiryDate: '2026-12-31',
    minOrderAmount: 0,
    applicableTier: 'Young Explorer',
    isActive: true,
    createdAt: '2026-01-01',
  },
];

// Helper: Parse numeric price from string like "₹3,999", "Free", or a number
export function parsePriceToNumber(price: string | number): number {
  if (typeof price === 'number') return isNaN(price) ? 0 : price;
  if (!price || typeof price !== 'string' || price.toLowerCase() === 'free') return 0;
  const cleaned = price.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

// Helper: Format number to INR string
export function formatNumberToINR(amount: number): string {
  if (amount <= 0) return 'Free';
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Validate & calculate discount for a coupon code
export function validateCoupon(code: string, price: string | number): CouponValidationResult {
  const originalPrice = parsePriceToNumber(price);
  if (!code || typeof code !== 'string') {
    return {
      isValid: false,
      error: 'Please enter a valid coupon code.',
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      formattedDiscount: '₹0',
    };
  }
  const normalizedCode = code.trim().toUpperCase();

  const coupon = couponsDatabase.find((c) => c.code.toUpperCase() === normalizedCode);

  if (!coupon) {
    return {
      isValid: false,
      error: `Coupon code "${code}" is invalid or does not exist.`,
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      formattedDiscount: '₹0',
    };
  }

  if (!coupon.isActive) {
    return {
      isValid: false,
      error: `Coupon code "${coupon.code}" has been deactivated.`,
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      formattedDiscount: '₹0',
    };
  }

  if (coupon.usedCount >= coupon.maxUses) {
    return {
      isValid: false,
      error: `Coupon code "${coupon.code}" has reached its maximum redemption limit.`,
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      formattedDiscount: '₹0',
    };
  }

  const now = new Date();
  const expiry = new Date(coupon.expiryDate);
  // Set expiry to the end of the day so the coupon is valid throughout the expiration date
  expiry.setHours(23, 59, 59, 999);
  if (now > expiry) {
    return {
      isValid: false,
      error: `Coupon code "${coupon.code}" expired on ${coupon.expiryDate}.`,
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      formattedDiscount: '₹0',
    };
  }

  if (originalPrice < coupon.minOrderAmount) {
    return {
      isValid: false,
      error: `Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required to apply this coupon.`,
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      formattedDiscount: '₹0',
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (originalPrice * coupon.discountValue) / 100;
  } else {
    discountAmount = Math.min(originalPrice, coupon.discountValue);
  }

  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const formattedDiscount =
    coupon.discountType === 'percentage'
      ? `${coupon.discountValue}% OFF (-₹${discountAmount.toLocaleString('en-IN')})`
      : `-₹${discountAmount.toLocaleString('en-IN')}`;

  return {
    isValid: true,
    coupon,
    originalPrice,
    discountAmount,
    finalPrice,
    formattedDiscount,
  };
}

// Fetch all coupons
export async function getAllCoupons(): Promise<Coupon[]> {
  return [...couponsDatabase];
}

// Create a new coupon
export async function createCoupon(couponData: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>): Promise<Coupon> {
  const newCoupon: Coupon = {
    ...couponData,
    id: `cpn-${Date.now()}`,
    code: couponData.code.trim().toUpperCase(),
    usedCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };

  couponsDatabase.unshift(newCoupon);
  return newCoupon;
}

// Toggle coupon active state
export async function toggleCouponStatus(id: string): Promise<Coupon | null> {
  const coupon = couponsDatabase.find((c) => c.id === id);
  if (!coupon) return null;
  coupon.isActive = !coupon.isActive;
  return coupon;
}

// Delete a coupon
export async function deleteCoupon(id: string): Promise<boolean> {
  const initialLength = couponsDatabase.length;
  couponsDatabase = couponsDatabase.filter((c) => c.id !== id);
  return couponsDatabase.length < initialLength;
}
