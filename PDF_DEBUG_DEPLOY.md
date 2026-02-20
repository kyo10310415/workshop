# PDFページ数取得のデバッグ版デプロイ

## 変更内容

### 1. pdf-parseのバージョンダウングレード
- `pdf-parse@2.4.5` → `pdf-parse@1.1.1`
- より安定した古いバージョンを使用

### 2. 詳細なデバッグログを追加

```typescript
const getPdfParse = () => {
  try {
    const pdfParseModule = require('pdf-parse');
    console.log('pdf-parse loaded, type:', typeof pdfParseModule);
    console.log('pdf-parse.default type:', typeof pdfParseModule?.default);
    return pdfParseModule.default || pdfParseModule;
  } catch (error) {
    console.error('Failed to load pdf-parse:', error);
    return null;
  }
};
```

### 3. 遅延ロード（Lazy Loading）
- pdf-parseをアップロード時に動的にロード
- モジュールの型情報をログ出力

## Renderデプロイ手順

### 1. Clear build cache & deploy
1. Renderダッシュボード → `workshop-management-system`
2. **Settings** タブ → **Build & Deploy**
3. **「Clear build cache & deploy」**をクリック
4. デプロイ完了を待つ（5-7分）

### 2. ビルドログを確認

Logsタブで以下を確認：

```
==> Installing dependencies...
npm install
added 187 packages

==> Building...
npm run build
> rm -rf dist && tsc
Build successful

==> Starting server...
Server running on port 5000
```

### 3. PDFアップロードテスト

1. **ブラウザキャッシュクリア**（Ctrl+Shift+R）

2. **管理画面からPDFをアップロード**

3. **Renderログで詳細情報を確認**：

#### 期待されるログ（成功時）

```
=== Upload Material Debug ===
File received: test.pdf
File size: 123456
Has buffer: true
Has path: false
File saved as: 1234567890-test.pdf
Attempting to parse PDF...
pdf-parse loaded, type: function          ← 重要！
pdf-parse.default type: undefined
pdf-parse function type: function         ← 重要！
✓ PDF page count: 10                      ← 成功！
Material created: { id: 40, title: 'test.pdf', pageCount: 10 }
```

#### エラーパターン1: モジュールがロードできない

```
=== Upload Material Debug ===
...
Attempting to parse PDF...
Failed to load pdf-parse: Error: Cannot find module 'pdf-parse'
✗ pdf-parse module not available
Material created: { id: 40, title: 'test.pdf', pageCount: 0 }
```

**対処**: Render Shellで手動インストール
```bash
cd /opt/render/project/src/server
npm install pdf-parse@1.1.1
npm run build:clean
pm2 restart all
```

#### エラーパターン2: 関数として呼び出せない

```
=== Upload Material Debug ===
...
Attempting to parse PDF...
pdf-parse loaded, type: object            ← function ではない
pdf-parse.default type: undefined
pdf-parse function type: object           ← function ではない
✗ Failed to parse PDF: TypeError: pdfParse is not a function
Material created: { id: 40, title: 'test.pdf', pageCount: 0 }
```

**対処**: 別のPDF解析ライブラリを検討（pdf-lib など）

#### エラーパターン3: PDFパース自体が失敗

```
=== Upload Material Debug ===
...
Attempting to parse PDF...
pdf-parse loaded, type: function
pdf-parse.default type: undefined
pdf-parse function type: function
✗ Failed to parse PDF: Error: Invalid PDF structure
Error details: { message: 'Invalid PDF structure', stack: '...' }
Material created: { id: 40, title: 'test.pdf', pageCount: 0 }
```

**対処**: 
- 別のPDFファイルで試す
- Google Docsから生成したシンプルなPDFで試す
- PDFのバージョンや暗号化を確認

## トラブルシューティング

### 問題: pdf-parse loaded, type: object

**原因**: pdf-parseモジュールが関数ではなくオブジェクトとしてロードされている

**解決策A**: pdf-libに切り替え
```bash
npm install pdf-lib
```

**解決策B**: 手動でPDFページ数を入力する機能を追加

### 問題: Cannot find module 'pdf-parse'

**原因**: npm installでpdf-parseがインストールされていない

**解決策**: Render Shellで手動インストール
```bash
cd /opt/render/project/src/server
npm install pdf-parse@1.1.1
ls -la node_modules/pdf-parse  # 存在確認
npm run build:clean
```

### 問題: ビルドは成功するがランタイムでエラー

**原因**: Renderの環境でCommonJSとESModuleの互換性問題

**解決策**: 
1. package.jsonに `"type": "commonjs"` を追加
2. tsconfig.jsonで `"module": "commonjs"` を確認

## 次のステップ

### ログ確認後の対応

1. **「pdf-parse loaded, type: function」が表示される場合**
   → 成功！そのまま使用可能

2. **「pdf-parse loaded, type: object」が表示される場合**
   → pdf-libへの切り替えを検討

3. **「Failed to load pdf-parse」が表示される場合**
   → Render Shellで手動インストール

## Git情報
- Commit: 3a4852b - "fix: Add debug logging and lazy loading for pdf-parse module, downgrade to v1.1.1"
- 変更: 3ファイル (+46行, -227行)
- pdf-parse@1.1.1にダウングレード
- 詳細なデバッグログ追加

## 本番URL
https://workshop-management-system-wp6s.onrender.com

## 確認項目

デプロイ後、以下を順番に確認：

1. [ ] Renderでビルドキャッシュをクリア
2. [ ] デプロイ完了（5-7分）
3. [ ] ブラウザキャッシュクリア（Ctrl+Shift+R）
4. [ ] 新しいPDFをアップロード
5. [ ] **Renderログで「pdf-parse loaded, type:」を確認**
6. [ ] **「pdf-parse function type:」が function かを確認**
7. [ ] 「✓ PDF page count: X」が表示されるか
8. [ ] 資料一覧でページ数が正しく表示されるか

この詳細ログにより、問題の正確な原因が特定できます。
