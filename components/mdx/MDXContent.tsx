'use client';

import ReactMarkdown from 'react-markdown';
import MDXComponents from './MDXComponents';
import { TocProvider } from './TocContext';
import { extractHeadings, hasTableOfContents, filterTocHeadings } from '@/lib/toc-utils';

interface MDXContentProps {
  content: string;
}

export default function MDXContent({ content }: MDXContentProps) {
  // Extract headings from content for table of contents
  const allHeadings = extractHeadings(content);
  const tocHeadings = filterTocHeadings(allHeadings);
  const hasToc = hasTableOfContents(content);

  return (
    <TocProvider headings={tocHeadings} hasTableOfContents={hasToc}>
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown components={MDXComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </TocProvider>
  );
}
