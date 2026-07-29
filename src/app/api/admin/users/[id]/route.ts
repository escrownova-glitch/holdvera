import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdminOrAgent } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        createdTransactions: {
          include: {
            images: true,
            _count: { select: { messages: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        counterpartyTransactions: {
          include: {
            images: true,
            _count: { select: { messages: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Don't expose password
    const { password, ssn, ...safeUser } = user;

    return NextResponse.json({
      user: {
        ...safeUser,
        ssnLast4: ssn ? `***-**-${ssn.slice(-4)}` : null,
      },
    });
  } catch (error) {
    console.error('Admin get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
