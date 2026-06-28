import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get challenge with solutions
    const challenge = await prisma.challenge.findUnique({
      where: { slug },
      include: {
        solutions: true,
        solutionMetadata: true,
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    if (
      !challenge.hasSolution ||
      !challenge.solutions ||
      challenge.solutions.length === 0
    ) {
      return NextResponse.json(
        { error: 'No solution available for this challenge' },
        { status: 404 }
      );
    }

    // Calculate some basic metrics if metadata is missing
    const files = challenge.solutions.map(file => ({
      type: file.fileType,
      filename: file.fileName,
      content: file.fileContent,
      relativePath: file.filePath,
    }));

    const sourceFiles = files.filter(f => f.type === 'SOURCE');
    const testFiles = files.filter(f => f.type === 'TEST');

    // Calculate lines of code if not available
    const calculatedLinesOfCode = sourceFiles.reduce(
      (total, file) => total + file.content.split('\n').length,
      0
    );

    // Estimate test coverage based on test files presence and content
    const estimatedTestCoverage =
      testFiles.length > 0
        ? Math.min(85, Math.max(60, testFiles.length * 30)) // Estimate 60-85% based on test files
        : 0;

    // Return solution data
    const solutionData = {
      language: challenge.solutionLanguage,
      files,
      metadata: challenge.solutionMetadata
        ? {
            linesOfCode:
              challenge.solutionMetadata.linesOfCode || calculatedLinesOfCode,
            testCoverage:
              challenge.solutionMetadata.testCoverage ?? estimatedTestCoverage,
            keyFeatures: challenge.solutionMetadata.keyFeatures || [],
            implementationNotes:
              challenge.solutionMetadata.implementationNotes?.split('\n') || [],
          }
        : {
            linesOfCode: calculatedLinesOfCode,
            testCoverage: estimatedTestCoverage,
            keyFeatures: [],
            implementationNotes: [],
          },
    };

    return NextResponse.json(solutionData);
  } catch (error) {
    console.error('Error fetching solution:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch solution',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
