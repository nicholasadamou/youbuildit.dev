'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ClientChallenge } from '@/types/challenge';

interface UseChallengesOptions {
  autoLoad?: boolean;
  errorMessage?: string;
}

interface UseChallengesReturn {
  challenges: ClientChallenge[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getRandomChallenge: () => ClientChallenge | null;
  getRandomFreeChallenge: () => ClientChallenge | null;
}
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

  // All challenges are free; kept for backward compatibility with callers.
  const getRandomFreeChallenge = (): ClientChallenge | null =>
    getRandomChallenge();

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
