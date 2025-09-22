import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customerId } = await request.json();

    if (!customerId) {
      // Try to get customer ID from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true },
      });

      if (!user?.stripeCustomerId) {
        return NextResponse.json(
          { error: 'No Stripe customer found' },
          { status: 400 }
        );
      }
    }

    const finalCustomerId =
      customerId ||
      (
        await prisma.user.findUnique({
          where: { id: userId },
          select: { stripeCustomerId: true },
        })
      )?.stripeCustomerId;

    if (!finalCustomerId) {
      return NextResponse.json(
        { error: 'Customer ID not found' },
        { status: 400 }
      );
    }

    // Get the base URL from the request or environment
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol =
      process.env.NODE_ENV === 'production'
        ? request.headers.get('x-forwarded-proto') || 'https'
        : 'http';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    // Create Stripe customer portal session
    const sessionConfig = {
      customer: finalCustomerId,
      return_url: `${baseUrl}/account?tab=subscription`,
    };

    // If you have a specific portal configuration ID, you can add it here:
    // sessionConfig.configuration = 'bpc_your_configuration_id';

    const session = await stripe.billingPortal.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Error creating portal session:', error);

    // Provide more specific error messages
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'resource_missing'
    ) {
      return NextResponse.json(
        {
          error:
            'Stripe Customer Portal is not configured. Please configure it in your Stripe Dashboard at https://dashboard.stripe.com/test/settings/billing/portal',
          details:
            error && typeof error === 'object' && 'message' in error
              ? String(error.message)
              : 'Unknown error',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create billing portal session',
        details:
          error && typeof error === 'object' && 'message' in error
            ? String(error.message)
            : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
