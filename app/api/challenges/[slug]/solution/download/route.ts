import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import JSZip from 'jszip';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get challenge with solution (published challenges only)
    const challenge = await prisma.challenge.findFirst({
      where: { slug, published: true },
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

    // Create zip file
    const zip = new JSZip();

    // Add all solution files to the zip
    for (const file of challenge.solutions) {
      zip.file(file.filePath, file.fileContent);
    }

    // Add a metadata file with solution information
    const metadataContent = JSON.stringify(
      {
        challenge: {
          title: challenge.title,
          slug: challenge.slug,
          difficulty: challenge.difficulty,
          category: challenge.category,
        },
        solution: {
          language: challenge.solutionLanguage,
          ...(challenge.solutionMetadata || {}),
        },
        downloadedAt: new Date().toISOString(),
      },
      null,
      2
    );

    zip.file('solution-info.json', metadataContent);

    // Generate zip buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Return the zip file
    return new NextResponse(zipBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${slug}-solution.zip"`,
      },
    });
  } catch (error) {
    console.error('Error downloading solution:', error);
    return NextResponse.json(
      {
        error: 'Failed to download solution',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
