# Renderデプロイ設定（最終版）

## 🔧 正しいビルド＆スタートコマンド

### ✅ Build Command（最終版）
```bash
cd server && npm install --include=dev && npx prisma generate && npm run build && cd ../client && npm install --include=dev && npm run build
```

**重要ポイント:**
- `npm install --include=dev` を使用（devDependenciesもインストール）
- TypeScript、型定義、Prismaツールをビルド時に利用可能にする

---

### ✅ Start Command（最終版）
```bash
cd server && npx prisma migrate deploy && node prisma/seed.js && npm start
```

**重要ポイント:**
- `npx prisma migrate deploy` でマイグレーション適用
- `node prisma/seed.js` で初期データ投入
- `npm start` でサーバー起動

---

## 📊 期待されるデプロイログ

### ビルドフェーズ
```
==> Running build command...
cd server && npm install --include=dev
✓ added 183 packages

npx prisma generate
✓ Generated Prisma Client (v6.19.2)

npm run build
✓ TypeScript compilation successful

cd ../client && npm install --include=dev
✓ added 207 packages

npm run build
✓ vite build successful

==> Build succeeded 🎉
```

### デプロイフェーズ
```
==> Running 'cd server && npx prisma migrate deploy && node prisma/seed.js && npm start'

Prisma schema loaded from prisma/schema.prisma
Database changes to apply:

  [+] Migration `20240122000000_init`

The following migration(s) have been applied:

migrations/
  └─ 20240122000000_init/
    └─ migration.sql

Your database is now in sync with your schema.

Seeding database...
Created admin user: admin@example.com
Created test user: user@example.com
Created sample workshop: はじめてのワークショップ
Seeding completed!

Server running on port 10000
Environment: production

==> Your service is live 🎉
```

---

## 🎯 初期データ

Seedスクリプトで以下のデータが作成されます：

### テストアカウント
| 役割 | メールアドレス | パスワード |
|------|---------------|-----------|
| 管理者 | admin@example.com | admin123 |
| ユーザー | user@example.com | user123 |

### サンプルワークショップ
- **タイトル**: はじめてのワークショップ
- **説明**: これはサンプルのワークショップです。PDFをアップロードして使い始めましょう。
- **公開設定**: 公開中

---

## 🔍 トラブルシューティング

### 問題1: "The table 'public.users' does not exist"
**原因:** マイグレーションが適用されていない

**解決策:**
1. `prisma/migrations`フォルダが存在することを確認
2. Start Commandに`npx prisma migrate deploy`が含まれていることを確認
3. Renderで再デプロイ

### 問題2: "Login error: Internal server error"
**原因:** データベースにデータが存在しない

**解決策:**
1. Start Commandに`node prisma/seed.js`が含まれていることを確認
2. Renderのログで"Seeding completed!"を確認
3. 必要に応じてRender Shellで手動実行:
   ```bash
   cd server && node prisma/seed.js
   ```

### 問題3: TypeScriptビルドエラー
**原因:** devDependenciesがインストールされていない

**解決策:**
Build Commandに`--include=dev`を追加

---

## 🚀 Renderでの設定手順

### 1. Renderダッシュボードにアクセス
- https://render.com/ にログイン
- あなたのWeb Serviceを選択

### 2. Build Commandを更新
**Settings** → **Build & Deploy** → **Build Command**に以下をコピー：
```bash
cd server && npm install --include=dev && npx prisma generate && npm run build && cd ../client && npm install --include=dev && npm run build
```

### 3. Start Commandを更新
**Settings** → **Build & Deploy** → **Start Command**に以下をコピー：
```bash
cd server && npx prisma migrate deploy && node prisma/seed.js && npm start
```

### 4. 環境変数を確認
**Environment** タブで以下が設定されていることを確認：
- `DATABASE_URL`: PostgreSQL接続文字列
- `JWT_SECRET`: ランダムな秘密鍵（32文字以上推奨）
- `NODE_ENV`: `production`
- `PORT`: `10000`
- `FRONTEND_URL`: あなたのRender Web Service URL

### 5. 再デプロイ
**Manual Deploy** → **Deploy latest commit**

---

## ✅ デプロイ成功の確認

1. **ログ確認**
   - "Build succeeded 🎉"が表示される
   - "Your service is live 🎉"が表示される
   - "Seeding completed!"が表示される

2. **アプリケーション確認**
   - Web Service URLにアクセス
   - ログイン画面が表示される
   - `admin@example.com` / `admin123` でログイン可能

3. **動作確認**
   - ダッシュボードが表示される
   - ワークショップ一覧が表示される
   - サンプルワークショップが表示される

---

## 📝 手動でのSeed実行（必要な場合）

もしSeedが実行されていない場合、Render Shellで手動実行：

1. **Renderダッシュボード** → **あなたのWeb Service** → **Shell**タブ
2. 以下を実行：
   ```bash
   cd server && node prisma/seed.js
   ```
3. 成功メッセージを確認：
   ```
   Seeding database...
   Created admin user: admin@example.com
   Created test user: user@example.com
   Created sample workshop: はじめてのワークショップ
   Seeding completed!
   ```

---

## 🎉 完了！

これでワークショップ管理システムが正常にデプロイされました。

**次のステップ:**
- 管理者アカウントでログイン
- 新しいワークショップを作成
- PDF資料をアップロード
- ユーザーアカウントでPDF閲覧をテスト
