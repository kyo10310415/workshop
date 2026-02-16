# eラーニング管理システム

PDF資料を用いたeラーニング（レッスン）を管理するシステム。管理者がeラーニングを作成し、PDF資料を紐づけて公開できる。ユーザーはPDFを閲覧し、進行度が自動保存される。

## 🎉 **完成機能**

### ✅ 認証・ユーザー管理
- JWT認証（HTTP-only cookie）
- ログイン/ログアウト
- 管理者とユーザーの役割分離
- 管理者によるユーザー作成・削除

### ✅ eラーニング管理（管理者）
- eラーニングの作成・編集・削除
- 公開/非公開の切り替え
- eラーニング一覧表示

### ✅ PDF資料管理（管理者）
- PDFファイルのアップロード（Multer）
- 資料のタイトル設定
- アップロード済み資料の一覧表示
- 資料の削除

### ✅ PDFビューア
- PDF.js統合
- ページ送り/戻しボタン
- ズームイン/ズームアウト
- 現在ページ/総ページ数の表示
- スムーズなPDFレンダリング

### ✅ 進行度管理
- ページ移動時の自動保存（lastPage）
- 完了/未完了の切り替え
- 前回の続きから再開
- ユーザーごとの進行状況表示

### ✅ ユーザー向けページ
- 公開eラーニング一覧
- eラーニング詳細ページ
- 資料一覧表示
- 進行状況の可視化

### ✅ UI/UX
- **WannaV Dashboard風デザイン**: モダンな紫-青グラデーションテーマ
- **視認性の高い配色**: Purple-Blue グラデーション、大きなフォント、適切な余白
- **グラデーションカード**: 各eラーニングカードは紫から青へのグラデーション
- **インタラクティブな要素**: ホバーエフェクト、スムーズなトランジション、アニメーション
- **モダンなナビゲーションバー**: グラデーション背景、白文字、ロゴとアイコン
- **シンプルで洗練されたデザイン**: YouTube Clipperスタイルをベースにした統一感
- **アイコン統合**: SVGアイコンで操作を直感的に
- **空の状態表示**: データがない場合の分かりやすいメッセージ
- **Tailwind CSSによる統一されたデザイン言語**
- **保護されたルート**: 認証必須、管理者専用ページの制御
- **ローディング状態**: スピナーアニメーションで処理中を明示

---

## 📋 技術スタック

### Backend
- **Framework**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 6
- **Authentication**: JWT (HTTP-only cookie)
- **File Upload**: Multer
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **PDF Viewer**: PDF.js
- **Styling**: Tailwind CSS (CDN)
- **State Management**: React Context API

### Deployment
- **Platform**: Render
- **Database**: Render PostgreSQL
- **CI/CD**: GitHub連携による自動デプロイ

---

## 🌐 デプロイ済みURL

- **本番環境**: https://workshop-management-system-wp6s.onrender.com
- **GitHub**: https://github.com/kyo10310415/workshop

---

## 🔐 テストアカウント

### 管理者アカウント
- **メール**: admin@example.com
- **パスワード**: admin123
- **権限**: eラーニング管理、PDF管理、ユーザー管理

### 一般ユーザーアカウント
- **メール**: user@example.com
- **パスワード**: user123
- **権限**: 公開eラーニング閲覧、PDF閲覧、進行度管理

---

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
cd server && npm install --include=dev && npx prisma generate && npm run build && cd ../client && npm install --include=dev && npm run build
```

**Start Command:**
```bash
cd server && npx prisma migrate deploy && node prisma/seed.js && npm start
```

**Environment Variables:**
```
DATABASE_URL=<RenderのPostgreSQL URL>
JWT_SECRET=<ランダムな秘密鍵（32文字以上推奨）>
NODE_ENV=production
PORT=10000
FRONTEND_URL=<Web ServiceのURL>
```

### 3. デプロイ

「Create Web Service」をクリックしてデプロイ開始。

**初回デプロイ後：**
- マイグレーションが自動適用される
- Seedスクリプトで初期データが作成される
- テストアカウントでログイン可能

---

## 💻 ローカル開発環境のセットアップ

### 前提条件
- Node.js 18以上
- PostgreSQL 14以上

### 1. リポジトリをクローン

```bash
git clone https://github.com/kyo10310415/workshop.git
cd workshop
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

# マイグレーション実行
npx prisma migrate dev

# Seed実行（テストデータ作成）
node prisma/seed.js

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

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **ログイン**: admin@example.com / admin123

---

## 📁 プロジェクト構造

```
webapp/
├── server/                 # Backend (Express + TypeScript + Prisma)
│   ├── src/
│   │   ├── controllers/   # ビジネスロジック
│   │   ├── middlewares/   # 認証ミドルウェア
│   │   ├── routes/        # APIルート
│   │   ├── services/      # ストレージサービス
│   │   ├── utils/         # Prisma クライアント
│   │   └── index.ts       # エントリーポイント
│   ├── prisma/
│   │   ├── schema.prisma  # データベーススキーマ
│   │   ├── migrations/    # マイグレーションファイル
│   │   └── seed.js        # 初期データ
│   └── uploads/           # アップロードされたPDFファイル
│
├── client/                # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/    # 共通コンポーネント
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/      # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── pages/         # ページコンポーネント
│   │   │   ├── Login.tsx
│   │   │   ├── Workshops.tsx
│   │   │   ├── WorkshopDetail.tsx
│   │   │   ├── PDFViewer.tsx
│   │   │   └── admin/     # 管理者ページ
│   │   │       ├── AdminWorkshops.tsx
│   │   │       ├── MaterialManagement.tsx
│   │   │       └── AdminUsers.tsx
│   │   ├── api.ts         # Axios設定
│   │   ├── App.tsx        # ルーティング
│   │   └── main.tsx       # エントリーポイント
│   └── dist/              # ビルド出力
│
├── README.md              # このファイル
├── RENDER_DEPLOY_FINAL.md # デプロイガイド
└── .gitignore
```

---

## 🗄️ データベーススキーマ

### User（ユーザー）
- `id`: ユーザーID
- `email`: メールアドレス（ユニーク）
- `password`: ハッシュ化パスワード
- `name`: ユーザー名
- `role`: 役割（USER / ADMIN）
- `createdAt`, `updatedAt`: タイムスタンプ

### Workshop（eラーニング）
- `id`: eラーニングID
- `title`: タイトル
- `description`: 説明（オプション）
- `isPublic`: 公開状態
- `createdAt`, `updatedAt`: タイムスタンプ

### Material（資料）
- `id`: 資料ID
- `workshopId`: 紐づけられたeラーニング
- `title`: 資料タイトル
- `filename`: 保存ファイル名
- `originalName`: 元のファイル名
- `fileSize`: ファイルサイズ
- `mimeType`: MIMEタイプ
- `pageCount`: ページ数
- `createdAt`: 作成日時

### Progress（進行度）
- `id`: 進行度ID
- `userId`: ユーザーID
- `workshopId`: eラーニングID
- `lastPage`: 最後に見たページ
- `completed`: 完了状態
- `updatedAt`: 更新日時
- **ユニーク制約**: (userId, workshopId)

---

## 🔌 主要APIエンドポイント

### 認証
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報取得

### eラーニング（共通）
- `GET /api/workshops` - eラーニング一覧取得
- `GET /api/workshops/:id` - eラーニング詳細取得

### eラーニング管理（管理者専用）
- `POST /api/admin/workshops` - eラーニング作成
- `PUT /api/admin/workshops/:id` - eラーニング更新
- `DELETE /api/admin/workshops/:id` - eラーニング削除

### 資料管理（管理者専用）
- `POST /api/admin/workshops/:id/materials` - PDF資料アップロード
- `GET /api/materials/:id` - PDF資料取得
- `DELETE /api/admin/materials/:id` - PDF資料削除

### 進行度管理
- `GET /api/workshops/:id/progress` - 進行度取得
- `PUT /api/workshops/:id/progress` - 進行度更新

### ユーザー管理（管理者専用）
- `GET /api/admin/users` - ユーザー一覧取得
- `POST /api/admin/users` - ユーザー作成
- `DELETE /api/admin/users/:id` - ユーザー削除

---

## 🎯 使い方

### 管理者としての使い方

1. **ログイン**: admin@example.com / admin123
2. **eラーニングを作成**: 
   - 「管理」メニューをクリック
   - 「新規作成」ボタン
   - タイトルと説明を入力
   - 「公開する」にチェックを入れて作成
3. **PDF資料をアップロード**:
   - eラーニング一覧から「資料管理」をクリック
   - タイトルを入力し、PDFファイルを選択
   - 「アップロード」ボタン
4. **ユーザーを管理**:
   - 「ユーザー管理」メニューをクリック
   - 新規ユーザーを作成または削除

### ユーザーとしての使い方

1. **ログイン**: user@example.com / user123
2. **eラーニング一覧を閲覧**: 公開されているeラーニングが表示される
3. **eラーニングをクリック**: 詳細ページへ移動
4. **PDF資料を開く**: 「開く」ボタンでPDFビューアを起動
5. **PDFを閲覧**: 
   - ページ送り/戻しボタンで移動
   - ズームイン/アウトで拡大縮小
   - 進行度は自動保存される
6. **完了にする**: 「完了」ボタンで進行状況を記録

---

## 🎨 主な画面

### ログイン画面
- WannaV Dashboard風のグラデーション背景（紫-青）
- 大きなアイコンロゴ（角丸の四角形）
- メールアドレスとパスワードでログイン
- テストアカウント情報を表示

### eラーニング一覧（ユーザー）
- 「🔗 システムリンク一覧」ヘッダー
- 各eラーニングをグラデーションカード（紫から青）で表示
- アイコン、タイトル、説明、矢印アイコン
- ホバーで拡大とスライドアニメーション
- 「リーダー以上」バッジ表示

### eラーニング詳細
- タイトル、説明、進行状況を表示
- 資料一覧から各PDFを開く

### PDFビューア
- PDF.jsでPDFを表示
- ページナビゲーション（前へ/次へ）
- ズームコントロール
- 完了/未完了の切り替え
- 進行度の自動保存

### 管理者：eラーニング管理
- テーブル形式で全eラーニングを表示
- 作成/編集/削除/公開切り替え
- 資料管理へのリンク

### 管理者：資料管理
- PDFアップロードフォーム
- アップロード済み資料一覧
- 資料の削除

### 管理者：ユーザー管理
- 全ユーザーをテーブル表示
- 新規ユーザー作成フォーム
- ユーザーの削除

---

## 🔒 セキュリティ機能

- ✅ パスワードのbcryptハッシュ化
- ✅ JWT認証（HTTP-only cookie）
- ✅ CORS設定
- ✅ 管理者権限チェック
- ✅ ファイルタイプ検証（PDF のみ）
- ✅ 入力バリデーション
- ✅ SQLインジェクション対策（Prisma ORM）

---

## 📊 プロジェクト統計

- **Backend Controllers**: 5ファイル
- **Backend Routes**: 5ファイル
- **Frontend Pages**: 8ファイル
- **Frontend Components**: 3ファイル
- **Database Models**: 4モデル
- **API Endpoints**: 15+
- **Total Lines of Code**: 約5,000行以上

---

## 🚀 今後の拡張案

- [ ] プロフィール編集機能
- [ ] パスワード変更機能
- [ ] eラーニング検索・フィルタリング
- [ ] コメント機能
- [ ] 完了証明書のPDF生成
- [ ] メール通知機能
- [ ] ダークモード対応
- [ ] モバイルアプリ化（React Native）

---

## 🐛 トラブルシューティング

### ログインできない
- 正しいメールアドレスとパスワードを入力していますか？
- テストアカウント: admin@example.com / admin123

### PDFが表示されない
- PDFファイルが正しくアップロードされていますか？
- ブラウザのコンソールでエラーを確認してください

### Render デプロイが失敗する
- 環境変数が正しく設定されていますか？
- Build CommandとStart Commandが正しいですか？
- `RENDER_DEPLOY_FINAL.md`を参照してください

---

## 📝 ライセンス

ISC

---

## 👤 作成者

kyo10310415

---

## 🙏 謝辞

このプロジェクトは以下のオープンソースプロジェクトを使用しています：

- Express.js
- React
- Prisma
- PDF.js
- Tailwind CSS
- TypeScript

---

**🎉 eラーニング管理システムが完成しました！デプロイ済みで、すべての機能が動作します！**
