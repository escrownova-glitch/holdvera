import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const tokenValue = params.token.toUpperCase();

    // Try to find by inviteCode first (short code), then by inviteToken (legacy)
    let transaction = await prisma.transaction.findUnique({
      where: { inviteCode: tokenValue },
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

    // Fallback to inviteToken for legacy links
    if (!transaction) {
      transaction = await prisma.transaction.findUnique({
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
    }

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
        inviteCode: (transaction as any).inviteCode,
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
