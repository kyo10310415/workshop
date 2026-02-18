# 管理画面でのユーザーパスワード変更機能

## 概要
管理者がユーザー管理画面から各ユーザーのパスワードを変更できる機能を追加しました。

## 実装内容

### バックエンド

#### 新規APIエンドポイント
```
PUT /admin/users/:id/password
```

**リクエストボディ:**
```json
{
  "password": "新しいパスワード(6文字以上)"
}
```

**レスポンス:**
```json
{
  "message": "Password updated successfully"
}
```

**エラーレスポンス:**
- 400: パスワードが6文字未満
- 401: 認証エラー
- 403: 管理者権限がない
- 500: サーバーエラー

#### 実装ファイル
- `server/src/controllers/userController.ts` - `updateUserPassword` 関数を追加
- `server/src/routes/users.ts` - パスワード更新ルートを追加

#### セキュリティ
- bcryptでパスワードをハッシュ化（saltラウンド: 10）
- 管理者のみがアクセス可能（`requireAdmin` ミドルウェア）
- 最小パスワード長: 6文字

### フロントエンド

#### UI追加
- ユーザー一覧の各行に「パスワード変更」ボタンを追加
- モーダルウィンドウでパスワード入力フォームを表示
- 変更対象のユーザー名を表示
- 入力バリデーション: 6文字以上

#### 実装ファイル
- `client/src/pages/admin/AdminUsers.tsx`
  - `PasswordModalState` インターフェイスを追加
  - `passwordModal` ステートを追加
  - `openPasswordModal`, `closePasswordModal`, `handlePasswordUpdate` 関数を追加
  - モーダルUIを追加

## 使い方

### 管理者の操作手順
1. 管理画面の「ユーザー管理」ページにアクセス
2. パスワードを変更したいユーザーの行で「パスワード変更」ボタンをクリック
3. モーダルが開き、対象ユーザー名が表示される
4. 新しいパスワードを入力（6文字以上）
5. 「更新」ボタンをクリック
6. 成功メッセージが表示される

### 注意事項
- パスワード変更後、ユーザーには通知されません（必要に応じて別途連絡が必要）
- 変更したパスワードは管理者にも表示されません（セキュリティ上の理由）
- パスワードは即座に更新され、次回ログイン時から有効

## デプロイ

### Render環境でのデプロイ手順
1. **GitHub経由で自動デプロイ**
   - Renderは自動的に最新のコミットを検知してデプロイを開始します
   
2. **手動デプロイの場合**
   - Renderダッシュボードにログイン
   - `workshop-management-system` サービスを選択
   - 「Manual Deploy」→「Deploy latest commit」をクリック
   - ビルドとデプロイの完了を待つ（3-5分）

3. **デプロイ確認**
   - サーバーログで `Server running on port 5000` を確認
   - ブラウザでキャッシュクリア（Ctrl+Shift+R）
   - 管理画面のユーザー管理ページで「パスワード変更」ボタンが表示されることを確認

4. **機能テスト**
   - テストユーザーのパスワードを変更
   - 一度ログアウト
   - 新しいパスワードでログインできることを確認

## Git情報
- **Commit**: `71ae52b` - "feat: Add password change functionality for admin users"
- **変更ファイル**: 3ファイル (+113行, -1行)
  - `server/src/controllers/userController.ts`
  - `server/src/routes/users.ts`
  - `client/src/pages/admin/AdminUsers.tsx`
- **リポジトリ**: https://github.com/kyo10310415/workshop

## 本番URL
https://workshop-management-system-wp6s.onrender.com

## トラブルシューティング

### 「パスワード変更」ボタンが表示されない
- ブラウザのキャッシュをクリア（Ctrl+Shift+R）
- 管理者権限でログインしているか確認

### パスワード更新時にエラーが表示される
- パスワードが6文字以上か確認
- サーバーログでエラー内容を確認
- ネットワーク接続を確認

### ユーザーが新しいパスワードでログインできない
- パスワード変更が正常に完了したか確認（成功メッセージが表示されたか）
- スペースなどの余分な文字が入力されていないか確認
- 大文字・小文字を間違えていないか確認
