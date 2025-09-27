import { Challenge } from './mdx';

export type SubscriptionTier = 'FREE' | 'PRO' | 'TEAM';
export type ChallengeTier = 'FREE' | 'PRO' | 'TEAM' | 'free' | 'pro' | 'team'; // Support both formats

export interface UserSubscription {
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: string;
  stripeCurrentPeriodEnd?: Date | null;
}

// Helper to normalize tier values
function normalizeTier(tier: string): 'FREE' | 'PRO' | 'TEAM' {
  return tier.toUpperCase() as 'FREE' | 'PRO' | 'TEAM';
}

export function hasAccessToChallenge(
  userSubscription: UserSubscription,
  challenge: Challenge
): boolean {
  const { subscriptionTier, subscriptionStatus } = userSubscription;
  const challengeTier = normalizeTier(challenge.tier);

  // Everyone has access to free challenges
  if (challengeTier === 'FREE') {
    return true;
  }

  // Check if user has an active subscription
  const isActiveSubscription =
    subscriptionStatus === 'ACTIVE' || subscriptionStatus === 'TRIALING';

  if (!isActiveSubscription) {
    return false;
  }

  // Pro tier has access to pro challenges
  if (
    challengeTier === 'PRO' &&
    (subscriptionTier === 'PRO' || subscriptionTier === 'TEAM')
  ) {
    return true;
  }

  // Team tier has access to team challenges
  if (challengeTier === 'TEAM' && subscriptionTier === 'TEAM') {
    return true;
  }

  return false;
}

export function getSubscriptionBenefits(tier: SubscriptionTier): string[] {
  switch (tier) {
    case 'FREE':
      return [
        'Access to 20+ beginner challenges',
        'Community support',
        'Basic progress tracking',
      ];
    case 'PRO':
      return [
        'Access to all challenges (50+)',
        'Premium challenges with detailed solutions',
        'Priority support',
        'Advanced progress analytics',
        'Challenge completion certificates',
      ];
    case 'TEAM':
      return [
        'Everything in Pro',
        'Team dashboard and progress tracking',
        'Custom challenge requests',
        'Enterprise support',
        'White-label options',
      ];
    default:
      return [];
  }
}

export function getRequiredTierForChallenge(
  challenge: Challenge
): SubscriptionTier {
  const challengeTier = normalizeTier(challenge.tier);
  switch (challengeTier) {
    case 'FREE':
      return 'FREE';
    case 'PRO':
      return 'PRO';
    case 'TEAM':
      return 'TEAM';
    default:
      return 'FREE';
  }
}

export function filterChallengesByAccess(
  challenges: Challenge[],
  userSubscription: UserSubscription
): Challenge[] {
  return challenges.filter(challenge =>
    hasAccessToChallenge(userSubscription, challenge)
  );
}

export function isSubscriptionExpired(subscription: UserSubscription): boolean {
  if (!subscription.stripeCurrentPeriodEnd) {
    return false;
  }

  return new Date() > subscription.stripeCurrentPeriodEnd;
}

export function getUpgradeMessage(challenge: Challenge): string {
  const requiredTier = getRequiredTierForChallenge(challenge);

  switch (requiredTier) {
    case 'PRO':
      return 'Upgrade to Pro to access this premium challenge with detailed solutions and explanations.';
    case 'TEAM':
      return 'Upgrade to Team to access this exclusive team challenge and unlock advanced features.';
    default:
      return 'This challenge is available with your current subscription.';
  }
}
