# PDFページ数取得機能の修正

## 問題点
- PDFアップロード時にページ数が常に0に設定されていた
- 進捗バーが表示されない原因となっていた

## 修正内容

### 1. pdf-parseライブラリの追加
```bash
npm install pdf-parse @types/pdf-parse
```

### 2. materialController.ts の修正
- PDFアップロード時に pdf-parse を使ってページ数を取得
- ページ数をデータベースに保存

### 3. 既存PDFのページ数更新スクリプト
- `src/scripts/updatePageCounts.ts` を作成
- 既存のPDF資料のページ数を一括更新

## デプロイ手順

### Render環境での作業

1. **Renderダッシュボードで手動デプロイ**
   - `workshop-management-system` サービスを選択
   - **Manual Deploy** → **Deploy latest commit**
   - デプロイ完了を待つ（3-5分）

2. **Render Shellを開く**
   - Renderダッシュボード → `workshop-management-system` → **Shell**

3. **既存PDFのページ数を更新**
   ```bash
   cd /opt/render/project/src/server
   npm run update-page-counts
   ```
   
   **期待される出力:**
   ```
   Starting page count update...
   Found X PDF materials
   Updated material 1 (研修テキスト): 10 pages
   Updated material 2 (テスト): 15 pages
   Page count update completed
   ```

4. **サービス再起動**
   - Renderダッシュボードで自動的に再起動される
   - または手動で再起動: Settings → **Restart**

5. **動作確認**
   - ブラウザでキャッシュクリア（Ctrl+Shift+R）
   - eラーニング詳細ページを開く
   - 資料一覧で「X ページ」と正しく表示されることを確認
   - 進捗バーが表示されることを確認

## 新規PDFアップロード時の動作
- 管理画面からPDFをアップロード
- 自動的にページ数が計算される
- データベースに保存される
- すぐに進捗バーが表示される

## トラブルシューティング

### ページ数が0のまま
- Render Shellで `npm run update-page-counts` を実行
- サーバーログを確認: `PDF page count: X` のメッセージを探す

### スクリプト実行エラー
```bash
# データベース接続確認
cd /opt/render/project/src/server
npx prisma migrate status

# エラーが出る場合は環境変数を確認
echo $DATABASE_URL
```

### 進捗バーがまだ表示されない
- ブラウザキャッシュクリア（Ctrl+Shift+R）
- データベースで確認:
  ```bash
  npx prisma studio
  # materials テーブルで pageCount を確認
  ```

## コード変更詳細

### materialController.ts
```typescript
// PDFページ数取得処理を追加
const dataBuffer = fs.readFileSync(file.path);
const pdfData = await (pdfParse as any)(dataBuffer);
pageCount = pdfData.numpages;
```

### updatePageCounts.ts
```typescript
// 全PDF資料を取得してページ数を更新
const materials = await prisma.material.findMany({
  where: { type: 'PDF', filename: { not: null } }
});

for (const material of materials) {
  const dataBuffer = fs.readFileSync(filepath);
  const pdfData = await (pdfParse as any)(dataBuffer);
  await prisma.material.update({
    where: { id: material.id },
    data: { pageCount: pdfData.numpages }
  });
}
```

## 確認項目
- [ ] pdf-parseがインストールされている
- [ ] サーバーがビルドされている
- [ ] Renderにデプロイされている
- [ ] updatePageCountsスクリプトが実行されている
- [ ] 資料一覧でページ数が正しく表示される
- [ ] 進捗バーが表示される
- [ ] 新規PDFアップロード時にページ数が自動取得される
