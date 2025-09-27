import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { hasAccessToChallenge } from '@/lib/subscription';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();

    // Fetch challenges from database
    const challenges = await prisma.challenge.findMany({
      where: { published: true },
      select: {
        slug: true,
        title: true,
        summary: true,
        difficulty: true,
        category: true,
        skills: true,
        estimatedTime: true,
        tier: true,
        hasSolution: true,
        solutionLanguage: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

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

    // Helper function to convert difficulty to proper case
    const formatDifficulty = (difficulty: string) => {
      return (
        difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
      );
    };

    // Return challenge data with access information
    const enrichedChallenges = challenges.map(challenge => {
      const hasAccess = userSubscription
        ? hasAccessToChallenge(userSubscription, {
            ...challenge,
            content: '',
            source: 'database' as const,
            difficulty: formatDifficulty(challenge.difficulty) as
              | 'Beginner'
              | 'Intermediate'
              | 'Advanced',
            solutionLanguage: challenge.solutionLanguage || undefined,
          })
        : challenge.tier === 'FREE';

      return {
        slug: challenge.slug,
        title: challenge.title,
        summary: challenge.summary,
        difficulty: formatDifficulty(challenge.difficulty),
        category: challenge.category,
        skills: challenge.skills,
        estimatedTime: challenge.estimatedTime,
        tier: challenge.tier,
        hasAccess,
        hasSolution: challenge.hasSolution,
        solutionLanguage: challenge.solutionLanguage,
        premium: challenge.tier === 'PRO', // Legacy support
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
