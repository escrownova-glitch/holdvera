import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { id: 'cms62hzo4000018u6tsruis5a' },
    select: { id: true, email: true, firstName: true, lastName: true }
  });
  console.log('User:', user);
  await prisma.$disconnect();
}
main();
