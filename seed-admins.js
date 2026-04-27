const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123',
    },
  });

  await prisma.admin.upsert({
    where: { username: 'admin2' },
    update: {},
    create: {
      username: 'admin2',
      password: 'admin123',
    },
  });

  console.log('Admins seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
