import { getBaseUrl } from './getBaseUrl';

interface Challenge {
  slug: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  skills: string[];
  estimatedTime: string;
  updatedAt?: string;
}

// Website Schema - for the main site
export function generateWebsiteSchema() {
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'You Build It',
    description:
      'Learn by building real applications through hands-on coding challenges',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/challenges?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'You Build It',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
      },
    },
  };
}

// Organization Schema
export function generateOrganizationSchema() {
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'You Build It',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    description:
      'A platform helping developers become better software engineers through coding challenges that build real applications',
    founder: {
      '@type': 'Person',
      name: 'You Build It Team',
    },
    foundingDate: '2024',
    areaServed: 'Worldwide',
    knowsAbout: [
      'Software Development',
      'Coding Challenges',
      'Programming Education',
      'Web Development',
      'Full-stack Development',
      'TypeScript',
      'JavaScript',
      'React',
      'Next.js',
    ],
    sameAs: ['https://github.com/youbuildit', 'https://twitter.com/youbuildit'],
  };
}

// Course Schema for the challenges platform
export function generateCourseSchema() {
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'You Build It Coding Challenges',
    description:
      'Interactive coding challenges that help developers build real-world applications and improve their programming skills',
    provider: {
      '@type': 'Organization',
      name: 'You Build It',
      url: baseUrl,
    },
    url: `${baseUrl}/challenges`,
    courseMode: 'online',
    educationalLevel: 'beginner to advanced',
    teaches: [
      'Software Development',
      'Programming',
      'Web Development',
      'Application Building',
      'Code Quality',
      'Best Practices',
    ],
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
    },
    isAccessibleForFree: true,
    inLanguage: 'en',
    availableLanguage: 'en',
  };
}

// Individual Challenge Schema
export function generateChallengeSchema(challenge: Challenge) {
  const baseUrl = getBaseUrl();
  const challengeUrl = `${baseUrl}/challenge/${challenge.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: challenge.title,
    description: challenge.description,
    url: challengeUrl,
    learningResourceType: 'Coding Challenge',
    educationalLevel: challenge.difficulty.toLowerCase(),
    teaches: challenge.skills,
    timeRequired: challenge.estimatedTime,
    isAccessibleForFree: true,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: 'You Build It',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'You Build It',
      url: baseUrl,
    },
    dateModified: challenge.updatedAt || new Date().toISOString(),
    about: {
      '@type': 'Thing',
      name: challenge.category,
    },
    keywords: challenge.skills.join(', '),
    difficulty: challenge.difficulty,
    interactivityType: 'active',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
    },
  };
}

// Breadcrumb Schema
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// FAQ Schema for common questions
export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is You Build It?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You Build It is an interactive coding challenges platform designed to help developers improve their programming skills through hands-on, practical projects. Unlike traditional algorithmic challenges, our platform focuses on building real-world applications.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are the challenges free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all coding challenges on You Build It are completely free to access and use.',
        },
      },
      {
        '@type': 'Question',
        name: 'What skill levels are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer challenges for all skill levels, from beginner-friendly projects to advanced challenges that will test experienced developers.',
        },
      },
      {
        '@type': 'Question',
        name: 'What technologies will I learn?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our challenges cover a wide range of technologies including JavaScript, TypeScript, React, Next.js, Node.js, Python, Go, Docker, APIs, databases, and many more modern development tools and frameworks.',
        },
      },
    ],
  };
}

// Helper function to combine multiple schemas
export function combineSchemas(schemas: object[]) {
  if (schemas.length === 1) {
    return schemas[0];
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}
