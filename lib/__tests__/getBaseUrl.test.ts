import { describe, it, expect, afterEach } from 'vitest';
import { getBaseUrl } from '../getBaseUrl';

describe('getBaseUrl', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should return localhost URL in development', () => {
    process.env.NODE_ENV = 'development';
    const result = getBaseUrl();
    expect(result).toBe('http://localhost:3000');
  });

  it('should return production URL in production', () => {
    process.env.NODE_ENV = 'production';
    const result = getBaseUrl();
    expect(result).toBe('https://youbuildit.dev');
  });

  it('should return production URL when NODE_ENV is not development', () => {
    process.env.NODE_ENV = 'test';
    const result = getBaseUrl();
    expect(result).toBe('https://youbuildit.dev');
  });

  it('should return production URL when NODE_ENV is undefined', () => {
    delete process.env.NODE_ENV;
    const result = getBaseUrl();
    expect(result).toBe('https://youbuildit.dev');
  });
});
