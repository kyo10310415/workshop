# ワークショップ管理システム 完全構築ガイド
## 初心者向け詳細スライド

---

## 📋 目次

1. [事前準備](#slide-1)
2. [GitHubアカウント作成](#slide-2)
3. [Renderアカウント作成](#slide-3)
4. [AIデベロッパーでプロジェクト作成](#slide-4)
5. [初期プロンプト投入](#slide-5)
6. [コード生成の確認](#slide-6)
7. [GitHubリポジトリ作成](#slide-7)
8. [コードをGitHubにプッシュ](#slide-8)
9. [Renderでデータベース作成](#slide-9)
10. [Renderでアプリケーションデプロイ](#slide-10)
11. [環境変数の設定](#slide-11)
12. [マイグレーション実行](#slide-12)
13. [シード実行](#slide-13)
14. [アプリケーション動作確認](#slide-14)
15. [トラブルシューティング](#slide-15)

---

<a name="slide-1"></a>
## スライド 1: 事前準備

### 必要なもの

#### 1. メールアドレス
- **GitHub用**: `your-email@example.com`
- **Render用**: 同じメールアドレスでOK

#### 2. ブラウザ
- **推奨**: Google Chrome または Firefox
- **理由**: 開発者ツールが使いやすい

#### 3. インターネット接続
- **安定した接続**: デプロイ時にタイムアウトしないように

#### 4. AIデベロッパーへのアクセス
- **URL**: （GenSpark AIデベロッパーのURL）
- **ログイン**: GenSparkアカウントでログイン

### このガイドで作成するもの

```
┌─────────────────────────────────────┐
│  ワークショップ管理システム        │
├─────────────────────────────────────┤
│  ✅ ユーザー認証                   │
│  ✅ ワークショップ管理             │
│  ✅ PDF資料アップロード            │
│  ✅ PDFビューア                    │
│  ✅ 進行度管理                     │
│  ✅ 管理者機能                     │
└─────────────────────────────────────┘
```

### 所要時間
- **合計**: 約60〜90分
- **準備**: 15分
- **コード生成**: 10分
- **デプロイ**: 30〜45分
- **動作確認**: 15分

---

<a name="slide-2"></a>
## スライド 2: GitHubアカウント作成

### 手順

#### ステップ 1: GitHubにアクセス
1. ブラウザで `https://github.com` を開く
2. 右上の **「Sign up」** ボタンをクリック

#### ステップ 2: アカウント情報入力
1. **Email address**: メールアドレスを入力
   ```
   例: your-email@example.com
   ```
2. **Password**: 強力なパスワードを作成
   ```
   例: MySecurePassword123!
   ```
3. **Username**: ユーザー名を決定
   ```
   例: your-username
   ```
4. **Email preferences**: メール受信設定（任意）

#### ステップ 3: 認証
1. **CAPTCHA**: 人間であることを証明
2. **Create account**: ボタンをクリック

#### ステップ 4: メール認証
1. 登録したメールアドレスに確認メールが届く
2. メール内の **「Verify email address」** をクリック

#### ステップ 5: プロフィール設定（任意）
1. アンケートに回答またはスキップ
2. 無料プラン（Free）を選択

### 確認ポイント

✅ GitHubにログインできる  
✅ ダッシュボードが表示される  
✅ メールアドレスが認証済みである  

### スクリーンショット（イメージ）

```
┌──────────────────────────────────┐
│  GitHub                          │
├──────────────────────────────────┤
│  [Sign up] [Sign in]             │
│                                  │
│  Enter your email:               │
│  [your-email@example.com    ]    │
│                                  │
│  Create a password:              │
│  [******************        ]    │
│                                  │
│  Enter a username:               │
│  [your-username            ]     │
│                                  │
│  [Continue]                      │
└──────────────────────────────────┘
```

---

<a name="slide-3"></a>
## スライド 3: Renderアカウント作成

### 手順

#### ステップ 1: Renderにアクセス
1. ブラウザで `https://render.com` を開く
2. 右上の **「Get Started」** または **「Sign Up」** をクリック

#### ステップ 2: サインアップ方法選択

**推奨**: GitHubアカウントで登録

1. **「Sign up with GitHub」** ボタンをクリック
2. GitHubのログイン画面が表示される
3. GitHubアカウントでログイン
4. Renderへのアクセス許可を承認

**代替**: メールアドレスで登録

1. **「Sign up with Email」** を選択
2. メールアドレスとパスワードを入力
3. 確認メールのリンクをクリック

#### ステップ 3: 初期設定
1. **Organization name**: チーム名（個人利用なら自分の名前でOK）
   ```
   例: My Projects
   ```
2. **Use case**: 用途を選択（任意）
   ```
   例: Personal projects
   ```

#### ステップ 4: 支払い情報（任意）
- **無料プラン**: クレジットカード不要
- **注意**: 無料枠を超えると課金される可能性あり
- **推奨**: 最初は無料プランで十分

### 確認ポイント

✅ Renderにログインできる  
✅ ダッシュボードが表示される  
✅ GitHubとの連携が完了している（GitHub経由でサインアップした場合）

### Renderの無料プラン内容

| リソース | 無料プラン |
|---------|-----------|
| Web Service | 750時間/月（自動スリープあり） |
| PostgreSQL | 90日間無料、その後月$7 |
| 帯域幅 | 100GB/月 |
| ビルド時間 | 500分/月 |

### スクリーンショット（イメージ）

```
┌──────────────────────────────────┐
│  Render                          │
├──────────────────────────────────┤
│  [Sign up with GitHub]           │
│                                  │
│  [Sign up with GitLab]           │
│                                  │
│  [Sign up with Email]            │
│                                  │
│  Already have an account?        │
│  [Sign In]                       │
└──────────────────────────────────┘
```

---

<a name="slide-4"></a>
## スライド 4: AIデベロッパーでプロジェクト作成

### 手順

#### ステップ 1: AIデベロッパーにアクセス
1. GenSpark AIデベロッパーにログイン
2. ダッシュボードを開く

#### ステップ 2: 新規プロジェクト作成
1. **「New Project」** または **「+」** ボタンをクリック
2. プロジェクト名を入力
   ```
   プロジェクト名: workshop-management-system
   ```

#### ステップ 3: プロジェクトタイプ選択
1. **「Web Application」** を選択
2. **「Full Stack」** を選択（フロントエンド + バックエンド）

#### ステップ 4: 技術スタック確認
自動的に以下が選択される：
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma

#### ステップ 5: プロジェクト初期化
1. **「Create Project」** ボタンをクリック
2. サンドボックス環境が起動するのを待つ（約30秒）

### 確認ポイント

✅ プロジェクトが作成された  
✅ サンドボックス環境が起動している  
✅ ファイルエクスプローラーが表示されている  
✅ ターミナルが使用可能である

### AIデベロッパーの画面構成

```
┌─────────────────────────────────────────────┐
│  [ファイル] [編集] [表示] [ヘルプ]          │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ 📁 Files │  🖥️ Code Editor                 │
│          │                                  │
│ webapp/  │  (コードがここに表示される)      │
│ ├─server │                                  │
│ ├─client │                                  │
│ └─prisma │                                  │
│          │                                  │
├──────────┴──────────────────────────────────┤
│  💬 Chat / Prompt Input                     │
│  ┌──────────────────────────────────────┐   │
│  │ ここに初期プロンプトを貼り付ける    │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

<a name="slide-5"></a>
## スライド 5: 初期プロンプト投入

### 手順

#### ステップ 1: 初期プロンプトファイルを開く
- 別紙の **「初期プロンプト.md」** を開く
- 内容を全選択（Ctrl+A または Cmd+A）
- コピー（Ctrl+C または Cmd+C）

#### ステップ 2: AIデベロッパーのチャット欄に貼り付け
1. AIデベロッパーの画面下部のチャット入力欄をクリック
2. 貼り付け（Ctrl+V または Cmd+V）

#### ステップ 3: プロンプト送信
1. 内容を確認
2. **「Send」** ボタンまたは Enter キーで送信

#### ステップ 4: AIの応答を待つ
- AIが要件を理解し、実装計画を提示します
- 所要時間: 約30秒〜1分

#### ステップ 5: 実装開始の確認
AIが以下のような返答をします：
```
了解しました。ワークショップ管理システムを実装します。
以下の順序で進めます：

1. プロジェクト構造の作成
2. バックエンドの実装
3. フロントエンドの実装
4. デプロイ準備

それでは実装を開始します。
```

#### ステップ 6: コード生成を確認
- AIが自動的にファイルを作成・編集していきます
- ファイルエクスプローラーに新しいファイルが追加されます
- 進行状況が表示されます

### 重要な注意点

⚠️ **プロンプトは正確にコピー&ペーストしてください**
- 改行や空白も含めて正確に
- 一部だけコピーしないように注意

⚠️ **途中で中断しないでください**
- コード生成が完了するまで待ちます
- 所要時間: 約5〜10分

⚠️ **エラーが出たら**
- エラーメッセージをAIに共有
- AIが自動的に修正します

### プロンプト投入後の流れ

```
1. プロンプト送信
   ↓
2. AI が要件を解析（30秒）
   ↓
3. プロジェクト構造作成（1分）
   ↓
4. バックエンド実装（3分）
   ↓
5. フロントエンド実装（3分）
   ↓
6. デプロイ準備（1分）
   ↓
7. 完了報告
```

---

<a name="slide-6"></a>
## スライド 6: コード生成の確認

### 確認する項目

#### 1. ディレクトリ構造

ファイルエクスプローラーで以下が作成されているか確認：

```
webapp/
├── server/
│   ├── src/
│   │   ├── index.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── upload.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── workshops.ts
│   │   │   ├── materials.ts
│   │   │   ├── progress.ts
│   │   │   └── users.ts
│   │   └── controllers/
│   ├── package.json
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   ├── contexts/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── .gitignore
└── README.md
```

#### 2. 重要ファイルの内容確認

##### prisma/schema.prisma
- User、Workshop、Material、Progress モデルが定義されているか

##### server/package.json
- 必要な依存関係がすべて記載されているか
  - express
  - prisma
  - @prisma/client
  - jsonwebtoken
  - bcrypt
  - multer
  - cors
  - cookie-parser

##### client/package.json
- 必要な依存関係がすべて記載されているか
  - react
  - react-dom
  - react-router-dom
  - axios
  - pdfjs-dist
  - tailwindcss

##### .gitignore
- 機密情報が除外されているか
  - node_modules/
  - .env
  - uploads/
  - dist/
  - build/

#### 3. README.md の確認

以下のセクションが含まれているか：
- プロジェクト概要
- 技術スタック
- ローカル開発手順
- デプロイ手順
- 環境変数一覧
- トラブルシューティング

### 確認コマンド

AIデベロッパーのターミナルで実行：

```bash
# プロジェクトルートに移動
cd /home/user/webapp

# ディレクトリ構造を確認
ls -la

# serverディレクトリの確認
ls -la server/

# clientディレクトリの確認
ls -la client/

# prismaディレクトリの確認
ls -la prisma/
```

### エラーがある場合

以下をAIに伝えます：
```
以下のファイルが見つかりません：
- （見つからないファイル名をリストアップ）

確認をお願いします。
```

### 完了の目安

✅ すべてのディレクトリが作成されている  
✅ package.json に依存関係が記載されている  
✅ .gitignore が設定されている  
✅ README.md が作成されている  
✅ AIが「実装が完了しました」と報告している

---

<a name="slide-7"></a>
## スライド 7: GitHubリポジトリ作成

### 手順

#### ステップ 1: GitHubにログイン
1. `https://github.com` を開く
2. ログインしていない場合はログイン

#### ステップ 2: 新規リポジトリ作成
1. 右上の **「+」** アイコンをクリック
2. **「New repository」** を選択

#### ステップ 3: リポジトリ情報入力

##### Repository name
```
workshop-management-system
```

##### Description（任意）
```
Workshop management system with PDF viewer and progress tracking
```

##### Public / Private
- **Public**: 誰でも見られる（推奨）
- **Private**: 自分だけ見られる

##### Initialize this repository with:
⚠️ **すべてチェックを外す**
- ❌ Add a README file
- ❌ Add .gitignore
- ❌ Choose a license

**理由**: AIデベロッパーで既に作成済み

#### ステップ 4: リポジトリ作成
1. **「Create repository」** ボタンをクリック

#### ステップ 5: リポジトリURLをコピー

作成されたページに表示される以下をコピー：

```
https://github.com/your-username/workshop-management-system.git
```

### スクリーンショット（イメージ）

```
┌──────────────────────────────────────────┐
│  Create a new repository                 │
├──────────────────────────────────────────┤
│  Repository name *                       │
│  [workshop-management-system        ]    │
│                                          │
│  Description (optional)                  │
│  [Workshop management system...     ]    │
│                                          │
│  ○ Public  ○ Private                     │
│                                          │
│  Initialize this repository with:        │
│  ☐ Add a README file                     │
│  ☐ Add .gitignore                        │
│  ☐ Choose a license                      │
│                                          │
│  [Create repository]                     │
└──────────────────────────────────────────┘
```

### 次の画面（作成後）

```
┌──────────────────────────────────────────┐
│  Quick setup                             │
├──────────────────────────────────────────┤
│  HTTPS   SSH                             │
│  https://github.com/your-username/...    │
│                                          │
│  …or create a new repository on the      │
│  command line                            │
│                                          │
│  echo "# workshop" >> README.md          │
│  git init                                │
│  git add README.md                       │
│  git commit -m "first commit"            │
│  git branch -M main                      │
│  git remote add origin https://...       │
│  git push -u origin main                 │
└──────────────────────────────────────────┘
```

**このコマンドは使いません**（AIデベロッパーが自動で実行）

---

<a name="slide-8"></a>
## スライド 8: コードをGitHubにプッシュ

### 手順

#### ステップ 1: AIデベロッパーのチャットで指示

以下のメッセージをAIに送信：

```
GitHubリポジトリを作成しました。
以下のURLにコードをpushしてください：

https://github.com/your-username/workshop-management-system.git

※ your-username を自分のGitHubユーザー名に置き換えてください
```

#### ステップ 2: GitHub認証のセットアップ

AIが以下を実行します：

1. **setup_github_environment** ツールを呼び出し
2. GitHubトークンの設定
3. Git設定の完了

もし認証に失敗したら：
```
AIからの指示:
「GenSparkの#githubタブでGitHub認証を完了してください」

→ GenSparkの画面で#githubタブを開く
→ 「Authorize GitHub」ボタンをクリック
→ GitHubの認証画面で「Authorize」をクリック
```

#### ステップ 3: Git初期化とプッシュ

AIが自動的に以下を実行：

```bash
# Gitリポジトリ初期化
git init

# .gitignoreの確認
cat .gitignore

# 全ファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: Complete workshop management system"

# リモートリポジトリ追加
git remote add origin https://github.com/your-username/workshop-management-system.git

# mainブランチにプッシュ
git push -u origin main
```

#### ステップ 4: プッシュ成功の確認

AIが以下のようなメッセージを返します：

```
✅ GitHubへのプッシュが完了しました

リポジトリ: https://github.com/your-username/workshop-management-system
ブランチ: main
コミット数: 1
```

#### ステップ 5: GitHubで確認

1. GitHubのリポジトリページをブラウザで開く
2. 以下が表示されているか確認：
   - ✅ README.md
   - ✅ server/ ディレクトリ
   - ✅ client/ ディレクトリ
   - ✅ prisma/ ディレクトリ
   - ✅ .gitignore
   - ✅ 「Initial commit」コミットメッセージ

### トラブルシューティング

#### エラー: Authentication failed

**原因**: GitHubトークンが設定されていない

**解決策**:
1. GenSparkの#githubタブを開く
2. GitHub認証を完了
3. AIに再度プッシュを依頼

#### エラー: Permission denied

**原因**: リポジトリへの書き込み権限がない

**解決策**:
1. GitHubでリポジトリのURLが正しいか確認
2. 自分のアカウントでリポジトリが作成されているか確認

#### エラー: Repository not found

**原因**: リポジトリURLが間違っている

**解決策**:
1. GitHubでリポジトリURLを再確認
2. 正しいURLをAIに伝える

### 確認ポイント

✅ GitHubリポジトリにコードが表示される  
✅ すべてのファイルがアップロードされている  
✅ .gitignore が機能している（node_modules/ などが除外）  
✅ コミット履歴が表示される

---

<a name="slide-9"></a>
## スライド 9: Renderでデータベース作成

### 手順

#### ステップ 1: Renderダッシュボードを開く
1. `https://dashboard.render.com` にアクセス
2. ログイン

#### ステップ 2: 新しいPostgreSQLを作成
1. ダッシュボード画面で **「New +」** ボタンをクリック
2. **「PostgreSQL」** を選択

#### ステップ 3: データベース情報入力

##### Name
```
workshop-db
```

##### Database
```
workshop_production
```
**注意**: データベース名にハイフン（-）は使えません

##### User
```
workshop_user
```
**注意**: 自動生成される場合はそのままでOK

##### Region
```
Singapore (Southeast Asia)
```
または最も近いリージョンを選択

##### PostgreSQL Version
```
16
```
最新バージョンを選択

##### Datadog API Key
```
（空欄のまま）
```

##### Plan
```
Free
```
**注意**: 90日間無料、その後月$7

#### ステップ 4: データベース作成
1. **「Create Database」** ボタンをクリック
2. 作成完了を待つ（約1〜2分）

#### ステップ 5: 接続情報をコピー

作成されたデータベースページで以下をコピー：

##### Internal Database URL
```
postgres://workshop_user:password@hostname/workshop_production
```

**または**

##### External Database URL
```
postgres://workshop_user:password@hostname/workshop_production
```

⚠️ **どちらを使うべきか**:
- **Internal**: RenderのWeb ServiceとPostgreSQLが同じリージョンの場合（推奨）
- **External**: 外部からアクセスする場合

**推奨**: Internal Database URL

#### ステップ 6: 接続情報を保存

メモ帳などに以下を保存：

```
DATABASE_URL=postgres://workshop_user:password@hostname/workshop_production
```

**注意**: このURLは後で環境変数として使用します

### スクリーンショット（イメージ）

```
┌──────────────────────────────────────────┐
│  New PostgreSQL                          │
├──────────────────────────────────────────┤
│  Name                                    │
│  [workshop-db                       ]    │
│                                          │
│  Database                                │
│  [workshop_production               ]    │
│                                          │
│  User                                    │
│  [workshop_user                     ]    │
│                                          │
│  Region                                  │
│  [Singapore (Southeast Asia)  ▼]         │
│                                          │
│  PostgreSQL Version                      │
│  [16                          ▼]         │
│                                          │
│  Plan                                    │
│  ● Free                                  │
│  ○ Starter ($7/month)                    │
│                                          │
│  [Create Database]                       │
└──────────────────────────────────────────┘
```

### 作成後の画面

```
┌──────────────────────────────────────────┐
│  workshop-db                             │
├──────────────────────────────────────────┤
│  Status: ● Available                     │
│                                          │
│  Internal Database URL                   │
│  postgres://workshop_user:xxxxx@...      │
│  [Copy]                                  │
│                                          │
│  External Database URL                   │
│  postgres://workshop_user:xxxxx@...      │
│  [Copy]                                  │
│                                          │
│  PSQL Command                            │
│  psql -h hostname -U workshop_user ...   │
│  [Copy]                                  │
└──────────────────────────────────────────┘
```

### 確認ポイント

✅ データベースのステータスが「Available」である  
✅ Internal Database URL がコピーできる  
✅ 接続情報が保存されている

---

<a name="slide-10"></a>
## スライド 10: Renderでアプリケーションデプロイ

### 手順

#### ステップ 1: Renderダッシュボードに戻る
1. `https://dashboard.render.com` を開く

#### ステップ 2: 新しいWeb Serviceを作成
1. **「New +」** ボタンをクリック
2. **「Web Service」** を選択

#### ステップ 3: GitHubリポジトリ接続

##### 初回の場合
1. **「Connect GitHub」** ボタンをクリック
2. GitHubの認証画面で **「Authorize Render」** をクリック
3. アクセスを許可するリポジトリを選択
   - **All repositories** または
   - **Only select repositories** → `workshop-management-system` を選択
4. **「Install & Authorize」** をクリック

##### 既にGitHub連携済みの場合
1. リポジトリ一覧から **「workshop-management-system」** を選択
2. **「Connect」** ボタンをクリック

#### ステップ 4: Web Service情報入力

##### Name
```
workshop-management-system
```

##### Region
```
Singapore (Southeast Asia)
```
**注意**: データベースと同じリージョンを選択

##### Branch
```
main
```

##### Root Directory
```
（空欄のまま）
```

##### Runtime
```
Node
```

##### Build Command
```
cd server && npm install && npm run build && cd ../client && npm install && npm run build
```

**説明**:
1. `cd server`: サーバーディレクトリに移動
2. `npm install`: サーバーの依存関係をインストール
3. `npm run build`: サーバーをビルド（TypeScriptコンパイル）
4. `cd ../client`: クライアントディレクトリに移動
5. `npm install`: クライアントの依存関係をインストール
6. `npm run build`: クライアントをビルド（Viteビルド）

##### Start Command
```
cd server && npm start
```

**説明**:
1. `cd server`: サーバーディレクトリに移動
2. `npm start`: サーバーを起動

##### Plan
```
Free
```

#### ステップ 5: 詳細設定（Advanced）

**「Advanced」** ボタンをクリックして以下を設定：

##### Auto-Deploy
```
✅ Yes
```
**説明**: GitHubにプッシュすると自動的に再デプロイ

##### Health Check Path
```
/api/health
```
**説明**: サーバーが起動しているか確認するエンドポイント

#### ステップ 6: Web Service作成
1. **「Create Web Service」** ボタンをクリック
2. デプロイが開始される（約5〜10分）

#### ステップ 7: デプロイログの確認

画面に表示されるログを確認：

```
==> Cloning from https://github.com/your-username/workshop-management-system...
==> Checking out commit xxxxx in branch main
==> Running build command 'cd server && npm install && npm run build && cd ../client && npm install && npm run build'...
    
    > server: npm install
    added 150 packages
    
    > server: npm run build
    Compiled successfully
    
    > client: npm install
    added 200 packages
    
    > client: npm run build
    vite v7.3.1 building for production...
    ✓ 105 modules transformed.
    dist/index.html                   0.45 kB
    dist/assets/index-xxx.css         20.52 kB
    dist/assets/index-xxx.js         709.38 kB
    ✓ built in 5.99s

==> Build successful!
==> Starting service with 'cd server && npm start'...
    Server is running on port 10000
```

#### ステップ 8: デプロイ完了の確認

画面上部に以下が表示される：

```
● Live
Your service is live at https://workshop-management-system-xxxx.onrender.com
```

### スクリーンショット（イメージ）

```
┌──────────────────────────────────────────┐
│  New Web Service                         │
├──────────────────────────────────────────┤
│  Connect a repository                    │
│  ● workshop-management-system            │
│    [Connect]                             │
│                                          │
│  ─────────────────────────────────────── │
│                                          │
│  Name *                                  │
│  [workshop-management-system        ]    │
│                                          │
│  Region                                  │
│  [Singapore (Southeast Asia)  ▼]         │
│                                          │
│  Branch                                  │
│  [main                          ▼]       │
│                                          │
│  Build Command *                         │
│  [cd server && npm install && ...   ]    │
│                                          │
│  Start Command *                         │
│  [cd server && npm start            ]    │
│                                          │
│  Plan                                    │
│  ● Free                                  │
│                                          │
│  [Create Web Service]                    │
└──────────────────────────────────────────┘
```

### トラブルシューティング

#### ビルドエラー: npm install failed

**原因**: package.json が見つからない

**解決策**:
1. GitHubでserver/package.json が存在するか確認
2. Root Directory が空欄であることを確認

#### ビルドエラー: TypeScript compilation failed

**原因**: TypeScriptエラー

**解決策**:
1. AIデベロッパーでエラーメッセージを共有
2. AIにコード修正を依頼
3. 修正後、GitHubにプッシュ
4. Renderで自動的に再デプロイ

#### 起動エラー: Port already in use

**原因**: Start Command が間違っている

**解決策**:
1. Start Command を確認: `cd server && npm start`
2. server/package.json の scripts.start を確認

### 確認ポイント

✅ Web Serviceが作成された  
✅ ビルドが成功した  
✅ サービスが起動している  
✅ URLが発行されている（https://xxxx.onrender.com）

---

<a name="slide-11"></a>
## スライド 11: 環境変数の設定

### 手順

#### ステップ 1: Web Serviceのページを開く
1. Renderダッシュボードで作成したWeb Serviceをクリック
2. 左サイドバーの **「Environment」** をクリック

#### ステップ 2: 環境変数を追加

以下の環境変数を1つずつ追加します：

##### 1. DATABASE_URL

**Key**:
```
DATABASE_URL
```

**Value**:
```
postgres://workshop_user:password@hostname/workshop_production
```

**説明**: スライド9でコピーしたInternal Database URL

**手順**:
1. 「Add Environment Variable」をクリック
2. Key に `DATABASE_URL` を入力
3. Value に接続URLを貼り付け
4. 「Save Changes」をクリック

##### 2. JWT_SECRET

**Key**:
```
JWT_SECRET
```

**Value**:
```
your-super-secret-jwt-key-change-this-in-production
```

**説明**: JWT トークンの署名に使う秘密鍵

**推奨**: ランダムな文字列を生成
```bash
# ランダム文字列生成（AIデベロッパーで実行）
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 出力例:
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

##### 3. NODE_ENV

**Key**:
```
NODE_ENV
```

**Value**:
```
production
```

**説明**: 本番環境であることを示す

##### 4. PORT

**Key**:
```
PORT
```

**Value**:
```
10000
```

**説明**: Renderが自動的に設定（変更不要）

**注意**: この変数は既に存在する場合があります

##### 5. FRONTEND_URL

**Key**:
```
FRONTEND_URL
```

**Value**:
```
https://workshop-management-system-xxxx.onrender.com
```

**説明**: アプリケーションのURL

**注意**: `xxxx` 部分は自分のURLに置き換えてください

#### ステップ 3: 環境変数の保存

すべての環境変数を入力したら：
1. **「Save Changes」** ボタンをクリック
2. 自動的に再デプロイが開始される（約3〜5分）

#### ステップ 4: 再デプロイ完了を待つ

画面上部のステータスが以下に変わるまで待ちます：
```
● Live
```

### 環境変数一覧（チェックリスト）

| Key | Value 例 | 必須 |
|-----|---------|------|
| `DATABASE_URL` | `postgres://...` | ✅ |
| `JWT_SECRET` | `a1b2c3d4...` | ✅ |
| `NODE_ENV` | `production` | ✅ |
| `PORT` | `10000` | ✅ |
| `FRONTEND_URL` | `https://...onrender.com` | ✅ |

### スクリーンショット（イメージ）

```
┌──────────────────────────────────────────┐
│  Environment Variables                   │
├──────────────────────────────────────────┤
│  Add Environment Variable                │
│                                          │
│  Key                                     │
│  [DATABASE_URL                      ]    │
│                                          │
│  Value                                   │
│  [postgres://workshop_user:...     ]    │
│                                          │
│  [Add]                                   │
│                                          │
│  ──────────────────────────────────────  │
│                                          │
│  Existing Variables:                     │
│                                          │
│  DATABASE_URL                            │
│  postgres://workshop_user:...            │
│  [Edit] [Delete]                         │
│                                          │
│  JWT_SECRET                              │
│  ********************************         │
│  [Edit] [Delete]                         │
│                                          │
│  [Save Changes]                          │
└──────────────────────────────────────────┘
```

### トラブルシューティング

#### エラー: Invalid DATABASE_URL

**原因**: URLの形式が間違っている

**解決策**:
1. RenderのPostgreSQLページでURLを再コピー
2. 余計な空白や改行がないか確認

#### エラー: JWT_SECRET is required

**原因**: JWT_SECRET が設定されていない

**解決策**:
1. 環境変数一覧で JWT_SECRET が存在するか確認
2. 値が空欄でないか確認

#### 警告: NODE_ENV not set

**原因**: NODE_ENV が設定されていない

**解決策**:
1. NODE_ENV を `production` に設定

### 確認ポイント

✅ 5つの環境変数がすべて設定されている  
✅ DATABASE_URL が正しい  
✅ JWT_SECRET がランダムな文字列である  
✅ FRONTEND_URL が正しいURLである  
✅ 再デプロイが完了している

---

<a name="slide-12"></a>
## スライド 12: マイグレーション実行

### 概要

**マイグレーション**とは、データベースのテーブルを作成する処理です。
以下のテーブルが作成されます：
- User（ユーザー）
- Workshop（ワークショップ）
- Material（PDF資料）
- Progress（進行度）

### 手順

#### ステップ 1: Render Shellを開く

1. RenderダッシュボードでWeb Serviceを開く
2. 右上の **「Shell」** タブをクリック
3. ターミナルが開くのを待つ（約30秒）

#### ステップ 2: サーバーディレクトリに移動

Shell で以下のコマンドを実行：

```bash
cd server
```

**確認**:
```bash
pwd
# 出力: /opt/render/project/src/server
```

#### ステップ 3: Prismaマイグレーション実行

```bash
npx prisma migrate deploy
```

**実行例**:
```
Prisma Migrate
Applying migrations:
  0001_initial_schema

Database is now in sync with your Prisma schema.
✓ Applied 1 migration(s)
```

#### ステップ 4: マイグレーション確認

```bash
npx prisma db pull
```

**実行例**:
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "workshop_production"

Introspecting based on datasource defined in prisma/schema.prisma

✓ Introspected 4 models and wrote them into prisma/schema.prisma
```

### スクリーンショット（イメージ）

```
┌──────────────────────────────────────────┐
│  Shell - workshop-management-system      │
├──────────────────────────────────────────┤
│  $ cd server                             │
│  $ npx prisma migrate deploy             │
│                                          │
│  Prisma Migrate                          │
│  Applying migrations:                    │
│    0001_initial_schema                   │
│                                          │
│  Database is now in sync with your       │
│  Prisma schema.                          │
│  ✓ Applied 1 migration(s)                │
│                                          │
│  $                                       │
└──────────────────────────────────────────┘
```

### トラブルシューティング

#### エラー: DATABASE_URL environment variable not found

**原因**: 環境変数が設定されていない

**解決策**:
1. Render の Environment タブで DATABASE_URL を確認
2. 設定後、再デプロイ
3. Shell を開き直す

#### エラー: Can't reach database server

**原因**: データベースが起動していない

**解決策**:
1. RenderのPostgreSQLページで「Available」になっているか確認
2. DATABASE_URL が正しいか確認

#### エラー: Migration failed

**原因**: スキーマ定義にエラーがある

**解決策**:
1. エラーメッセージをコピー
2. AIデベロッパーでエラーを共有
3. AIに修正を依頼

### 代替方法: AIデベロッパー経由

Render Shell が使えない場合、AIデベロッパーで実行：

```
Renderでマイグレーションを実行してください。
以下の手順を教えてください：

1. Render Shellを開く
2. マイグレーションコマンドを実行
```

AIが詳細な手順を提示します。

### 確認ポイント

✅ マイグレーションが成功した  
✅ 「Applied 1 migration(s)」と表示された  
✅ エラーが表示されていない  
✅ データベースにテーブルが作成された

---

<a name="slide-13"></a>
## スライド 13: シード実行

### 概要

**シード**とは、データベースに初期データを投入する処理です。
以下のデータが作成されます：

- **adminユーザー**: `admin@example.com` / `admin123`
- **userユーザー**: `user@example.com` / `user123`
- **サンプルワークショップ**: 1件

### 手順

#### ステップ 1: Render Shellで実行

Shellで以下のコマンドを実行：

```bash
npx prisma db seed
```

**実行例**:
```
Prisma Seed
Running seed: node --loader ts-node/esm prisma/seed.ts

✓ Admin user created: admin@example.com
✓ Regular user created: user@example.com
✓ Sample workshop created: GensparkでWebアプリを作る！完全ガイド

Database seeded successfully!
```

#### ステップ 2: シード確認

データが正しく投入されたか確認：

```bash
npx prisma studio
```

**注意**: Render Shell では Prisma Studio は起動できません

**代替方法**: SQLクエリで確認

```bash
psql $DATABASE_URL -c "SELECT email, role FROM \"User\";"
```

**実行例**:
```
         email          | role
------------------------+-------
 admin@example.com      | ADMIN
 user@example.com       | USER
(2 rows)
```

#### ステップ 3: ワークショップ確認

```bash
psql $DATABASE_URL -c "SELECT id, title, \"isPublic\" FROM \"Workshop\";"
```

**実行例**:
```
 id |                title                 | isPublic
----+--------------------------------------+----------
  1 | GensparkでWebアプリを作る！完全ガイド | t
(1 row)
```

### スクリーンショット（イメージ）

```
┌──────────────────────────────────────────┐
│  Shell - workshop-management-system      │
├──────────────────────────────────────────┤
│  $ npx prisma db seed                    │
│                                          │
│  Prisma Seed                             │
│  Running seed: node prisma/seed.ts       │
│                                          │
│  ✓ Admin user created:                   │
│    admin@example.com                     │
│                                          │
│  ✓ Regular user created:                 │
│    user@example.com                      │
│                                          │
│  ✓ Sample workshop created:              │
│    GensparkでWebアプリを作る！完全...    │
│                                          │
│  Database seeded successfully!           │
│                                          │
│  $                                       │
└──────────────────────────────────────────┘
```

### トラブルシューティング

#### エラー: Seed file not found

**原因**: prisma/seed.ts が存在しない

**解決策**:
1. AIデベロッパーで seed.ts を確認
2. GitHubで prisma/seed.ts が存在するか確認
3. 存在しない場合、AIに作成を依頼

#### エラー: Unique constraint failed

**原因**: 既にデータが存在する

**解決策**:
```bash
# データを削除して再実行
psql $DATABASE_URL -c "TRUNCATE \"User\", \"Workshop\", \"Material\", \"Progress\" CASCADE;"
npx prisma db seed
```

#### エラー: bcrypt error

**原因**: bcrypt がインストールされていない

**解決策**:
1. server/package.json で bcrypt が記載されているか確認
2. Render で再ビルド

### 代替方法: 手動でユーザー作成

Shellでユーザーを手動作成：

```bash
psql $DATABASE_URL
```

SQLを実行：

```sql
-- adminユーザー作成（パスワード: admin123）
INSERT INTO "User" (email, password, name, role)
VALUES (
  'admin@example.com',
  '$2b$10$xyzxyzxyz...', -- bcryptハッシュ
  'Admin User',
  'ADMIN'
);

-- userユーザー作成（パスワード: user123）
INSERT INTO "User" (email, password, name, role)
VALUES (
  'user@example.com',
  '$2b$10$xyzxyzxyz...', -- bcryptハッシュ
  'Test User',
  'USER'
);
```

**注意**: パスワードハッシュはAIに生成してもらってください

### 確認ポイント

✅ シードが成功した  
✅ admin ユーザーが作成された  
✅ user ユーザーが作成された  
✅ サンプルワークショップが作成された  
✅ エラーが表示されていない

---

<a name="slide-14"></a>
## スライド 14: アプリケーション動作確認

### 手順

#### ステップ 1: アプリケーションURLを開く

1. Renderダッシュボードで Web Service を開く
2. 画面上部のURLをクリック
   ```
   https://workshop-management-system-xxxx.onrender.com
   ```
3. 新しいタブでアプリケーションが開く

#### ステップ 2: ログインページの確認

以下が表示されることを確認：

- ✅ グラデーション背景（グレー）
- ✅ 大きなアイコン
- ✅ 「ワークショップ管理システム」タイトル
- ✅ 「アカウントにログイン」サブタイトル
- ✅ メールアドレス入力欄
- ✅ パスワード入力欄
- ✅ 「ログイン」ボタン

#### ステップ 3: 管理者でログイン

以下の情報でログイン：

**メールアドレス**:
```
admin@example.com
```

**パスワード**:
```
admin123
```

**手順**:
1. メールアドレスを入力
2. パスワードを入力
3. 「ログイン」ボタンをクリック

#### ステップ 4: ワークショップ一覧の確認

ログイン後、以下が表示されることを確認：

- ✅ グラデーションNavbar（紫→青）
- ✅ 「ワークショップ管理システム」ロゴ
- ✅ ナビゲーションメニュー
  - ワークショップ
  - 管理（管理者のみ）
  - ユーザー管理（管理者のみ）
- ✅ ユーザー名表示
- ✅ 「管理者」バッジ
- ✅ ログアウトボタン

- ✅ ページタイトル「ワークショップ一覧」
- ✅ サンプルワークショップカード
  - タイトル: 「GensparkでWebアプリを作る！完全ガイド」
  - グラデーション背景（紫→青）
  - 「グループ以上」バッジ
  - 矢印アイコン

#### ステップ 5: 管理者機能の確認

##### 5.1 ワークショップ管理
1. Navbarの「管理」→「ワークショップ管理」をクリック
2. 以下を確認：
   - ✅ 「トップページに戻る」ボタン
   - ✅ ワークショップ一覧（テーブル）
   - ✅ 「新規作成」ボタン
   - ✅ 公開/非公開切り替えボタン
   - ✅ 「資料管理」リンク
   - ✅ 「削除」ボタン

##### 5.2 ワークショップ作成
1. 「新規作成」ボタンをクリック
2. フォームが表示される
3. 以下を入力：
   - タイトル: `テストワークショップ`
   - 説明: `これはテストです`
   - 公開する: チェック
4. 「作成」ボタンをクリック
5. 一覧に追加されることを確認

##### 5.3 PDF資料管理
1. 作成したワークショップの「資料管理」をクリック
2. 以下を確認：
   - ✅ 「トップページに戻る」ボタン
   - ✅ 「ワークショップ管理に戻る」ボタン
   - ✅ PDFアップロードフォーム
   - ✅ アップロード済み資料一覧

##### 5.4 PDFアップロード（オプション）
1. タイトルを入力: `テストPDF`
2. PDFファイルを選択（任意のPDFファイル）
3. 「アップロード」ボタンをクリック
4. 一覧に追加されることを確認

**注意**: Renderの無料プランでは、再デプロイ時にアップロードファイルが消えます

##### 5.5 ユーザー管理
1. Navbarの「管理」→「ユーザー管理」をクリック
2. 以下を確認：
   - ✅ 「トップページに戻る」ボタン
   - ✅ ユーザー一覧（テーブル）
   - ✅ admin と user が表示される
   - ✅ 役割バッジ（管理者/ユーザー）
   - ✅ 「ユーザー作成」ボタン

#### ステップ 6: 一般ユーザーでログイン

##### 6.1 ログアウト
1. Navbarの「ログアウト」ボタンをクリック
2. ログインページに戻る

##### 6.2 userでログイン
以下の情報でログイン：

**メールアドレス**:
```
user@example.com
```

**パスワード**:
```
user123
```

##### 6.3 一般ユーザー画面の確認
- ✅ Navbarに「管理」メニューが表示されない
- ✅ 「管理者」バッジが表示されない
- ✅ 公開ワークショップのみ表示される

#### ステップ 7: PDFビューアの確認（PDF資料がある場合）

1. ワークショップカードをクリック
2. ワークショップ詳細ページが開く
3. 資料カードをクリック
4. PDFビューアが開く
5. 以下を確認：
   - ✅ PDFが表示される
   - ✅ 「戻る」ボタン
   - ✅ 資料タイトル
   - ✅ 「未完了」ボタン
   - ✅ ページ送り/戻しボタン
   - ✅ ページ番号表示（例: 1 / 10）
   - ✅ ズームイン/アウトボタン
   - ✅ 拡大率表示（例: 120%）

#### ステップ 8: 進行度管理の確認

1. PDFビューアで「次へ」ボタンを数回クリック
2. ワークショップ詳細ページに戻る
3. 進行度が更新されていることを確認：
   - 「最終閲覧ページ: 3」など

4. PDFビューアに戻る
5. 前回の続き（ページ3）から再開されることを確認

6. 「未完了」ボタンをクリック
7. 「✓ 完了」に変わることを確認

8. ワークショップ詳細ページに戻る
9. 「✓ 完了」と表示されることを確認

### 動作確認チェックリスト

#### 認証
- ✅ ログインできる（admin）
- ✅ ログインできる（user）
- ✅ ログアウトできる
- ✅ 未認証でアクセスするとログインページにリダイレクト

#### ワークショップ
- ✅ 一覧が表示される
- ✅ 詳細が表示される
- ✅ adminは全件表示される
- ✅ userは公開のみ表示される

#### 管理者機能
- ✅ ワークショップを作成できる
- ✅ ワークショップを編集できる
- ✅ ワークショップを削除できる
- ✅ 公開/非公開を切り替えられる
- ✅ PDF資料をアップロードできる
- ✅ PDF資料を削除できる
- ✅ ユーザーを作成できる
- ✅ ユーザーを削除できる

#### PDFビューア
- ✅ PDFが表示される
- ✅ ページ送りができる
- ✅ ページ戻しができる
- ✅ ズームイン/アウトができる
- ✅ ページ番号が表示される

#### 進行度管理
- ✅ ページ移動で自動保存される
- ✅ 次回アクセス時に復元される
- ✅ 完了状態を切り替えられる
- ✅ 詳細ページに進行度が表示される

#### UI/UX
- ✅ グラデーション背景が表示される
- ✅ アイコンが適切なサイズで表示される
- ✅ ホバーエフェクトが動作する
- ✅ レスポンシブデザインが機能する
- ✅ エラーメッセージが表示される
- ✅ ローディングスピナーが表示される

### トラブルシューティング

#### 問題: ログインできない

**原因**: シードが実行されていない

**解決策**:
1. スライド13に戻ってシードを実行

#### 問題: 「管理」メニューが表示されない（admin）

**原因**: ユーザーの役割がADMINでない

**解決策**:
```sql
-- Render Shellで実行
psql $DATABASE_URL -c "UPDATE \"User\" SET role='ADMIN' WHERE email='admin@example.com';"
```

#### 問題: PDFが表示されない

**原因1**: PDF資料がアップロードされていない

**解決策**: 管理画面でPDFをアップロード

**原因2**: PDF.js Worker URL が間違っている

**解決策**: AIデベロッパーで Worker URL を確認

#### 問題: Tailwind CSSが適用されていない

**原因**: Tailwind CSS がビルドに含まれていない

**解決策**:
1. client/tailwind.config.js が存在するか確認
2. client/postcss.config.js が存在するか確認
3. client/src/index.css に Tailwind ディレクティブがあるか確認
4. Render で再ビルド

### 確認完了！

すべてのチェックリストが ✅ になったら、アプリケーションは正常に動作しています！

---

<a name="slide-15"></a>
## スライド 15: トラブルシューティング

### よくある問題と解決策

---

### 問題カテゴリ

1. [ビルドエラー](#build-errors)
2. [デプロイエラー](#deploy-errors)
3. [データベース接続エラー](#database-errors)
4. [認証エラー](#auth-errors)
5. [PDF表示エラー](#pdf-errors)
6. [UI表示エラー](#ui-errors)

---

<a name="build-errors"></a>
### 1. ビルドエラー

#### エラー: npm install failed

**症状**:
```
Error: Cannot find module 'express'
npm ERR! 404 Not Found
```

**原因**:
- package.json が存在しない
- 依存関係の記載ミス

**解決策**:
```bash
# AIデベロッパーで確認
cd /home/user/webapp/server
cat package.json

# 依存関係を確認
npm install
```

**Renderで再ビルド**:
1. Render ダッシュボード
2. Manual Deploy → Deploy latest commit

---

#### エラー: TypeScript compilation failed

**症状**:
```
error TS2304: Cannot find name 'Request'
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'
```

**原因**:
- TypeScript型エラー
- 型定義が不足

**解決策**:
1. エラーメッセージをコピー
2. AIデベロッパーで共有:
   ```
   以下のTypeScriptエラーが出ています：
   （エラーメッセージを貼り付け）
   
   修正をお願いします。
   ```
3. AIが修正
4. GitHubにプッシュ
5. Render で自動再デプロイ

---

#### エラー: Vite build failed

**症状**:
```
✗ Error: Build failed
Could not resolve './Component'
```

**原因**:
- import パスが間違っている
- ファイルが存在しない

**解決策**:
```bash
# AIデベロッパーで確認
cd /home/user/webapp/client
npm run build

# エラーメッセージを確認
# AIに修正を依頼
```

---

<a name="deploy-errors"></a>
### 2. デプロイエラー

#### エラー: Deploy timeout

**症状**:
```
Error: Build exceeded maximum time limit
```

**原因**:
- ビルドに時間がかかりすぎる
- 無限ループ

**解決策**:
1. Build Command を確認:
   ```
   cd server && npm install && npm run build && cd ../client && npm install && npm run build
   ```
2. 不要な処理がないか確認
3. Render のプランをアップグレード（有料）

---

#### エラー: Port already in use

**症状**:
```
Error: listen EADDRINUSE: address already in use :::10000
```

**原因**:
- Start Command が間違っている
- 複数のプロセスが起動している

**解決策**:
1. Start Command を確認:
   ```
   cd server && npm start
   ```
2. server/package.json の scripts.start を確認:
   ```json
   {
     "scripts": {
       "start": "node dist/index.js"
     }
   }
   ```

---

<a name="database-errors"></a>
### 3. データベース接続エラー

#### エラー: DATABASE_URL not found

**症状**:
```
Error: Environment variable DATABASE_URL is required
```

**原因**:
- 環境変数が設定されていない

**解決策**:
1. Render の Environment タブを開く
2. DATABASE_URL を確認
3. 設定されていない場合は追加:
   ```
   Key: DATABASE_URL
   Value: postgres://workshop_user:password@hostname/workshop_production
   ```
4. Save Changes
5. 再デプロイ

---

#### エラー: Can't reach database server

**症状**:
```
Error: Can't reach database server at hostname:5432
```

**原因**:
- データベースが起動していない
- DATABASE_URL が間違っている

**解決策**:
1. Render の PostgreSQL ページを開く
2. Status が「Available」であることを確認
3. Internal Database URL をコピー
4. Render の Environment で DATABASE_URL を更新
5. Save Changes

---

#### エラー: Migration failed

**症状**:
```
Error: P1001: Can't reach database server
Error: P3009: migrate found failed migrations
```

**原因**:
- マイグレーションファイルにエラー
- データベース接続が切れた

**解決策**:
```bash
# Render Shell で実行
cd server

# マイグレーションをリセット
npx prisma migrate reset --force

# 再度マイグレーション
npx prisma migrate deploy

# シード
npx prisma db seed
```

---

<a name="auth-errors"></a>
### 4. 認証エラー

#### エラー: Invalid credentials

**症状**:
- ログインできない
- 「メールアドレスまたはパスワードが間違っています」

**原因**:
- シードが実行されていない
- パスワードが間違っている

**解決策**:
```bash
# Render Shell で確認
cd server
psql $DATABASE_URL -c "SELECT email, role FROM \"User\";"

# ユーザーが存在しない場合
npx prisma db seed
```

**テストアカウント**:
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

---

#### エラー: JWT token invalid

**症状**:
- ログイン後すぐにログアウトされる
- 「認証エラー」が表示される

**原因**:
- JWT_SECRET が設定されていない
- JWT_SECRET が変更された

**解決策**:
1. Render の Environment タブを開く
2. JWT_SECRET を確認
3. 設定されていない場合は追加:
   ```bash
   # ランダム文字列を生成（AIデベロッパーで）
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. Render で設定:
   ```
   Key: JWT_SECRET
   Value: （生成された文字列）
   ```
5. Save Changes
6. ログアウト → 再ログイン

---

<a name="pdf-errors"></a>
### 5. PDF表示エラー

#### エラー: PDFの読み込みに失敗しました

**症状**:
- PDFビューアで「PDFの読み込みに失敗しました」

**原因1**: ファイルが存在しない（Renderで再デプロイした）

**解決策**:
1. 管理画面でPDFを再アップロード

**原因2**: PDF.js Worker URL が間違っている

**解決策**:
1. AIデベロッパーで確認:
   ```
   PDFViewerのWorker URLを確認してください。
   unpkg CDNを使用していますか？
   ```
2. 正しいURL:
   ```typescript
   pdfjsLib.GlobalWorkerOptions.workerSrc = 
     `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
   ```

**原因3**: CORS エラー

**解決策**:
1. server/src/index.ts で CORS 設定を確認:
   ```typescript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```
2. FRONTEND_URL を確認

---

#### エラー: 404 - Material not found

**症状**:
- PDFビューアで404エラー

**原因**:
- 資料IDが間違っている
- ファイルが物理的に存在しない

**解決策**:
```bash
# Render Shell で確認
cd server
psql $DATABASE_URL -c "SELECT id, title, filename FROM \"Material\";"

# uploadsディレクトリを確認
ls -la uploads/

# ファイルが存在しない場合
# 管理画面で再アップロード
```

---

<a name="ui-errors"></a>
### 6. UI表示エラー

#### エラー: Tailwind CSSが適用されていない

**症状**:
- デザインが崩れている
- スタイルが全く適用されていない

**原因**:
- Tailwind CSS がインストールされていない
- ビルド設定が間違っている

**解決策**:
```bash
# AIデベロッパーで確認
cd /home/user/webapp/client

# Tailwind CSS インストール
npm install -D tailwindcss@3.4.17 postcss autoprefixer

# 設定ファイル確認
ls -la tailwind.config.js postcss.config.js

# 存在しない場合、AIに作成を依頼
```

**tailwind.config.js**:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**postcss.config.js**:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**src/index.css**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**再ビルド**:
```bash
npm run build
```

---

#### エラー: アイコンが表示されない

**症状**:
- SVGアイコンが表示されない

**原因**:
- SVGコードが間違っている

**解決策**:
1. AIデベロッパーで確認:
   ```
   SVGアイコンが表示されません。
   コードを確認してください。
   ```
2. AIが修正

---

#### エラー: レイアウトが崩れている

**症状**:
- 要素が重なっている
- 余白がおかしい

**原因**:
- Tailwind クラスが間違っている

**解決策**:
1. ブラウザの開発者ツールを開く（F12）
2. Elements タブで要素を確認
3. Styles タブでクラスを確認
4. AIデベロッパーで修正依頼:
   ```
   以下の要素のレイアウトが崩れています：
   （スクリーンショットまたは説明）
   
   修正をお願いします。
   ```

---

### デバッグのヒント

#### 1. ブラウザの開発者ツールを使う

**開き方**: F12 または 右クリック → 検証

**確認する箇所**:
- **Console タブ**: JavaScriptエラーを確認
- **Network タブ**: APIリクエストの成功/失敗を確認
- **Elements タブ**: HTML/CSSを確認

#### 2. Render のログを確認

**手順**:
1. Render ダッシュボード
2. Web Service を開く
3. Logs タブをクリック
4. エラーメッセージを確認

#### 3. Render Shell でデバッグ

**手順**:
1. Render ダッシュボード
2. Web Service を開く
3. Shell タブをクリック
4. コマンドを実行:
   ```bash
   # ディレクトリ確認
   pwd
   ls -la
   
   # 環境変数確認
   echo $DATABASE_URL
   echo $JWT_SECRET
   
   # データベース確認
   psql $DATABASE_URL -c "SELECT * FROM \"User\";"
   
   # ログ確認
   cd server
   cat logs/*.log
   ```

#### 4. AIデベロッパーでデバッグ

**手順**:
1. エラーメッセージをコピー
2. AIデベロッパーのチャットに貼り付け:
   ```
   以下のエラーが発生しています：
   （エラーメッセージ）
   
   原因と解決策を教えてください。
   ```
3. AIが診断と修正案を提示

---

### 緊急時の対処法

#### 完全にやり直す場合

**手順**:
1. Render で Web Service を削除
2. Render で PostgreSQL を削除（データが消えます）
3. スライド9から再開

#### データベースのみリセット

**手順**:
```bash
# Render Shell で実行
cd server

# すべてのテーブルを削除
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# マイグレーション実行
npx prisma migrate deploy

# シード実行
npx prisma db seed
```

---

### サポート情報

#### 公式ドキュメント
- **Render**: https://render.com/docs
- **Prisma**: https://www.prisma.io/docs
- **React**: https://react.dev
- **Express**: https://expressjs.com

#### コミュニティ
- **Render Community**: https://community.render.com
- **Stack Overflow**: https://stackoverflow.com

#### AIデベロッパーサポート
- チャットで質問する
- エラーメッセージを共有する
- スクリーンショットを共有する

---

## 🎉 完了！

このチュートリアルを完了すれば、ワークショップ管理システムが完全に動作します！

何か問題があれば、このスライドのトラブルシューティングを参照するか、AIデベロッパーに質問してください。

**Happy Learning! 🚀✨**
