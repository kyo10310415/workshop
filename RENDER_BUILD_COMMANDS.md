# Render Build & Start Commands

## 正しいBuild Command

```bash
cd server && npm install --include=dev && npx prisma generate && npm run build && cd ../client && npm install --include=dev && npm run build
```

**重要**: 両方のディレクトリに`--include=dev` フラグを追加して、devDependenciesもインストールします。
これにより、TypeScript、Prisma CLI、型定義ファイル、Viteがインストールされます。

## Start Command

```bash
cd server && npx prisma migrate deploy && node prisma/seed.js && npm start
```

## 環境変数（Environment Variables）

Renderの「Environment」タブで以下を設定してください：

```
DATABASE_URL=<RenderのPostgreSQL Internal Database URL>
JWT_SECRET=<ランダムな秘密鍵（例: openssl rand -base64 32で生成）>
NODE_ENV=production
PORT=10000
FRONTEND_URL=<Web ServiceのURL（例: https://workshop-xxxx.onrender.com）>
```

## トラブルシューティング

### ビルドエラー: Cannot find type definition file for 'node'

**原因**: `npm install`が本番モードで実行され、devDependenciesがインストールされない

**解決**: Build Commandに`--include=dev`を追加

### マイグレーションエラー

**原因**: DATABASE_URLが正しく設定されていない

**解決**: 
1. RenderのPostgreSQLダッシュボードで「Internal Database URL」をコピー
2. 環境変数`DATABASE_URL`にペースト

### Seedエラー

**原因**: bcryptモジュールがロードできない

**解決**: 
- 通常は自動的に解決されます
- 必要に応じて`npm rebuild bcrypt`を実行

### サーバー起動エラー

**原因**: PORTまたはFRONTEND_URLが設定されていない

**解決**: 環境変数を確認

## デプロイ後の確認

1. ブラウザでWeb ServiceのURLを開く
2. ログイン画面が表示されることを確認
3. テストアカウントでログイン:
   - 管理者: admin@example.com / admin123
   - ユーザー: user@example.com / user123
