import { getBaseUrl } from '@/lib/getBaseUrl';

export function GET(): Response {
  const baseUrl = getBaseUrl();

  const robotsTxt = `# Robots.txt for You Build It
User-agent: *
Allow: /

# Important pages for crawling
Allow: /challenges
Allow: /challenge/*
Allow: /api/og*

# Block unnecessary API routes
Disallow: /api/commit
Disallow: /api/challenges

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay to be respectful
Crawl-delay: 1
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
