import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdminOrAgent } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://holdvera.site';

export async function POST(
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
      if (!permissions.canSendMessages) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
    }

    const body = await request.json();
    const { content } = body;

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

    // Create single message (broadcast to all in transaction)
    const message = await prisma.message.create({
      data: {
        transactionId: params.id,
        senderId: admin.id,
        receiverId: null, // Broadcast message
        content: `[HOLDVERA SUPPORT] ${content}`,
      },
      include: {
        sender: {
          select: { firstName: true, lastName: true, email: true, role: true },
        },
      },
    });

    // Send email notifications to both parties
    const recipients = [transaction.creator];
    if (transaction.counterparty) {
      recipients.push(transaction.counterparty);
    }

    for (const recipient of recipients) {
      await sendEmail({
        to: recipient.email,
        subject: `New message from HoldVera Support - ${transaction.title}`,
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
                <h2>New Message from Support</h2>
                <p>Hello ${recipient.firstName},</p>
                <p>HoldVera Support has sent a message regarding your transaction <strong>"${transaction.title}"</strong>:</p>

                <div class="message-box">
                  <p style="margin: 0;">${content}</p>
                </div>

                <p style="text-align: center; margin: 30px 0;">
                  <a href="${APP_URL}/dashboard/transactions/${transaction.id}" class="button">View Transaction</a>
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

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Admin send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
