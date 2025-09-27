'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Code, Tag, Github, MessageCircle } from 'lucide-react';

// Components
import MDXContent from '@/components/mdx/MDXContent';
import Footer from '@/components/sections/Footer';
import RelatedChallenges from '@/components/RelatedChallenges';
import ChallengeSolution from '@/components/ChallengeSolution';
import DifficultyTag from '@/components/ui/DifficultyTag';
import PremiumBadge from '@/components/PremiumBadge';
import PaywallOverlay from '@/components/PaywallOverlay';
import SolutionPaywallOverlay from '@/components/SolutionPaywallOverlay';

// Hooks and utilities
import { useSubscription } from '@/hooks/useSubscription';
import { hasAccessToChallenge } from '@/lib/subscription';
import { type Challenge } from '@/lib/mdx';

interface ChallengePageContentProps {
  challenge: Challenge;
  relatedChallenges: Challenge[];
}

export default function ChallengePageContent({
  challenge,
  relatedChallenges,
}: ChallengePageContentProps) {
  // ===== Hooks =====
  const { subscription, isLoading: isSubscriptionLoading } = useSubscription();
  const router = useRouter();

  // ===== Access Control =====
  const hasAccess = subscription
    ? hasAccessToChallenge(
        {
          subscriptionTier: subscription.tier,
          subscriptionStatus: subscription.status,
          stripeCurrentPeriodEnd: subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd)
            : null,
        },
        challenge
      )
    : challenge.tier === 'FREE';

  // Determine if content should be blurred for paywall
  const shouldBlurContent =
    !isSubscriptionLoading && !hasAccess && challenge.tier !== 'FREE';

  // ===== Event Handlers =====
  // Handle escape key to navigate away from paywall
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && shouldBlurContent) {
        router.push('/challenges?tier=FREE'); // Navigate to challenges page with free filter on escape
      }
    },
    [shouldBlurContent, router]
  );

  // ===== Effects =====
  // Prevent scrolling when paywall is active and add escape key listener
  useEffect(() => {
    if (shouldBlurContent) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscapeKey);
    }

    // Cleanup function to restore scrolling and remove listener when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [shouldBlurContent, handleEscapeKey]);

  // ===== Render =====
  // Show loading state while checking subscription
  if (isSubscriptionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {/* Add styles to prevent easy bypass of blur effect */}
          {shouldBlurContent && (
            <style jsx>{`
              .challenge-content * {
                user-select: none !important;
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                pointer-events: none !important;
              }
            `}</style>
          )}
          {/* Challenge Content Wrapper */}
          <div className={shouldBlurContent ? 'challenge-content' : ''}>
            {/* Challenge Header */}
            <motion.div
              className={`mb-8 ${shouldBlurContent ? 'blur-sm pointer-events-none select-none' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <motion.h1
                  className="text-4xl font-bold text-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {challenge.title}
                </motion.h1>
                <motion.div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <PremiumBadge tier={challenge.tier} size="md" />
                  <DifficultyTag
                    difficulty={challenge.difficulty}
                    size="md"
                    animated={false}
                  />
                </motion.div>
              </div>

              <motion.p
                className="text-xl text-muted-foreground mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {challenge.summary}
              </motion.p>

              {/* Challenge Metadata */}
              <motion.div
                className="flex flex-wrap items-center gap-6 p-4 bg-card rounded-lg border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-card-foreground">
                    <strong>Estimated Time:</strong> {challenge.estimatedTime}
                  </span>
                </motion.div>

                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <Code className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-card-foreground">
                    <strong>Category:</strong> {challenge.category}
                  </span>
                </motion.div>
              </motion.div>

              {/* Skills */}
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.div
                  className="flex items-center gap-2 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">
                    Skills you&apos;ll learn:
                  </span>
                </motion.div>
                <div className="flex flex-wrap gap-2">
                  {challenge.skills.map((skill: string, index: number) => (
                    <motion.span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Challenge Content */}
            <motion.div
              className={`prose prose-lg max-w-none dark:prose-invert ${shouldBlurContent ? 'blur-md pointer-events-none select-none' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <MDXContent content={challenge.content} />
            </motion.div>

            {/* Solution Section - Always blurred for non-Pro users */}
            <div className="relative">
              <div
                className={
                  // Solution should be blurred if user doesn't have Pro access (separate from main content access)
                  !isSubscriptionLoading &&
                  (!subscription || subscription.tier !== 'PRO')
                    ? 'blur-sm pointer-events-none select-none'
                    : ''
                }
              >
                <ChallengeSolution
                  challengeSlug={challenge.slug}
                  challengeTier={challenge.tier}
                  hasSolutionAvailable={challenge.hasSolution}
                  hasAccess={subscription?.tier === 'PRO'}
                />
              </div>

              {/* Solution Paywall Overlay */}
              {!isSubscriptionLoading &&
                (!subscription || subscription.tier !== 'PRO') &&
                challenge.hasSolution && (
                  <SolutionPaywallOverlay
                    isSubscriptionLoading={isSubscriptionLoading}
                  />
                )}
            </div>
          </div>

          {/* Footer Call-to-Action */}
          <motion.div
            className={`mt-12 p-6 bg-gradient-to-r from-[--brand] to-green-600 rounded-lg text-white ${shouldBlurContent ? 'blur-sm pointer-events-none select-none' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h3
              className="text-xl font-semibold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              Ready to start building?
            </motion.h3>
            <motion.p
              className="text-green-100 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.3 }}
            >
              This challenge will help you understand{' '}
              {challenge.category.toLowerCase()} concepts and improve your
              skills in {challenge.skills.slice(0, 3).join(', ')}.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.4 }}
            >
              {process.env.NEXT_PUBLIC_CODE_REPO_URL && (
                <motion.a
                  href={process.env.NEXT_PUBLIC_CODE_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-white text-[--brand] font-medium rounded-md hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-4 h-4" />
                  View Examples
                </motion.a>
              )}
              <motion.a
                href={`${process.env.NEXT_PUBLIC_FEEDBACK_REPO_URL || 'https://github.com/youbuildit/youbuildit-feedback'}/issues/new?title=Feedback: ${encodeURIComponent(challenge.title)}&body=${encodeURIComponent(`**Challenge:** ${challenge.title}\n**Category:** ${challenge.category}\n**Difficulty:** ${challenge.difficulty}\n\n## Feedback\n\n<!-- Please share your feedback about this challenge -->\n\n## Suggestions\n\n<!-- Any suggestions for improvement? -->`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 border border-green-200 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-4 h-4" />
                Share Feedback
              </motion.a>
            </motion.div>
            <motion.div
              className="mt-4 pt-4 border-t border-green-400/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.5 }}
            >
              <p className="text-sm text-green-100">
                💡 <strong>Tip:</strong> Share your feedback and discuss
                solutions with the community using the feedback link above!
              </p>
            </motion.div>
          </motion.div>

          {/* Related Challenges Section */}
          <div
            className={
              shouldBlurContent ? 'blur-sm pointer-events-none select-none' : ''
            }
          >
            <RelatedChallenges challenges={relatedChallenges} />
          </div>
        </div>

        {/* Main Challenge Paywall Overlay */}
        <AnimatePresence>
          {shouldBlurContent && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: 'auto' }}
            >
              <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <PaywallOverlay challenge={challenge} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer bgColor="bg-secondary" />
    </>
  );
}
