# Render デプロイガイド

## Renderへのデプロイ手順

### 前提条件
- Renderアカウント（https://render.com/）
- GitHubリポジトリにプロジェクトがpush済み

### Step 1: PostgreSQLデータベースの作成

1. Renderダッシュボードにログイン
2. 「New」→「PostgreSQL」を選択
3. 以下の設定を入力：
   - **Name**: `workshop-db`
   - **Database**: `workshop_db`
   - **User**: `workshop_user`
   - **Region**: 最寄りのリージョンを選択
   - **Plan**: Free（開発用）またはStarter

4. 「Create Database」をクリック
5. 作成後、「Internal Database URL」をコピー

### Step 2: Web Serviceの作成

1. Renderダッシュボードで「New」→「Web Service」を選択
2. GitHubリポジトリを接続
3. 以下の設定を入力：

#### Basic Settings
- **Name**: `workshop-management-system`
- **Region**: PostgreSQLと同じリージョン
- **Branch**: `main`
- **Root Directory**: （空白のまま）
- **Environment**: `Node`
- **Build Command**:
  ```bash
  cd server && npm install && npx prisma generate && npm run build && cd ../client && npm install && npm run build
  ```
- **Start Command**:
  ```bash
  cd server && npx prisma migrate deploy && node prisma/seed.js && npm start
  ```

#### Instance Type
- **Plan**: Free（開発用）またはStarter

### Step 3: 環境変数の設定

「Environment」タブで以下の環境変数を追加：

| Key | Value | 説明 |
|-----|-------|------|
| `DATABASE_URL` | `<Step 1でコピーしたInternal Database URL>` | PostgreSQL接続URL |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-in-production-123456` | JWT署名用のランダムな文字列 |
| `NODE_ENV` | `production` | 本番環境設定 |
| `PORT` | `10000` | Renderのデフォルトポート |
| `FRONTEND_URL` | `https://workshop-management-system.onrender.com` | 作成されるWeb ServiceのURL（後で更新） |

**重要**: `JWT_SECRET`は必ず推測不可能なランダムな文字列に変更してください。

### Step 4: デプロイ

1. 「Create Web Service」をクリック
2. 自動的にビルドとデプロイが開始されます
3. デプロイログを確認：
   - ✅ 依存関係のインストール
   - ✅ Prismaクライアント生成
   - ✅ TypeScriptビルド
   - ✅ データベースマイグレーション
   - ✅ Seedデータ投入
   - ✅ サーバー起動

### Step 5: 動作確認

1. デプロイ完了後、Web ServiceのURLが表示されます
   - 例: `https://workshop-management-system.onrender.com`

2. ブラウザでアクセス
3. ログイン画面が表示されることを確認
4. テストアカウントでログイン：
   - Email: `admin@example.com`
   - Password: `admin123`

### Step 6: カスタムドメインの設定（オプション）

1. Web Serviceの「Settings」タブ
2. 「Custom Domain」セクションで独自ドメインを追加

## トラブルシューティング

### ビルドエラー

**エラー**: `npm install failed`
- **原因**: package.jsonの依存関係に問題
- **解決**: ローカルで`npm install`が成功することを確認

**エラー**: `Prisma Client not generated`
- **原因**: Build Commandが正しくない
- **解決**: Build Commandを確認し、`npx prisma generate`が含まれているか確認

### デプロイエラー

**エラー**: `Database connection failed`
- **原因**: DATABASE_URLが正しくない
- **解決**: 環境変数のDATABASE_URLを確認

**エラー**: `Port already in use`
- **原因**: PORTの設定が間違っている
- **解決**: 環境変数PORTを`10000`に設定

### 起動エラー

**エラー**: `JWT_SECRET is not defined`
- **原因**: JWT_SECRETが設定されていない
- **解決**: 環境変数にJWT_SECRETを追加

## 本番環境の設定

### セキュリティ設定

1. **JWT_SECRET**を強力なランダム文字列に変更
   ```bash
   # ランダムな文字列を生成
   openssl rand -base64 32
   ```

2. **データベースバックアップ**を有効化
   - RenderのPostgreSQL設定で自動バックアップを有効化

### パフォーマンス最適化

1. **Renderプランのアップグレード**
   - Free Tierはスリープするため、有料プランを推奨

2. **ファイルストレージの設定**
   - PDF保存先をCloudflare R2やAWS S3に変更
   - `server/src/services/storageService.ts`を修正

### モニタリング

1. Renderダッシュボードでログを確認
2. エラーログをチェック
3. パフォーマンスメトリクスを監視

## デプロイ後のメンテナンス

### 再デプロイ

```bash
# コードを更新
git add .
git commit -m "Update: description"
git push origin main

# Renderが自動的に再デプロイ
```

### データベースマイグレーション

```bash
# ローカルで新しいマイグレーションを作成
cd server
npx prisma migrate dev --name add_new_feature

# GitHubにpush
git add .
git commit -m "Add: new migration"
git push origin main

# Renderが自動的にマイグレーションを実行
```

### ログの確認

1. Renderダッシュボード→Web Service→「Logs」タブ
2. リアルタイムでログを確認
3. エラーをフィルタリング

## コスト見積もり

### Free Tier
- **Web Service**: Free（スリープあり）
- **PostgreSQL**: Free（90日間）
- **合計**: $0/月

### Production Tier
- **Web Service**: Starter ($7/月)
- **PostgreSQL**: Starter ($7/月)
- **合計**: $14/月

## サポート

問題が発生した場合：
1. Renderのドキュメントを確認: https://render.com/docs
2. GitHubのIssuesを確認
3. プロジェクトのREADME.mdを参照
