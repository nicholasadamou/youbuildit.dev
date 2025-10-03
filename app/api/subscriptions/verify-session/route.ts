import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.customer !== (await getUserStripeCustomerId(userId))) {
      return NextResponse.json(
        { error: 'Session does not belong to user' },
        { status: 403 }
      );
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Get subscription details
    let subscription: Stripe.Subscription | null = null;
    if (session.subscription) {
      subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
    }

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Determine subscription tier from price ID
    const priceId = subscription.items.data[0]?.price.id;
    let tier = 'FREE';

    if (
      priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID ||
      priceId === process.env.STRIPE_PRO_YEARLY_PRICE_ID
    ) {
      tier = 'PRO';
    }

    // Update user subscription in database
    // Validate and convert the timestamp - get it from the subscription item
    const currentPeriodEndTimestamp =
      subscription.items.data[0]?.current_period_end;
    console.log('📅 Raw period end from Stripe:', currentPeriodEndTimestamp);
    console.log('📅 Type:', typeof currentPeriodEndTimestamp);

    let currentPeriodEnd: Date;
    if (
      typeof currentPeriodEndTimestamp === 'number' &&
      currentPeriodEndTimestamp > 0
    ) {
      currentPeriodEnd = new Date(currentPeriodEndTimestamp * 1000);
      console.log('✅ Converted to date:', currentPeriodEnd.toISOString());
    } else {
      console.log(
        '❌ Invalid period end timestamp:',
        currentPeriodEndTimestamp
      );
      // Use a default date 30 days from now
      currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      console.log('✅ Using default date:', currentPeriodEnd.toISOString());
    }

    // Validate the date is valid
    if (isNaN(currentPeriodEnd.getTime())) {
      console.log('❌ Final validation failed, using fallback');
      currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    console.log('✅ Final date to save:', currentPeriodEnd.toISOString());

    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: currentPeriodEnd,
        subscriptionStatus: subscription.status.toUpperCase() as
          | 'FREE'
          | 'ACTIVE'
          | 'CANCELED'
          | 'INCOMPLETE'
          | 'INCOMPLETE_EXPIRED'
          | 'PAST_DUE'
          | 'TRIALING'
          | 'UNPAID',
        subscriptionTier: tier as 'FREE' | 'PRO',
      },
    });

    return NextResponse.json({
      tier: tier.toLowerCase(),
      status: subscription.status,
      currentPeriodEnd: currentPeriodEnd.toISOString(),
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getUserStripeCustomerId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });
  return user?.stripeCustomerId || null;
}
