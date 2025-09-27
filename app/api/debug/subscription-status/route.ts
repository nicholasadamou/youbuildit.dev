import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        debug: {
          authenticated: false,
          userId: null,
          message: 'User not authenticated',
        },
      });
    }

    console.log('Debug: Checking subscription status for userId:', userId);

    // Test database connectivity
    let dbConnected = false;
    let user = null;
    let dbError = null;

    try {
      // Test basic database connection
      await prisma.$connect();
      dbConnected = true;
      console.log('Debug: Database connection successful');

      // Try to find user
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          stripeCurrentPeriodEnd: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
        },
      });
      console.log('Debug: User query result:', user);
    } catch (error) {
      dbError =
        error instanceof Error ? error.message : 'Unknown database error';
      console.error('Debug: Database error:', dbError);
    } finally {
      await prisma.$disconnect();
    }

    return NextResponse.json({
      debug: {
        authenticated: true,
        userId,
        dbConnected,
        dbError,
        userFound: !!user,
        userRecord: user,
        finalTier: user?.subscriptionTier || 'FREE',
        finalStatus: user?.subscriptionStatus || 'FREE',
      },
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      debug: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null,
      },
    });
  }
}
