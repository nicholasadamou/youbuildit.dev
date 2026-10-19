import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  docSlugs,
  docs,
  docHref,
  readDoc,
  headingId,
  resolveDocLink,
} from '@/lib/docs';
import DocsNavigation from '@/components/docs/DocsNavigation';
import Diagram from '@/components/docs/Diagram';
import Footer from '@/components/sections/Footer';
import { generateOpenGraphMetadata } from '@/lib/og-metadata';
import '@/styles/docs.css';

type Props = { params: Promise<{ slug?: string[] }> };
const slugFrom = (slug?: string[]) =>
  !slug ? 'README' : slug.length === 1 ? slug[0] : '';
export function generateStaticParams() {
  return docSlugs.map(slug => ({ slug: slug === 'README' ? [] : [slug] }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = readDoc(slugFrom((await params).slug));
  return doc
    ? generateOpenGraphMetadata({
        title: `${doc.title} — Documentation`,
        description: doc.description,
        path: docHref(doc.slug),
        image: '/og.png',
      })
    : {};
}

export default async function DocsPage({ params }: Props) {
  const doc = readDoc(slugFrom((await params).slug));
  if (!doc) notFound();
  const next = docs[docs.findIndex(entry => entry.slug === doc.slug) + 1];
  return (
    <div className="docs-page">
      <div className="docs-layout">
        <DocsNavigation
          entries={docs.map(({ slug, title, group }) => ({
            slug,
            title,
            group,
            href: docHref(slug),
          }))}
        />
        <article className="docs-main">
          <header className="doc-article-heading">
            <p className="eyebrow">{doc.group}</p>
            <h1>{doc.title}</h1>
            <p className="docs-lead">{doc.description}</p>
          </header>
          <details className="mobile-toc">
            <summary>On this page</summary>
            <nav>
              {doc.headings.map(heading => (
                <a key={heading.id} href={`#${heading.id}`}>
                  {heading.text}
                </a>
              ))}
            </nav>
          </details>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeHighlight, { plainText: ['mermaid'] }]]}
            components={{
              h2: ({ children }) => (
                <h2 id={headingId(String(children))}>{children}</h2>
              ),
              a: ({ href, children }) => (
                <Link href={resolveDocLink(href)}>{children}</Link>
              ),
              pre: ({ children }) => (
                <div className="docs-code">{children}</div>
              ),
              code: ({ className, children }) =>
                className === 'language-mermaid' ? (
                  <Diagram source={String(children).trim()} />
                ) : (
                  <code className={className}>{children}</code>
                ),
              table: ({ children }) => (
                <div className="docs-table">
                  <table>{children}</table>
                </div>
              ),
            }}
          >
            {doc.content}
          </ReactMarkdown>
          {next && (
            <Link className="doc-next" href={docHref(next.slug)}>
              <span>Next guide</span>
              {next.title}
            </Link>
          )}
          <div className="docs-footer">
            <a
              href={`https://github.com/youbuildit/youbuildit.dev/blob/main/docs/${doc.slug}.md`}
            >
              Edit this page on GitHub
            </a>
            <Link href="/docs/troubleshooting">Need a hand?</Link>
          </div>
        </article>
        <nav className="docs-toc" aria-label="On this page">
          <p>ON THIS PAGE</p>
          {doc.headings.map(heading => (
            <a key={heading.id} href={`#${heading.id}`}>
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
      <Footer />
    </div>
  );
}
