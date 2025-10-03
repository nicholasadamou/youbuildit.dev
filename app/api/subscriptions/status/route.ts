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
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          subscriptionTier: true,
          subscriptionStatus: true,
          stripeCurrentPeriodEnd: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
        },
      });
    } catch (dbError) {
      console.error(
        'Database connectivity error in subscription status:',
        dbError
      );
      // This is a database connectivity issue - return error response
      const errorResponse = NextResponse.json({
        tier: 'FREE',
        status: 'FREE',
        error: 'Database temporarily unavailable, showing free tier access',
      });
      errorResponse.headers.set(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      );
      return errorResponse;
    }

    if (!user) {
      // User is authenticated but not in our database yet (new user)
      // This is normal and should not show any error messages
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

    // Short cache for better responsiveness after subscription changes (1 minute)
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
    return response;
  } catch (error) {
    console.error('Unexpected error in subscription status endpoint:', error);

    // Handle unexpected errors (auth failures, etc.)
    // Still fallback gracefully but with different error message
    const errorResponse = NextResponse.json({
      tier: 'FREE',
      status: 'FREE',
      error: 'Service temporarily unavailable, showing free tier access',
    });

    // Don't cache error responses
    errorResponse.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    return errorResponse;
  }
}
