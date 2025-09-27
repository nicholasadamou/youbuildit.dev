'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ClientChallenge } from '@/types/challenge';

interface UseChallengesOptions {
  /**
   * Whether to automatically load challenges on mount.
   * @default true
   */
  autoLoad?: boolean;
  /**
   * Custom error message for fetch failures.
   * @default 'Failed to fetch challenges'
   */
  errorMessage?: string;
}

interface UseChallengesReturn {
  /** Array of challenges */
  challenges: ClientChallenge[];
  /** Whether challenges are currently loading */
  loading: boolean;
  /** Error object if the fetch failed */
  error: Error | null;
  /** Function to manually reload challenges */
  refetch: () => Promise<void>;
  /** Function to get a random challenge from the loaded challenges */
  getRandomChallenge: () => ClientChallenge | null;
  /** Function to get a random free challenge from the loaded challenges */
  getRandomFreeChallenge: () => ClientChallenge | null;
}

/**
 * Custom hook for loading challenges from the API.
 * Provides loading state, error handling, and utility functions.
 *
 * @param options - Configuration options for the hook
 * @returns Object containing challenges, loading state, error, and utility functions
 */
export function useChallenges(
  options: UseChallengesOptions = {}
): UseChallengesReturn {
  const { autoLoad = true, errorMessage = 'Failed to fetch challenges' } =
    options;

  const [challenges, setChallenges] = useState<ClientChallenge[]>([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<Error | null>(null);

  const loadChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/challenges');
      if (!response.ok) {
        throw new Error(`${errorMessage}: ${response.status}`);
      }

      const challengesData = await response.json();
      setChallenges(challengesData);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  }, [errorMessage]);

  const getRandomChallenge = (): ClientChallenge | null => {
    if (challenges.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
  };

  const getRandomFreeChallenge = (): ClientChallenge | null => {
    const freeChallenges = challenges.filter(
      challenge => challenge.tier.toUpperCase() === 'FREE'
    );
    if (freeChallenges.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * freeChallenges.length);
    return freeChallenges[randomIndex];
  };

  useEffect(() => {
    if (autoLoad) {
      loadChallenges();
    }
  }, [autoLoad, loadChallenges]);

  return {
    challenges,
    loading,
    error,
    refetch: loadChallenges,
    getRandomChallenge,
    getRandomFreeChallenge,
  };
}
