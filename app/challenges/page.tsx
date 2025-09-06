import { Metadata } from 'next';
import { generateOpenGraphMetadata } from '@/lib/og-metadata';
import ChallengesPageContent from './ChallengesPageContent';

export const metadata: Metadata = generateOpenGraphMetadata({
  title: 'Coding Challenges',
  description:
    "Build real applications and improve your programming skills with our hands-on coding challenges. Each challenge teaches practical concepts through building tools you'll actually use.",
  path: '/challenges',
  type: 'website',
});

export default function ChallengesPage() {
  return <ChallengesPageContent />;
}
