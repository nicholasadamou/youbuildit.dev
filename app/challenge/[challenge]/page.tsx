import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getChallengeBySlug,
  getChallengesSlugs,
  getRelatedChallenges,
} from '@/lib/mdx';
import { generateOpenGraphMetadata } from '@/lib/og-metadata';
import ChallengePageContent from './ChallengePageContent';

interface ChallengePageProps {
  params: Promise<{
    challenge: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getChallengesSlugs();
  return slugs.map(slug => ({
    challenge: slug,
  }));
}

export async function generateMetadata({
  params,
}: ChallengePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const challenge = await getChallengeBySlug(resolvedParams.challenge);

  if (!challenge) {
    return {
      title: 'Challenge Not Found - You Build It',
      description: 'The requested challenge could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return generateOpenGraphMetadata({
    title: challenge.title,
    description: challenge.summary,
    path: `/challenge/${challenge.slug}`,
    type: 'article',
    challengeData: {
      category: challenge.category,
      difficulty: challenge.difficulty,
      skills: challenge.skills,
      estimatedTime: challenge.estimatedTime,
    },
  });
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const resolvedParams = await params;
  const challenge = await getChallengeBySlug(resolvedParams.challenge);

  if (!challenge) {
    notFound();
  }

  const relatedChallenges = await getRelatedChallenges(challenge, 2);

  return (
    <ChallengePageContent
      challenge={challenge}
      relatedChallenges={relatedChallenges}
    />
  );
}
