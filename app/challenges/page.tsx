import { Metadata } from 'next';
import { generateOpenGraphMetadata } from '@/lib/og-metadata';
import { Suspense } from 'react';
import ChallengesPageContent from './ChallengesPageContent';

export const metadata: Metadata = generateOpenGraphMetadata({
  title: 'Coding Challenges',
  description:
    "Build real applications and improve your programming skills with our hands-on coding challenges. Each challenge teaches practical concepts through building tools you'll actually use.",
  path: '/challenges',
  type: 'website',
});

export default function ChallengesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--brand] mx-auto mb-4" />
            <p className="text-muted-foreground">Loading challenges...</p>
          </div>
        </div>
      }
    >
      <ChallengesPageContent />
    </Suspense>
  );
}
