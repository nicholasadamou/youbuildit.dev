'use client';

import React from 'react';
import { HeadingData } from '@/lib/toc-utils';

interface TableOfContentsProps {
  headings: HeadingData[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    const element = document.getElementById(id);
    if (element) {
      const offset = 136; // Offset for fixed navbar
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Update URL without triggering navigation
      window.history.pushState(null, '', `#${id}`);
    }
  };

  if (headings.length === 0) {
    return (
      <div className="my-6 p-4 bg-secondary border border-border rounded-lg">
        <p className="text-muted-foreground text-sm">
          No headings found to generate table of contents.
        </p>
      </div>
    );
  }

  return (
    <div className="my-6 p-4 bg-secondary border border-border rounded-lg">
      <nav className="space-y-2">
        {headings.map((heading, index) => {
          // Calculate indentation based on heading level
          const indentClass = getIndentClass(heading.level);

          return (
            <div key={index} className={`${indentClass}`}>
              <a
                href={`#${heading.id}`}
                onClick={e => handleClick(e, heading.id)}
                className="text-[--brand] hover:text-green-600 transition-colors hover:underline text-sm block py-1 cursor-pointer"
              >
                {heading.text}
              </a>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

function getIndentClass(level: number): string {
  switch (level) {
    case 2:
      return 'ml-0'; // h2 - no indent
    case 3:
      return 'ml-4'; // h3 - indent 1 level
    case 4:
      return 'ml-8'; // h4 - indent 2 levels
    default:
      return 'ml-0';
  }
}
