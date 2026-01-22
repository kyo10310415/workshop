# 🚨 緊急修正：CORS設定エラー

## 問題

環境変数 `FRONTEND_URL` が間違っているため、CORSエラーが発生しています。

### 現在の設定（間違い）
```
FRONTEND_URL=https://workshop-management-system.onrender.com
```

### 正しい設定
```
FRONTEND_URL=https://workshop-management-system-wp6s.onrender.com
```

---

## 修正手順

### 1. Renderダッシュボードにアクセス
- https://render.com/
- あなたのWeb Service（workshop-management-system-wp6s）を選択

### 2. Environment タブを開く
- 左側のメニューから「**Environment**」をクリック

### 3. FRONTEND_URL を編集
- `FRONTEND_URL` の右側にある「**Edit**」ボタンをクリック
- 値を以下に変更：
  ```
  https://workshop-management-system-wp6s.onrender.com
  ```
- 「**Save**」をクリック

### 4. サービスを再起動
- 環境変数を変更すると自動的に再デプロイが開始される
- または、手動で「Manual Deploy」→「Deploy latest commit」

---

## 期待される結果

修正後、以下のように動作します：

1. ✅ ログイン画面が正常に表示される
2. ✅ ログインが成功する
3. ✅ CORSエラーが解消される
4. ✅ APIリクエストが正常に動作する

---

## 確認方法

修正後、ブラウザの開発者ツール（F12）で確認：

1. **Network タブ**を開く
2. `/api/auth/me` リクエストを確認
3. Response Headers に以下が含まれていることを確認：
   ```
   access-control-allow-origin: https://workshop-management-system-wp6s.onrender.com
   ```

---

## トラブルシューティング

もし環境変数が見つからない場合：

1. 「Environment」タブで「**Add Environment Variable**」をクリック
2. 以下を追加：
   - Key: `FRONTEND_URL`
   - Value: `https://workshop-management-system-wp6s.onrender.com`
3. 保存して再デプロイ

---

**この修正を行ってください。これが白い画面の根本原因です！**
