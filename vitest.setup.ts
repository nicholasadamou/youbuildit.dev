import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => {
    // Return a simple mock object that behaves like URLSearchParams
    return {
      get: vi.fn(() => null),
      has: vi.fn(() => false),
      toString: vi.fn(() => ''),
    };
  }),
}));

// Mock environment variables
process.env.NODE_ENV = 'test';
