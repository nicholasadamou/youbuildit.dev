import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAllChallenges } from '@/lib/mdx';
import { hasAccessToChallenge } from '@/lib/subscription';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();
    const challenges = await getAllChallenges();

    // Get user subscription status if authenticated
    let userSubscription = null;
    if (userId) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            subscriptionTier: true,
            subscriptionStatus: true,
            stripeCurrentPeriodEnd: true,
          },
        });
        userSubscription = user;
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue without user subscription data
      }
    }

    // Return challenge data with access information
    const enrichedChallenges = challenges.map(challenge => {
      const hasAccess = userSubscription
        ? hasAccessToChallenge(userSubscription, challenge)
        : challenge.tier === 'free';

      return {
        slug: challenge.slug,
        title: challenge.title,
        summary: challenge.summary,
        difficulty: challenge.difficulty,
        category: challenge.category,
        skills: challenge.skills,
        estimatedTime: challenge.estimatedTime,
        tier: challenge.tier,
        hasAccess,
        premium: challenge.premium, // Legacy support
      };
    });

    return NextResponse.json(enrichedChallenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch challenges',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
