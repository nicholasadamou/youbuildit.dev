import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { hasAccessToChallenge } from '@/lib/subscription';
import { PrismaClient } from '@prisma/client';
import JSZip from 'jszip';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { slug } = await params;

    // Get user subscription status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get challenge with solution
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

    // Check if user has access to this challenge
    const challengeForAccess = {
      ...challenge,
      content: challenge.content || '',
      source: 'database' as const,
      difficulty: challenge.difficulty
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase()) as
        | 'Beginner'
        | 'Intermediate'
        | 'Advanced',
      solutionLanguage: challenge.solutionLanguage || undefined,
    };
    const hasAccess = hasAccessToChallenge(user, challengeForAccess);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied. Pro subscription required.' },
        { status: 403 }
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
        downloadedBy: userId,
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
