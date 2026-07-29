import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdminOrAgent, parseAgentPermissions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdminOrAgent(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check agent permissions
    if (admin.role === 'AGENT') {
      const permissions = parseAgentPermissions(admin.agentPermissions);
      if (!permissions.canViewTransactions) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { transactionId: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { counterpartyEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            kycStatus: true,
          },
        },
        counterparty: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            kycStatus: true,
          },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        documents: true,
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get stats
    const stats = await prisma.transaction.groupBy({
      by: ['status'],
      _count: true,
      _sum: { amount: true },
    });

    const totalValue = await prisma.transaction.aggregate({
      _sum: { amount: true },
    });

    return NextResponse.json({
      transactions,
      stats: {
        total: transactions.length,
        totalValue: totalValue._sum.amount || 0,
        pending: stats.find(s => s.status === 'PENDING_ACCEPTANCE')?._count || 0,
        active: stats.find(s => s.status === 'ACTIVE')?._count || 0,
        completed: stats.find(s => s.status === 'COMPLETED')?._count || 0,
        cancelled: stats.find(s => s.status === 'CANCELLED')?._count || 0,
      },
    });
  } catch (error) {
    console.error('Admin transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
