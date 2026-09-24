import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createAuditLog } from '@/services/audit-service';
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    const userRole = (session?.user as any)?.role;
    if (userRole !== 'Admin' && userRole !== 'Manager') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Administrative privilege required' },
        { status: 403 }
      );
    }
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    const userRole = (session?.user as any)?.role;
    if (userRole !== 'Admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin privilege required' },
        { status: 403 }
      );
    }

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

      // Idempotency: Prevent refunding an already refunded transaction
      if (transactionsStore[txIndex].status === 'Refunded') {
        return NextResponse.json(
          { success: false, error: 'Transaction has already been refunded' },
          { status: 400 }
        );
      }

      transactionsStore[txIndex] = {
        ...transactionsStore[txIndex],
        status: 'Refunded',
      };

      const refundAmountFormatted = `₹${transactionsStore[txIndex].amount.toLocaleString('en-IN')}`;

      // Register action in system audit trail
      await createAuditLog({
        userId: session.user.id || 'admin-user',
        action: `Processed refund of ${refundAmountFormatted} for transaction ${transactionsStore[txIndex].transactionId} (Reason: ${refundReason || 'Customer Request'})`,
        target: `transaction_${transactionsStore[txIndex].transactionId}`,
        type: 'security',
      });

      return NextResponse.json({
        success: true,
        message: `Refund of ${refundAmountFormatted} processed successfully for ${transactionsStore[txIndex].transactionId}`,
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
