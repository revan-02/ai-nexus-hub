import { NextRequest, NextResponse } from 'next/server';
import {
  MOCK_PAYMENT_METRICS,
  MOCK_REVENUE_CHART_DATA,
  MOCK_GATEWAY_DISTRIBUTION,
  MOCK_PRODUCT_BREAKDOWN,
  MOCK_TRANSACTIONS_LIST,
  PaymentTransaction,
} from '@/lib/mock-data/payment-reports-data';

let transactionsStore = [...MOCK_TRANSACTIONS_LIST];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const gateway = searchParams.get('gateway');
    const search = searchParams.get('search')?.toLowerCase();

    let filtered = [...transactionsStore];

    if (status && status !== 'All Status') {
      filtered = filtered.filter((tx) => tx.status.toLowerCase() === status.toLowerCase());
    }

    if (gateway && gateway !== 'All Gateways') {
      filtered = filtered.filter((tx) => tx.gateway.toLowerCase() === gateway.toLowerCase());
    }

    if (search) {
      filtered = filtered.filter(
        (tx) =>
          tx.transactionId.toLowerCase().includes(search) ||
          tx.invoiceNumber.toLowerCase().includes(search) ||
          tx.customerName.toLowerCase().includes(search) ||
          tx.customerEmail.toLowerCase().includes(search) ||
          tx.productName.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        metrics: MOCK_PAYMENT_METRICS,
        revenueChart: MOCK_REVENUE_CHART_DATA,
        gatewayDistribution: MOCK_GATEWAY_DISTRIBUTION,
        productBreakdown: MOCK_PRODUCT_BREAKDOWN,
        transactions: filtered,
        totalCount: filtered.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch payment reports' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, transactionId, refundReason } = body;

    if (action === 'refund') {
      if (!transactionId) {
        return NextResponse.json(
          { success: false, error: 'Transaction ID is required for refund' },
          { status: 400 }
        );
      }

      const txIndex = transactionsStore.findIndex((tx) => tx.id === transactionId || tx.transactionId === transactionId);
      if (txIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Transaction not found' },
          { status: 404 }
        );
      }

      transactionsStore[txIndex] = {
        ...transactionsStore[txIndex],
        status: 'Refunded',
      };

      return NextResponse.json({
        success: true,
        message: `Refund of ₹${transactionsStore[txIndex].amount.toLocaleString('en-IN')} processed successfully for ${transactionsStore[txIndex].transactionId}`,
        data: transactionsStore[txIndex],
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action specified' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process payment action' },
      { status: 500 }
    );
  }
}
