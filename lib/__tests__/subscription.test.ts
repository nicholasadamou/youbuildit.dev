import { describe, it, expect } from 'vitest';
import {
  hasAccessToChallenge,
  getSubscriptionBenefits,
  getRequiredTierForChallenge,
  filterChallengesByAccess,
  isSubscriptionExpired,
  getUpgradeMessage,
  type UserSubscription,
} from '../subscription';
import type { Challenge } from '../mdx';

describe('hasAccessToChallenge', () => {
  const freeChallenge: Challenge = {
    slug: 'test',
    title: 'Test',
    summary: 'Test',
    difficulty: 'Beginner',
    category: 'Test',
    skills: [],
    estimatedTime: '1h',
    content: '',
    tier: 'FREE',
    source: 'database',
  };

  const proChallenge: Challenge = {
    ...freeChallenge,
    tier: 'PRO',
  };

  it('should allow everyone to access free challenges', () => {
    const freeUser: UserSubscription = {
      subscriptionTier: 'FREE',
      subscriptionStatus: 'INACTIVE',
    };
    expect(hasAccessToChallenge(freeUser, freeChallenge)).toBe(true);
  });

  it('should allow pro users to access pro challenges', () => {
    const proUser: UserSubscription = {
      subscriptionTier: 'PRO',
      subscriptionStatus: 'ACTIVE',
    };
    expect(hasAccessToChallenge(proUser, proChallenge)).toBe(true);
  });

  it('should deny free users access to pro challenges', () => {
    const freeUser: UserSubscription = {
      subscriptionTier: 'FREE',
      subscriptionStatus: 'ACTIVE',
    };
    expect(hasAccessToChallenge(freeUser, proChallenge)).toBe(false);
  });

  it('should allow trialing users to access pro challenges', () => {
    const trialingUser: UserSubscription = {
      subscriptionTier: 'PRO',
      subscriptionStatus: 'TRIALING',
    };
    expect(hasAccessToChallenge(trialingUser, proChallenge)).toBe(true);
  });

  it('should deny inactive pro users access to pro challenges', () => {
    const inactiveUser: UserSubscription = {
      subscriptionTier: 'PRO',
      subscriptionStatus: 'CANCELED',
    };
    expect(hasAccessToChallenge(inactiveUser, proChallenge)).toBe(false);
  });

  it('should handle legacy TEAM tier as PRO', () => {
    const challenge: Challenge = {
      ...freeChallenge,
      tier: 'PRO',
    };
    const proUser: UserSubscription = {
      subscriptionTier: 'PRO',
      subscriptionStatus: 'ACTIVE',
    };
    expect(hasAccessToChallenge(proUser, challenge)).toBe(true);
  });
});

describe('getSubscriptionBenefits', () => {
  it('should return free tier benefits', () => {
    const benefits = getSubscriptionBenefits('FREE');
    expect(benefits).toContain('Access to 20+ beginner challenges');
    expect(benefits).toContain('Community support');
  });

  it('should return pro tier benefits', () => {
    const benefits = getSubscriptionBenefits('PRO');
    expect(benefits).toContain('Access to all challenges (50+)');
    expect(benefits).toContain('Premium challenges with detailed solutions');
  });
});

describe('getRequiredTierForChallenge', () => {
  it('should return FREE for free challenges', () => {
    const challenge: Challenge = {
      slug: 'test',
      title: 'Test',
      summary: 'Test',
      difficulty: 'Beginner',
      category: 'Test',
      skills: [],
      estimatedTime: '1h',
      content: '',
      tier: 'FREE',
      source: 'database',
    };
    expect(getRequiredTierForChallenge(challenge)).toBe('FREE');
  });

  it('should return PRO for pro challenges', () => {
    const challenge: Challenge = {
      slug: 'test',
      title: 'Test',
      summary: 'Test',
      difficulty: 'Beginner',
      category: 'Test',
      skills: [],
      estimatedTime: '1h',
      content: '',
      tier: 'PRO',
      source: 'database',
    };
    expect(getRequiredTierForChallenge(challenge)).toBe('PRO');
  });
});

describe('filterChallengesByAccess', () => {
  const challenges: Challenge[] = [
    {
      slug: 'free-1',
      title: 'Free Challenge 1',
      summary: 'Test',
      difficulty: 'Beginner',
      category: 'Test',
      skills: [],
      estimatedTime: '1h',
      content: '',
      tier: 'FREE',
      source: 'database',
    },
    {
      slug: 'pro-1',
      title: 'Pro Challenge 1',
      summary: 'Test',
      difficulty: 'Beginner',
      category: 'Test',
      skills: [],
      estimatedTime: '1h',
      content: '',
      tier: 'PRO',
      source: 'database',
    },
    {
      slug: 'free-2',
      title: 'Free Challenge 2',
      summary: 'Test',
      difficulty: 'Beginner',
      category: 'Test',
      skills: [],
      estimatedTime: '1h',
      content: '',
      tier: 'FREE',
      source: 'database',
    },
  ];

  it('should return only free challenges for free users', () => {
    const freeUser: UserSubscription = {
      subscriptionTier: 'FREE',
      subscriptionStatus: 'INACTIVE',
    };
    const result = filterChallengesByAccess(challenges, freeUser);
    expect(result.length).toBe(2);
    expect(result.every(c => c.tier === 'FREE')).toBe(true);
  });

  it('should return all challenges for pro users', () => {
    const proUser: UserSubscription = {
      subscriptionTier: 'PRO',
      subscriptionStatus: 'ACTIVE',
    };
    const result = filterChallengesByAccess(challenges, proUser);
    expect(result.length).toBe(3);
  });
});

describe('isSubscriptionExpired', () => {
  it('should return false when no period end date', () => {
    const subscription: UserSubscription = {
      subscriptionTier: 'PRO',
      subscriptionStatus: 'ACTIVE',
    };
    expect(isSubscriptionExpired(subscription)).toBe(false);
  });

  it('should return true when period end is in the past', () => {
    const subscription: UserSubscription = {
      subscriptionTier: 'PRO',
      subscriptionStatus: 'ACTIVE',
      stripeCurrentPeriodEnd: new Date('2020-01-01'),
    };
    expect(isSubscriptionExpired(subscription)).toBe(true);
  });

  it('should return false when period end is in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const subscription: UserSubscription = {
      subscriptionTier: 'PRO',
      subscriptionStatus: 'ACTIVE',
      stripeCurrentPeriodEnd: futureDate,
    };
    expect(isSubscriptionExpired(subscription)).toBe(false);
  });
});

describe('getUpgradeMessage', () => {
  it('should return pro upgrade message for pro challenges', () => {
    const challenge: Challenge = {
      slug: 'test',
      title: 'Test',
      summary: 'Test',
      difficulty: 'Beginner',
      category: 'Test',
      skills: [],
      estimatedTime: '1h',
      content: '',
      tier: 'PRO',
      source: 'database',
    };
    const message = getUpgradeMessage(challenge);
    expect(message).toContain('Upgrade to Pro');
    expect(message).toContain('premium challenge');
  });

  it('should return available message for free challenges', () => {
    const challenge: Challenge = {
      slug: 'test',
      title: 'Test',
      summary: 'Test',
      difficulty: 'Beginner',
      category: 'Test',
      skills: [],
      estimatedTime: '1h',
      content: '',
      tier: 'FREE',
      source: 'database',
    };
    const message = getUpgradeMessage(challenge);
    expect(message).toContain('available with your current subscription');
  });
});
