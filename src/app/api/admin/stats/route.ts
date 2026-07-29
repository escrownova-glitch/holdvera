import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminOrAgent } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdminOrAgent(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user stats
    const totalUsers = await db.user.count({
      where: { role: 'USER' },
    });

    const pendingKYC = await db.user.count({
      where: { role: 'USER', kycStatus: 'PENDING' },
    });

    const submittedKYC = await db.user.count({
      where: { role: 'USER', kycStatus: 'SUBMITTED' },
    });

    const approvedKYC = await db.user.count({
      where: { role: 'USER', kycStatus: 'APPROVED' },
    });

    const rejectedKYC = await db.user.count({
      where: { role: 'USER', kycStatus: 'REJECTED' },
    });

    // Get transaction stats
    const totalTransactions = await db.transaction.count();

    const pendingTransactions = await db.transaction.count({
      where: { status: 'PENDING' },
    });

    const activeTransactions = await db.transaction.count({
      where: { status: 'ACTIVE' },
    });

    const completedTransactions = await db.transaction.count({
      where: { status: 'COMPLETED' },
    });

    const cancelledTransactions = await db.transaction.count({
      where: { status: 'CANCELLED' },
    });

    // Get total value
    const totalValue = await db.transaction.aggregate({
      _sum: { amount: true },
    });

    return NextResponse.json({
      users: {
        total: totalUsers,
        pending: pendingKYC,
        submitted: submittedKYC,
        approved: approvedKYC,
        rejected: rejectedKYC,
      },
      transactions: {
        total: totalTransactions,
        totalValue: totalValue._sum.amount || 0,
        pending: pendingTransactions,
        active: activeTransactions,
        completed: completedTransactions,
        cancelled: cancelledTransactions,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
