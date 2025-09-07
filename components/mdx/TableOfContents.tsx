'use client';

import React from 'react';
import Link from 'next/link';
import { HeadingData } from '@/lib/toc-utils';

interface TableOfContentsProps {
  headings: HeadingData[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
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
              <Link
                href={`#${heading.id}`}
                className="text-[--brand] hover:text-green-600 transition-colors hover:underline text-sm block py-1"
              >
                {heading.text}
              </Link>
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
