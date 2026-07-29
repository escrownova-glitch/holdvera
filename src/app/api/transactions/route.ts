import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import {
  sendEscrowInviteEmail,
  sendTransactionCreatedEmail,
  sendAdminNotificationEmail
} from '@/lib/email';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'holdvera-secret';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://holdvera.site';

// Generate short 8-char invite code (uppercase alphanumeric, easy to read/type)
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I/O/0/1 to avoid confusion
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

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

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      role,
      counterpartyEmail,
      counterpartyName,
      amount,
      currency,
      inspectionDays,
      terms,
      images, // array of base64 or URLs
    } = body;

    // Generate transaction ID
    const transactionId = `HV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Calculate fees
    const amountNum = parseFloat(amount);
    const escrowFee = amountNum * 0.029;
    const totalAmount = amountNum + escrowFee;

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    let codeExists = await prisma.transaction.findUnique({ where: { inviteCode } });
    while (codeExists) {
      inviteCode = generateInviteCode();
      codeExists = await prisma.transaction.findUnique({ where: { inviteCode } });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        transactionId,
        title,
        description,
        type: role === 'buyer' ? 'PURCHASE' : 'SALE',
        creatorRole: role,
        creatorId: user.userId,
        counterpartyEmail,
        counterpartyName,
        amount: amountNum,
        currency: currency || 'USD',
        inspectionDays: parseInt(inspectionDays) || 3,
        terms: terms || null,
        escrowFee,
        totalAmount,
        status: 'PENDING_ACCEPTANCE',
        inviteCode,
      },
      include: {
        creator: true,
      },
    });

    // Store images if provided
    if (images && images.length > 0) {
      const imageRecords = images.map((url: string, index: number) => ({
        transactionId: transaction.id,
        url,
        order: index,
      }));

      await prisma.transactionImage.createMany({
        data: imageRecords,
      });
    }

    // Create timeline event
    await prisma.timelineEvent.create({
      data: {
        transactionId: transaction.id,
        event: 'CREATED',
        description: `Escrow transaction created by ${transaction.creator.firstName} ${transaction.creator.lastName}`,
      },
    });

    const inviteLink = `${APP_URL}/invite/${transaction.inviteCode}`;
    const formattedAmount = `$${amountNum.toLocaleString()} ${currency || 'USD'}`;
    const creatorFullName = `${transaction.creator.firstName} ${transaction.creator.lastName}`;

    // Send emails
    await Promise.all([
      // Email to counterparty
      sendEscrowInviteEmail(
        counterpartyEmail,
        counterpartyName,
        creatorFullName,
        title,
        formattedAmount,
        transaction.inviteCode!
      ),
      // Email to creator
      sendTransactionCreatedEmail(
        transaction.creator.email,
        creatorFullName,
        transactionId,
        title,
        counterpartyName,
        formattedAmount,
        inviteLink
      ),
      // Email to admin
      sendAdminNotificationEmail(
        transactionId,
        title,
        creatorFullName,
        transaction.creator.email,
        counterpartyName,
        counterpartyEmail,
        amountNum.toLocaleString()
      ),
    ]);

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        transactionId: transaction.transactionId,
        inviteToken: transaction.inviteToken,
        inviteCode: transaction.inviteCode,
        inviteLink,
      },
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { creatorId: user.userId },
          { counterpartyId: user.userId },
        ],
      },
      include: {
        creator: {
          select: { firstName: true, lastName: true, email: true },
        },
        counterparty: {
          select: { firstName: true, lastName: true, email: true },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
