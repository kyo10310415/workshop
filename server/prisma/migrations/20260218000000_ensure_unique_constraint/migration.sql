-- Drop old unique constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'progresses_userId_workshopId_key'
  ) THEN
    ALTER TABLE "progresses" DROP CONSTRAINT "progresses_userId_workshopId_key";
  END IF;
END $$;

-- Ensure materialId column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'progresses' AND column_name = 'materialid'
  ) THEN
    ALTER TABLE "progresses" ADD COLUMN "materialId" INTEGER;
  END IF;
END $$;

-- Drop new unique constraint if it exists (to recreate it)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'progresses_userId_workshopId_materialId_key'
  ) THEN
    ALTER TABLE "progresses" DROP CONSTRAINT "progresses_userId_workshopId_materialId_key";
  END IF;
END $$;

-- Add foreign key constraint for materialId if not exists
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
  END IF;
END $$;

-- Create new unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS "progresses_userId_workshopId_materialId_key" 
ON "progresses"("userId", "workshopId", "materialId");
