import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to check if we're on the server
const isServer = typeof window === 'undefined';

export interface Challenge {
  slug: string;
  title: string;
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  skills: string[];
  estimatedTime: string;
  content: string;
  tier: 'FREE' | 'PRO';
  premium?: boolean; // Backward compatibility
  source: 'file' | 'database'; // Track where content comes from
}

export async function getAllChallenges(): Promise<Challenge[]> {
  if (!isServer) {
    throw new Error('getAllChallenges can only be called on the server');
  }

  // Get ALL published challenges from database (paywall handled in frontend)
  const dbChallenges = await prisma.challenge.findMany({
    where: {
      published: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Convert database challenges to Challenge interface
  return dbChallenges.map(dbChallenge => ({
    slug: dbChallenge.slug,
    title: dbChallenge.title,
    summary: dbChallenge.summary,
    difficulty: dbChallenge.difficulty
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase()) as
      | 'Beginner'
      | 'Intermediate'
      | 'Advanced',
    category: dbChallenge.category,
    skills: dbChallenge.skills,
    estimatedTime: dbChallenge.estimatedTime,
    content: dbChallenge.content,
    tier: dbChallenge.tier,
    source: 'database' as const,
  }));
}

// Get challenge from database
export async function getChallengeBySlug(
  slug: string
): Promise<Challenge | null> {
  if (!isServer) {
    throw new Error('getChallengeBySlug can only be called on the server');
  }

  try {
    // Get ANY published challenge by slug (paywall handled in frontend)
    const dbChallenge = await prisma.challenge.findFirst({
      where: {
        slug,
        published: true,
      },
    });

    if (dbChallenge) {
      return {
        slug: dbChallenge.slug,
        title: dbChallenge.title,
        summary: dbChallenge.summary,
        difficulty: dbChallenge.difficulty
          .toLowerCase()
          .replace(/^\w/, c => c.toUpperCase()) as
          | 'Beginner'
          | 'Intermediate'
          | 'Advanced',
        category: dbChallenge.category,
        skills: dbChallenge.skills,
        estimatedTime: dbChallenge.estimatedTime,
        content: dbChallenge.content,
        tier: dbChallenge.tier,
        source: 'database' as const,
      };
    }

    return null;
  } catch (error) {
    console.error(`Error reading challenge from database ${slug}:`, error);
    return null;
  }
}

export async function getChallengesSlugs(): Promise<string[]> {
  if (!isServer) {
    throw new Error('getChallengesSlugs can only be called on the server');
  }

  try {
    // Get ALL published challenge slugs (paywall handled in frontend)
    const dbChallenges = await prisma.challenge.findMany({
      where: {
        published: true,
      },
      select: { slug: true },
    });

    return dbChallenges.map(challenge => challenge.slug);
  } catch (error) {
    console.error('Error getting challenges from database:', error);
    return [];
  }
}

export async function getRelatedChallenges(
  currentChallenge: Challenge,
  limit: number = 3
): Promise<Challenge[]> {
  if (!isServer) {
    throw new Error('getRelatedChallenges can only be called on the server');
  }

  const allChallenges = await getAllChallenges();

  // Filter out the current challenge and find related ones based on category or skills
  const otherChallenges = allChallenges.filter(
    challenge => challenge.slug !== currentChallenge.slug
  );

  // Score challenges based on similarity
  const scored = otherChallenges.map(challenge => {
    let score = 0;

    // Same category gets higher score
    if (challenge.category === currentChallenge.category) {
      score += 10;
    }

    // Same difficulty gets some points
    if (challenge.difficulty === currentChallenge.difficulty) {
      score += 5;
    }

    // Shared skills get points
    const sharedSkills = challenge.skills.filter(skill =>
      currentChallenge.skills.includes(skill)
    ).length;
    score += sharedSkills * 3;

    return { challenge, score };
  });

  // Sort by score and return top matches
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.challenge);
}
