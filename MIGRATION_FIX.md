# マイグレーション修正手順

## 問題
本番データベースに失敗したマイグレーション記録が残っており、新しいマイグレーションが実行できません。

## 解決方法1：Renderシェルで手動修正（推奨）

### 1. Renderダッシュボードを開く
https://dashboard.render.com/

### 2. Shellタブを開く
Services → workshop-management-system → Shell

### 3. 以下のコマンドを実行

```bash
# 失敗したマイグレーションをスキップ
cd /opt/render/project/src/server
npx prisma migrate resolve --rolled-back "20260217164224_add_material_types_and_progress_by_material"

# 新しいマイグレーションを実行
npx prisma migrate deploy
```

### 4. 再デプロイ
Render Dashboard → Manual Deploy → Deploy latest commit

## 解決方法2：データベースに直接接続して修正

### 1. RenderのDatabase URLを取得
Dashboard → Database → Connect → External Connection

### 2. PostgreSQL クライアントで接続
```bash
psql "postgresql://workshop_db_0lq9_user:PASSWORD@dpg-d5p041d6ubrc739mgg00-a/workshop_db_0lq9"
```

### 3. SQLを実行
```sql
-- 失敗したマイグレーション記録を削除
DELETE FROM "_prisma_migrations" 
WHERE migration_name = '20260217164224_add_material_types_and_progress_by_material';

-- 確認
SELECT * FROM "_prisma_migrations" ORDER BY finished_at DESC;
```

### 4. 再デプロイ
Render Dashboard → Manual Deploy → Deploy latest commit

## 解決方法3：スタートコマンドを一時的に変更

### 1. Renderダッシュボードで設定変更
Settings → Build & Deploy → Start Command を以下に変更：

```bash
cd server && npx prisma migrate resolve --rolled-back "20260217164224_add_material_types_and_progress_by_material" && npx prisma migrate deploy && node prisma/seed.js && npm start
```

### 2. 保存して再デプロイ

### 3. デプロイ成功後、Start Commandを元に戻す
```bash
cd server && npx prisma migrate deploy && node prisma/seed.js && npm start
```

## 検証

マイグレーション成功後、以下を確認：
```bash
cd /opt/render/project/src/server
npx prisma migrate status
```

期待される出力：
```
Database schema is up to date!
```
