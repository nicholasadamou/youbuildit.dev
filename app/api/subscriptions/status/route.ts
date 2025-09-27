import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      const response = NextResponse.json({
        tier: 'FREE',
        status: 'FREE',
      });
      // Cache free tier response for non-authenticated users (30 minutes)
      response.headers.set(
        'Cache-Control',
        'public, max-age=1800, s-maxage=1800'
      );
      return response;
    }

    // Get user subscription from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    });

    if (!user) {
      const response = NextResponse.json({
        tier: 'FREE',
        status: 'FREE',
      });
      // Cache for shorter time for new users (5 minutes)
      response.headers.set(
        'Cache-Control',
        'public, max-age=300, s-maxage=300'
      );
      return response;
    }

    const response = NextResponse.json({
      tier: user.subscriptionTier || 'FREE',
      status: user.subscriptionStatus || 'FREE',
      currentPeriodEnd: user.stripeCurrentPeriodEnd?.toISOString() || null,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
    });

    // Add cache headers for successful responses (cache for 5 minutes)
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    return response;
  } catch (error) {
    console.error('Error fetching subscription status:', error);

    // Instead of returning 500, gracefully fallback to FREE tier
    // This ensures the frontend can still function even if database is unavailable
    const errorResponse = NextResponse.json({
      tier: 'FREE',
      status: 'FREE',
      error: 'Database temporarily unavailable, showing free tier access',
    });

    // Don't cache error responses
    errorResponse.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    return errorResponse;
  }
}
