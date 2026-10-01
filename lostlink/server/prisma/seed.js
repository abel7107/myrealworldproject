import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create categories
  const categories = ['Electronics', 'Documents', 'Bags', 'Keys', 'Clothing', 'Jewelry', 'Accessories', 'Other'];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@lostlink.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@lostlink.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      phone: '+251911000000',
    },
  });

  // Create demo user
  const userPassword = await bcrypt.hash('user123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'abebe@example.com' },
    update: {},
    create: {
      name: 'Abebe Kebede',
      email: 'abebe@example.com',
      passwordHash: userPassword,
      role: 'USER',
      phone: '+251911111111',
    },
  });

  // Get category IDs
  const electronics = await prisma.category.findUnique({ where: { name: 'Electronics' } });
  const bags = await prisma.category.findUnique({ where: { name: 'Bags' } });
  const keys = await prisma.category.findUnique({ where: { name: 'Keys' } });

  // Create sample items
  const items = [
    { title: 'iPhone 13', type: 'LOST', location: 'Dire Dawa', description: 'Black iPhone 13 with transparent case', categoryId: electronics.id, ownerId: demoUser.id, dateLostOrFound: new Date('2026-09-30') },
    { title: 'Black Backpack', type: 'FOUND', location: 'Addis Ababa', description: 'Found near bus station', categoryId: bags.id, ownerId: demoUser.id, dateLostOrFound: new Date('2026-09-29') },
    { title: 'Car Keys', type: 'LOST', location: 'Dire Dawa', description: 'Toyota car keys with remote', categoryId: keys.id, ownerId: demoUser.id, dateLostOrFound: new Date('2026-09-28') },
  ];

  for (const item of items) {
    await prisma.item.create({ data: item });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });