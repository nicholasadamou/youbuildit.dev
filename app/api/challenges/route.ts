import { NextResponse } from 'next/server';
import { getAllChallenges } from '@/lib/mdx';

export async function GET() {
  try {
    const challenges = await getAllChallenges();

    // Return simplified challenge data for client-side use
    const simplifiedChallenges = challenges.map(challenge => ({
      slug: challenge.slug,
      title: challenge.title,
      summary: challenge.summary,
      difficulty: challenge.difficulty,
      category: challenge.category,
      skills: challenge.skills,
      estimatedTime: challenge.estimatedTime,
    }));

    return NextResponse.json(simplifiedChallenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}
