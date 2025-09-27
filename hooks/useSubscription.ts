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
    async function fetchSubscriptionWithRetry(retries = 3) {
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

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await fetch('/api/subscriptions/status');

          if (!response.ok) {
            throw new Error(
              `Failed to fetch subscription (${response.status})`
            );
          }

          const subscriptionData = await response.json();

          // Check if the API returned a graceful error (database issues)
          if (subscriptionData.error) {
            console.warn('Subscription API warning:', subscriptionData.error);
            // Only show error message if this is a service/database connectivity issue
            // Don't show error for legitimate FREE tier users
            if (
              subscriptionData.error.includes(
                'Database temporarily unavailable'
              ) ||
              subscriptionData.error.includes('Service temporarily unavailable')
            ) {
              setError(
                'Temporarily showing free tier access due to server issues'
              );
            } else {
              setError(null); // Clear any previous errors for legitimate users
            }
          } else {
            setError(null); // Clear any previous errors
          }

          setSubscription(subscriptionData);
          setIsLoading(false);
          return; // Success, exit retry loop
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Unknown error';
          console.error(
            `Subscription fetch error (attempt ${attempt}/${retries}):`,
            errorMessage
          );

          // If this is the last attempt, handle the error
          if (attempt === retries) {
            setError(
              `Unable to load subscription status after ${retries} attempts: ${errorMessage}`
            );

            // Fallback to free subscription on error
            setSubscription({
              tier: 'FREE',
              status: 'FREE',
            });
            setIsLoading(false);
          } else {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve =>
              setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
            );
          }
        }
      }
    }

    fetchSubscriptionWithRetry();
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
