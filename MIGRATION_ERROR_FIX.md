# マイグレーションエラー解決手順

## エラー内容
```
ERROR: column "materialId" of relation "progresses" already exists
Migration name: 20260218000000_ensure_unique_constraint
```

## 解決方法

### ステップ1: Render Shellを開く
1. Renderダッシュボード → `workshop-management-system` サービス
2. **Shell** タブをクリック

### ステップ2: 失敗したマイグレーションをロールバック扱いにする
```bash
cd /opt/render/project/src/server

# 失敗したマイグレーションをロールバック扱いにする
npx prisma migrate resolve --rolled-back "20260218000000_ensure_unique_constraint"
```

### ステップ3: 最新のコードをデプロイ
1. Render Dashboard に戻る
2. **Manual Deploy** → **Deploy latest commit** をクリック

### ステップ4: デプロイログを確認
以下のメッセージが表示されればOK：
```
✓ Applying migration `20260218000000_ensure_unique_constraint`
✓ Applying migration `20260218000001_add_external_material_completion`
```

### ステップ5: マイグレーション状態を確認（任意）
Render Shellで以下を実行：
```bash
cd /opt/render/project/src/server
npx prisma migrate status
```

出力例：
```
Database schema is up to date!
```

## トラブルシューティング

### エラー: "Migration already marked as rolled back"
→ 無視してOK。次のステップに進む。

### エラー: "Migration still showing as failed"
→ データベースから直接削除：
```bash
cd /opt/render/project/src/server
npx wrangler d1 execute workshop_db --command="DELETE FROM _prisma_migrations WHERE migration_name = '20260218000000_ensure_unique_constraint';"
```

### サービスが起動しない
→ ログを確認して、具体的なエラーメッセージをチェック。

## デプロイ後の確認事項

1. ✅ サービスが正常に起動している
2. ✅ eラーニング一覧ページが表示される
3. ✅ 外部リンク資料の「完了にする」ボタンが動作する
4. ✅ PDF資料のページ進捗が保存される
5. ✅ エラーアラートが表示されない

## 本番URL
https://workshop-management-system-wp6s.onrender.com
