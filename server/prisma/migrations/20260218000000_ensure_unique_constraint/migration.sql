-- This migration ensures the correct unique constraint exists
-- It is idempotent and can be run multiple times safely

-- Step 1: Drop old unique constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'progresses_userId_workshopId_key'
  ) THEN
    ALTER TABLE "progresses" DROP CONSTRAINT "progresses_userId_workshopId_key";
    RAISE NOTICE 'Dropped old constraint: progresses_userId_workshopId_key';
  END IF;
END $$;

-- Step 2: Check if materialId column exists (in any case variation)
DO $$
DECLARE
  col_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'progresses' 
    AND column_name IN ('materialid', 'materialId')
  ) INTO col_exists;
  
  IF NOT col_exists THEN
    ALTER TABLE "progresses" ADD COLUMN "materialId" INTEGER;
    RAISE NOTICE 'Added materialId column';
  ELSE
    RAISE NOTICE 'materialId column already exists';
  END IF;
END $$;

-- Step 3: Drop new unique constraint if it exists (to recreate it cleanly)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'progresses_userId_workshopId_materialId_key'
  ) THEN
    ALTER TABLE "progresses" DROP CONSTRAINT "progresses_userId_workshopId_materialId_key";
    RAISE NOTICE 'Dropped constraint to recreate: progresses_userId_workshopId_materialId_key';
  END IF;
END $$;

-- Step 4: Drop the index if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'progresses_userId_workshopId_materialId_key'
  ) THEN
    DROP INDEX "progresses_userId_workshopId_materialId_key";
    RAISE NOTICE 'Dropped index: progresses_userId_workshopId_materialId_key';
  END IF;
END $$;

-- Step 5: Add foreign key constraint for materialId if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'progresses_materialId_fkey'
  ) THEN
    ALTER TABLE "progresses" 
    ADD CONSTRAINT "progresses_materialId_fkey" 
    FOREIGN KEY ("materialId") REFERENCES "materials"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
    RAISE NOTICE 'Added foreign key constraint: progresses_materialId_fkey';
  END IF;
END $$;

-- Step 6: Create new unique constraint (as index)
CREATE UNIQUE INDEX IF NOT EXISTS "progresses_userId_workshopId_materialId_key" 
ON "progresses"("userId", "workshopId", "materialId");
