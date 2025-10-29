import { describe, it, expect } from 'vitest';
import {
  slugify,
  extractHeadings,
  hasTableOfContents,
  filterTocHeadings,
  type HeadingData,
} from '../toc-utils';

describe('slugify', () => {
  it('should convert text to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('This is a test')).toBe('this-is-a-test');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world');
  });

  it('should replace multiple spaces with single hyphen', () => {
    expect(slugify('Hello    World')).toBe('hello-world');
  });

  it('should remove leading and trailing hyphens', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });

  it('should handle underscores', () => {
    expect(slugify('hello_world_test')).toBe('hello-world-test');
  });

  it('should handle mixed case with special chars', () => {
    expect(slugify('Getting Started (Part 1)')).toBe('getting-started-part-1');
  });
});

describe('extractHeadings', () => {
  it('should extract h1 headings', () => {
    const content = '# Main Title\nSome content';
    const result = extractHeadings(content);
    expect(result).toEqual([
      { level: 1, text: 'Main Title', id: 'main-title' },
    ]);
  });

  it('should extract multiple heading levels', () => {
    const content = `# Title
## Subtitle
### Sub-subtitle`;
    const result = extractHeadings(content);
    expect(result).toEqual([
      { level: 1, text: 'Title', id: 'title' },
      { level: 2, text: 'Subtitle', id: 'subtitle' },
      { level: 3, text: 'Sub-subtitle', id: 'sub-subtitle' },
    ]);
  });

  it('should skip Table of Contents heading', () => {
    const content = `# Main Title
## Table of Contents
## Real Heading`;
    const result = extractHeadings(content);
    expect(result).toEqual([
      { level: 1, text: 'Main Title', id: 'main-title' },
      { level: 2, text: 'Real Heading', id: 'real-heading' },
    ]);
  });

  it('should handle headings with trailing whitespace', () => {
    const content = '##  Heading with spaces  ';
    const result = extractHeadings(content);
    expect(result).toEqual([
      { level: 2, text: 'Heading with spaces', id: 'heading-with-spaces' },
    ]);
  });

  it('should extract headings up to h6', () => {
    const content = `# H1
## H2
### H3
#### H4
##### H5
###### H6`;
    const result = extractHeadings(content);
    expect(result.length).toBe(6);
    expect(result[5]).toEqual({ level: 6, text: 'H6', id: 'h6' });
  });

  it('should ignore lines that are not headings', () => {
    const content = `# Real Heading
Not a heading
## Another Heading
Just text`;
    const result = extractHeadings(content);
    expect(result).toEqual([
      { level: 1, text: 'Real Heading', id: 'real-heading' },
      { level: 2, text: 'Another Heading', id: 'another-heading' },
    ]);
  });

  it('should return empty array for content without headings', () => {
    const content = 'Just some text\nNo headings here';
    const result = extractHeadings(content);
    expect(result).toEqual([]);
  });
});

describe('hasTableOfContents', () => {
  it('should return true when TOC heading exists', () => {
    const content = '## Table of Contents\n- Item 1\n- Item 2';
    expect(hasTableOfContents(content)).toBe(true);
  });

  it('should return true for case-insensitive match', () => {
    expect(hasTableOfContents('# TABLE OF CONTENTS')).toBe(true);
    expect(hasTableOfContents('## table of contents')).toBe(true);
  });

  it('should return false when TOC heading does not exist', () => {
    const content = '# Main Title\nSome content';
    expect(hasTableOfContents(content)).toBe(false);
  });

  it('should match different heading levels', () => {
    expect(hasTableOfContents('# Table of Contents')).toBe(true);
    expect(hasTableOfContents('### Table of Contents')).toBe(true);
    expect(hasTableOfContents('###### Table of Contents')).toBe(true);
  });
});

describe('filterTocHeadings', () => {
  it('should only include h2, h3, and h4', () => {
    const headings: HeadingData[] = [
      { level: 1, text: 'H1', id: 'h1' },
      { level: 2, text: 'H2', id: 'h2' },
      { level: 3, text: 'H3', id: 'h3' },
      { level: 4, text: 'H4', id: 'h4' },
      { level: 5, text: 'H5', id: 'h5' },
      { level: 6, text: 'H6', id: 'h6' },
    ];
    const result = filterTocHeadings(headings);
    expect(result).toEqual([
      { level: 2, text: 'H2', id: 'h2' },
      { level: 3, text: 'H3', id: 'h3' },
      { level: 4, text: 'H4', id: 'h4' },
    ]);
  });

  it('should return empty array when no h2-h4 headings', () => {
    const headings: HeadingData[] = [
      { level: 1, text: 'H1', id: 'h1' },
      { level: 5, text: 'H5', id: 'h5' },
      { level: 6, text: 'H6', id: 'h6' },
    ];
    const result = filterTocHeadings(headings);
    expect(result).toEqual([]);
  });

  it('should handle empty input', () => {
    const result = filterTocHeadings([]);
    expect(result).toEqual([]);
  });

  it('should preserve order of filtered headings', () => {
    const headings: HeadingData[] = [
      { level: 2, text: 'First', id: 'first' },
      { level: 1, text: 'Skip', id: 'skip' },
      { level: 3, text: 'Second', id: 'second' },
      { level: 5, text: 'Skip2', id: 'skip2' },
      { level: 4, text: 'Third', id: 'third' },
    ];
    const result = filterTocHeadings(headings);
    expect(result).toEqual([
      { level: 2, text: 'First', id: 'first' },
      { level: 3, text: 'Second', id: 'second' },
      { level: 4, text: 'Third', id: 'third' },
    ]);
  });
});
