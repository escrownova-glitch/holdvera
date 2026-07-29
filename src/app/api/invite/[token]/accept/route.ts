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
  { params }: { params: { token: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tokenValue = params.token.toUpperCase();

    // Try to find by inviteCode first (short code), then by inviteToken (legacy)
    let transaction = await prisma.transaction.findUnique({
      where: { inviteCode: tokenValue },
      include: { creator: true },
    });

    if (!transaction) {
      transaction = await prisma.transaction.findUnique({
        where: { inviteToken: params.token },
        include: { creator: true },
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

    // Get the accepting user
    const acceptingUser = await prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!acceptingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check KYC status - must be approved to accept transactions
    if (acceptingUser.kycStatus !== 'APPROVED') {
      return NextResponse.json(
        {
          error: 'KYC verification required',
          requiresKYC: true,
          kycStatus: acceptingUser.kycStatus,
        },
        { status: 403 }
      );
    }

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        counterpartyId: user.userId,
        inviteAccepted: true,
        inviteAcceptedAt: new Date(),
        status: 'ACTIVE',
      },
    });

    // Create timeline event
    await prisma.timelineEvent.create({
      data: {
        transactionId: transaction.id,
        event: 'INVITE_ACCEPTED',
        description: `${acceptingUser.firstName} ${acceptingUser.lastName} joined the transaction`,
      },
    });

    // Create system welcome message in chat
    const creatorRole = transaction.creatorRole === 'buyer' ? 'Buyer' : 'Seller';
    const counterpartyRole = transaction.creatorRole === 'buyer' ? 'Seller' : 'Buyer';

    await prisma.message.create({
      data: {
        transactionId: transaction.id,
        senderId: null, // System message
        receiverId: null, // Broadcast to all
        isSystem: true,
        content: `Welcome to your HoldVera Escrow Transaction!

**Participants:**
- ${transaction.creator.firstName} ${transaction.creator.lastName} (${creatorRole})
- ${acceptingUser.firstName} ${acceptingUser.lastName} (${counterpartyRole})

**Transaction Details:**
- Title: ${transaction.title}
- Amount: $${transaction.amount.toLocaleString()} ${transaction.currency}
- Inspection Period: ${transaction.inspectionDays} days

This chat is monitored by HoldVera support to ensure a safe and secure transaction. All communications regarding this escrow should take place here.

Please coordinate the next steps and feel free to reach out if you have any questions!

— HoldVera Team`,
      },
    });

    // Send notification emails
    const creatorName = `${transaction.creator.firstName} ${transaction.creator.lastName}`;
    const counterpartyName = `${acceptingUser.firstName} ${acceptingUser.lastName}`;

    // Notify creator that invite was accepted
    await sendEmail({
      to: transaction.creator.email,
      subject: `${counterpartyName} accepted your escrow invitation - HoldVera`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; padding: 30px; text-align: center; }
            .logo { color: #d4af37; font-size: 28px; font-weight: bold; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">HOLD<span style="color:#fff">VERA</span></div>
            </div>
            <div class="content">
              <div class="success-box">
                <strong>✅ Great news!</strong> ${counterpartyName} has accepted your escrow invitation.
              </div>

              <h2>Transaction is Now Active</h2>
              <p>Hello ${creatorName},</p>
              <p>Your escrow transaction <strong>"${transaction.title}"</strong> is now active. Both parties are connected and can communicate securely.</p>

              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Use the secure chat to coordinate with ${counterpartyName}</li>
                <li>Follow the agreed terms for delivery/payment</li>
                <li>Confirm completion when ready</li>
              </ol>

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

    // Notify admin
    await sendEmail({
      to: 'ceo@holdvera.site',
      subject: `[ADMIN] Escrow Accepted: ${transaction.title}`,
      html: `
        <h2>Escrow Transaction Activated</h2>
        <p><strong>Transaction:</strong> ${transaction.transactionId}</p>
        <p><strong>Title:</strong> ${transaction.title}</p>
        <p><strong>Amount:</strong> $${transaction.amount.toLocaleString()} ${transaction.currency}</p>
        <p><strong>Creator:</strong> ${creatorName} (${transaction.creator.email})</p>
        <p><strong>Counterparty:</strong> ${counterpartyName} (${acceptingUser.email})</p>
        <p><strong>Status:</strong> ACTIVE</p>
        <p><a href="${APP_URL}/admin/transactions/${transaction.id}">View in Admin Panel</a></p>
      `,
    });

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error('Accept invite error:', error);
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}
