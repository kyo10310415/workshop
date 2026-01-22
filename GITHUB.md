# GitHub セットアップガイド

## GitHubリポジトリへのPush手順

### Step 1: GitHubでリポジトリを作成

1. GitHubにログイン: https://github.com/
2. 右上の「+」→「New repository」をクリック
3. 以下を入力：
   - **Repository name**: `workshop-management-system`
   - **Description**: `PDF資料を用いたワークショップ管理システム`
   - **Visibility**: Public または Private
   - **❌ DO NOT** initialize with README, .gitignore, or license
4. 「Create repository」をクリック

### Step 2: ローカルリポジトリをリモートに接続

```bash
# プロジェクトディレクトリに移動
cd /path/to/webapp

# リモートリポジトリを追加（<username>を自分のユーザー名に変更）
git remote add origin https://github.com/<username>/workshop-management-system.git

# リモートリポジトリを確認
git remote -v
```

### Step 3: GitHubにPush

```bash
# mainブランチをpush
git push -u origin main

# 認証が求められた場合：
# - Username: GitHubのユーザー名
# - Password: Personal Access Token（パスワードではない）
```

### Personal Access Token (PAT) の作成方法

GitHubがパスワード認証を廃止したため、Personal Access Tokenが必要です。

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」→「Generate new token (classic)」
3. 以下を設定：
   - **Note**: `Workshop Management System`
   - **Expiration**: 90 days（または無期限）
   - **Scopes**: 
     - ✅ `repo` (Full control of private repositories)
4. 「Generate token」をクリック
5. **トークンをコピー**（後で見られなくなります）

### Step 4: SSH認証の設定（推奨）

Personal Access Tokenの代わりにSSH認証を使用する方が便利です。

#### SSH鍵の生成

```bash
# SSH鍵を生成
ssh-keygen -t ed25519 -C "your_email@example.com"

# Enterを3回押す（デフォルト設定）

# 公開鍵をクリップボードにコピー
cat ~/.ssh/id_ed25519.pub
```

#### GitHubにSSH鍵を登録

1. GitHub → Settings → SSH and GPG keys → New SSH key
2. 以下を入力：
   - **Title**: `My Development Machine`
   - **Key**: コピーした公開鍵を貼り付け
3. 「Add SSH key」をクリック

#### SSH URLに変更

```bash
# リモートURLをSSHに変更
git remote set-url origin git@github.com:<username>/workshop-management-system.git

# 確認
git remote -v

# Push（認証なしでできるようになる）
git push -u origin main
```

## 日常的なGit操作

### コードを更新してPush

```bash
# 変更を確認
git status

# 全ての変更を追加
git add .

# コミット
git commit -m "Update: 機能の説明"

# Push
git push origin main
```

### コミットメッセージの書き方

良い例：
```bash
git commit -m "Add: PDF viewer component with page navigation"
git commit -m "Fix: Authentication cookie not being set correctly"
git commit -m "Update: README with deployment instructions"
git commit -m "Remove: Unused dependencies from package.json"
```

悪い例：
```bash
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

### ブランチ戦略

```bash
# 新しい機能用のブランチを作成
git checkout -b feature/pdf-viewer

# 開発...

# コミット
git add .
git commit -m "Add: PDF viewer with zoom controls"

# mainブランチに戻る
git checkout main

# 変更をマージ
git merge feature/pdf-viewer

# Push
git push origin main

# ブランチを削除
git branch -d feature/pdf-viewer
```

## GitHubリポジトリの設定

### 1. 説明文の追加

リポジトリページで「About」の歯車アイコンをクリック：
- **Description**: `PDF資料を用いたワークショップ管理システム`
- **Website**: `https://workshop-management-system.onrender.com`
- **Topics**: `workshop`, `pdf`, `education`, `typescript`, `react`, `express`, `postgresql`

### 2. README.mdの確認

GitHubで自動的にREADME.mdが表示されます。

### 3. GitHub Pagesの設定（オプション）

ドキュメントサイトを公開する場合：
1. Settings → Pages
2. Source: `main` branch, `/docs` folder
3. Save

## Renderとの連携

### 自動デプロイの有効化

1. Render Web Serviceの設定
2. 「Auto-Deploy」を有効化
3. GitHubにpushすると自動的にRenderにデプロイされる

### デプロイステータスバッジ

README.mdにデプロイステータスを表示：

```markdown
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)
```

## トラブルシューティング

### Push が rejected される

```bash
# リモートの変更を取得
git pull origin main --rebase

# 再度push
git push origin main
```

### Merge conflict

```bash
# 競合ファイルを確認
git status

# ファイルを編集して競合を解決
# <<<<<<<, =======, >>>>>>> を削除

# 解決後
git add .
git commit -m "Resolve: merge conflict"
git push origin main
```

### 間違ってコミットした場合

```bash
# 最後のコミットを取り消し（変更は保持）
git reset --soft HEAD~1

# 変更を修正

# 再度コミット
git add .
git commit -m "Fix: correct commit message"
```

## セキュリティのベストプラクティス

### .gitignoreの確認

以下がgitignoreされているか確認：
- ✅ `.env`
- ✅ `node_modules/`
- ✅ `uploads/`（PDF files）
- ✅ `dist/`, `build/`

### 機密情報のチェック

```bash
# .envファイルがコミットされていないか確認
git log --all --full-history -- "**/.env"

# もしコミットされていたら、履歴から削除
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch **/.env" \
  --prune-empty --tag-name-filter cat -- --all
```

## 参考リンク

- GitHub Docs: https://docs.github.com/
- Git公式ドキュメント: https://git-scm.com/doc
- Render Docs: https://render.com/docs
