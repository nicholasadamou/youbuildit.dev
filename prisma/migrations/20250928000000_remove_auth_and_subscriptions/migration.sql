-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChallengeProgress" DROP CONSTRAINT "ChallengeProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChallengeProgress" DROP CONSTRAINT "ChallengeProgress_challengeId_fkey";

-- DropIndex
DROP INDEX "public"."Challenge_tier_published_idx";

-- AlterTable
ALTER TABLE "public"."Challenge" DROP COLUMN "tier";

-- DropTable
DROP TABLE "public"."Account";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."VerificationToken";

-- DropTable
DROP TABLE "public"."ChallengeProgress";

-- DropEnum
DROP TYPE "public"."SubscriptionStatus";

-- DropEnum
DROP TYPE "public"."SubscriptionTier";

