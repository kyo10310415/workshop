#!/bin/bash
# このスクリプトをRenderのシェルで実行してください
# Render Dashboard → Services → workshop-management-system → Shell

# Step 1: 失敗したマイグレーション記録を削除
cd /opt/render/project/src/server
npx prisma db execute --stdin <<SQL
DELETE FROM "_prisma_migrations" 
WHERE migration_name = '20260217164224_add_material_types_and_progress_by_material';
SQL

echo "✅ 失敗したマイグレーション記録を削除しました"

# Step 2: 新しいマイグレーションを実行
npx prisma migrate deploy

echo "✅ マイグレーションが完了しました"
