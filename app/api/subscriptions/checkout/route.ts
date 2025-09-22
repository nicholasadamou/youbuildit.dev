import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import {
  createCheckoutSession,
  createStripeCustomer,
  STRIPE_CONFIG,
  stripe,
} from '@/lib/stripe';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { priceId } = body;

    // Validate price ID
    const validPriceIds = [
      STRIPE_CONFIG.plans.pro.monthly.priceId,
      STRIPE_CONFIG.plans.pro.yearly.priceId,
      STRIPE_CONFIG.plans.team.monthly.priceId,
      STRIPE_CONFIG.plans.team.yearly.priceId,
    ];

    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
    }

    // Get Clerk user information
    const clerkUser = await (await clerkClient()).users.getUser(userId);
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
    const userName =
      `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

    // Get user with Stripe customer ID, or create if they don't exist
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user) {
      try {
        // Try to create the user
        user = await prisma.user.create({
          data: {
            id: userId,
            email: userEmail,
            name: userName || null,
          },
        });
      } catch (error: unknown) {
        // If user already exists (race condition), fetch the existing user
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          error.code === 'P2002'
        ) {
          user = await prisma.user.findUnique({
            where: { id: userId },
            select: { stripeCustomerId: true },
          });
          if (!user) {
            // Try finding by email as a fallback
            user = await prisma.user.findUnique({
              where: { email: userEmail },
              select: { stripeCustomerId: true },
            });
            if (user) {
              // Update the user ID if found by email
              user = await prisma.user.update({
                where: { email: userEmail },
                data: { id: userId },
                select: { stripeCustomerId: true },
              });
            }
          }
        } else {
          throw error;
        }
      }
    }

    // Create Stripe customer if one doesn't exist
    let stripeCustomerId = user?.stripeCustomerId;

    if (!stripeCustomerId) {
      if (!userEmail) {
        return NextResponse.json(
          { error: 'User email not found' },
          { status: 400 }
        );
      }

      const stripeCustomer = await createStripeCustomer(
        userEmail,
        userName || undefined
      );
      stripeCustomerId = stripeCustomer.id;

      // Update user with the new Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    // Verify the Stripe customer exists, create a new one if it doesn't
    if (stripeCustomerId) {
      try {
        await stripe.customers.retrieve(stripeCustomerId);
      } catch (error: unknown) {
        if (
          error &&
          typeof error === 'object' &&
          'type' in error &&
          error.type === 'StripeInvalidRequestError' &&
          'code' in error &&
          error.code === 'resource_missing'
        ) {
          console.log(
            '⚠️ Stored Stripe customer ID is invalid, creating new customer...'
          );
          if (!userEmail) {
            return NextResponse.json(
              { error: 'User email not found' },
              { status: 400 }
            );
          }

          const stripeCustomer = await createStripeCustomer(
            userEmail,
            userName || undefined
          );
          stripeCustomerId = stripeCustomer.id;

          // Update user with the new Stripe customer ID
          await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId },
          });
        } else {
          throw error; // Re-throw if it's a different error
        }
      }
    }

    // Create checkout session
    const baseUrl = getBaseUrl();
    const checkoutSession = await createCheckoutSession(
      stripeCustomerId,
      priceId,
      `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      `${baseUrl}`
    );

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
