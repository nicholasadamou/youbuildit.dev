import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all published challenges from the database
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
        hasSolution: true,
        solutionLanguage: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Helper function to convert difficulty to proper case
    const formatDifficulty = (difficulty: string) => {
      return (
        difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
      );
    };

    const formattedChallenges = challenges.map(challenge => ({
      slug: challenge.slug,
      title: challenge.title,
      summary: challenge.summary,
      difficulty: formatDifficulty(challenge.difficulty),
      category: challenge.category,
      skills: challenge.skills,
      estimatedTime: challenge.estimatedTime,
      hasSolution: challenge.hasSolution,
      solutionLanguage: challenge.solutionLanguage ?? undefined,
    }));

    return NextResponse.json(formattedChallenges);
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
