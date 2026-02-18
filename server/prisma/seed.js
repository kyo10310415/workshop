require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });
  console.log('Created admin user:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Test User',
      role: 'USER'
    }
  });
  console.log('Created test user:', user.email);

  // Check if sample workshop already exists
  const existingWorkshop = await prisma.workshop.findFirst({
    where: { title: 'はじめてのワークショップ' }
  });

  if (!existingWorkshop) {
    const workshop = await prisma.workshop.create({
      data: {
        title: 'はじめてのワークショップ',
        description: 'これはサンプルのワークショップです。PDFをアップロードして使い始めましょう。',
        isPublic: true
      }
    });
    console.log('Created sample workshop:', workshop.title);
  } else {
    console.log('Sample workshop already exists, skipping...');
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
