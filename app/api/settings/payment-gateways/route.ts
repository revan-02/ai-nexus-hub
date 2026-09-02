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
  return NextResponse.json({
    data: paymentGatewayConfig,
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'admin-user';

    const body = await request.json();

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
        error: 'Failed to update payment gateway settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
