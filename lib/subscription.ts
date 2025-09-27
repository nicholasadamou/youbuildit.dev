import { Challenge } from './mdx';

export type SubscriptionTier = 'FREE' | 'PRO';
export type ChallengeTier = 'FREE' | 'PRO' | 'free' | 'pro'; // Support both formats

export interface UserSubscription {
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: string;
  stripeCurrentPeriodEnd?: Date | null;
}

// Helper to normalize tier values
function normalizeTier(tier: string): 'FREE' | 'PRO' {
  const normalized = tier.toUpperCase();
  // Convert legacy TEAM tier to PRO
  if (normalized === 'TEAM') {
    return 'PRO';
  }
  return normalized as 'FREE' | 'PRO';
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
  if (challengeTier === 'PRO' && subscriptionTier === 'PRO') {
    return true;
  }

  return false;
}

export function getSubscriptionBenefits(tier: SubscriptionTier): string[] {
  switch (tier) {
    case 'FREE':
      return ['Access to 20+ beginner challenges', 'Community support'];
    case 'PRO':
      return [
        'Access to all challenges (50+)',
        'Premium challenges with detailed solutions',
        'Priority support',
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
    default:
      return 'This challenge is available with your current subscription.';
  }
}
