import { Challenge } from './mdx';

export type SubscriptionTier = 'FREE' | 'PRO' | 'TEAM';
export type ChallengeTier = 'free' | 'pro' | 'team';

export interface UserSubscription {
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: string;
  stripeCurrentPeriodEnd?: Date | null;
}

export function hasAccessToChallenge(
  userSubscription: UserSubscription,
  challenge: Challenge
): boolean {
  const { subscriptionTier, subscriptionStatus } = userSubscription;

  // Everyone has access to free challenges
  if (challenge.tier === 'free') {
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
    challenge.tier === 'pro' &&
    (subscriptionTier === 'PRO' || subscriptionTier === 'TEAM')
  ) {
    return true;
  }

  // Team tier has access to team challenges
  if (challenge.tier === 'team' && subscriptionTier === 'TEAM') {
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
  switch (challenge.tier) {
    case 'free':
      return 'FREE';
    case 'pro':
      return 'PRO';
    case 'team':
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
