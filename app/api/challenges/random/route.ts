import { NextResponse } from 'next/server';
import { getAllChallenges } from '@/lib/mdx';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier');

    const allChallenges = await getAllChallenges();

    if (allChallenges.length === 0) {
      return NextResponse.json(
        { error: 'No challenges available' },
        { status: 404 }
      );
    }

    // Filter challenges by tier if specified
    const challenges = tier
      ? allChallenges.filter(challenge => challenge.tier === tier)
      : allChallenges;

    if (challenges.length === 0) {
      return NextResponse.json(
        { error: `No ${tier || ''} challenges available` },
        { status: 404 }
      );
    }

    // Get a random challenge
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const randomChallenge = challenges[randomIndex];

    // Return simplified challenge data
    const simplifiedChallenge = {
      slug: randomChallenge.slug,
      title: randomChallenge.title,
      summary: randomChallenge.summary,
      difficulty: randomChallenge.difficulty,
      category: randomChallenge.category,
      skills: randomChallenge.skills,
      estimatedTime: randomChallenge.estimatedTime,
    };

    return NextResponse.json(simplifiedChallenge);
  } catch (error) {
    console.error('Error fetching random challenge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random challenge' },
      { status: 500 }
    );
  }
}
