# ローカル開発クイックスタートガイド

## 前提条件

- Node.js 18以上
- PostgreSQL 14以上
- npm または yarn

## セットアップ手順

### 1. PostgreSQLデータベースの作成

```bash
# PostgreSQLにログイン
psql -U postgres

# データベースを作成
CREATE DATABASE workshop_db;

# ユーザーを作成（オプション）
CREATE USER workshop_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE workshop_db TO workshop_user;

# 終了
\q
```

### 2. Backendのセットアップ

```bash
cd server

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env

# .envファイルを編集
# DATABASE_URL="postgresql://postgres:password@localhost:5432/workshop_db?schema=public"
# JWT_SECRET="your-random-secret-key-here"

# Prismaクライアント生成
npx prisma generate

# データベースマイグレーション
npx prisma migrate dev --name init

# Seedデータの投入
node prisma/seed.js
```

### 3. Frontendのセットアップ

```bash
cd ../client

# 依存関係のインストール
npm install
```

### 4. アプリケーションの起動

```bash
# Terminal 1: Backend起動
cd server
npm run dev

# Terminal 2: Frontend起動
cd client
npm run dev
```

### 5. ブラウザでアクセス

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### テストアカウント

**管理者:**
- Email: admin@example.com
- Password: admin123

**ユーザー:**
- Email: user@example.com
- Password: user123

## トラブルシューティング

### データベース接続エラー

```bash
# PostgreSQLが起動しているか確認
sudo systemctl status postgresql

# PostgreSQLを起動
sudo systemctl start postgresql
```

### Prismaマイグレーションエラー

```bash
# マイグレーションをリセット
cd server
npx prisma migrate reset

# 再度マイグレーション
npx prisma migrate dev
```

### ポート競合エラー

```bash
# 使用中のポートを確認
lsof -i :5000
lsof -i :3000

# プロセスを終了
kill -9 <PID>
```

## 開発時の便利なコマンド

```bash
# Prisma Studio（データベースGUI）を起動
cd server
npx prisma studio

# データベースをリセットしてSeedを再実行
cd server
npx prisma migrate reset --skip-seed
node prisma/seed.js

# TypeScriptのコンパイルチェック
cd server
npm run build
```

## API テスト例

```bash
# ログイン
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  -c cookies.txt

# ワークショップ一覧取得
curl http://localhost:5000/api/workshops \
  -b cookies.txt

# ワークショップ作成
curl -X POST http://localhost:5000/api/workshops \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"新しいワークショップ","description":"テスト","isPublic":true}'
```
