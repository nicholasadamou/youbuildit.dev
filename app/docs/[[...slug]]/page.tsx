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
import CopyButton from '@/components/docs/CopyButton';
import DocsActions from '@/components/docs/DocsActions';
import { generateOpenGraphMetadata } from '@/lib/og-metadata';
import '@/styles/docs.css';

const nodeText = (node: { value?: string; children?: unknown[] }): string =>
  node.value ??
  (node.children ?? [])
    .map(child => nodeText(child as Parameters<typeof nodeText>[0]))
    .join('');

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
          <details className="mobile-toc">
            <summary>On this page</summary>
            <nav aria-label="On this page">
              <a href="#overview">Overview</a>
              {doc.headings.map(heading => (
                <a key={heading.id} href={`#${heading.id}`}>
                  {heading.text}
                </a>
              ))}
            </nav>
          </details>
          <header className="doc-article-heading" id="overview">
            <p className="eyebrow">
              {doc.slug === 'api' ? 'Developer documentation' : doc.group}
            </p>
            <h1>
              {doc.slug === 'api' ? (
                <>
                  Ideas in.
                  <br />
                  <em>Projects out.</em>
                </>
              ) : (
                doc.title
              )}
            </h1>
            <p className="docs-lead">{doc.description}</p>
            {doc.slug === 'api' && (
              <>
                <div className="docs-notice">
                  Public, read-only endpoints. No account or API key required.
                  Retrieve published challenges and available solutions.
                </div>
                <div className="docs-base">
                  <span>Production · base URL</span>
                  <code>https://youbuildit.dev</code>
                </div>
              </>
            )}
          </header>
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
              pre: ({ children, node }) => {
                const code = node?.children[0];
                const language =
                  code?.type === 'element'
                    ? String(code.properties.className ?? '')
                        .replace('hljs,', '')
                        .replace('language-', '')
                    : 'text';
                if (language === 'mermaid') return children;
                const source = nodeText(node!).trimEnd();
                return (
                  <div className="docs-code">
                    <div className="docs-code-heading">
                      <span>{language}</span>
                      <CopyButton text={source} />
                    </div>
                    <pre tabIndex={0} aria-label={`${language} code example`}>
                      <span className="code-gutter" aria-hidden="true">
                        {source
                          .split('\n')
                          .map((_, index) => index + 1)
                          .join('\n')}
                      </span>
                      {children}
                    </pre>
                  </div>
                );
              },
              code: ({ className, children }) =>
                className === 'language-mermaid' ? (
                  <Diagram source={String(children).trim()} />
                ) : (
                  <code className={className}>{children}</code>
                ),
              table: ({ children }) => (
                <div className="docs-table" tabIndex={0}>
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
          <div className="mobile-doc-actions">
            <DocsActions
              slug={doc.slug}
              markdown={`# ${doc.title}\n\n${doc.content}`}
            />
          </div>
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
          <a href="#overview">Overview</a>
          {doc.headings.map(heading => (
            <a key={heading.id} href={`#${heading.id}`}>
              {heading.text}
            </a>
          ))}
          <DocsActions
            slug={doc.slug}
            markdown={`# ${doc.title}\n\n${doc.content}`}
          />
        </nav>
      </div>
    </div>
  );
}
