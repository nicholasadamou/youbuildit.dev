import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('bg-red-500', 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    const result = cn('base-class', false && 'hidden', true && 'visible');
    expect(result).toBe('base-class visible');
  });

  it('should merge Tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['bg-blue-500', 'text-white'], 'p-4');
    expect(result).toBe('bg-blue-500 text-white p-4');
  });

  it('should handle objects with conditional classes', () => {
    const result = cn({
      'bg-red-500': true,
      'text-white': false,
      'p-4': true,
    });
    expect(result).toBe('bg-red-500 p-4');
  });

  it('should remove duplicate classes', () => {
    const result = cn('text-white', 'text-white', 'bg-red-500');
    expect(result).toBe('text-white bg-red-500');
  });
});
