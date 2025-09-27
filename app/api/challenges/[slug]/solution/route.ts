import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { hasAccessToChallenge } from '@/lib/subscription';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('Solution API - User ID from Clerk:', userId);

    const { slug } = await params;

    // Get user subscription status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    console.log('Solution API - User from database:', user);

    if (!user) {
      console.log('Solution API - User not found in database for ID:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get challenge with solutions
    const challenge = await prisma.challenge.findUnique({
      where: { slug },
      include: {
        solutions: true,
        solutionMetadata: true,
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    if (
      !challenge.hasSolution ||
      !challenge.solutions ||
      challenge.solutions.length === 0
    ) {
      return NextResponse.json(
        { error: 'No solution available for this challenge' },
        { status: 404 }
      );
    }

    // Check if user has access to this challenge
    const challengeForAccess = {
      ...challenge,
      content: challenge.content || '',
      source: 'database' as const,
      difficulty: challenge.difficulty
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase()) as
        | 'Beginner'
        | 'Intermediate'
        | 'Advanced',
      solutionLanguage: challenge.solutionLanguage || undefined,
    };
    const hasAccess = hasAccessToChallenge(user, challengeForAccess);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied. Pro subscription required.' },
        { status: 403 }
      );
    }

    // Return solution data
    const solutionData = {
      language: challenge.solutionLanguage,
      files: challenge.solutions.map(file => ({
        type: file.fileType,
        filename: file.fileName,
        content: file.fileContent,
        relativePath: file.filePath,
      })),
      metadata: challenge.solutionMetadata
        ? {
            linesOfCode: challenge.solutionMetadata.linesOfCode,
            testCoverage: challenge.solutionMetadata.testCoverage,
            keyFeatures: challenge.solutionMetadata.keyFeatures,
            implementationNotes:
              challenge.solutionMetadata.implementationNotes?.split('\n') || [],
          }
        : null,
    };

    return NextResponse.json(solutionData);
  } catch (error) {
    console.error('Error fetching solution:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch solution',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
