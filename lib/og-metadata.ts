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
    default:
      'You Build It - Learn by Building Real Applications | Coding Challenges Platform',
    template: '%s | You Build It - Coding Challenges',
  },
  description:
    'Master software engineering through hands-on coding challenges that build real applications. Learn JavaScript, TypeScript, React, Node.js, Docker, APIs, and more by creating production-ready projects. Free interactive programming tutorials for beginners to advanced developers.',
  keywords: [
    // Primary keywords
    'coding challenges',
    'programming challenges',
    'software engineering challenges',
    'learn to code',
    'coding practice',
    'programming practice',

    // Technology-specific keywords
    'javascript challenges',
    'typescript challenges',
    'react challenges',
    'nodejs challenges',
    'web development challenges',
    'fullstack development',
    'docker challenges',
    'api development',
    'database challenges',

    // Learning-focused keywords
    'hands-on programming',
    'project based learning',
    'real world projects',
    'build real applications',
    'coding tutorials',
    'interactive coding',
    'programming education',
    'software development training',

    // Skill level keywords
    'beginner programming',
    'intermediate coding',
    'advanced programming',
    'developer skills',
    'programming skills',
    'software engineering skills',

    // Platform-specific
    'free coding challenges',
    'online programming platform',
    'coding challenge platform',
    'developer training platform',
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
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'education',
  classification: 'education',
  other: {
    // Additional SEO meta tags
    'theme-color': '#3b82f6',
    'color-scheme': 'light',
    'format-detection': 'telephone=no',
    'mobile-web-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'You Build It',
    'application-name': 'You Build It',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/icons/browserconfig.xml',
    // Educational content meta tags
    audience: 'developers, programmers, software engineers, students',
    subject: 'software development, programming, coding education',
    coverage: 'worldwide',
    distribution: 'global',
    rating: 'general',
    'revisit-after': '7 days',
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
    // other: {
    //   me: ['your-domain@email.com', 'https://your-social-profile'],
    // },
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png' }],
    shortcut: ['/icons/favicon.ico'],
  },
  manifest: '/icons/manifest.webmanifest',
};
