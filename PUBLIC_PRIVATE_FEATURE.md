# eラーニング公開/非公開機能

## 機能概要

eラーニング管理画面で公開/非公開を切り替えることで、ユーザー画面での表示を制御できます。

## 動作仕様

### 管理者画面（eラーニング管理）
- **すべてのeラーニングが表示される**（公開/非公開に関わらず）
- 公開状態が以下のバッジで表示される：
  - 🌐 公開中（緑色）: ユーザーが閲覧可能
  - 🔒 非公開（グレー）: 管理者のみ閲覧可能
- バッジをクリックすることで公開/非公開を切り替え可能

### ユーザー画面（eラーニング一覧）
- **公開中（isPublic = true）のeラーニングのみ表示される**
- 非公開のeラーニングは一覧に表示されない
- 管理者でログインした場合でも、ユーザー画面ではすべて表示される

## 実装詳細

### バックエンド（workshopController.ts）

```typescript
export const getWorkshops = async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user?.role === 'ADMIN';
  const userId = req.user!.id;

  const workshops = await prisma.workshop.findMany({
    where: isAdmin ? {} : { isPublic: true },  // ← ここで制御
    include: {
      materials: true,
      progresses: {
        where: { userId }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.json({ workshops });
};
```

**動作**:
- 管理者（`isAdmin = true`）: `where: {}` → すべて取得
- 一般ユーザー（`isAdmin = false`）: `where: { isPublic: true }` → 公開のみ取得

### フロントエンド（AdminWorkshops.tsx）

**公開/非公開トグルボタン**:
```typescript
const togglePublic = async (id: number, currentStatus: boolean) => {
  await api.put(`/admin/workshops/${id}`, { isPublic: !currentStatus });
  fetchWorkshops();
};
```

**表示バッジ**:
```tsx
<button
  onClick={() => togglePublic(workshop.id, workshop.isPublic)}
  className={workshop.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
>
  {workshop.isPublic ? '🌐 公開中' : '🔒 非公開'}
</button>
```

## 使い方

### 1. eラーニングを非公開にする

1. 管理画面の「eラーニング管理」を開く
2. 該当のeラーニングの「🌐 公開中」バッジをクリック
3. 「🔒 非公開」に変わる
4. ユーザー画面のeラーニング一覧から消える

### 2. eラーニングを公開する

1. 管理画面の「eラーニング管理」を開く
2. 該当のeラーニングの「🔒 非公開」バッジをクリック
3. 「🌐 公開中」に変わる
4. ユーザー画面のeラーニング一覧に表示される

### 3. 新規作成時の初期状態

- デフォルトは**非公開**（`isPublic: false`）
- 作成フォームで「公開する」にチェックを入れると公開状態で作成される

## 注意事項

### セキュリティ
- 非公開のeラーニングは、URLを直接知っていても一般ユーザーはアクセスできません
- バックエンドで`isPublic`チェックが行われているため安全です

### 管理者の動作
- 管理者が「トップページに戻る」でユーザー画面に移動すると、**すべてのeラーニングが表示される**
- これは意図的な動作（管理者は全体を確認可能にするため）
- 管理者でも非公開設定は機能する（一般ユーザーには見えない）

### よくある質問

**Q: 管理者でログインしているのに、ユーザー画面で非公開のeラーニングが表示される**
A: 仕様です。管理者は常にすべてのeラーニングを確認できます。

**Q: 非公開にしたのに、まだ表示される**
A: ブラウザのキャッシュをクリア（Ctrl+Shift+R）してください。

**Q: 複数のeラーニングを一括で公開/非公開にしたい**
A: 現在は個別にバッジをクリックする必要があります。

## テスト手順

### 1. 非公開設定のテスト
1. 管理者でログイン
2. eラーニング管理で「はじめてのワークショップ」を非公開にする
3. ログアウト
4. 一般ユーザーでログイン
5. ✅ eラーニング一覧に「はじめてのワークショップ」が表示されない

### 2. 公開設定のテスト
1. 管理者でログイン
2. eラーニング管理で非公開のeラーニングを公開にする
3. ログアウト
4. 一般ユーザーでログイン
5. ✅ eラーニング一覧に該当のeラーニングが表示される

### 3. URLアクセステスト
1. 管理者でログイン
2. eラーニングを非公開にする
3. そのeラーニングの詳細ページURLをコピー
4. ログアウトして一般ユーザーでログイン
5. コピーしたURLにアクセス
6. ✅ アクセスが拒否される（404 or 403エラー）

## 本番環境URL
https://workshop-management-system-wp6s.onrender.com
