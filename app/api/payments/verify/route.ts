import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { verifyPaymentAndEnroll } from '@/services/payment-service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user || {
      id: 'guest-learner',
      name: 'Guest Learner',
      email: 'learner@nexus.ai',
    };

    const body = await req.json();
    const { orderId, paymentId, signature, gateway, courseId, courseTitle, amount, currency, paymentMethod } = body;

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { success: false, error: 'orderId and paymentId are required for payment verification' },
        { status: 400 }
      );
    }

    const receipt = await verifyPaymentAndEnroll({
      orderId,
      paymentId,
      signature,
      gateway: gateway || 'razorpay',
      courseId: courseId || 'course-default',
      courseTitle,
      amount: amount || 2999,
      currency: currency || 'INR',
      paymentMethod,
      user,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Enrollment activated.',
      data: receipt,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
