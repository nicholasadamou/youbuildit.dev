-- Existing installations may already have these objects from db push.
-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SolutionFileType') THEN
    CREATE TYPE "SolutionFileType" AS ENUM ('SOURCE', 'TEST', 'CONFIG', 'README', 'FIXTURE');
  END IF;
END $$;

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN IF NOT EXISTS "hasSolution" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "solutionLanguage" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "ChallengeSolution" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileContent" TEXT NOT NULL,
    "fileType" "SolutionFileType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChallengeSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "SolutionMetadata" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "testCoverage" DOUBLE PRECISION,
    "linesOfCode" INTEGER,
    "keyFeatures" TEXT[],
    "implementationNotes" TEXT,
    "performanceNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolutionMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ChallengeSolution_challengeId_fileType_idx" ON "ChallengeSolution"("challengeId", "fileType");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ChallengeSolution_challengeId_filePath_key" ON "ChallengeSolution"("challengeId", "filePath");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "SolutionMetadata_challengeId_key" ON "SolutionMetadata"("challengeId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Challenge_hasSolution_idx" ON "Challenge"("hasSolution");

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChallengeSolution_challengeId_fkey') THEN
    ALTER TABLE "ChallengeSolution" ADD CONSTRAINT "ChallengeSolution_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SolutionMetadata_challengeId_fkey') THEN
    ALTER TABLE "SolutionMetadata" ADD CONSTRAINT "SolutionMetadata_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

