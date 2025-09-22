'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useChallenges } from '@/hooks/useChallenges';

export interface NavigationOptions {
  onStart?: () => void;
  onSuccess?: (slug: string) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  fallbackUrl?: string;
}

export function useNavigateToChallenges() {
  const router = useRouter();

  return useCallback(() => {
    router.push('/challenges');
  }, [router]);
}

export function useNavigateToRandomFreeChallenge(
  options: NavigationOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { getRandomFreeChallenge } = useChallenges();

  const navigateToRandomFreeChallenge = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    options.onStart?.();

    try {
      const randomChallenge = getRandomFreeChallenge();
      if (randomChallenge) {
        options.onSuccess?.(randomChallenge.slug);
        router.push(`/challenge/${randomChallenge.slug}`);
      } else {
        // Fallback to challenges page or custom URL
        const fallbackUrl = options.fallbackUrl || '/challenges';
        router.push(fallbackUrl);
      }
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Navigation failed');
      console.error('Error navigating to random free challenge:', err);
      options.onError?.(err);

      // Fallback to challenges page or custom URL
      const fallbackUrl = options.fallbackUrl || '/challenges';
      router.push(fallbackUrl);
    } finally {
      setIsLoading(false);
      options.onComplete?.();
    }
  }, [isLoading, router, getRandomFreeChallenge, options]);

  return {
    navigateToRandomFreeChallenge,
    isLoading,
  };
}

export function useNavigateToRandomFreeChallengeAPI(
  options: NavigationOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const navigateToRandomFreeChallenge = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    options.onStart?.();

    try {
      const response = await fetch('/api/challenges/random?tier=free');
      if (response.ok) {
        const challenge = await response.json();
        options.onSuccess?.(challenge.slug);
        router.push(`/challenge/${challenge.slug}`);
      } else {
        throw new Error('Failed to fetch random free challenge');
      }
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Navigation failed');
      console.error('Error navigating to random free challenge:', err);
      options.onError?.(err);

      // Fallback to challenges page or custom URL
      const fallbackUrl = options.fallbackUrl || '/challenges';
      router.push(fallbackUrl);
    } finally {
      setIsLoading(false);
      options.onComplete?.();
    }
  }, [isLoading, router, options]);

  return {
    navigateToRandomFreeChallenge,
    isLoading,
  };
}

// Utility function for non-hook usage (for static components)
export async function navigateToRandomFreeChallenge(
  router: ReturnType<typeof useRouter>,
  options: NavigationOptions = {}
): Promise<void> {
  options.onStart?.();

  try {
    const response = await fetch('/api/challenges/random?tier=free');
    if (response.ok) {
      const challenge = await response.json();
      options.onSuccess?.(challenge.slug);
      router.push(`/challenge/${challenge.slug}`);
    } else {
      throw new Error('Failed to fetch random free challenge');
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Navigation failed');
    console.error('Error navigating to random free challenge:', err);
    options.onError?.(err);

    // Fallback to challenges page or custom URL
    const fallbackUrl = options.fallbackUrl || '/challenges';
    router.push(fallbackUrl);
  } finally {
    options.onComplete?.();
  }
}
