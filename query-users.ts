import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      kycStatus: true,
      verified: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}
main();
