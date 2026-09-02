import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentReportView } from '@/components/reports/payment-report-view';

describe('Payment & Revenue Reports for Admin', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders PaymentReportView with KPI metrics, status cards and charts', () => {
    render(<PaymentReportView />);

    expect(screen.getByText(/Payment & Financial Reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Settled \/ Paid \(Full\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Half Paid \(Installments\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pending \(Processing\)/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Not Paid \(Invoice Due\)/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Total Gross Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Recurring \(MRR\)/i)).toBeInTheDocument();
  });

  it('filters transactions by search query including customer phone', () => {
    render(<PaymentReportView />);

    const searchInput = screen.getByPlaceholderText(/Search customer, phone, TXN ID, invoice #/i);
    fireEvent.change(searchInput, { target: { value: 'Priya Sharma' } });

    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    expect(screen.getAllByText(/Half Paid/i)[0]).toBeInTheDocument();
    expect(screen.queryByText('Sarah Jenkins')).not.toBeInTheDocument();
  });

  it('opens 100% Printable Tax Invoice Modal with GST and balance due', () => {
    render(<PaymentReportView />);

    const invoiceButtons = screen.getAllByRole('button', { name: /Print Invoice/i });
    fireEvent.click(invoiceButtons[0]);

    expect(screen.getByText(/NEXUS AI EDUCATION/i)).toBeInTheDocument();
    expect(screen.getAllByText(/TAX INVOICE/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/GSTIN:/i)).toBeInTheDocument();
    expect(screen.getByText(/SAC: 999293/i)).toBeInTheDocument();
    expect(screen.getByText(/IGST \/ CGST\+SGST \(18%\):/i)).toBeInTheDocument();
  });

  it('opens WhatsApp & Email reminder modal and dispatches reminder', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          message: 'Payment reminder dispatched',
        }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<PaymentReportView />);

    const reminderButtons = screen.getAllByRole('button', { name: /Reminder/i });
    fireEvent.click(reminderButtons[0]);

    expect(screen.getByText(/Send Invoice & Payment Reminder/i)).toBeInTheDocument();
    expect(screen.getByText(/WhatsApp \+ Email/i)).toBeInTheDocument();

    const dispatchBtn = screen.getByRole('button', { name: /Dispatch Reminder/i });
    fireEvent.click(dispatchBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/successfully dispatched/i)).toBeInTheDocument();
    });
  });

  it('handles direct WhatsApp button click with pre-formatted message', () => {
    const openMock = vi.fn();
    window.open = openMock;

    render(<PaymentReportView />);

    const whatsappButtons = screen.getAllByRole('button', { name: /^WhatsApp$/i });
    fireEvent.click(whatsappButtons[0]);

    expect(openMock).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/'),
      '_blank'
    );
  });
});
