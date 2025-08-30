import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getChallengeBySlug, getChallengesSlugs, getRelatedChallenges } from "@/lib/mdx";
import ChallengePageContent from "./ChallengePageContent";

interface ChallengePageProps {
  params: Promise<{
    challenge: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getChallengesSlugs();
  return slugs.map((slug) => ({
    challenge: slug,
  }));
}

export async function generateMetadata({ params }: ChallengePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const challenge = await getChallengeBySlug(resolvedParams.challenge);
  
  if (!challenge) {
    return {
      title: "Challenge Not Found",
      description: "The requested challenge could not be found.",
    };
  }

  return {
    title: `${challenge.title} - You Build It`,
    description: challenge.summary,
    openGraph: {
      title: challenge.title,
      description: challenge.summary,
      type: 'article',
    },
  };
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
