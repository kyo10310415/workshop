# Render マイグレーション修正手順

## 問題
- マイグレーション `20260217164224_add_material_types_and_progress_by_material` が失敗している
- `materialId` カラムが存在しないため、進捗保存ができない
- 外部リンク資料の完了ボタンがエラーになる

## 解決方法

### 方法1: Render Shell で直接実行（推奨）

1. Renderダッシュボードを開く
2. `workshop-management-system` サービスを選択
3. **Shell** タブをクリック
4. 以下のコマンドを順番に実行：

```bash
cd /opt/render/project/src/server

# 失敗したマイグレーションをロールバック扱いにする
npx prisma migrate resolve --rolled-back "20260217164224_add_material_types_and_progress_by_material"

# 新しいマイグレーションを適用
npx prisma migrate deploy

# Prismaクライアントを再生成
npx prisma generate

# マイグレーション状態を確認
npx prisma migrate status
```

5. 出力に "Database schema is up to date!" と表示されればOK
6. サービスを再起動（Dashboard → Manual Deploy → Deploy latest commit）

---

### 方法2: Start Command を一時的に変更

現在のStart Command:
```
cd server && npx prisma migrate deploy && node prisma/seed.js && npm start
```

一時的に変更（強制マイグレーション）:
```
cd server && npx prisma migrate resolve --rolled-back "20260217164224_add_material_types_and_progress_by_migration" || true && npx prisma migrate deploy && npx prisma generate && node prisma/seed.js && npm start
```

手順:
1. Renderダッシュボード → Settings
2. **Start Command** を上記に変更
3. **Save Changes**
4. Manual Deploy → Deploy latest commit
5. ログで "Migration ... applied successfully" を確認
6. Start Commandを元に戻す

---

### 方法3: データベースに直接接続

1. Renderダッシュボード → Database タブ
2. **Connect** → **External Connection** でDB URLをコピー
3. ローカルまたはRender Shellで接続：

```bash
psql "postgresql://workshop_db_user:password@hostname/workshop_db"
```

4. テーブル構造を確認：

```sql
\d progresses
```

5. `materialId` カラムがあるか確認
6. なければ手動で追加（非推奨、マイグレーションで行うべき）

---

## 確認事項

マイグレーション成功後、以下を確認：

1. Render Shell で確認：
```bash
cd /opt/render/project/src/server
npx prisma migrate status
```
→ "Database schema is up to date!" が表示される

2. データベーステーブル確認：
```bash
npx prisma studio
```
→ `progresses` テーブルに `materialId` カラムが存在する

3. アプリケーション動作確認：
- 外部リンク資料の「完了にする」ボタンが正常に動作
- エラーアラートが表示されない
- 進捗バーが更新される

---

## 注意事項

- **方法1（Shell実行）が最も安全**で推奨
- 方法2はStart Commandの変更ミスに注意
- 方法3はデータベースの整合性を壊す可能性があるため非推奨
- マイグレーション後は必ずサービスを再起動

---

## トラブルシューティング

### エラー: "Migration already marked as rolled back"
→ 無視してOK、次のステップ（migrate deploy）に進む

### エラー: "Unique constraint violation"
→ データベースに既存の重複データがある
→ 重複データを削除してから再実行

### エラー: "Column already exists"
→ カラムは既に存在している
→ `npx prisma migrate status` で確認し、必要ならマイグレーションをスキップ

---

## サポート

問題が解決しない場合：
1. Renderのログを全てコピー（Logs タブ）
2. Shell実行結果をコピー
3. エラーメッセージをスクリーンショット
