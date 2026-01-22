# GensparkでWebアプリを作る！ワークショップ資料

## 🎯 このワークショップで学べること

- ✅ GensparkのAIデベロッパーの使い方
- ✅ GitHubの基本操作
- ✅ Webアプリケーションのデプロイ
- ✅ 完全なワークショップ管理システムの構築

---

## 📚 ワークショップの流れ

### 第1部：準備編（15分）
1. Gensparkへのログイン
2. GitHubアカウント作成
3. Renderアカウント作成

### 第2部：開発編（30分）
4. AIデベロッパーでプロジェクト作成
5. GitHubへのコードプッシュ
6. デプロイ準備

### 第3部：デプロイ編（20分）
7. PostgreSQLデータベース作成
8. Renderへのデプロイ
9. 動作確認

### 第4部：トラブルシューティング編（15分）
10. よくある問題と解決方法
11. エラーの見方
12. AIデベロッパーへの質問の仕方

---

## 🚀 第1部：準備編

### ステップ1: Gensparkへのログイン

1. **Gensparkにアクセス**
   ```
   https://www.genspark.ai/
   ```

2. **ログイン方法**
   - 右上の「Sign In」をクリック
   - Googleアカウントでログイン（推奨）
   - または、メールアドレスで登録

3. **AIデベロッパーを開く**
   - ダッシュボードから「AI Developer」を選択
   - または、検索バーに「AI Developer」と入力

**💡 ポイント**: 初回ログイン時はチュートリアルが表示される場合があります。一度確認しておくと便利です。

---

### ステップ2: GitHubアカウント作成

1. **GitHubにアクセス**
   ```
   https://github.com/
   ```

2. **アカウント作成**
   - 「Sign up」をクリック
   - メールアドレスを入力
   - パスワードを設定
   - ユーザー名を決定
   - メール認証を完了

3. **プロフィール設定**
   - プロフィール写真を設定（任意）
   - 自己紹介を追加（任意）

**💡 ポイント**: ユーザー名は後から変更できますが、リポジトリURLに影響します。慎重に選びましょう。

---

### ステップ3: Renderアカウント作成

1. **Renderにアクセス**
   ```
   https://render.com/
   ```

2. **アカウント作成**
   - 「Get Started」をクリック
   - **GitHubアカウントでサインアップ（推奨）**
   - または、メールアドレスで登録

3. **メール認証**
   - 登録したメールアドレスに確認メールが届く
   - リンクをクリックして認証を完了

**💡 ポイント**: GitHubアカウントで登録すると、リポジトリの連携がスムーズになります。

---

## 💻 第2部：開発編

### ステップ4: AIデベロッパーでプロジェクト作成

#### 4-1. プロンプトを準備

以下のプロンプトをコピーしてください：

```
ワークショップ管理システムを作成してください。

【システム概要】
PDF資料を用いたワークショップ（レッスン）を管理するシステム。
管理者がワークショップを作成し、PDF資料を紐づけて公開する。
ユーザーはPDFを閲覧し、進行度が自動保存される。

【技術スタック】
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma 6
- Frontend: React + TypeScript + Vite
- PDF表示: PDF.js
- 認証: JWT（HTTP-only cookie）
- デプロイ: Render

【重要な技術的制約】
1. Prisma 6を使用（Prisma 7は避ける）
2. Express 5ではミドルウェア形式でSPAルーティングを実装
3. すべてのAPIレスポンスは { data: ... } 形式で統一
4. フロントエンドは response.data.xxx でデータを取得

【役割と権限】
- Admin: ワークショップ作成・編集・削除、PDF管理、ユーザー管理
- User: 公開ワークショップ閲覧、PDF閲覧、進行度管理のみ

【MVP機能】
1. ユーザー管理: ログイン/ログアウト、bcryptでハッシュ化
2. ワークショップ管理: 作成、一覧、詳細表示
3. PDF資料管理: アップロード、ダウンロード、表示
4. PDF表示: PDF.js、ページ送り、ズーム、進行度自動保存
5. 進行度管理: 最後に見たページ、完了フラグ

【データベーススキーマ】
- User: email, password, name, role
- Workshop: title, description, isPublic
- Material: title, filename, pageCount
- Progress: lastPage, completed

【Render デプロイ設定】
Build Command:
cd server && npm install --include=dev && npx prisma generate && npm run build && cd ../client && npm install --include=dev && npm run build

Start Command:
cd server && npx prisma migrate deploy && node prisma/seed.js && npm start

Environment Variables:
- DATABASE_URL: PostgreSQL接続文字列
- JWT_SECRET: ランダムな秘密鍵（32文字以上）
- NODE_ENV: production
- PORT: 10000
- FRONTEND_URL: Web ServiceのURL

【開発手順】
1. プロジェクト構造作成（/server, /client）
2. Git初期化と.gitignore設定
3. Backend開発（API、認証）
4. マイグレーションとSeed作成
5. Frontend開発（React、PDF.js統合）
6. GitHubにpush
7. Renderデプロイ手順書作成

【期待成果】
- GitHubにpush可能な完全なコード
- Renderへのデプロイ手順書
- 管理者とユーザーの両方の機能が動作
```

#### 4-2. プロンプトを送信

1. AIデベロッパーのチャット欄に貼り付け
2. 送信ボタンをクリック
3. AIが開発を開始

#### 4-3. 開発の進行を確認

AIが以下の作業を行います：

- ✅ プロジェクト構造作成
- ✅ バックエンド実装
- ✅ フロントエンド実装
- ✅ データベース設計
- ✅ README作成

**所要時間**: 約10〜15分

---

### ステップ5: GitHubへのコードプッシュ

#### 5-1. GitHubリポジトリを作成

**方法A: GitHub Web UIで作成**

1. GitHubにログイン
2. 右上の「+」→「New repository」
3. 以下を入力：
   - **Repository name**: `workshop`
   - **Description**: `Workshop Management System`
   - **Public** を選択
   - **Add a README file**: チェックを入れない
4. 「Create repository」をクリック
5. URLをメモ: `https://github.com/あなたのユーザー名/workshop`

**方法B: AIデベロッパーから作成**

AIデベロッパーに以下のように依頼：

```
GitHubに新しいリポジトリ「workshop」を作成してください
```

#### 5-2. AIデベロッパーとGitHubを連携

1. AIデベロッパーの「GitHub」タブをクリック
2. 「Authorize GitHub」をクリック
3. GitHubの認証画面で「Authorize」
4. リポジトリ `workshop` を選択

#### 5-3. コードをプッシュ

AIデベロッパーに以下を依頼：

```
GitHubのworkshopリポジトリにコードをpushしてください
```

AIが自動的に以下を実行：
- `git add .`
- `git commit -m "Initial commit"`
- `git push origin main`

#### 5-4. 確認

1. GitHubのリポジトリページにアクセス
2. ファイルが表示されていることを確認

---

## 🚀 第3部：デプロイ編

### ステップ6: PostgreSQLデータベース作成

#### 6-1. Renderダッシュボードにアクセス

```
https://dashboard.render.com/
```

#### 6-2. 新しいPostgreSQLを作成

1. 「New +」ボタンをクリック
2. 「PostgreSQL」を選択

#### 6-3. データベース設定

| 項目 | 値 | 説明 |
|------|-----|------|
| **Name** | `workshop-db` | データベース名 |
| **Database** | `workshop_db` | 自動生成でOK |
| **Region** | `Oregon (US West)` | 最寄りのリージョン |
| **PostgreSQL Version** | `15` | 最新版 |
| **Plan** | `Free` | 無料プラン |

#### 6-4. Database URLを取得

1. 作成完了後、データベースの詳細ページを開く
2. 「Internal Database URL」をコピー
3. メモ帳などに保存

**重要**: このURLは後で使用します！

---

### ステップ7: Renderへのデプロイ

#### 7-1. Web Service作成

1. Renderダッシュボード → 「New +」→ 「Web Service」
2. 「Connect a repository」
3. GitHubアカウントを接続（初回のみ）
4. `workshop` リポジトリを選択
5. 「Connect」をクリック

#### 7-2. サービス設定

| 項目 | 値 |
|------|-----|
| **Name** | `workshop-management-system` |
| **Region** | データベースと同じリージョン |
| **Branch** | `main` |
| **Runtime** | `Node` |

**Build Command**:
```bash
cd server && npm install --include=dev && npx prisma generate && npm run build && cd ../client && npm install --include=dev && npm run build
```

**Start Command**:
```bash
cd server && npx prisma migrate deploy && node prisma/seed.js && npm start
```

#### 7-3. 環境変数の設定

「Environment」セクションで以下を追加：

| Key | Value | 
|-----|-------|
| `DATABASE_URL` | 先ほどコピーしたDatabase URL |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-to-random-string` |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `FRONTEND_URL` | 空欄（後で設定） |

**重要**: `JWT_SECRET` は必ず変更してください！

#### 7-4. デプロイ開始

1. 「Create Web Service」をクリック
2. デプロイが自動的に開始される
3. 初回は5〜10分かかる

#### 7-5. FRONTEND_URL の設定

デプロイ完了後：

1. Web Service URLを確認（例: `https://workshop-xxx.onrender.com`）
2. URLをコピー
3. 「Environment」タブを開く
4. `FRONTEND_URL` を編集
5. コピーしたURLを貼り付け
6. 「Save Changes」
7. 自動的に再デプロイされる

---

### ステップ8: 動作確認

#### 8-1. ログの確認

「Logs」タブで以下を確認：

```
✅ Build succeeded 🎉
✅ Seeding database...
✅ Created admin user: admin@example.com
✅ Created test user: user@example.com
✅ Seeding completed!
✅ Server running on port 10000
✅ Your service is live 🎉
```

#### 8-2. アプリケーションにアクセス

1. Web Service URLを開く
2. ログイン画面が表示される

#### 8-3. ログインテスト

**管理者アカウント**:
- メール: `admin@example.com`
- パスワード: `admin123`

**一般ユーザーアカウント**:
- メール: `user@example.com`
- パスワード: `user123`

#### 8-4. 機能確認

- ✅ ログイン成功
- ✅ ワークショップ一覧表示
- ✅ サンプルワークショップが表示される
- ✅ 管理者メニューが表示される（管理者のみ）

---

## 🔧 第4部：トラブルシューティング編

### よくある問題と解決方法

#### 問題1: 白い画面が表示される

**症状**:
- ページにアクセスすると真っ白な画面
- 一瞬何か表示されてすぐ消える

**原因**:
- CORSエラー
- FRONTEND_URLの設定ミス
- JavaScriptエラー

**解決方法**:

1. **ブラウザのキャッシュをクリア**
   - `Ctrl + Shift + Delete` （Windows）
   - `Cmd + Shift + Delete` （Mac）
   - 「キャッシュされた画像とファイル」をクリア

2. **開発者ツールでエラーを確認**
   - `F12` を押す
   - 「Console」タブを開く
   - エラーメッセージを確認

3. **FRONTEND_URLを確認**
   - Render → Environment タブ
   - FRONTEND_URLがWeb Service URLと一致しているか確認
   - 末尾に `/` がないことを確認

#### 問題2: ログインできない

**症状**:
- "Invalid credentials" エラー
- ログインボタンを押しても反応しない

**原因**:
- Seedが実行されていない
- データベースが空

**解決方法**:

1. **Render Shellでseedを実行**
   - Render → 「Shell」タブ
   - 以下を実行:
     ```bash
     cd server && node prisma/seed.js
     ```

2. **成功メッセージを確認**
   ```
   Created admin user: admin@example.com
   Created test user: user@example.com
   Seeding completed!
   ```

#### 問題3: ビルドが失敗する

**症状**:
- "Build failed" エラー
- デプロイが完了しない

**原因**:
- 依存関係のエラー
- TypeScriptコンパイルエラー

**解決方法**:

1. **ログを確認**
   - Render → 「Logs」タブ
   - エラーメッセージを探す

2. **AIデベロッパーに報告**
   - エラーログをコピー
   - AIデベロッパーに貼り付け
   - 「このエラーを修正してください」と依頼

---

### エラーの見方

#### ビルドログの見方

Renderのログは時系列で表示されます。エラーは通常、以下のように表示されます：

```
==> Running build command...
npm install
...
Error: Cannot find module 'express'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:815:15)
    ...
==> Build failed ❌
```

**重要なキーワード**:
- `Error:` - エラーの種類
- `at` - エラーが発生した場所
- `Build failed` - ビルド失敗

#### ブラウザコンソールの見方

1. `F12` でデベロッパーツールを開く
2. 「Console」タブを選択
3. 赤いエラーメッセージを探す

例：
```
Uncaught TypeError: Cannot read property 'map' of undefined
    at Workshops (Workshops.tsx:25)
```

---

### AIデベロッパーへの質問の仕方

#### ❌ 悪い例

```
エラーが出ます
```

```
動きません
```

```
直してください
```

#### ✅ 良い例

```
【問題】
ログイン画面でadmin@example.com / admin123を入力してログインボタンを押すと、
"Invalid credentials"エラーが表示されます。

【エラーログ】
Renderのログに以下が表示されています：
Login error: PrismaClientKnownRequestError: 
The table `public.users` does not exist in the current database.

【試したこと】
- ブラウザのキャッシュをクリア
- シークレットモードで試行

【質問】
データベースにテーブルが作成されていないようです。
マイグレーションとSeedを実行する方法を教えてください。
```

---

### 情報提供のチェックリスト

不具合を報告する際は、以下の情報を含めてください：

- [ ] **問題の概要**（何が起こったか）
- [ ] **再現手順**（どうやったら問題が起こるか）
- [ ] **エラーメッセージ**（Renderのログまたはブラウザのコンソール）
- [ ] **スクリーンショットまたは動画**（可能であれば）
- [ ] **試したこと**（どんな対処法を試したか）
- [ ] **環境情報**（Web Service URL、ブラウザなど）

---

## 🎓 まとめ

### 学んだこと

1. ✅ GensparkのAIデベロッパーの基本的な使い方
2. ✅ GitHubでのリポジトリ作成とコード管理
3. ✅ Renderでのデータベース作成とデプロイ
4. ✅ トラブルシューティングの基本
5. ✅ AIへの効果的な質問の仕方

### 次のステップ

- 📝 新しいワークショップを作成してみる
- 📄 PDFファイルをアップロードしてみる
- 👥 ユーザーを追加してみる
- 🎨 デザインをカスタマイズしてみる

### さらに学びたい人へ

- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **Prisma**: https://www.prisma.io/
- **Render**: https://render.com/docs

---

**おめでとうございます！🎉**

**Gensparkを使って、完全なWebアプリケーションをデプロイできました！**

このワークショップで学んだスキルを活かして、あなた自身のプロジェクトを作ってみてください！

---

## 📞 サポート

質問や問題がある場合は、AIデベロッパーのチャットでいつでも質問してください。

このガイドがお役に立てば幸いです！
