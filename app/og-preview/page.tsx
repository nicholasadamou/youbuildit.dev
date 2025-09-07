'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Footer from '@/components/sections/Footer';

interface OGImagePreviewProps {
  title: string;
  description: string;
  type: 'home' | 'challenges' | 'challenge';
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  skills?: string;
}

function OGImagePreview({
  title,
  description,
  type,
  category,
  difficulty,
  skills,
}: OGImagePreviewProps) {
  const params = new URLSearchParams({
    title,
    description,
    type,
  });

  if (type === 'challenge') {
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    if (skills) params.append('skills', skills);
  }

  const ogImageUrl = `/api/og?${params.toString()}`;

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border hover:shadow-md transition-shadow">
      <div className="aspect-[1200/630] bg-muted border-b border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ogImageUrl}
          alt={`OG Image for ${title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-card-foreground line-clamp-1">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 rounded-full font-medium border border-blue-200 dark:border-blue-700">
            Type: {type}
          </span>
          {category && (
            <span className="px-3 py-1 bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100 rounded-full font-medium border border-green-200 dark:border-green-700">
              Category: {category}
            </span>
          )}
          {difficulty && (
            <span
              className={`px-3 py-1 rounded-full font-medium border ${
                difficulty === 'Beginner'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700'
                  : difficulty === 'Intermediate'
                    ? 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700'
                    : 'bg-red-100 text-red-900 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700'
              }`}
            >
              {difficulty}
            </span>
          )}
          {skills && (
            <span className="px-3 py-1 bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100 rounded-full font-medium border border-purple-200 dark:border-purple-700">
              Skills: {skills}
            </span>
          )}
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <a
            href={ogImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-[var(--brand)] hover:text-[var(--brand-dark)] transition-colors"
          >
            View Full Size
            <svg
              className="ml-1 h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OGPreviewPage() {
  // Block access in production environment
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      notFound();
    }
  }, []);

  const [customTitle, setCustomTitle] = useState('You Build It');
  const [customDescription, setCustomDescription] = useState(
    'Learn by Building Real Applications'
  );
  const [customCategory, setCustomCategory] = useState('Web Development');
  const [customDifficulty, setCustomDifficulty] = useState<
    'Beginner' | 'Intermediate' | 'Advanced'
  >('Beginner');
  const [customSkills, setCustomSkills] = useState(
    'React, TypeScript, Node.js'
  );

  const predefinedExamples = [
    {
      title: 'You Build It',
      description: 'Learn by Building Real Applications',
      type: 'home' as const,
    },
    {
      title: 'Coding Challenges',
      description:
        "Build real applications and improve your programming skills with our hands-on coding challenges. Each challenge teaches practical concepts through building tools you'll actually use.",
      type: 'challenges' as const,
    },
    {
      title: 'Build Your Own cat Tool',
      description:
        'Create a command-line tool that displays file contents with various formatting options. Learn about file I/O, text processing, and command-line arguments.',
      type: 'challenge' as const,
      category: 'Command Line',
      difficulty: 'Beginner' as const,
      skills: 'File I/O, Text Processing, Command-Line Arguments',
    },
    {
      title: 'Build Your Own Database',
      description:
        'Implement a simple database system from scratch. Learn about data storage, indexing, query processing, and transaction management.',
      type: 'challenge' as const,
      category: 'Backend',
      difficulty: 'Advanced' as const,
      skills: 'Data Structures, File Systems, SQL',
    },
    {
      title: 'Build Your Own Docker',
      description:
        'Create a container runtime similar to Docker. Learn about Linux containers, namespaces, cgroups, and container orchestration.',
      type: 'challenge' as const,
      category: 'DevOps',
      difficulty: 'Advanced' as const,
      skills: 'Linux, Systems Programming, Containers',
    },
    {
      title: 'Build Your Own Cut Tool',
      description:
        'Implement the Unix cut command for extracting columns from text. Learn about text parsing, field extraction, and command-line processing.',
      type: 'challenge' as const,
      category: 'Command Line',
      difficulty: 'Intermediate' as const,
      skills: 'Text Processing, Parsing, CLI Tools',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            OG Images Preview
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Preview different variations of Open Graph images used across the
            site. These images appear when pages are shared on social media
            platforms.
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-12 border border-border">
          <h2 className="text-2xl font-semibold mb-6 text-card-foreground">
            Custom OG Image Generator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-[var(--brand)] transition-colors"
                placeholder="Enter custom title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <input
                type="text"
                value={customDescription}
                onChange={e => setCustomDescription(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-[var(--brand)] transition-colors"
                placeholder="Enter custom description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Category (for challenge type)
              </label>
              <input
                type="text"
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-[var(--brand)] transition-colors"
                placeholder="e.g., Web Development"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Difficulty
              </label>
              <select
                value={customDifficulty}
                onChange={e =>
                  setCustomDifficulty(
                    e.target.value as 'Beginner' | 'Intermediate' | 'Advanced'
                  )
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-[var(--brand)] transition-colors"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={customSkills}
                onChange={e => setCustomSkills(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-[var(--brand)] transition-colors"
                placeholder="e.g., React, TypeScript, Node.js"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <OGImagePreview
              title={customTitle}
              description={customDescription}
              type="home"
            />
            <OGImagePreview
              title={customTitle}
              description={customDescription}
              type="challenges"
            />
            <OGImagePreview
              title={customTitle}
              description={customDescription}
              type="challenge"
              category={customCategory}
              difficulty={customDifficulty}
              skills={customSkills}
            />
          </div>
        </div>

        {/* Predefined Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Predefined Examples
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {predefinedExamples.map((example, index) => (
              <OGImagePreview key={index} {...example} />
            ))}
          </div>
        </div>

        {/* Technical Information */}
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <h2 className="text-2xl font-semibold mb-6 text-card-foreground">
            Technical Information
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                OG Image Types
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Home:</span>{' '}
                  General site branding with the main tagline
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Challenges:
                  </span>{' '}
                  Shows difficulty level badges for the challenges listing page
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Challenge:
                  </span>{' '}
                  Individual challenge with category, difficulty badge, and
                  skills
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                Specifications
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  Dimensions: 1200x630 pixels (Facebook/Twitter recommended)
                </li>
                <li>Format: Dynamic PNG generated via Next.js ImageResponse</li>
                <li>Brand colors: Primary #37d388, Light #a4e6c5</li>
                <li>Fonts: Inter (system fallback supported)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                URL Parameters
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground font-mono text-xs">
                    title
                  </code>
                  : Main heading text
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground font-mono text-xs">
                    description
                  </code>
                  : Subtitle/description text
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground font-mono text-xs">
                    type
                  </code>
                  : home | challenges | challenge
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground font-mono text-xs">
                    category
                  </code>
                  : Challenge category (challenge type only)
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground font-mono text-xs">
                    difficulty
                  </code>
                  : Beginner | Intermediate | Advanced
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground font-mono text-xs">
                    skills
                  </code>
                  : Comma-separated skills list
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                API Endpoint
              </h3>
              <p className="text-muted-foreground">
                <code className="bg-muted px-2 py-1 rounded text-foreground font-mono text-sm">
                  /api/og
                </code>{' '}
                - Dynamic OG image generation endpoint
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
