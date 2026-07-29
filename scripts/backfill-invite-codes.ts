import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function main() {
  const transactions = await prisma.transaction.findMany({
    where: { inviteCode: null },
  });

  console.log(`Found ${transactions.length} transactions without invite codes`);

  for (const tx of transactions) {
    let code = generateInviteCode();
    let exists = await prisma.transaction.findUnique({ where: { inviteCode: code } });
    while (exists) {
      code = generateInviteCode();
      exists = await prisma.transaction.findUnique({ where: { inviteCode: code } });
    }

    await prisma.transaction.update({
      where: { id: tx.id },
      data: { inviteCode: code },
    });
    console.log(`Updated ${tx.transactionId} with code ${code}`);
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
