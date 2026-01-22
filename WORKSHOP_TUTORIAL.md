# Gensparkでワークショップ管理システムを作成する完全ガイド

## 📋 目次

1. [事前準備](#事前準備)
2. [Gensparkへのログインとセットアップ](#gensparkへのログインとセットアップ)
3. [GitHubアカウント作成とリポジトリ準備](#githubアカウント作成とリポジトリ準備)
4. [AIデベロッパーでプロジェクト作成](#aiデベロッパーでプロジェクト作成)
5. [GitHubとGensparkの連携](#githubとgensparkの連携)
6. [Renderでのデータベース作成とデプロイ](#renderでのデータベース作成とデプロイ)
7. [トラブルシューティング](#トラブルシューティング)
8. [不具合発生時の情報提供方法](#不具合発生時の情報提供方法)

---

## 事前準備

### 必要なアカウント

- ✅ **Gensparkアカウント** - https://www.genspark.ai/
- ✅ **GitHubアカウント** - https://github.com/
- ✅ **Renderアカウント** - https://render.com/

### 推奨環境

- ブラウザ: Chrome、Edge、Firefox（最新版）
- 安定したインターネット接続

---

## Gensparkへのログインとセットアップ

### 1. Gensparkにアクセス

1. https://www.genspark.ai/ にアクセス
2. 右上の「Sign In」または「ログイン」をクリック
3. Googleアカウントまたはメールアドレスでログイン

### 2. AIデベロッパーにアクセス

1. ログイン後、ダッシュボードが表示される
2. 左側のメニューから「**AI Developer**」を選択
3. または、検索バーに「AI Developer」と入力

### 3. AIデベロッパーの画面構成

AIデベロッパーには以下のタブがあります：

- **チャット**: AIとの対話エリア
- **ファイル**: プロジェクトファイルの閲覧・編集
- **ターミナル**: コマンド実行
- **GitHub**: リポジトリ連携
- **Deploy**: デプロイ設定（Cloudflare、Render）

---

## GitHubアカウント作成とリポジトリ準備

### 1. GitHubアカウント作成（既にある場合はスキップ）

1. https://github.com/ にアクセス
2. 右上の「Sign up」をクリック
3. メールアドレス、パスワード、ユーザー名を入力
4. メール認証を完了

### 2. 新規リポジトリ作成

#### 方法1: GitHub Web UIで作成

1. GitHubにログイン
2. 右上の「+」→「New repository」をクリック
3. 以下を入力：
   - **Repository name**: `workshop`（または任意の名前）
   - **Description**: `Workshop Management System`（任意）
   - **Public/Private**: どちらでも可（Publicを推奨）
   - **Add a README file**: チェックを**入れない**（AIが作成するため）
4. 「Create repository」をクリック
5. リポジトリURLをメモ：`https://github.com/ユーザー名/workshop`

#### 方法2: AIデベロッパーで後から作成

- 後述の「GitHubとGensparkの連携」セクションで、AIデベロッパーから直接作成することも可能

### 3. GitHubアクセストークンの準備（推奨）

Gensparkとの連携をスムーズにするため、Personal Access Token（PAT）を作成しておくことを推奨します：

1. GitHub → 右上のプロフィール → Settings
2. 左下の「Developer settings」
3. 「Personal access tokens」→「Tokens (classic)」
4. 「Generate new token」→「Generate new token (classic)」
5. 以下を設定：
   - **Note**: `Genspark AI Developer`
   - **Expiration**: 任意（90日推奨）
   - **Scopes**: 
     - ✅ `repo`（すべてのチェック）
     - ✅ `workflow`
     - ✅ `write:packages`
6. 「Generate token」をクリック
7. 表示されたトークンを**必ず保存**（二度と表示されません）

---

## AIデベロッパーでプロジェクト作成

### 1. 改良版プロンプト

以下のプロンプトをAIデベロッパーに送信してください。このプロンプトは、初回の開発で発生した問題を考慮して改良されています。

```
ワークショップ管理システムを作成してください。

【システム概要】
PDF資料を用いたワークショップ（レッスン）を管理するシステム。管理者がワークショップを作成し、PDF資料を紐づけて公開する。ユーザーはPDFを閲覧し、進行度が自動保存される。

【技術スタック】
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma 6（Prisma 7は使用しない）
- Frontend: React + TypeScript + Vite
- PDF表示: PDF.js
- 認証: JWT（HTTP-only cookie）
- デプロイ: Render（PostgreSQL + Web Service）

【重要な技術的制約】
1. Prisma 6を使用（Prisma 7は環境変数の扱いが複雑なため避ける）
2. Express 5では app.get('/*', ...) ではなくミドルウェア形式でSPAルーティングを実装
3. すべてのAPIレスポンスは { data: ... } 形式で統一
4. フロントエンドはAPIレスポンスから response.data.xxx で取得

【役割と権限】
- Admin: ワークショップ作成・編集・削除、PDF管理、ユーザー管理
- User: 公開ワークショップ閲覧、PDF閲覧、進行度管理のみ

【MVP機能】
1. ユーザー管理
   - ログイン/ログアウト
   - パスワードはbcryptでハッシュ化
   - 管理者がユーザーを作成
   - 初期Seed: admin@example.com/admin123、user@example.com/user123

2. ワークショップ管理
   - 作成（title, description, is_public）
   - 一覧: adminは全件、userはis_public=trueのみ
   - 詳細: 説明・資料一覧・自分の進行度を表示

3. PDF資料管理
   - adminがPDFをアップロード（Multer）
   - ワークショップに紐づけ
   - ローカルストレージに保存（uploads/ディレクトリ）
   - 将来的に外部ストレージ（Cloudflare R2など）への切替を考慮した抽象化

4. PDF表示
   - PDF.jsで表示
   - ページ送り/戻しボタン
   - 現在ページ/総ページ数表示
   - ズームイン/ズームアウト
   - ページ移動時に進行度（last_page）を自動保存
   - 再訪問時に前回のページから再開

5. 進行度管理
   - last_page（最後に見たページ）
   - completed（完了フラグ）
   - updated_at（更新日時）
   - UI: 「完了にする」「未完了に戻す」ボタン

【画面/ルーティング】
- /login: ログイン画面
- /workshops: ワークショップ一覧（ユーザー向け）
- /workshops/:id: ワークショップ詳細
- /workshops/:workshopId/materials/:materialId: PDFビューア
- /admin/workshops: ワークショップ管理（管理者専用）
- /admin/workshops/:id/materials: PDF資料管理（管理者専用）
- /admin/users: ユーザー管理（管理者専用）

【API設計（REST）】
認証:
- POST /api/auth/login → { user: {...} }
- POST /api/auth/logout → { success: true }
- GET /api/auth/me → { user: {...} }

ワークショップ:
- GET /api/workshops → { workshops: [...] }
- GET /api/workshops/:id → { workshop: {...} }
- POST /api/admin/workshops → { workshop: {...} }
- PUT /api/admin/workshops/:id → { workshop: {...} }
- DELETE /api/admin/workshops/:id → { success: true }

資料:
- POST /api/admin/workshops/:id/materials (multipart) → { material: {...} }
- GET /api/materials/:materialId → PDFファイル（バイナリ）
- DELETE /api/admin/materials/:id → { success: true }

進行度:
- GET /api/workshops/:id/progress → { progress: {...} }
- PUT /api/workshops/:id/progress → { progress: {...} }

ユーザー（管理者専用）:
- GET /api/admin/users → { users: [...] }
- POST /api/admin/users → { user: {...} }
- DELETE /api/admin/users/:id → { success: true }

【データベーススキーマ】
User: id, email(unique), password(hashed), name, role(USER/ADMIN), createdAt, updatedAt
Workshop: id, title, description, isPublic, createdAt, updatedAt
Material: id, workshopId, title, filename, originalName, fileSize, mimeType, pageCount, createdAt
Progress: id, userId, workshopId, lastPage, completed, updatedAt
  - unique制約: (userId, workshopId)

【Render デプロイ設定】
プロジェクト構造: 
- /server: バックエンド
- /client: フロントエンド

Build Command:
cd server && npm install --include=dev && npx prisma generate && npm run build && cd ../client && npm install --include=dev && npm run build

Start Command:
cd server && npx prisma migrate deploy && node prisma/seed.js && npm start

Environment Variables:
- DATABASE_URL: PostgreSQL接続文字列
- JWT_SECRET: ランダムな秘密鍵（32文字以上）
- NODE_ENV: production
- PORT: 10000
- FRONTEND_URL: Web ServiceのURL（例: https://xxx.onrender.com）

【開発手順】
1. プロジェクト構造作成（/server, /client）
2. Git初期化と.gitignore設定
3. Backend開発（Prisma schema、API、認証）
4. マイグレーションファイル作成
5. Seedスクリプト作成
6. Frontend開発（React、ルーティング、API統合）
7. PDF.js統合
8. GitHubにpush
9. Renderデプロイ手順書作成

【品質要件】
- 入力検証とエラーハンドリング
- 権限チェック（管理者専用API）
- CORS設定
- セキュリティ（SQLインジェクション対策、XSS対策）
- レスポンシブデザイン（Tailwind CSS）
- 包括的なREADME

【期待成果】
- GitHubにpush可能な完全なコード
- Renderへのデプロイ手順書
- 初回アクセス時に動作するシステム
- 管理者とユーザーの両方の機能が動作

【注意事項】
1. すべてのAPIレスポンスは必ず { data: ... } 形式でラップする
2. フロントエンドは response.data.workshops のようにアクセスする
3. Express 5のルーティングでワイルドカードを使う場合はミドルウェア形式にする
4. Prisma 6を使用し、Prisma 7は避ける
5. 環境変数はRenderのEnvironmentタブで設定する
6. FRONTEND_URLは必ず正確なURLを設定する（例: https://project-name-xxxx.onrender.com）
```

### 2. プロンプト送信と開発の進行

1. 上記のプロンプトをコピーして、AIデベロッパーのチャット欄に貼り付け
2. 送信
3. AIが開発を開始します
4. 途中で質問される場合は、適切に回答してください
5. ファイルが作成されたら、「ファイル」タブで確認できます

### 3. 開発中の確認ポイント

AIが作業を進める中で、以下を確認してください：

- ✅ `/home/user/webapp/server` と `/home/user/webapp/client` が作成されている
- ✅ Prismaマイグレーションファイルが存在する
- ✅ Seedスクリプトが作成されている
- ✅ README.mdが作成されている
- ✅ Git初期化されている

---

## GitHubとGensparkの連携

### 方法1: AIデベロッパーの「GitHub」タブを使用（推奨）

1. **GitHub認証**
   - AIデベロッパーの上部にある「GitHub」タブをクリック
   - 「GitHub連携」または「Authorize GitHub」ボタンをクリック
   - GitHubのOAuth認証画面が表示される
   - 「Authorize」をクリックしてGensparkにアクセスを許可

2. **リポジトリ選択**
   - 既存のリポジトリを選択する場合:
     - ドロップダウンから `workshop` リポジトリを選択
   - 新規リポジトリを作成する場合:
     - 「Create new repository」をクリック
     - リポジトリ名: `workshop`
     - Public/Private を選択
     - 「Create」をクリック

3. **コードをプッシュ**
   - AIデベロッパーに以下のように依頼:
     ```
     GitHubのworkshopリポジトリにコードをpushしてください
     ```
   - AIが自動的に以下を実行:
     - `git add .`
     - `git commit -m "Initial commit"`
     - `git push origin main`

### 方法2: コマンドで手動連携

AIデベロッパーで以下のコマンドを実行してもらいます：

```bash
# GitHubリモートを追加
cd /home/user/webapp
git remote add origin https://github.com/ユーザー名/workshop.git

# プッシュ
git push -u origin main
```

**注意**: 認証エラーが発生する場合は、方法1を使用してください。

### 3. プッシュの確認

1. GitHubのリポジトリページにアクセス
2. ファイルが表示されていることを確認
3. コミット履歴を確認

---

## Renderでのデータベース作成とデプロイ

### ステップ1: Renderアカウント作成

1. https://render.com/ にアクセス
2. 「Get Started」または「Sign Up」をクリック
3. GitHubアカウントで登録（推奨）
4. メール認証を完了

### ステップ2: PostgreSQLデータベース作成

1. **Renderダッシュボードにアクセス**
   - https://dashboard.render.com/

2. **新しいPostgreSQLを作成**
   - 「New +」ボタン → 「PostgreSQL」を選択

3. **データベース設定**
   - **Name**: `workshop-db`（または任意の名前）
   - **Database**: `workshop_db`（自動生成でも可）
   - **User**: `workshop_user`（自動生成でも可）
   - **Region**: `Oregon (US West)` または最寄りのリージョン
   - **PostgreSQL Version**: `15` または最新版
   - **Plan**: `Free` または `Starter`（$7/月）
     - 注意: Free プランはデータベースが90日後に削除されます

4. **作成を確認**
   - 「Create Database」をクリック
   - 作成完了まで数分待つ

5. **Database URLを取得**
   - データベースの詳細ページで「Internal Database URL」または「External Database URL」をコピー
   - 形式: `postgresql://user:password@host:port/database`
   - **このURLを必ず保存しておいてください**

### ステップ3: Web Service作成

1. **新しいWeb Serviceを作成**
   - Renderダッシュボード → 「New +」→ 「Web Service」

2. **GitHubリポジトリを接続**
   - 「Connect a repository」セクション
   - GitHubアカウントを接続（初回のみ）
   - `workshop` リポジトリを選択
   - 「Connect」をクリック

3. **サービス設定**
   
   **基本設定:**
   - **Name**: `workshop-management-system`（またはユニークな名前）
   - **Region**: データベースと同じリージョン
   - **Branch**: `main`
   - **Root Directory**: 空欄（ルートディレクトリ）
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     cd server && npm install --include=dev && npx prisma generate && npm run build && cd ../client && npm install --include=dev && npm run build
     ```
   - **Start Command**:
     ```bash
     cd server && npx prisma migrate deploy && node prisma/seed.js && npm start
     ```

4. **環境変数の設定**
   
   「Environment」セクションで以下を追加：

   | Key | Value | 説明 |
   |-----|-------|------|
   | `DATABASE_URL` | `postgresql://...` | ステップ2でコピーしたDatabase URL |
   | `JWT_SECRET` | ランダムな文字列（32文字以上） | 例: `your-super-secret-jwt-key-here-change-this` |
   | `NODE_ENV` | `production` | 本番環境フラグ |
   | `PORT` | `10000` | Renderのデフォルトポート |
   | `FRONTEND_URL` | `https://workshop-management-system-xxxx.onrender.com` | 後で設定（一旦空でもOK） |

   **重要**: `JWT_SECRET` は必ず変更してください。ランダムな文字列を生成するコマンド：
   ```bash
   openssl rand -base64 32
   ```

5. **プランの選択**
   - **Plan**: `Free` または `Starter`（$7/月）
   - Free プランの制限:
     - 15分間アクセスがないとスリープ
     - 月750時間まで
     - 512MB RAM

6. **デプロイ開始**
   - 「Create Web Service」をクリック
   - デプロイが自動的に開始される
   - 初回は5〜10分程度かかる

### ステップ4: FRONTEND_URL の設定

デプロイが完了したら、URLが確定します。

1. **Web Service URLを確認**
   - デプロイ完了後、上部に表示される
   - 例: `https://workshop-management-system-wp6s.onrender.com`
   - **このURLをコピー**

2. **環境変数を更新**
   - Renderダッシュボード → Web Service → 「Environment」タブ
   - `FRONTEND_URL` を見つける
   - 「Edit」をクリック
   - コピーしたURLを貼り付け
   - **重要**: 末尾に `/` を付けない
   - 「Save Changes」をクリック

3. **再デプロイ**
   - 環境変数を変更すると自動的に再デプロイされる
   - または、手動で「Manual Deploy」→「Deploy latest commit」

### ステップ5: デプロイの確認

1. **ログの確認**
   - 「Logs」タブを開く
   - 以下のメッセージを確認:
     ```
     ==> Build succeeded 🎉
     ==> Your service is live 🎉
     Seeding database...
     Created admin user: admin@example.com
     Created test user: user@example.com
     Created sample workshop: はじめてのワークショップ
     Seeding completed!
     Server running on port 10000
     ```

2. **アプリケーションにアクセス**
   - Web Service URLを開く
   - ログイン画面が表示されることを確認

3. **動作確認**
   - 管理者でログイン: `admin@example.com` / `admin123`
   - ワークショップ一覧が表示される
   - サンプルワークショップが表示される

---

## トラブルシューティング

### 1. ビルドが失敗する

#### 問題: `npm install` が失敗

**原因**: 
- ネットワークエラー
- package.jsonの問題

**解決策**:
```bash
# package-lock.jsonを削除して再試行
cd /home/user/webapp/server
rm -f package-lock.json
npm install
```

#### 問題: TypeScript コンパイルエラー

**原因**:
- 型定義の不一致
- インポートエラー

**解決策**:
- エラーメッセージを確認
- 該当ファイルを修正
- AIデベロッパーにエラーログを共有

#### 問題: Prisma エラー

**原因**:
- スキーマの問題
- マイグレーションエラー

**解決策**:
```bash
# Prismaクライアントを再生成
cd /home/user/webapp/server
npx prisma generate

# マイグレーションをリセット
npx prisma migrate reset --force
```

### 2. デプロイが失敗する

#### 問題: "No pending migrations to apply"

**原因**:
- マイグレーションファイルが存在しない

**解決策**:
1. ローカルでマイグレーションファイルを確認:
   ```bash
   ls /home/user/webapp/server/prisma/migrations/
   ```
2. ファイルがない場合は作成:
   ```bash
   cd /home/user/webapp/server
   npx prisma migrate dev --name init
   ```
3. GitHubにプッシュ
4. Renderで再デプロイ

#### 問題: "PrismaClient initialization error"

**原因**:
- DATABASE_URLが設定されていない
- DATABASE_URLが間違っている

**解決策**:
1. Render → Environment タブ
2. DATABASE_URLを確認
3. PostgreSQLの「Internal Database URL」をコピー
4. 環境変数を更新
5. 再デプロイ

#### 問題: "Authentication failed"

**原因**:
- JWT_SECRETが設定されていない

**解決策**:
1. Render → Environment タブ
2. JWT_SECRETを追加（32文字以上のランダム文字列）
3. 再デプロイ

### 3. 白い画面が表示される

#### 問題: CORSエラー

**原因**:
- FRONTEND_URLが間違っている

**解決策**:
1. Render → Environment タブ
2. FRONTEND_URLを確認
3. Web Service URLと一致しているか確認
4. 末尾に `/` がないことを確認
5. 修正して再デプロイ

#### 問題: APIレスポンスエラー

**原因**:
- データ構造の不一致

**解決策**:
1. ブラウザのデベロッパーツール（F12）を開く
2. Consoleタブでエラーを確認
3. Networkタブで失敗しているAPIを確認
4. エラーメッセージをAIデベロッパーに共有

### 4. ログインできない

#### 問題: "Invalid credentials"

**原因**:
- Seedが実行されていない
- データベースが空

**解決策**:
1. Render → Shell タブ
2. 以下を実行:
   ```bash
   cd server && node prisma/seed.js
   ```
3. 成功メッセージを確認:
   ```
   Created admin user: admin@example.com
   Created test user: user@example.com
   ```

### 5. PDFがアップロードできない

#### 問題: ファイルサイズエラー

**原因**:
- アップロード制限を超えている

**解決策**:
- サーバーの設定を確認（通常は10MB制限）
- より小さいPDFファイルを試す

#### 問題: "File not found"

**原因**:
- Renderの一時ストレージは再デプロイ時に削除される

**解決策**:
- 外部ストレージ（Cloudflare R2、AWS S3など）を使用
- または、Render Diskを有料プランで購入

---

## 不具合発生時の情報提供方法

AIデベロッパーに不具合を報告する際は、以下の情報を提供してください。

### 1. エラーメッセージ

#### ビルドエラーの場合

```
Renderのビルドログでエラーが発生しました：

[エラーメッセージをここに貼り付け]

例:
Error: Cannot find module 'express'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:815:15)
    ...
```

#### ランタイムエラーの場合

```
サーバー起動時にエラーが発生しました：

[Renderのログからエラー部分をコピー]

例:
PrismaClientInitializationError: 
Invalid `prisma.user.findUnique()` invocation:
The table `public.users` does not exist in the current database.
```

### 2. ブラウザのコンソールエラー

```
ブラウザのコンソールに以下のエラーが表示されています：

[F12 → Console タブのエラーをコピー]

例:
Uncaught TypeError: u.map is not a function
    at tx (index-D1EYXPNh.js:16:10650)
    ...
```

### 3. ネットワークエラー

```
ブラウザのネットワークタブで以下のリクエストが失敗しています：

URL: https://workshop-xxx.onrender.com/api/workshops
Status: 500 Internal Server Error
Response: {"error": "Internal server error"}
```

ネットワークタブのスクリーンショットも有効です。

### 4. 画面のスクリーンショットまたは動画

- 白い画面が表示される場合
- 予期しない動作が発生する場合
- エラーダイアログが表示される場合

**録画方法**:
- Windows: Win + G でゲームバー → 録画開始
- Mac: Shift + Cmd + 5 で画面収録

動画ファイルをAIデベロッパーにアップロード

### 5. 環境情報

```
Render環境情報：

Web Service URL: https://workshop-xxx.onrender.com
PostgreSQL Version: 15
Node.js Version: 25.4.0
Region: Oregon (US West)

設定済み環境変数:
- DATABASE_URL: ✅ 設定済み
- JWT_SECRET: ✅ 設定済み
- NODE_ENV: production
- PORT: 10000
- FRONTEND_URL: https://workshop-xxx.onrender.com
```

### 6. 再現手順

```
不具合の再現手順：

1. https://workshop-xxx.onrender.com にアクセス
2. admin@example.com / admin123 でログイン
3. 「管理」メニューをクリック
4. 「新規作成」ボタンをクリック
5. タイトルと説明を入力
6. 「作成」ボタンをクリック
7. → エラーが発生（エラーメッセージ: "Internal server error"）
```

### 7. 期待される動作

```
期待される動作：
ワークショップが正常に作成され、一覧に表示される

実際の動作：
エラーメッセージが表示され、作成に失敗する
```

### 8. 試したこと

```
すでに試した対処法：

✅ ブラウザのキャッシュをクリア
✅ シークレットモードで試した
✅ 別のブラウザで試した
❌ 問題は解決していない
```

### 情報提供のテンプレート

以下のテンプレートを使うと便利です：

```
【不具合報告】

■ 問題の概要
[簡潔に問題を説明]

■ 発生箇所
[どの画面/機能で発生したか]

■ エラーメッセージ
[エラーメッセージをコピー]

■ 再現手順
1. 
2. 
3. 

■ 期待される動作
[本来どうなるべきか]

■ 実際の動作
[実際に何が起こったか]

■ 環境情報
- Web Service URL: 
- ブラウザ: 
- OS: 

■ 添付ファイル
[スクリーンショットや動画]

■ 試したこと
- [ ] ブラウザのキャッシュクリア
- [ ] 再デプロイ
- [ ] その他: 
```

---

## 効果的な質問の仕方

### ❌ 悪い例

```
エラーが出ます。直してください。
```

### ✅ 良い例

```
ログイン画面でadmin@example.com / admin123を入力してログインボタンを押すと、
コンソールに以下のエラーが表示され、ログインできません：

Error: Request failed with status code 401
    at createError (axios.js:...)

Renderのログには以下が表示されています：
Login error: PrismaClientKnownRequestError: 
Invalid `prisma.user.findUnique()` invocation:
The table `public.users` does not exist in the current database.

データベースが正しく作成されていない可能性があります。
マイグレーションとSeedを実行する方法を教えてください。
```

---

## まとめ

このガイドに従えば、GensparkのAIデベロッパーを使用して、ワークショップ管理システムを完全に構築し、Renderにデプロイできます。

### 開発の流れ（再確認）

1. ✅ Gensparkにログイン
2. ✅ 改良版プロンプトを送信
3. ✅ GitHubリポジトリを作成
4. ✅ AIデベロッパーとGitHubを連携
5. ✅ コードをGitHubにプッシュ
6. ✅ RenderでPostgreSQLを作成
7. ✅ RenderでWeb Serviceを作成
8. ✅ 環境変数を設定
9. ✅ デプロイ
10. ✅ 動作確認

### サポートが必要な場合

- AIデベロッパーのチャットで質問
- エラーログとスクリーンショットを共有
- このガイドの「不具合発生時の情報提供方法」を参照

---

**このガイドを使って、素晴らしいワークショップ管理システムを構築してください！** 🚀
