import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'holdvera-secret';

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        counterparty: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            senderId: true,
            isSystem: true,
            createdAt: true,
            sender: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        timeline: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Check if user is part of this transaction
    const isCreator = transaction.creatorId === user.userId;
    const isCounterparty = transaction.counterpartyId === user.userId;

    if (!isCreator && !isCounterparty) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
}
