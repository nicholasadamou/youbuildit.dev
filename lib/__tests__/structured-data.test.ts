import { describe, it, expect, afterEach } from 'vitest';
import {
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateCourseSchema,
  generateChallengeSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  combineSchemas,
} from '../structured-data';

describe('generateWebsiteSchema', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should generate valid website schema', () => {
    process.env.NODE_ENV = 'production';
    const schema = generateWebsiteSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebSite');
    expect(schema.name).toBe('You Build It');
    expect(schema.url).toBe('https://youbuildit.dev');
  });

  it('should include search action', () => {
    process.env.NODE_ENV = 'production';
    const schema = generateWebsiteSchema();
    expect(schema.potentialAction['@type']).toBe('SearchAction');
    expect(schema.potentialAction.target).toContain('/challenges?search=');
  });

  it('should include publisher information', () => {
    process.env.NODE_ENV = 'production';
    const schema = generateWebsiteSchema();
    expect(schema.publisher['@type']).toBe('Organization');
    expect(schema.publisher.name).toBe('You Build It');
  });
});

describe('generateOrganizationSchema', () => {
  it('should generate valid organization schema', () => {
    process.env.NODE_ENV = 'production';
    const schema = generateOrganizationSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('You Build It');
  });

  it('should include technologies', () => {
    const schema = generateOrganizationSchema();
    expect(schema.knowsAbout).toContain('JavaScript');
    expect(schema.knowsAbout).toContain('TypeScript');
    expect(schema.knowsAbout).toContain('React');
  });

  it('should include founding date', () => {
    const schema = generateOrganizationSchema();
    expect(schema.foundingDate).toBe('2024');
  });
});

describe('generateCourseSchema', () => {
  it('should generate valid course schema', () => {
    process.env.NODE_ENV = 'production';
    const schema = generateCourseSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Course');
    expect(schema.name).toBe('You Build It Coding Challenges');
  });

  it('should indicate free access', () => {
    const schema = generateCourseSchema();
    expect(schema.isAccessibleForFree).toBe(true);
  });

  it('should include educational level', () => {
    const schema = generateCourseSchema();
    expect(schema.educationalLevel).toBe('beginner to advanced');
  });

  it('should list topics taught', () => {
    const schema = generateCourseSchema();
    expect(schema.teaches).toContain('Software Development');
    expect(schema.teaches).toContain('Programming');
  });
});

describe('generateChallengeSchema', () => {
  const mockChallenge = {
    slug: 'test-challenge',
    title: 'Test Challenge',
    description: 'A test challenge',
    difficulty: 'Beginner' as const,
    category: 'Web Development',
    skills: ['JavaScript', 'React'],
    estimatedTime: '2 hours',
    updatedAt: '2024-01-01',
  };

  it('should generate valid challenge schema', () => {
    process.env.NODE_ENV = 'production';
    const schema = generateChallengeSchema(mockChallenge);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('LearningResource');
    expect(schema.name).toBe('Test Challenge');
  });

  it('should include challenge details', () => {
    const schema = generateChallengeSchema(mockChallenge);
    expect(schema.description).toBe('A test challenge');
    expect(schema.educationalLevel).toBe('beginner');
    expect(schema.teaches).toEqual(['JavaScript', 'React']);
    expect(schema.timeRequired).toBe('2 hours');
  });

  it('should indicate free access', () => {
    const schema = generateChallengeSchema(mockChallenge);
    expect(schema.isAccessibleForFree).toBe(true);
  });

  it('should include correct URL', () => {
    process.env.NODE_ENV = 'production';
    const schema = generateChallengeSchema(mockChallenge);
    expect(schema.url).toBe('https://youbuildit.dev/challenge/test-challenge');
  });

  it('should include difficulty', () => {
    const schema = generateChallengeSchema(mockChallenge);
    expect(schema.difficulty).toBe('Beginner');
  });
});

describe('generateBreadcrumbSchema', () => {
  it('should generate valid breadcrumb schema', () => {
    const breadcrumbs = [
      { name: 'Home', url: 'https://youbuildit.dev' },
      { name: 'Challenges', url: 'https://youbuildit.dev/challenges' },
      {
        name: 'Challenge',
        url: 'https://youbuildit.dev/challenge/test-challenge',
      },
    ];

    const schema = generateBreadcrumbSchema(breadcrumbs);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(3);
  });

  it('should include correct positions', () => {
    const breadcrumbs = [
      { name: 'Home', url: 'https://youbuildit.dev' },
      { name: 'Challenges', url: 'https://youbuildit.dev/challenges' },
    ];

    const schema = generateBreadcrumbSchema(breadcrumbs);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].position).toBe(2);
  });

  it('should include names and URLs', () => {
    const breadcrumbs = [{ name: 'Home', url: 'https://youbuildit.dev' }];

    const schema = generateBreadcrumbSchema(breadcrumbs);
    expect(schema.itemListElement[0].name).toBe('Home');
    expect(schema.itemListElement[0].item).toBe('https://youbuildit.dev');
  });
});

describe('generateFAQSchema', () => {
  it('should generate valid FAQ schema', () => {
    const schema = generateFAQSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toBeInstanceOf(Array);
  });

  it('should include multiple questions', () => {
    const schema = generateFAQSchema();
    expect(schema.mainEntity.length).toBeGreaterThan(0);
  });

  it('should have valid question structure', () => {
    const schema = generateFAQSchema();
    const firstQuestion = schema.mainEntity[0];
    expect(firstQuestion['@type']).toBe('Question');
    expect(firstQuestion.name).toBeDefined();
    expect(firstQuestion.acceptedAnswer['@type']).toBe('Answer');
    expect(firstQuestion.acceptedAnswer.text).toBeDefined();
  });

  it('should include relevant questions', () => {
    const schema = generateFAQSchema();
    const questionNames = schema.mainEntity.map(q => q.name);
    expect(questionNames.some(q => q.includes('You Build It'))).toBe(true);
    expect(questionNames.some(q => q.includes('free'))).toBe(true);
  });
});

describe('combineSchemas', () => {
  it('should return single schema if only one provided', () => {
    const schema = { '@type': 'WebSite', name: 'Test' };
    const result = combineSchemas([schema]);
    expect(result).toEqual(schema);
  });

  it('should combine multiple schemas into @graph', () => {
    const schema1 = { '@type': 'WebSite', name: 'Test 1' };
    const schema2 = { '@type': 'Organization', name: 'Test 2' };
    const result = combineSchemas([schema1, schema2]);

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@graph']).toBeInstanceOf(Array);
    expect(result['@graph']).toHaveLength(2);
    expect(result['@graph']).toContain(schema1);
    expect(result['@graph']).toContain(schema2);
  });

  it('should preserve all schemas in correct order', () => {
    const schemas = [
      { '@type': 'WebSite', name: 'Test 1' },
      { '@type': 'Organization', name: 'Test 2' },
      { '@type': 'Course', name: 'Test 3' },
    ];
    const result = combineSchemas(schemas);
    expect(result['@graph']).toEqual(schemas);
  });
});
