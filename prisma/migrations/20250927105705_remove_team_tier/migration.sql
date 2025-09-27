/*
  Warnings:

  - The values [TEAM] on the enum `SubscriptionTier` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."SubscriptionTier_new" AS ENUM ('FREE', 'PRO');
ALTER TABLE "public"."Challenge" ALTER COLUMN "tier" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "subscriptionTier" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "subscriptionTier" TYPE "public"."SubscriptionTier_new" USING ("subscriptionTier"::text::"public"."SubscriptionTier_new");
ALTER TABLE "public"."Challenge" ALTER COLUMN "tier" TYPE "public"."SubscriptionTier_new" USING ("tier"::text::"public"."SubscriptionTier_new");
ALTER TYPE "public"."SubscriptionTier" RENAME TO "SubscriptionTier_old";
ALTER TYPE "public"."SubscriptionTier_new" RENAME TO "SubscriptionTier";
DROP TYPE "public"."SubscriptionTier_old";
ALTER TABLE "public"."Challenge" ALTER COLUMN "tier" SET DEFAULT 'FREE';
ALTER TABLE "public"."User" ALTER COLUMN "subscriptionTier" SET DEFAULT 'FREE';
COMMIT;
