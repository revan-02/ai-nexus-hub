'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  ArrowRight,
  Download,
  AlertCircle,
  Clock,
  Layers,
  Award,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { validateCoupon, CouponValidationResult } from '@/services/coupon-service';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    price: string | number;
    thumbnail?: string;
    level?: string;
    duration?: string;
  };
  couponCode?: string;
  onSuccess?: (receipt: any) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  course,
  couponCode: initialCoupon = '',
  onSuccess,
}: CheckoutModalProps) {
  // Gateway selection: razorpay (INR) vs stripe (USD)
  const [gateway, setGateway] = useState<'razorpay' | 'stripe'>('razorpay');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  // Pricing & Coupon
  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [couponApplied, setCouponApplied] = useState<CouponValidationResult | null>(null);

  // Form Fields
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // UI Flow States: 'checkout' | 'processing' | 'success'
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any | null>(null);

  // Calculate pricing
  const numericBasePrice = typeof course.price === 'string'
    ? parseFloat(course.price.replace(/[^0-9.]/g, '')) || 2999
    : course.price || 2999;

  useEffect(() => {
    if (initialCoupon) {
      const res = validateCoupon(initialCoupon, numericBasePrice);
      if (res.isValid) {
        setCouponApplied(res);
      }
    }
  }, [initialCoupon, numericBasePrice]);

  const discount = couponApplied?.isValid ? couponApplied.discountAmount : 0;
  const subtotal = Math.max(0, numericBasePrice - discount);
  const tax = gateway === 'razorpay' ? Math.round(subtotal * 0.18) : Math.round(subtotal * 0.05);
  const totalPayable = subtotal + tax;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponCode;
    if (!code.trim()) return;
    const res = validateCoupon(code.trim(), numericBasePrice);
    setCouponApplied(res);
    if (!res.isValid) {
      setErrorMessage(res.error || 'Invalid coupon code');
    } else {
      setErrorMessage(null);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const executePayment = async (isSandbox: boolean = false) => {
    setErrorMessage(null);
    setStep('processing');

    try {
      // 1. Create payment order on server
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          amount: totalPayable,
          currency: gateway === 'razorpay' ? 'INR' : 'USD',
          gateway,
          couponCode: couponApplied?.isValid ? couponCode : undefined,
        }),
      });

      const orderJson = await orderRes.json();
      if (!orderJson.success) {
        throw new Error(orderJson.error || 'Failed to create payment order');
      }

      const orderData = orderJson.data;

      // Simulate network / gateway authorization handshake
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // 2. Verify payment & automatically enroll
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentId: isSandbox ? `pay_sandbox_${Date.now()}` : `pay_live_${Date.now()}`,
          signature: 'sig_verified_mock_token_sha256',
          gateway,
          courseId: course.id,
          courseTitle: course.title,
          amount: totalPayable,
          currency: gateway === 'razorpay' ? 'INR' : 'USD',
          paymentMethod:
            paymentMethod === 'upi'
              ? 'UPI / GPay'
              : paymentMethod === 'card'
              ? 'Credit Card (Visa/Mastercard)'
              : 'NetBanking',
        }),
      });

      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) {
        throw new Error(verifyJson.error || 'Payment verification failed');
      }

      setReceipt(verifyJson.data);
      setStep('success');

      if (onSuccess) {
        onSuccess(verifyJson.data);
      }
    } catch (err: any) {
      setStep('checkout');
      setErrorMessage(err.message || 'An unexpected error occurred during payment.');
    }
  };

  const handleDownloadInvoice = () => {
    if (!receipt) return;
    const content = `================================================
AI NEXUS PLATFORM - OFFICIAL TAX INVOICE
================================================
Invoice Number: ${receipt.invoiceNumber}
Transaction ID: ${receipt.transactionId}
Order ID:       ${receipt.orderId}
Payment ID:     ${receipt.paymentId}
Date & Time:    ${receipt.timestamp}
Gateway:        ${receipt.gateway}
Payment Method: ${receipt.paymentMethod}
Customer:       ${receipt.customerName} (${receipt.customerEmail})
------------------------------------------------
Item:           ${receipt.courseTitle}
Amount:         ${gateway === 'razorpay' ? '₹' : '$'}${receipt.amount}
Tax (GST 18%):  ${gateway === 'razorpay' ? '₹' : '$'}${receipt.taxAmount}
Status:         ${receipt.status} (Verified)
================================================
Thank you for learning with AI Nexus.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${receipt.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-[#09090f] border border-[#232332] text-zinc-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Checkout Modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#181824] hover:bg-[#232334] text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ================= STEP 1: CHECKOUT VIEW ================= */}
        {step === 'checkout' && (
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
            {/* LEFT COLUMN: Order Summary (5 cols) */}
            <div className="md:col-span-5 bg-[#0e0e17] p-6 border-b md:border-b-0 md:border-r border-[#20202e] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                    {course.level || 'Intermediate'} Track
                  </span>
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    {course.duration || '24h Content'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {course.title}
                </h3>

                {/* Course Inclusions Summary */}
                <div className="space-y-2 py-3 border-y border-[#20202e] text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Interactive AI Code Studio Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Lifetime Access to Video Curriculum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>ISO Verifiable Digital Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>1-on-1 Mentor Support in Discord</span>
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-zinc-400">Coupon / Promo Code</span>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="e.g. NEXUS50"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="h-8 bg-[#151522] border-[#29293d] text-xs text-white uppercase font-mono"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleApplyCoupon()}
                      className="h-8 px-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg"
                    >
                      Apply
                    </Button>
                  </div>

                  {couponApplied?.isValid && (
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{couponApplied.coupon?.description || `Discount Applied: ${couponApplied.formattedDiscount}`}</span>
                    </div>
                  )}

                  {!couponApplied?.isValid && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      <span className="text-[10px] text-zinc-400">Popular:</span>
                      {['NEXUS50', 'SUPERAI', 'VTU100'].map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setCouponCode(code);
                            handleApplyCoupon(code);
                          }}
                          className="px-1.5 py-0.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[10px] font-mono rounded border border-purple-500/20"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown Footer */}
              <div className="space-y-2 pt-4 border-t border-[#20202e] text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Base Price</span>
                  <span className="font-mono">{gateway === 'razorpay' ? '₹' : '$'}{numericBasePrice.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span className="font-mono">-{gateway === 'razorpay' ? '₹' : '$'}{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>{gateway === 'razorpay' ? 'GST (18%)' : 'Service Fee'}</span>
                  <span className="font-mono">{gateway === 'razorpay' ? '₹' : '$'}{tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-[#20202e]">
                  <span>Total Amount</span>
                  <span className="text-base text-purple-300 font-mono">
                    {gateway === 'razorpay' ? '₹' : '$'}{totalPayable.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Payment Gateway Selection & Form (7 cols) */}
            <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#20202e]">
                  <div>
                    <h4 className="text-sm font-bold text-white">Select Payment Gateway</h4>
                    <p className="text-[11px] text-zinc-400">Fast, encrypted 256-bit checkout</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>PCI Compliant</span>
                  </div>
                </div>

                {/* Gateway Switcher Tabs: Razorpay vs Stripe */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#12121c] border border-[#232332] rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setGateway('razorpay');
                      setPaymentMethod('upi');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      gateway === 'razorpay'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span>Razorpay (India / UPI)</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded font-mono">₹ INR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGateway('stripe');
                      setPaymentMethod('card');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      gateway === 'stripe'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span>Stripe (Global Cards)</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded font-mono">$ USD</span>
                  </button>
                </div>

                {/* Razorpay Sub-methods: UPI vs Cards vs NetBanking */}
                {gateway === 'razorpay' && (
                  <div className="flex items-center gap-2 border-b border-[#20202e] pb-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`pb-1 px-1 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border-b-2 ${
                        paymentMethod === 'upi' ? 'text-purple-400 border-purple-500' : 'text-zinc-400 border-transparent hover:text-zinc-200'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>UPI & QR Code</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`pb-1 px-1 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border-b-2 ${
                        paymentMethod === 'card' ? 'text-purple-400 border-purple-500' : 'text-zinc-400 border-transparent hover:text-zinc-200'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Credit/Debit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`pb-1 px-1 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border-b-2 ${
                        paymentMethod === 'netbanking' ? 'text-purple-400 border-purple-500' : 'text-zinc-400 border-transparent hover:text-zinc-200'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>NetBanking</span>
                    </button>
                  </div>
                )}

                {/* Method Form: UPI */}
                {gateway === 'razorpay' && paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#12121c] border border-[#232332] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="text-xs font-bold text-white block">Scan with any UPI App</span>
                        <p className="text-[11px] text-zinc-400">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>

                      {/* Mock QR Code Visual */}
                      <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg relative group">
                        <QrCode className="w-20 h-20 text-zinc-900" />
                        <div className="absolute inset-0 bg-purple-600/90 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold text-center p-1">
                          Click to Test Scan
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">Or Enter Your UPI ID (VPA)</label>
                      <Input
                        placeholder="yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="h-9 bg-[#12121c] border-[#232332] text-xs text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Method Form: Card (Used for both Stripe and Razorpay card tab) */}
                {(gateway === 'stripe' || paymentMethod === 'card') && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-medium text-zinc-300 mb-1">Cardholder Name</label>
                      <Input
                        placeholder="Dr. Alex Morgan"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="h-9 bg-[#12121c] border-[#232332] text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-zinc-300 mb-1">Card Number</label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          placeholder="4242 •••• •••• 4242"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="h-9 pl-9 bg-[#12121c] border-[#232332] text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-zinc-300 mb-1">Expiry Date</label>
                        <Input
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className="h-9 bg-[#12121c] border-[#232332] text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-zinc-300 mb-1">CVV / CVC</label>
                        <Input
                          placeholder="123"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="h-9 bg-[#12121c] border-[#232332] text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Method Form: NetBanking */}
                {gateway === 'razorpay' && paymentMethod === 'netbanking' && (
                  <div className="space-y-3">
                    <span className="text-xs font-medium text-zinc-300 block">Select Popular Bank</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedBank === bank
                              ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                              : 'bg-[#12121c] border-[#232332] text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="space-y-2 pt-4 border-t border-[#20202e]">
                <Button
                  onClick={() => executePayment(false)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold h-11 rounded-xl shadow-lg shadow-purple-900/40 gap-2 cursor-pointer text-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    Pay {gateway === 'razorpay' ? '₹' : '$'}{totalPayable.toLocaleString()} via {gateway === 'razorpay' ? 'Razorpay' : 'Stripe'}
                  </span>
                </Button>

                {/* 1-Click Fast Sandbox Test Button */}
                <Button
                  variant="outline"
                  onClick={() => executePayment(true)}
                  className="w-full border-[#2a2a3c] bg-[#12121c] hover:bg-[#181824] text-zinc-300 hover:text-white h-9 rounded-xl text-xs font-semibold gap-2 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ Instant Sandbox Test Payment (Simulate Gateway)</span>
                </Button>

                <p className="text-[10px] text-center text-zinc-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>30-Day No-Questions-Asked Money-Back Guarantee</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PROCESSING ANIMATION ================= */}
        {step === 'processing' && (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-6 min-h-[480px]">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin flex items-center justify-center" />
              <Lock className="w-7 h-7 text-purple-400 absolute inset-0 m-auto" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className="text-lg font-bold text-white">Communicating with Payment Gateway...</h3>
              <p className="text-xs text-zinc-400">
                Authorizing transaction via {gateway === 'razorpay' ? 'Razorpay PCI Vault' : 'Stripe Security Infrastructure'}. Please do not refresh.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-[#12121c] border border-[#232332] rounded-full text-[11px] text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TLS 1.3 / 256-bit AES End-to-End Encryption</span>
            </div>
          </div>
        )}

        {/* ================= STEP 3: SUCCESS RECEIPT ================= */}
        {step === 'success' && receipt && (
          <div className="p-8 space-y-6">
            {/* Header Success Ring */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Payment Confirmed!</h3>
              <p className="text-xs text-zinc-400">
                You have successfully enrolled in <span className="text-white font-semibold">{receipt.courseTitle}</span>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <Card className="bg-[#12121c] border border-[#232332] p-5 rounded-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#232332] pb-3">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Official Receipt</span>
                  <span className="font-mono text-purple-300 font-bold">{receipt.invoiceNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Total Amount Paid</span>
                  <span className="font-mono text-emerald-400 font-black text-sm">
                    {receipt.currency === 'INR' ? '₹' : '$'}{receipt.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                <div>
                  <span className="text-zinc-400 block">Transaction ID</span>
                  <span className="font-mono text-white truncate block">{receipt.transactionId}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Gateway & Method</span>
                  <span className="text-white font-medium block">{receipt.gateway} ({receipt.paymentMethod})</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Date & Time</span>
                  <span className="text-white font-medium block">{receipt.timestamp}</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-[11px] flex items-center gap-2 font-medium">
                <Award className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Certificate Eligibility: Unlocked upon 100% course module completion.</span>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadInvoice}
                className="w-full sm:w-auto flex-1 border-[#2a2a3c] bg-[#12121c] hover:bg-[#181824] text-zinc-200 text-xs h-10 rounded-xl gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Invoice PDF / TXT</span>
              </Button>

              <Link href="/learn/room-1" className="w-full sm:w-auto flex-1 block">
                <Button
                  onClick={onClose}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-10 rounded-xl gap-2 shadow-lg shadow-purple-900/40 cursor-pointer"
                >
                  <span>Start Learning Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
