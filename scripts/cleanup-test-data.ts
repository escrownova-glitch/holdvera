import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Keep CEO account, delete all other users and their data
  const ceoEmail = 'ceo@holdvera.site';

  // Get all non-CEO users
  const usersToDelete = await prisma.user.findMany({
    where: { email: { not: ceoEmail } },
    select: { id: true, email: true, role: true },
  });

  console.log(`Found ${usersToDelete.length} users to delete:`);
  usersToDelete.forEach(u => console.log(`  - ${u.email} (${u.role})`));

  // Delete transactions and related data
  const transactions = await prisma.transaction.findMany({
    select: { id: true, transactionId: true },
  });
  console.log(`\nDeleting ${transactions.length} transactions...`);

  for (const tx of transactions) {
    await prisma.timelineEvent.deleteMany({ where: { transactionId: tx.id } });
    await prisma.message.deleteMany({ where: { transactionId: tx.id } });
    await prisma.document.deleteMany({ where: { transactionId: tx.id } });
    await prisma.transactionImage.deleteMany({ where: { transactionId: tx.id } });
    await prisma.transaction.delete({ where: { id: tx.id } });
    console.log(`  Deleted: ${tx.transactionId}`);
  }

  // Delete messages without transactions
  await prisma.message.deleteMany({});
  console.log('Deleted orphan messages');

  // Delete non-CEO users
  for (const user of usersToDelete) {
    await prisma.user.delete({ where: { id: user.id } });
    console.log(`Deleted user: ${user.email}`);
  }

  console.log('\nCleanup complete! CEO account preserved.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
