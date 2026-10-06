import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NexusProvider } from '@/context/nexus-context';
import SettingsPage from '@/app/settings/page';
import { CourseDetailModal } from '@/components/courses/course-detail-modal';
import { mockCoursesList } from '@/lib/mock-data/courses-data';
import {
  validateCoupon,
  updateCouponCourses,
} from '@/services/coupon-service';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div data-testid="nexus-shell">{children}</div>,
}));

vi.mock('@/components/layout/admin-shell', () => ({
  AdminShell: ({ children }: any) => <div data-testid="admin-shell">{children}</div>,
}));

vi.mock('@/components/courses/course-animated-video-modal', () => ({
  CourseAnimatedVideoModal: () => <div data-testid="video-modal-mock" />,
}));

vi.mock('@/components/payments/checkout-modal', () => ({
  CheckoutModal: () => <div data-testid="checkout-modal-mock" />,
}));

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
  useSession: vi.fn(() => ({ data: { user: { role: 'Super Admin', name: 'SuperAdmin' } } })),
}));

describe('Course Share & Super Admin Course-Specific Coupons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Coupon Service: Course-Specific Validation & Admin Updates', () => {
    it('validates coupon applicable to "All" courses successfully for any courseId', () => {
      const result = validateCoupon('NEXUS50', '₹4,999', 'crs-1');
      expect(result.isValid).toBe(true);
      expect(result.discountAmount).toBeCloseTo(2499.5);
      expect(result.finalPrice).toBeCloseTo(2499.5);
    });

    it('validates course-specific coupon when passed a valid courseId', () => {
      // SUPERAI is configured for crs-3, crs-4, crs-5, crs-8, crs-9 with 70% off
      const result = validateCoupon('SUPERAI', '₹6,499', 'crs-3');
      expect(result.isValid).toBe(true);
      expect(result.discountAmount).toBeCloseTo(4549.3);
    });

    it('rejects course-specific coupon when courseId does not match coupon rules', () => {
      // crs-0 is not in SUPERAI's list
      const result = validateCoupon('SUPERAI', '₹4,999', 'crs-0');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('not applicable to this specific course');
    });

    it('allows Super Admin to dynamically update applicable courses for a coupon', async () => {
      // Update SUPERAI to also allow crs-0
      const updated = await updateCouponCourses('cpn-2', ['crs-0', 'crs-3', 'crs-4']);
      expect(updated).not.toBeNull();
      expect(updated?.applicableCourses).toEqual(['crs-0', 'crs-3', 'crs-4']);

      // Now validating with crs-0 should succeed
      const result = validateCoupon('SUPERAI', '₹4,999', 'crs-0');
      expect(result.isValid).toBe(true);
    });
  });

  describe('Student UI: Course Sharing with Coupon Codes', () => {
    it('renders "Share Course & Gift Discount Coupon" button and opens referral share modal', () => {
      const sampleCourse = mockCoursesList[0];
      render(
        <CourseDetailModal
          course={sampleCourse}
          isOpen={true}
          onClose={() => {}}
        />
      );

      // Verify Share button exists
      const shareButtons = screen.getAllByText(/Share Course & Gift/i);
      expect(shareButtons.length).toBeGreaterThan(0);

      // Open share modal
      fireEvent.click(shareButtons[0]);

      // Verify share modal heading and content
      const heading = screen.getByRole('heading', { name: /Share Course & Gift Discount/i });
      expect(heading).toBeInTheDocument();
      expect(screen.getByText(/Choose Discount Coupon to Gift:/i)).toBeInTheDocument();
      expect(screen.getByText(/Your Personalized Referral Link:/i)).toBeInTheDocument();

      // Verify popular coupon choices are available in share modal
      expect(screen.getByText('NEXUS50')).toBeInTheDocument();
      expect(screen.getByText('SUPERAI')).toBeInTheDocument();
      expect(screen.getByText('VTU100')).toBeInTheDocument();
      expect(screen.getByText('STUDENT20')).toBeInTheDocument();

      // Verify social share buttons
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('X / Twitter')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('allows student to switch the coupon code attached to the referral link and copy it', () => {
      const sampleCourse = mockCoursesList[0];
      render(
        <CourseDetailModal
          course={sampleCourse}
          isOpen={true}
          onClose={() => {}}
        />
      );

      const shareButtons = screen.getAllByText(/Share Course & Gift/i);
      fireEvent.click(shareButtons[0]);

      // Click VTU100 coupon option
      const vtuBtn = screen.getByText('VTU100');
      fireEvent.click(vtuBtn);

      // Check referral input value reflects VTU100
      const linkInput = screen.getByDisplayValue(/coupon=VTU100/i);
      expect(linkInput).toBeInTheDocument();

      // Click copy button
      const copyButton = screen.getByRole('button', { name: /Copy/i });
      fireEvent.click(copyButton);

      // Should show copied status
      expect(screen.getByText(/Copied!/i)).toBeInTheDocument();
    });
  });

  describe('Super Admin Portal: Course-Specific Coupon Management', () => {
    it('displays Applicable Courses column and allows configuring course restrictions', () => {
      render(
        <NexusProvider>
          <SettingsPage defaultTab="Coupons & Promo Codes" />
        </NexusProvider>
      );

      // Check Applicable Courses header
      expect(screen.getByText(/Applicable Courses/i)).toBeInTheDocument();

      // Check "All Courses" badges
      expect(screen.getAllByText(/All Courses/i).length).toBeGreaterThan(0);

      // Find Configure button for course-specific coupons (exact text or button role)
      const configureBtn = screen.getAllByRole('button', { name: /^Configure$/i })[0];
      expect(configureBtn).toBeInTheDocument();

      // Click configure button for a coupon
      fireEvent.click(configureBtn);

      // Verify course restriction section opens
      expect(screen.getByText(/Enable Courses for Coupon:/i)).toBeInTheDocument();
      expect(screen.getByText(/Set to All Courses/i)).toBeInTheDocument();
    });
  });
});
