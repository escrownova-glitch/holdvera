import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Delete the two test users
  const deleted = await prisma.user.deleteMany({
    where: {
      email: {
        in: ['dead1x_x@proton.me', 'anthonykochanski101@gmail.com']
      }
    }
  });
  console.log(`Deleted ${deleted.count} users`);
  
  // Show remaining users
  const remaining = await prisma.user.findMany({
    select: { email: true, firstName: true, lastName: true, role: true }
  });
  console.log('Remaining users:', remaining);
  
  await prisma.$disconnect();
}
main();
