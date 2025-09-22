import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (!user) {
      // Return default free subscription for new users
      return NextResponse.json({
        subscriptionTier: 'FREE',
        subscriptionStatus: 'INACTIVE',
        stripeCurrentPeriodEnd: null,
      });
    }

    return NextResponse.json({
      subscriptionTier: user.subscriptionTier || 'FREE',
      subscriptionStatus: user.subscriptionStatus || 'INACTIVE',
      stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
    });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}
