import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vs,
  vscDarkPlus,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Components } from 'react-markdown';
import { useToc } from './TocContext';
import TableOfContents from './TableOfContents';

// Helper function to generate heading IDs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to extract text content from React children
function getTextContent(children: ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(getTextContent).join('');
  }
  if (children && typeof children === 'object' && 'props' in children) {
    return getTextContent(
      (children as { props: { children: ReactNode } }).props.children
    );
  }
  return '';
}

// React components for headings
function H1Component({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const textContent = getTextContent(children);
  const id = slugify(textContent);
  return (
    <h1
      id={id}
      className="text-3xl font-bold text-foreground mb-6 mt-8 scroll-mt-8"
      {...props}
    >
      <Link
        href={`#${id}`}
        className="no-underline hover:underline text-foreground"
      >
        {children}
      </Link>
    </h1>
  );
}

function H2Component({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const textContent = getTextContent(children);
  const id = slugify(textContent);
  const isTableOfContents = textContent
    .toLowerCase()
    .includes('table of contents');
  const { headings } = useToc();

  return (
    <>
      <h2
        id={id}
        className="text-2xl font-semibold text-foreground mb-4 mt-8 scroll-mt-8"
        {...props}
      >
        <Link
          href={`#${id}`}
          className="no-underline hover:underline text-foreground"
        >
          {children}
        </Link>
      </h2>
      {isTableOfContents && <TableOfContents headings={headings} />}
    </>
  );
}

function H3Component({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const textContent = getTextContent(children);
  const id = slugify(textContent);
  return (
    <h3
      id={id}
      className="text-xl font-semibold text-foreground mb-3 mt-6 scroll-mt-8"
      {...props}
    >
      <Link
        href={`#${id}`}
        className="no-underline hover:underline text-foreground"
      >
        {children}
      </Link>
    </h3>
  );
}

function H4Component({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const textContent = getTextContent(children);
  const id = slugify(textContent);
  return (
    <h4
      id={id}
      className="text-lg font-semibold text-foreground mb-2 mt-4 scroll-mt-8"
      {...props}
    >
      <Link
        href={`#${id}`}
        className="no-underline hover:underline text-foreground"
      >
        {children}
      </Link>
    </h4>
  );
}

function CodeComponent({
  children,
  className,
  ...props
}: React.ComponentProps<'code'>) {
  const match = /language-(\w+)/.exec(className || '');
  const { theme, systemTheme } = useTheme();

  // Determine if we should use dark theme
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  const isDark = effectiveTheme === 'dark';

  if (match) {
    return (
      <SyntaxHighlighter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={(isDark ? vscDarkPlus : vs) as any}
        language={match[1]}
        PreTag="div"
        className="rounded-lg mb-6"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
  }

  return (
    <code
      className="bg-secondary px-2 py-1 rounded text-sm font-mono text-secondary-foreground border border-border"
      {...props}
    >
      {children}
    </code>
  );
}

const MDXComponents: Components = {
  // Headings
  h1: H1Component,
  h2: H2Component,
  h3: H3Component,
  h4: H4Component,

  // Text elements
  p: ({ children, ...props }) => (
    <p className="text-foreground leading-7 mb-4" {...props}>
      {children}
    </p>
  ),

  // Lists - with proper styling
  ul: ({ children, ...props }) => (
    <ul
      className="list-disc list-outside ml-6 text-foreground mb-6 space-y-2"
      {...props}
    >
      {children}
    </ul>
  ),

  ol: ({ children, ...props }) => (
    <ol
      className="list-decimal list-outside ml-6 text-foreground mb-6 space-y-2"
      {...props}
    >
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => (
    <li className="text-foreground leading-6" {...props}>
      {children}
    </li>
  ),

  // Links
  a: ({ href, children, ...props }) => {
    if (!href) {
      return (
        <span className="text-[--brand]" {...props}>
          {children}
        </span>
      );
    }

    const isExternal = href.startsWith('http');

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[--brand] hover:text-green-600 underline transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className="text-[--brand] hover:text-green-600 underline transition-colors"
        {...props}
      >
        {children}
      </Link>
    );
  },

  // Code
  code: CodeComponent,

  // Pre (for code blocks without language)
  pre: ({ children, ...props }) => (
    <pre
      className="bg-transparent text-foreground rounded-lg mb-6 overflow-x-auto text-sm"
      {...props}
    >
      {children}
    </pre>
  ),

  // Blockquote
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-[--brand] pl-6 py-2 my-6 italic text-muted-foreground bg-secondary"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Tables
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-6">
      <table
        className="min-w-full divide-y divide-border border border-border rounded-lg"
        {...props}
      >
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }) => (
    <thead className="bg-secondary" {...props}>
      {children}
    </thead>
  ),

  tbody: ({ children, ...props }) => (
    <tbody className="bg-card divide-y divide-border" {...props}>
      {children}
    </tbody>
  ),

  tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,

  th: ({ children, ...props }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground"
      {...props}
    >
      {children}
    </td>
  ),

  // Strong/Bold
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),

  // Emphasis/Italic
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),

  // Horizontal rule
  hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,

  // Images
  img: ({ src, alt, ...props }) => {
    if (!src || typeof src !== 'string') {
      return null;
    }

    // For external images or images that might not work with Next.js Image,
    // fall back to regular img tag
    const isExternalImage =
      src.startsWith('http://') || src.startsWith('https://');

    if (isExternalImage) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || ''}
          className="max-w-full h-auto rounded-lg shadow-sm mb-6"
          {...props}
        />
      );
    }

    // For local images, use Next.js Image component
    return (
      <div className="mb-6">
        <Image
          src={src}
          alt={alt || ''}
          width={800}
          height={400}
          className="rounded-lg shadow-sm"
          style={{ width: '100%', height: 'auto' }}
          unoptimized // Add this for compatibility
        />
      </div>
    );
  },
};

export default MDXComponents;
