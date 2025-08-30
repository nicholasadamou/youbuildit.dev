// Utility functions for extracting headings and generating table of contents

// Helper function to generate heading IDs (same as in MDXComponents)
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export interface HeadingData {
  level: number;
  text: string;
  id: string;
}

// Extract headings from markdown content
export function extractHeadings(content: string): HeadingData[] {
  const headings: HeadingData[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Match markdown headings (## Header, ### Header, etc.)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugify(text);
      
      // Skip the Table of Contents heading itself
      if (!text.toLowerCase().includes('table of contents')) {
        headings.push({ level, text, id });
      }
    }
  }
  
  return headings;
}

// Check if content has a table of contents section
export function hasTableOfContents(content: string): boolean {
  return /^#{1,6}\s+.*table of contents/im.test(content);
}

// Filter headings to only show relevant ones for TOC
export function filterTocHeadings(headings: HeadingData[]): HeadingData[] {
  // Only show h2, h3, and h4 in the table of contents
  return headings.filter(heading => heading.level >= 2 && heading.level <= 4);
}
