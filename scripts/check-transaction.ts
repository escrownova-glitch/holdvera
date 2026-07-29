import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tx = await prisma.transaction.findFirst({
    select: {
      id: true,
      transactionId: true,
      inviteToken: true,
      inviteCode: true,
      title: true,
      inviteAccepted: true,
    }
  });

  console.log('Transaction found:');
  console.log(JSON.stringify(tx, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
