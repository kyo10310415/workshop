-- CreateTable
CREATE TABLE IF NOT EXISTS "external_material_completions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_material_completions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "external_material_completions_userId_materialId_key" ON "external_material_completions"("userId", "materialId");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'external_material_completions_userId_fkey'
  ) THEN
    ALTER TABLE "external_material_completions" 
    ADD CONSTRAINT "external_material_completions_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'external_material_completions_materialId_fkey'
  ) THEN
    ALTER TABLE "external_material_completions" 
    ADD CONSTRAINT "external_material_completions_materialId_fkey" 
    FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
