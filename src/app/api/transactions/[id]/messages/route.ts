import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'holdvera-secret';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://holdvera.site';

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

    const sender = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { firstName: true, lastName: true },
    });

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

    // Get receiver and transaction details for email notification
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { email: true, firstName: true },
    });

    const txDetails = await prisma.transaction.findUnique({
      where: { id: transaction.id },
      select: { title: true },
    });

    // Send email notification to the other party
    if (receiver && txDetails) {
      await sendEmail({
        to: receiver.email,
        subject: `New message from ${sender?.firstName} - ${txDetails.title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a1a1a; padding: 20px; text-align: center; }
              .logo { color: #d4af37; font-size: 24px; font-weight: bold; }
              .content { padding: 30px; background: #f9f9f9; }
              .message-box { background: #fff; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">HOLD<span style="color:#fff">VERA</span></div>
              </div>
              <div class="content">
                <h2>New Message</h2>
                <p>Hello ${receiver.firstName},</p>
                <p><strong>${sender?.firstName}</strong> sent you a message regarding <strong>"${txDetails.title}"</strong>:</p>

                <div class="message-box">
                  <p style="margin: 0;">${content.trim()}</p>
                </div>

                <p style="text-align: center; margin: 30px 0;">
                  <a href="${APP_URL}/dashboard/transactions/${transaction.id}" class="button">Reply Now</a>
                </p>

                <p>Best regards,<br>The HoldVera Team</p>
              </div>
              <div class="footer">
                <p>© 2026 HoldVera. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    }

    // Also notify admin of new message
    await sendEmail({
      to: 'ceo@holdvera.site',
      subject: `[CHAT] New message in: ${txDetails?.title}`,
      html: `
        <p><strong>From:</strong> ${sender?.firstName} ${sender?.lastName}</p>
        <p><strong>Transaction:</strong> ${txDetails?.title}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 3px solid #d4af37; padding-left: 15px; margin: 10px 0;">${content.trim()}</blockquote>
        <p><a href="${APP_URL}/admin/transactions/${transaction.id}">View in Admin Panel</a></p>
      `,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
