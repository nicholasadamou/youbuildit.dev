import { getBaseUrl } from '@/lib/getBaseUrl';

// You'll need to create this function to get all challenges
async function getAllChallenges() {
  try {
    // This should match your existing challenge loading logic
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/challenges`);
    if (!response.ok) return [];
    const challenges = await response.json();
    return challenges || [];
  } catch (error) {
    console.error('Error fetching challenges for sitemap:', error);
    return [];
  }
}

export async function GET(): Promise<Response> {
  const baseUrl = getBaseUrl();
  const challenges = await getAllChallenges();

  // Static pages with their priorities and update frequencies
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/challenges`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic challenge pages
  const challengePages = challenges.map(
    (challenge: { slug: string; updatedAt?: string }) => ({
      url: `${baseUrl}/challenge/${challenge.slug}`,
      lastModified: challenge.updatedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  );

  const allPages = [...staticPages, ...challengePages];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages
  .map(
    page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}
