import { describe, it, expect } from 'vitest';
import { formatShortDate, formatLongDateWithSuffix } from '../formatShortDate';

describe('formatShortDate', () => {
  it('should format date with short month', () => {
    const result = formatShortDate('2024-01-15');
    expect(result).toBe('Jan 15, 2024');
  });

  it('should format date with UTC timezone', () => {
    const result = formatShortDate('2024-12-25');
    expect(result).toBe('Dec 25, 2024');
  });

  it('should handle different months', () => {
    expect(formatShortDate('2024-03-01')).toBe('Mar 01, 2024');
    expect(formatShortDate('2024-06-30')).toBe('Jun 30, 2024');
    expect(formatShortDate('2024-09-15')).toBe('Sep 15, 2024');
  });
});

describe('formatLongDateWithSuffix', () => {
  it('should add "st" suffix for 1st', () => {
    const result = formatLongDateWithSuffix('2024-01-01T12:00:00');
    expect(result).toContain('1st');
  });

  it('should add "nd" suffix for 2nd', () => {
    const result = formatLongDateWithSuffix('2024-01-02T12:00:00');
    expect(result).toContain('2nd');
  });

  it('should add "rd" suffix for 3rd', () => {
    const result = formatLongDateWithSuffix('2024-01-03T12:00:00');
    expect(result).toContain('3rd');
  });

  it('should add "th" suffix for 4-20', () => {
    expect(formatLongDateWithSuffix('2024-01-04T12:00:00')).toContain('4th');
    expect(formatLongDateWithSuffix('2024-01-11T12:00:00')).toContain('11th');
    expect(formatLongDateWithSuffix('2024-01-20T12:00:00')).toContain('20th');
  });

  it('should add "st" suffix for 21st, 31st', () => {
    expect(formatLongDateWithSuffix('2024-01-21T12:00:00')).toContain('21st');
    expect(formatLongDateWithSuffix('2024-01-31T12:00:00')).toContain('31st');
  });

  it('should add "nd" suffix for 22nd', () => {
    const result = formatLongDateWithSuffix('2024-01-22T12:00:00');
    expect(result).toContain('22nd');
  });

  it('should add "rd" suffix for 23rd', () => {
    const result = formatLongDateWithSuffix('2024-01-23T12:00:00');
    expect(result).toContain('23rd');
  });

  it('should format date with correct day and suffix', () => {
    const result = formatLongDateWithSuffix('2024-06-15T12:00:00');
    expect(result).toContain('June');
    expect(result).toContain('15th');
    expect(result).toContain('2024');
  });

  it('should handle various dates correctly', () => {
    const dec25 = formatLongDateWithSuffix('2024-12-25T12:00:00');
    expect(dec25).toContain('December');
    expect(dec25).toContain('25th');
    expect(dec25).toContain('2024');

    const mar1 = formatLongDateWithSuffix('2024-03-01T12:00:00');
    expect(mar1).toContain('March');
    expect(mar1).toContain('1st');
    expect(mar1).toContain('2024');
  });
});
