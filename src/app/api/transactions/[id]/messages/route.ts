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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        creatorId: true,
        counterpartyId: true,
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

    // Determine receiver
    const receiverId = isCreator ? transaction.counterpartyId : transaction.creatorId;

    if (!receiverId) {
      return NextResponse.json({ error: 'No counterparty to message' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        transactionId: transaction.id,
        senderId: user.userId,
        receiverId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
