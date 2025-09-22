'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export interface Subscription {
  tier: 'FREE' | 'PRO' | 'TEAM';
  status:
    | 'ACTIVE'
    | 'CANCELED'
    | 'INCOMPLETE'
    | 'PAST_DUE'
    | 'TRIALING'
    | 'UNPAID'
    | 'FREE';
  currentPeriodEnd?: string | null;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export function useSubscription() {
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      if (!isLoaded) return;

      if (!user) {
        // User not signed in - set default free subscription
        setSubscription({
          tier: 'FREE',
          status: 'FREE',
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/subscriptions/status');
        if (!response.ok) {
          throw new Error('Failed to fetch subscription');
        }

        const subscriptionData = await response.json();
        setSubscription(subscriptionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to free subscription on error
        setSubscription({
          tier: 'FREE',
          status: 'FREE',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, [isLoaded, user]);

  // Helper to check if user has an active subscription
  const hasActiveSubscription =
    subscription &&
    subscription.tier !== 'FREE' &&
    ['ACTIVE', 'TRIALING'].includes(subscription.status);

  return {
    subscription,
    isLoading,
    error,
    hasActiveSubscription: !!hasActiveSubscription,
  };
}
