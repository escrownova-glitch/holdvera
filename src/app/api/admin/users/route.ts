import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdminOrAgent } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdminOrAgent(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check agent permissions
    if (admin.role === 'AGENT') {
      const permissions = admin.agentPermissions ? JSON.parse(admin.agentPermissions) : {};
      if (!permissions.canViewUsers) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // all, pending, approved, rejected
    const search = searchParams.get('search');

    const where: any = {
      role: 'USER', // Only show regular users, not admins
    };

    if (status && status !== 'all') {
      where.kycStatus = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        verified: true,
        createdAt: true,
        signupMethod: true,
        invitedBy: true,
        kycStatus: true,
        kycSubmittedAt: true,
        dateOfBirth: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        idType: true,
        idFrontUrl: true,
        idBackUrl: true,
        selfieUrl: true,
        _count: {
          select: {
            createdTransactions: true,
            counterpartyTransactions: true,
          },
        },
      },
    });

    // Get stats
    const stats = await prisma.user.groupBy({
      by: ['kycStatus'],
      where: { role: 'USER' },
      _count: true,
    });

    const totalUsers = await prisma.user.count({ where: { role: 'USER' } });

    return NextResponse.json({
      users,
      stats: {
        total: totalUsers,
        pending: stats.find(s => s.kycStatus === 'PENDING')?._count || 0,
        submitted: stats.find(s => s.kycStatus === 'SUBMITTED')?._count || 0,
        approved: stats.find(s => s.kycStatus === 'APPROVED')?._count || 0,
        rejected: stats.find(s => s.kycStatus === 'REJECTED')?._count || 0,
      },
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
