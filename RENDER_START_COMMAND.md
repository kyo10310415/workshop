# Render Start Command（Seed なし版）

## 推奨 Start Command

```bash
cd server && npx prisma migrate deploy && npm start
```

**重要**: Seedスクリプトを削除しました。初回デプロイ後、以下の方法でデータを作成できます。

## デプロイ後の初期データ作成方法

### 方法1: Render Shellを使用（推奨）

1. Renderダッシュボード → Web Service → 「Shell」タブ
2. 以下のコマンドを実行：

```bash
cd server
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

(async () => {
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });
  
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Test User',
      role: 'USER'
    }
  });
  
  await prisma.workshop.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'はじめてのワークショップ',
      description: 'これはサンプルのワークショップです。',
      isPublic: true
    }
  });
  
  console.log('Seed completed!');
  await prisma.\$disconnect();
})();
"
```

### 方法2: 管理者UIから作成

1. アプリにログイン（まだユーザーがない場合は、方法1を使用）
2. 管理者画面からユーザーとワークショップを作成

### 方法3: マイグレーションファイルにSQLを追加

`server/prisma/migrations/`に新しいマイグレーションファイルを作成して、初期データをINSERT。

## 元のStart Command（参考）

もしSeedが動作するようになったら、以下を使用：

```bash
cd server && npx prisma migrate deploy && node prisma/seed.js && npm start
```
