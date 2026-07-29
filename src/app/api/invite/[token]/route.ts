import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { inviteToken: params.token },
      include: {
        creator: {
          select: { firstName: true, lastName: true, email: true },
        },
        images: {
          orderBy: { order: 'asc' },
          select: { url: true },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    if (transaction.inviteAccepted) {
      return NextResponse.json(
        { error: 'This invitation has already been accepted' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      transaction: {
        id: transaction.id,
        transactionId: transaction.transactionId,
        title: transaction.title,
        description: transaction.description,
        amount: transaction.amount,
        currency: transaction.currency,
        creatorRole: transaction.creatorRole,
        inspectionDays: transaction.inspectionDays,
        status: transaction.status,
        creator: transaction.creator,
        counterpartyName: transaction.counterpartyName,
        counterpartyEmail: transaction.counterpartyEmail,
        images: transaction.images,
      },
    });
  } catch (error) {
    console.error('Get invite error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitation' },
      { status: 500 }
    );
  }
}
