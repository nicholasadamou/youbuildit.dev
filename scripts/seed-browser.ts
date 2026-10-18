import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.PRISMA_DATABASE_URL;
if (
  !connectionString ||
  !/^postgres(?:ql)?:\/\/[^/]+\/(youbuildit_test)(?:\?|$)/.test(
    connectionString
  )
) {
  throw new Error(
    'Browser fixtures may only be written to the dedicated youbuildit_test database.'
  );
}
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});
try {
  await prisma.challenge.upsert({
    where: { slug: 'browser-test-word-counter' },
    update: {},
    create: {
      slug: 'browser-test-word-counter',
      title: 'Test fixture: Word counter',
      summary:
        'A sample challenge used only for automated browser verification.',
      difficulty: 'BEGINNER',
      category: 'CLI',
      skills: ['Parsing'],
      estimatedTime: '1 hour',
      content:
        '## Build a word counter\n\nRead text and count its words.\n\n## Requirements\n\nHandle empty input and repeated whitespace.',
      hasSolution: true,
      solutionLanguage: 'python',
      solutions: {
        create: {
          fileName: 'counter.py',
          filePath: 'counter.py',
          fileContent: 'def count_words(text):\n    return len(text.split())\n',
          fileType: 'SOURCE',
        },
      },
    },
  });
} finally {
  await prisma.$disconnect();
}
