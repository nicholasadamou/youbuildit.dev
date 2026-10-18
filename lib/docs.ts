import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const docSlugs = [
  'README',
  'getting-started',
  'solutions',
  'troubleshooting',
  'local-development',
  'architecture',
  'contributing',
  'api',
];
export const docHref = (slug: string) =>
  slug === 'README' ? '/docs' : `/docs/${slug}`;
export const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

export function readDoc(slug: string) {
  if (!docSlugs.includes(slug)) return null;
  const { data, content } = matter(
    fs.readFileSync(path.join(process.cwd(), 'docs', `${slug}.md`), 'utf8')
  );
  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    group: String(data.group),
    content: content.replace(/^\s*# .+\n/, ''),
    headings: [...content.matchAll(/^## (.+)$/gm)].map(([, text]) => ({
      text,
      id: headingId(text),
    })),
  };
}

export const docs = docSlugs.map(slug => readDoc(slug)!);

export function resolveDocLink(href = '') {
  if (href === '../LICENSE')
    return 'https://github.com/youbuildit/youbuildit.dev/blob/main/LICENSE';
  if (href.endsWith('.md')) return docHref(href.replace(/\.md$/, ''));
  return href;
}
