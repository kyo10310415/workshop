# ワークショップ管理システム

PDF資料を用いたワークショップ（レッスン）を管理するシステム。管理者がワークショップを作成し、PDF資料を紐づけて公開できる。ユーザーはPDFを閲覧し、進行度が自動保存される。

## 🎯 主な機能

### 管理者（ADMIN）
- ✅ ワークショップの作成・編集・削除
- ✅ PDF資料のアップロード・管理
- ✅ ユーザーの作成・管理

### ユーザー（USER）
- ✅ 公開ワークショップの閲覧
- ✅ PDF資料の閲覧
- ✅ 進行度の自動保存（最後に見たページ、完了状態）

## 📋 技術スタック

### Backend
- **Framework**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (HTTP-only cookie)
- **File Upload**: Multer

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **PDF Viewer**: PDF.js (実装予定)

## 🚀 デプロイ手順（Render）

### 前提条件
- Renderアカウント
- GitHubリポジトリにプロジェクトをpush済み
- PostgreSQLデータベース（Render提供）

### 1. データベースの作成

1. Renderダッシュボードで「New PostgreSQL」を作成
2. Database URLをコピー（例: `postgresql://user:pass@host/dbname`）

### 2. Web Serviceの作成

1. Renderダッシュボードで「New Web Service」を作成
2. GitHubリポジトリを接続
3. 以下の設定を入力：

**Build Command:**
```bash
cd server && npm install && npx prisma generate && npm run build && cd ../client && npm install && npm run build
```

**Start Command:**
```bash
cd server && npx prisma migrate deploy && npm run prisma:seed && npm start
```

**Environment Variables:**
```
DATABASE_URL=<RenderのPostgreSQL URL>
JWT_SECRET=<ランダムな秘密鍵>
NODE_ENV=production
PORT=10000
FRONTEND_URL=<Web ServiceのURL>
```

### 3. デプロイ

「Create Web Service」をクリックしてデプロイ開始。

## 💻 ローカル開発環境のセットアップ

### 前提条件
- Node.js 18以上
- PostgreSQL 14以上

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd webapp
```

### 2. Backendのセットアップ

```bash
cd server

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してDATABASE_URLを設定

# Prismaクライアント生成
npx prisma generate

# データベースマイグレーション
npx prisma migrate dev

# Seedデータの投入
npm run prisma:seed

# 開発サーバー起動
npm run dev
```

### 3. Frontendのセットアップ

```bash
cd client

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

### 4. アクセス

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🔑 テストアカウント

### 管理者
- **Email**: admin@example.com
- **Password**: admin123

### ユーザー
- **Email**: user@example.com
- **Password**: user123

## 📚 API エンドポイント

### 認証
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報取得

### ワークショップ
- `GET /api/workshops` - ワークショップ一覧
- `GET /api/workshops/:id` - ワークショップ詳細
- `POST /api/workshops` - ワークショップ作成（管理者のみ）
- `PUT /api/workshops/:id` - ワークショップ更新（管理者のみ）
- `DELETE /api/workshops/:id` - ワークショップ削除（管理者のみ）

### PDF資料
- `POST /api/workshops/:workshopId/materials` - PDF資料アップロード（管理者のみ）
- `GET /api/materials/:materialId` - PDF資料取得
- `DELETE /api/materials/:materialId` - PDF資料削除（管理者のみ）

### 進行度
- `GET /api/workshops/:workshopId/progress` - 進行度取得
- `PUT /api/workshops/:workshopId/progress` - 進行度更新

### ユーザー管理
- `GET /api/admin/users` - ユーザー一覧（管理者のみ）
- `POST /api/admin/users` - ユーザー作成（管理者のみ）
- `DELETE /api/admin/users/:id` - ユーザー削除（管理者のみ）

## 📁 プロジェクト構造

```
webapp/
├── server/                 # Backend
│   ├── src/
│   │   ├── controllers/   # APIコントローラー
│   │   ├── middlewares/   # 認証ミドルウェア
│   │   ├── routes/        # ルート定義
│   │   ├── services/      # ビジネスロジック
│   │   ├── utils/         # ユーティリティ
│   │   └── index.ts       # エントリーポイント
│   ├── prisma/
│   │   ├── schema.prisma  # データベーススキーマ
│   │   └── seed.js        # Seedデータ
│   ├── uploads/           # PDFファイル保存先
│   └── package.json
├── client/                # Frontend
│   ├── src/
│   │   ├── pages/        # ページコンポーネント
│   │   ├── api.ts        # API クライアント
│   │   └── App.tsx       # ルートコンポーネント
│   └── package.json
└── README.md
```

## 🛠️ データベーススキーマ

### User
- id, email, password, name, role, timestamps

### Workshop
- id, title, description, isPublic, timestamps

### Material (PDF)
- id, workshopId, title, filename, fileSize, pageCount, timestamps

### Progress
- id, userId, workshopId, lastPage, completed, updatedAt

## 🔒 セキュリティ

- パスワードはbcryptでハッシュ化
- JWT認証（HTTP-only cookie）
- CORS設定
- 管理者権限チェック
- ファイルタイプ検証（PDFのみ）

## 📝 環境変数

### Server (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/workshop_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

## 🚧 未実装機能（今後の拡張）

- ❌ PDF.jsを使ったフルPDFビューア画面
- ❌ ページ送り/戻しUI
- ❌ 完了ボタンUI
- ❌ 管理者ダッシュボード画面
- ❌ ユーザー管理画面
- ❌ プロフィール編集
- ❌ パスワード変更
- ❌ ワークショップ検索・フィルター
- ❌ レスポンシブデザイン

## 📮 API使用例

### ログイン
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  --cookie-jar cookies.txt
```

### ワークショップ作成
```bash
curl -X POST http://localhost:5000/api/workshops \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"新しいワークショップ","description":"説明","isPublic":true}'
```

### PDF資料アップロード
```bash
curl -X POST http://localhost:5000/api/workshops/1/materials \
  -b cookies.txt \
  -F "pdf=@sample.pdf" \
  -F "title=サンプル資料"
```

## 📄 ライセンス

MIT

## 👥 開発者

開発者情報
