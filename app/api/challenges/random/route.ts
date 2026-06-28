import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Lightweight projection — only the summary fields are needed here,
    // so avoid materializing the full MDX content of every challenge.
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
      },
    });

    if (challenges.length === 0) {
      return NextResponse.json(
        { error: 'No challenges available' },
        { status: 404 }
      );
    }

    // Get a random challenge
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const randomChallenge = challenges[randomIndex];

    const formatDifficulty = (difficulty: string) =>
      difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

    return NextResponse.json({
      slug: randomChallenge.slug,
      title: randomChallenge.title,
      summary: randomChallenge.summary,
      difficulty: formatDifficulty(randomChallenge.difficulty),
      category: randomChallenge.category,
      skills: randomChallenge.skills,
      estimatedTime: randomChallenge.estimatedTime,
    });
  } catch (error) {
    console.error('Error fetching random challenge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random challenge' },
      { status: 500 }
    );
  }
}
