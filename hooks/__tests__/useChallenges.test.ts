import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useChallenges } from '../useChallenges';
import type { ClientChallenge } from '@/types/challenge';

// Mock fetch
global.fetch = vi.fn();

describe('useChallenges', () => {
  const mockChallenges: ClientChallenge[] = [
    {
      slug: 'free-challenge-1',
      title: 'Free Challenge 1',
      summary: 'Test',
      difficulty: 'Beginner',
      category: 'Test',
      skills: ['JavaScript'],
      estimatedTime: '1h',
      tier: 'FREE',
      hasSolution: false,
    },
    {
      slug: 'free-challenge-2',
      title: 'Free Challenge 2',
      summary: 'Test',
      difficulty: 'Intermediate',
      category: 'Test',
      skills: ['TypeScript'],
      estimatedTime: '2h',
      tier: 'FREE',
      hasSolution: true,
    },
    {
      slug: 'pro-challenge-1',
      title: 'Pro Challenge 1',
      summary: 'Test',
      difficulty: 'Advanced',
      category: 'Test',
      skills: ['React'],
      estimatedTime: '3h',
      tier: 'PRO',
      hasSolution: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should load challenges on mount by default', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChallenges,
    });

    const { result } = renderHook(() => useChallenges());

    expect(result.current.loading).toBe(true);
    expect(result.current.challenges).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.challenges).toEqual(mockChallenges);
    expect(result.current.error).toBe(null);
  });

  it('should not auto-load when autoLoad is false', () => {
    const { result } = renderHook(() => useChallenges({ autoLoad: false }));

    expect(result.current.loading).toBe(false);
    expect(result.current.challenges).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle fetch errors', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).not.toBe(null);
    expect(result.current.error?.message).toContain(
      'Failed to fetch challenges'
    );
    expect(result.current.challenges).toEqual([]);
  });

  it('should use custom error message', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const customError = 'Custom error message';
    const { result } = renderHook(() =>
      useChallenges({ errorMessage: customError })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error?.message).toContain(customError);
  });

  it('should refetch challenges', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockChallenges,
    });

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.challenges).toEqual(mockChallenges);

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should get random challenge', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChallenges,
    });

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const randomChallenge = result.current.getRandomChallenge();
    expect(randomChallenge).not.toBe(null);
    expect(mockChallenges).toContainEqual(randomChallenge);
  });

  it('should return null for random challenge when no challenges loaded', () => {
    const { result } = renderHook(() => useChallenges({ autoLoad: false }));

    const randomChallenge = result.current.getRandomChallenge();
    expect(randomChallenge).toBe(null);
  });

  it('should get random free challenge', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChallenges,
    });

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const randomFreeChallenge = result.current.getRandomFreeChallenge();
    expect(randomFreeChallenge).not.toBe(null);
    expect(randomFreeChallenge?.tier.toUpperCase()).toBe('FREE');
  });

  it('should return null for random free challenge when no free challenges', async () => {
    const proChallenges: ClientChallenge[] = [
      {
        slug: 'pro-challenge',
        title: 'Pro Challenge',
        summary: 'Test',
        difficulty: 'Advanced',
        category: 'Test',
        skills: [],
        estimatedTime: '3h',
        tier: 'PRO',
        hasSolution: true,
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => proChallenges,
    });

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const randomFreeChallenge = result.current.getRandomFreeChallenge();
    expect(randomFreeChallenge).toBe(null);
  });

  it('should handle network errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).not.toBe(null);
    expect(result.current.error?.message).toBe('Network error');
  });

  it('should clear error on successful refetch', async () => {
    // First fetch fails
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).not.toBe(null);
    });

    // Second fetch succeeds
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChallenges,
    });

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    expect(result.current.challenges).toEqual(mockChallenges);
  });
});
