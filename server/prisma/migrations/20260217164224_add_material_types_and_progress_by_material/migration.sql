-- CreateEnum for MaterialType
CREATE TYPE "MaterialType" AS ENUM ('PDF', 'GOOGLE_DOCS', 'GOOGLE_SHEETS');

-- AlterTable: Add new columns to materials table
ALTER TABLE "materials" ADD COLUMN "type" "MaterialType" NOT NULL DEFAULT 'PDF';
ALTER TABLE "materials" ADD COLUMN "url" TEXT;
ALTER TABLE "materials" ALTER COLUMN "filename" DROP NOT NULL;
ALTER TABLE "materials" ALTER COLUMN "originalName" DROP NOT NULL;
ALTER TABLE "materials" ALTER COLUMN "fileSize" DROP NOT NULL;
ALTER TABLE "materials" ALTER COLUMN "mimeType" DROP NOT NULL;

-- DropIndex: Remove old unique constraint on progresses
ALTER TABLE "progresses" DROP CONSTRAINT "progresses_userId_workshopId_key";

-- AlterTable: Add materialId to progresses table
ALTER TABLE "progresses" ADD COLUMN "materialId" INTEGER;

-- AddForeignKey: Link progresses to materials
ALTER TABLE "progresses" ADD CONSTRAINT "progresses_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex: Add new unique constraint including materialId
CREATE UNIQUE INDEX "progresses_userId_workshopId_materialId_key" ON "progresses"("userId", "workshopId", "materialId");
