import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createAuditLog } from '@/services/audit-service';

// In-memory / stored configuration cache for Payment Gateways (Razorpay, Stripe)
let paymentGatewayConfig = {
  razorpay: {
    enabled: true,
    keyId: 'rzp_test_9842aBcDeFgHiJ',
    keySecret: '••••••••••••••••••••••••',
    webhookSecret: '••••••••••••••••',
    mode: 'test' as 'test' | 'live',
    currency: 'INR',
    instantSettlement: true,
  },
  stripe: {
    enabled: true,
    publishableKey: 'pk_test_51MzAbCdEfGhIjKlMnOpQrStUvWxYz',
    secretKey: '••••••••••••••••••••••••',
    webhookSecret: '••••••••••••••••',
    mode: 'test' as 'test' | 'live',
    currency: 'USD',
  },
  general: {
    defaultGateway: 'razorpay' as 'razorpay' | 'stripe',
    autoInvoicing: true,
    taxPercentage: 18,
    supportEmail: 'billing@nexus.ai',
  },
};

export async function GET() {
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

    return NextResponse.json({
      success: true,
      data: paymentGatewayConfig,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch payment gateway settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const userId = session.user.id || 'admin-user';
    const body = await request.json();

    // Validate mode and gateway configuration if provided
    if (body.razorpay?.mode && !['test', 'live'].includes(body.razorpay.mode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Razorpay mode. Must be "test" or "live"' },
        { status: 400 }
      );
    }

    if (body.stripe?.mode && !['test', 'live'].includes(body.stripe.mode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Stripe mode. Must be "test" or "live"' },
        { status: 400 }
      );
    }

    if (body.general?.defaultGateway && !['razorpay', 'stripe'].includes(body.general.defaultGateway)) {
      return NextResponse.json(
        { success: false, error: 'Invalid default gateway. Must be "razorpay" or "stripe"' },
        { status: 400 }
      );
    }

    paymentGatewayConfig = {
      razorpay: {
        ...paymentGatewayConfig.razorpay,
        ...(body.razorpay || {}),
        keySecret: body.razorpay?.keySecret?.includes('••')
          ? paymentGatewayConfig.razorpay.keySecret
          : body.razorpay?.keySecret || paymentGatewayConfig.razorpay.keySecret,
      },
      stripe: {
        ...paymentGatewayConfig.stripe,
        ...(body.stripe || {}),
        secretKey: body.stripe?.secretKey?.includes('••')
          ? paymentGatewayConfig.stripe.secretKey
          : body.stripe?.secretKey || paymentGatewayConfig.stripe.secretKey,
      },
      general: {
        ...paymentGatewayConfig.general,
        ...(body.general || {}),
      },
    };

    await createAuditLog({
      userId,
      action: `Updated Payment Gateway Configuration (Razorpay Mode: ${paymentGatewayConfig.razorpay.mode}, Stripe Mode: ${paymentGatewayConfig.stripe.mode})`,
      target: 'payment_gateways',
      type: 'security',
    });

    return NextResponse.json({
      success: true,
      message: 'Payment gateway settings updated successfully',
      data: paymentGatewayConfig,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update payment gateway settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
