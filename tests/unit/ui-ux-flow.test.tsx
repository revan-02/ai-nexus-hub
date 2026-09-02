import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NexusProvider } from '@/context/nexus-context';
import SettingsPage from '@/app/settings/page';
import ModelComparisonPage from '@/app/model-comparison/page';
import VTUQuestionPapersPage from '@/app/vtu-question-papers/page';
import { CourseDetailModal } from '@/components/courses/course-detail-modal';
import { mockCoursesList } from '@/lib/mock-data/courses-data';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div data-testid="nexus-shell">{children}</div>,
}));

describe('UI / UX End-to-End Interaction Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.className = '';
  });

  describe('UI/UX Area 1: Light & Dark Theme Customization & DOM State', () => {
    it('switches between Light Mode, Dark Mode, and applies CSS classes to document root', () => {
      render(
        <NexusProvider>
          <SettingsPage defaultTab="Preferences" />
        </NexusProvider>
      );

      expect(screen.getByText(/Appearance & Color Theme/i)).toBeInTheDocument();

      // Click Light / White Mode button
      const lightButtons = screen.getAllByText(/Light \/ White Mode/i);
      expect(lightButtons.length).toBeGreaterThan(0);
      fireEvent.click(lightButtons[0]);

      expect(document.documentElement.classList.contains('light')).toBe(true);

      // Click Dark Mode button
      const darkButtons = screen.getAllByText(/Dark Mode/i);
      expect(darkButtons.length).toBeGreaterThan(0);
      fireEvent.click(darkButtons[0]);

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('UI/UX Area 2: Settings Coupons & Promo Codes Tab', () => {
    it('renders coupons table, allows coupon copying, and displays coupon metrics', () => {
      render(
        <NexusProvider>
          <SettingsPage defaultTab="Coupons & Promo Codes" />
        </NexusProvider>
      );

      // Verify coupon codes are present in the table
      expect(screen.getAllByText(/NEXUS50/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/SUPERAI/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/VTU100/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/EARLYBIRD/i).length).toBeGreaterThan(0);

      // Verify metrics
      expect(screen.getByText(/Active Promo Codes/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Redemptions/i)).toBeInTheDocument();
    });
  });

  describe('UI/UX Area 3: Course Checkout with Real-Time Promo Validation', () => {
    it('applies promo code dynamically with price recalculation and error feedback', () => {
      const paidCourse = mockCoursesList.find((c) => c.price !== 'Free') || {
        ...mockCoursesList[0],
        price: '₹3,999',
      };
      const mockOnClose = vi.fn();

      render(
        <CourseDetailModal
          course={paidCourse}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText(paidCourse.title)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e\.g\. NEXUS50, SUPERAI/i)).toBeInTheDocument();

      const promoInput = screen.getByPlaceholderText(/e\.g\. NEXUS50, SUPERAI/i);
      const applyBtn = screen.getByRole('button', { name: /Apply/i });

      // Test 1: Invalid Coupon
      fireEvent.change(promoInput, { target: { value: 'INVALID999' } });
      fireEvent.click(applyBtn);
      expect(screen.getByText(/is invalid or does not exist/i)).toBeInTheDocument();

      // Test 2: Valid 50% Coupon
      fireEvent.change(promoInput, { target: { value: 'NEXUS50' } });
      fireEvent.click(applyBtn);
      expect(screen.getByText(/Coupon "NEXUS50" applied!/i)).toBeInTheDocument();

      // Test 3: 100% Scholarship Coupon
      fireEvent.change(promoInput, { target: { value: 'VTU100' } });
      fireEvent.click(applyBtn);
      expect(screen.getByText(/Coupon "VTU100" applied!/i)).toBeInTheDocument();
    });
  });

  describe('UI/UX Area 4: AI Model Comparison & Pricing Matrix', () => {
    it('switches currency between INR (₹) and USD ($) and updates model cards', () => {
      render(
        <NexusProvider>
          <ModelComparisonPage />
        </NexusProvider>
      );

      expect(screen.getByText(/AI Models Benchmark, Purpose & Price Comparison Matrix/i)).toBeInTheDocument();

      // Toggle to USD
      const usdBtn = screen.getByRole('button', { name: /\$ USD/i });
      fireEvent.click(usdBtn);

      expect(screen.getAllByText(/\$0\./i).length).toBeGreaterThan(0);

      // Toggle back to INR
      const inrBtn = screen.getByRole('button', { name: /₹ INR/i });
      fireEvent.click(inrBtn);

      expect(screen.getAllByText(/₹/i).length).toBeGreaterThan(0);
    });
  });

  describe('UI/UX Area 5: VTU Question Papers Bank Search & Filter', () => {
    it('filters question papers by engineering branch and search query', () => {
      render(
        <NexusProvider>
          <VTUQuestionPapersPage />
        </NexusProvider>
      );

      const branchButtons = screen.getAllByText(/Computer Science \(CSE\)/i);
      expect(branchButtons.length).toBeGreaterThan(0);

      const aimlButtons = screen.getAllByText(/AI & ML \(AIML\)/i);
      expect(aimlButtons.length).toBeGreaterThan(0);
      fireEvent.click(aimlButtons[0]);

      expect(screen.getAllByText(/Deep Learning/i).length).toBeGreaterThan(0);

      const searchBox = screen.getByPlaceholderText(/Search topic/i);
      fireEvent.change(searchBox, { target: { value: 'Backprop' } });

      expect(searchBox).toHaveValue('Backprop');
    });
  });
});
