import type { Metadata } from 'next';
import { getBaseUrl } from './getBaseUrl';

interface OpenGraphMetadataOptions {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
  challengeData?: {
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    skills: string[];
    estimatedTime: string;
  };
}

export function generateOpenGraphMetadata({
  title,
  description,
  path = '',
  type = 'website',
  image,
  imageAlt,
  challengeData,
}: OpenGraphMetadataOptions): Metadata {
  const baseUrl = getBaseUrl();
  const fullUrl = `${baseUrl}${path}`;

  // Generate dynamic OG image URL if not provided
  const ogImageType = challengeData
    ? 'challenge'
    : path === '/challenges'
      ? 'challenges'
      : 'home';
  const ogImageUrl =
    image ||
    `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}${challengeData ? `&type=challenge&category=${encodeURIComponent(challengeData.category)}&difficulty=${challengeData.difficulty}&skills=${encodeURIComponent(challengeData.skills.slice(0, 3).join(', '))}` : `&type=${ogImageType}`}`;

  const metadata: Metadata = {
    title: title.includes('You Build It') ? title : `${title} - You Build It`,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type,
      siteName: 'You Build It',
      title,
      description,
      url: fullUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt || `${title} - You Build It`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@youbuildit',
      creator: '@youbuildit',
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
    authors: [{ name: 'You Build It' }],
    creator: 'You Build It',
    publisher: 'You Build It',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };

  // Add article-specific metadata for challenges
  if (type === 'article' && challengeData) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: new Date().toISOString(),
      section: challengeData.category,
      tags: challengeData.skills,
    };

    // Add structured data for challenges
    metadata.other = {
      'article:section': challengeData.category,
      'article:tag': challengeData.skills.join(', '),
      'challenge:difficulty': challengeData.difficulty,
      'challenge:estimated-time': challengeData.estimatedTime,
    };
  }

  return metadata;
}

export const defaultSiteMetadata: Metadata = {
  title: {
    default: 'You Build It - Learn by Building Real Applications',
    template: '%s | You Build It',
  },
  description:
    'Helping you become a better software engineer through coding challenges that build real applications. Learn by doing with hands-on projects.',
  keywords: [
    'coding challenges',
    'programming',
    'software engineering',
    'web development',
    'learn to code',
    'real applications',
    'hands-on projects',
    'coding practice',
    'developer skills',
  ],
  authors: [{ name: 'You Build It' }],
  creator: 'You Build It',
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getBaseUrl(),
    siteName: 'You Build It',
    title: 'You Build It - Learn by Building Real Applications',
    description:
      'Helping you become a better software engineer through coding challenges that build real applications.',
    images: [
      {
        url: '/api/og?type=home',
        width: 1200,
        height: 630,
        alt: 'You Build It - Learn by Building Real Applications',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@youbuildit',
    creator: '@youbuildit',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png' }],
  },
  manifest: '/icons/manifest.webmanifest',
};
