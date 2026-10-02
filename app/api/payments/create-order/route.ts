import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createPaymentOrder } from '@/services/payment-service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user || {
      id: 'guest-learner',
      name: 'Guest Learner',
      email: 'learner@nexus.ai',
    };

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload' },
        { status: 400 }
      );
    }
    const { courseId, courseTitle, amount, currency, gateway, couponCode } = body || {};

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'courseId is required to create a payment order' },
        { status: 400 }
      );
    }

    const order = await createPaymentOrder({
      courseId,
      courseTitle: courseTitle || 'Advanced AI Engineering Certification',
      amount: amount || 2999,
      currency: currency || 'INR',
      gateway: gateway || 'razorpay',
      couponCode,
      user,
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initiate payment order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
