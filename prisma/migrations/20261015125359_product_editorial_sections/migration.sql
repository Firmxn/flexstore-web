-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ImageRole" ADD VALUE 'STORY';
ALTER TYPE "ImageRole" ADD VALUE 'LOOKBOOK';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "storyText" TEXT,
ADD COLUMN     "videoHeroAutoplay" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "videoHeroUrl" TEXT;
