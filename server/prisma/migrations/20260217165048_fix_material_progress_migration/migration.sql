-- Fix migration: Add material types and progress by material
-- This migration is idempotent and can be run multiple times

-- Step 1: Create MaterialType enum if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MaterialType') THEN
    CREATE TYPE "MaterialType" AS ENUM ('PDF', 'GOOGLE_DOCS', 'GOOGLE_SHEETS');
  END IF;
END $$;

-- Step 2: Add new columns to materials table
ALTER TABLE "materials" ADD COLUMN IF NOT EXISTS "type" "MaterialType" NOT NULL DEFAULT 'PDF';
ALTER TABLE "materials" ADD COLUMN IF NOT EXISTS "url" TEXT;

-- Step 3: Make PDF-specific fields nullable
DO $$ 
BEGIN
  -- Check and alter filename column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'materials' 
    AND column_name = 'filename' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "materials" ALTER COLUMN "filename" DROP NOT NULL;
  END IF;

  -- Check and alter originalName column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'materials' 
    AND column_name = 'originalName' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "materials" ALTER COLUMN "originalName" DROP NOT NULL;
  END IF;

  -- Check and alter fileSize column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'materials' 
    AND column_name = 'fileSize' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "materials" ALTER COLUMN "fileSize" DROP NOT NULL;
  END IF;

  -- Check and alter mimeType column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'materials' 
    AND column_name = 'mimeType' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "materials" ALTER COLUMN "mimeType" DROP NOT NULL;
  END IF;
END $$;

-- Step 4: Add materialId to progresses table
ALTER TABLE "progresses" ADD COLUMN IF NOT EXISTS "materialId" INTEGER;

-- Step 5: Remove old unique constraint on progresses (if exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'progresses_userId_workshopId_key'
  ) THEN
    ALTER TABLE "progresses" DROP CONSTRAINT "progresses_userId_workshopId_key";
  END IF;
END $$;

-- Step 6: Add foreign key constraint (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'progresses_materialId_fkey'
  ) THEN
    ALTER TABLE "progresses" ADD CONSTRAINT "progresses_materialId_fkey" 
      FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Step 7: Create new unique index including materialId (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'progresses_userId_workshopId_materialId_key'
  ) THEN
    CREATE UNIQUE INDEX "progresses_userId_workshopId_materialId_key" 
      ON "progresses"("userId", "workshopId", "materialId");
  END IF;
END $$;
