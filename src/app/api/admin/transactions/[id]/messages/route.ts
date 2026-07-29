import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, recipientId } = body;

    if (!content) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        creator: true,
        counterparty: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // If no specific recipient, send to both parties
    const recipients = recipientId
      ? [recipientId]
      : [transaction.creatorId, transaction.counterpartyId].filter(Boolean);

    const messages = [];
    for (const receiverId of recipients) {
      if (receiverId) {
        const message = await prisma.message.create({
          data: {
            transactionId: params.id,
            senderId: admin.id,
            receiverId,
            content: `[HOLDVERA SUPPORT] ${content}`,
          },
          include: {
            sender: {
              select: { firstName: true, lastName: true, email: true, role: true },
            },
          },
        });
        messages.push(message);
      }
    }

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Admin send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
