import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@flipkart-clone.com' },
    update: {},
    create: {
      email: 'admin@flipkart-clone.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Created admin user:', adminUser.email);

  const categories = await prisma.category.createMany({
    data: [
      { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
      { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories' },
      { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home appliances and kitchenware' },
      { name: 'Books', slug: 'books', description: 'Books and reading materials' },
      { name: 'Sports', slug: 'sports', description: 'Sports equipment and gear' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created categories:', categories.count);

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
