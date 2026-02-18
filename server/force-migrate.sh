#!/bin/bash
set -e

echo "=== Force Migration Script ==="
echo "Current directory: $(pwd)"

cd /opt/render/project/src/server

echo "Step 1: Check migration status"
npx prisma migrate status || true

echo "Step 2: Mark old failed migration as rolled back (if exists)"
npx prisma migrate resolve --rolled-back "20260217164224_add_material_types_and_progress_by_material" || true

echo "Step 3: Deploy migrations"
npx prisma migrate deploy

echo "Step 4: Check final migration status"
npx prisma migrate status

echo "Step 5: Generate Prisma Client"
npx prisma generate

echo "=== Migration Complete ==="
