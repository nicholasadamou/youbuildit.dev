import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

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
}

export async function getAllChallenges(): Promise<Challenge[]> {
  if (!isServer) {
    throw new Error('getAllChallenges can only be called on the server');
  }
  
  const challengesDirectory = path.join(contentDirectory, 'challenges');
  
  if (!fs.existsSync(challengesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(challengesDirectory);
  const challenges = await Promise.all(
    fileNames
      .filter(name => name.endsWith('.mdx'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        return await getChallengeBySlug(slug);
      })
  );

  return challenges.filter(Boolean) as Challenge[];
}

export async function getChallengeBySlug(slug: string): Promise<Challenge | null> {
  if (!isServer) {
    throw new Error('getChallengeBySlug can only be called on the server');
  }
  
  try {
    const challengesDirectory = path.join(contentDirectory, 'challenges');
    const fullPath = path.join(challengesDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate required fields
    if (!data.title || !data.summary || !data.difficulty || !data.category || !data.skills || !data.estimatedTime) {
      console.warn(`Invalid frontmatter in ${slug}.mdx`);
      return null;
    }

    return {
      slug,
      title: data.title,
      summary: data.summary,
      difficulty: data.difficulty,
      category: data.category,
      skills: Array.isArray(data.skills) ? data.skills : [],
      estimatedTime: data.estimatedTime,
      content,
    };
  } catch (error) {
    console.error(`Error reading challenge ${slug}:`, error);
    return null;
  }
}

export function getChallengesSlugs(): string[] {
  if (!isServer) {
    throw new Error('getChallengesSlugs can only be called on the server');
  }
  
  const challengesDirectory = path.join(contentDirectory, 'challenges');
  
  if (!fs.existsSync(challengesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(challengesDirectory)
    .filter(name => name.endsWith('.mdx'))
    .map(name => name.replace(/\.mdx$/, ''));
}

export async function getRelatedChallenges(currentChallenge: Challenge, limit: number = 3): Promise<Challenge[]> {
  if (!isServer) {
    throw new Error('getRelatedChallenges can only be called on the server');
  }
  
  const allChallenges = await getAllChallenges();
  
  // Filter out the current challenge and find related ones based on category or skills
  const otherChallenges = allChallenges.filter(challenge => challenge.slug !== currentChallenge.slug);
  
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
