-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingStatus" "OnboardingStatus" NOT NULL DEFAULT 'IN_PROGRESS';
