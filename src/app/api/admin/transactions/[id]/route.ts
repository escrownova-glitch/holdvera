import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdminOrAgent } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://holdvera.site';

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
      if (!permissions.canViewTransactions) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            kycStatus: true,
            idFrontUrl: true,
            idBackUrl: true,
            selfieUrl: true,
          },
        },
        counterparty: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            kycStatus: true,
            idFrontUrl: true,
            idBackUrl: true,
            selfieUrl: true,
          },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        documents: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            isSystem: true,
            senderId: true,
            sender: {
              select: { firstName: true, lastName: true, email: true, role: true },
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

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Admin get transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdminOrAgent(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check agent permissions for transaction actions
    if (admin.role === 'AGENT') {
      const permissions = admin.agentPermissions ? JSON.parse(admin.agentPermissions) : {};
      if (!permissions.canCompleteTransactions && !permissions.canCancelTransactions) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
    }

    const body = await request.json();
    const { action, reason, notes } = body;

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

    if (action === 'cancel') {
      await prisma.transaction.update({
        where: { id: params.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelledBy: admin.id,
          cancelReason: reason || 'Cancelled by admin',
        },
      });

      await prisma.timelineEvent.create({
        data: {
          transactionId: params.id,
          event: 'CANCELLED',
          description: `Transaction cancelled by admin: ${reason || 'No reason provided'}`,
        },
      });

      // Notify both parties
      const emails = [transaction.creator.email];
      if (transaction.counterparty) {
        emails.push(transaction.counterparty.email);
      }

      for (const email of emails) {
        await sendEmail({
          to: email,
          subject: `Transaction Cancelled: ${transaction.title} - HoldVera`,
          html: `
            <h2>Transaction Cancelled</h2>
            <p>The escrow transaction "${transaction.title}" has been cancelled.</p>
            <p><strong>Reason:</strong> ${reason || 'No reason provided'}</p>
            <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
            <p>If you have questions, please contact support@holdvera.site</p>
          `,
        });
      }

      return NextResponse.json({ success: true, status: 'CANCELLED' });
    }

    if (action === 'complete') {
      await prisma.transaction.update({
        where: { id: params.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          completedBy: admin.id,
        },
      });

      await prisma.timelineEvent.create({
        data: {
          transactionId: params.id,
          event: 'COMPLETED',
          description: 'Transaction completed and funds released by admin',
        },
      });

      // Notify both parties
      const emails = [transaction.creator.email];
      if (transaction.counterparty) {
        emails.push(transaction.counterparty.email);
      }

      for (const email of emails) {
        await sendEmail({
          to: email,
          subject: `Transaction Completed: ${transaction.title} - HoldVera`,
          html: `
            <h2>🎉 Transaction Completed!</h2>
            <p>The escrow transaction "${transaction.title}" has been successfully completed.</p>
            <p><strong>Amount:</strong> $${transaction.amount.toLocaleString()} ${transaction.currency}</p>
            <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
            <p>Thank you for using HoldVera!</p>
          `,
        });
      }

      return NextResponse.json({ success: true, status: 'COMPLETED' });
    }

    if (action === 'add_note') {
      await prisma.transaction.update({
        where: { id: params.id },
        data: {
          adminNotes: notes,
        },
      });

      return NextResponse.json({ success: true });
    }

    // Mark as funded (buyer has paid the invoice)
    if (action === 'mark_funded') {
      await prisma.transaction.update({
        where: { id: params.id },
        data: {
          status: 'FUNDED',
        },
      });

      await prisma.timelineEvent.create({
        data: {
          transactionId: params.id,
          event: 'FUNDED',
          description: 'Payment received and verified by HoldVera',
        },
      });

      // Notify both parties
      const recipients = [transaction.creator];
      if (transaction.counterparty) recipients.push(transaction.counterparty);

      for (const recipient of recipients) {
        const isBuyer = (transaction.creatorRole === 'buyer' && recipient.id === transaction.creatorId) ||
                        (transaction.creatorRole === 'seller' && recipient.id === transaction.counterpartyId);

        await sendEmail({
          to: recipient.email,
          subject: `Escrow Funded: ${transaction.title} - HoldVera`,
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
                .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
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
                  <div class="success-box">
                    <h2 style="color: #155724; margin: 0;">💰 Escrow Funded!</h2>
                  </div>
                  <p>Hello ${recipient.firstName},</p>
                  <p>Great news! The escrow for <strong>"${transaction.title}"</strong> has been funded.</p>
                  <p><strong>Amount:</strong> $${transaction.amount.toLocaleString()} ${transaction.currency}</p>
                  ${isBuyer
                    ? '<p>Your payment has been received and is now held securely in escrow. The seller can proceed with delivery.</p>'
                    : '<p>The buyer has funded the escrow. You can now proceed with the delivery as agreed.</p>'
                  }
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

      return NextResponse.json({ success: true, status: 'FUNDED' });
    }

    // Release funds to seller
    if (action === 'release_funds') {
      await prisma.transaction.update({
        where: { id: params.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          completedBy: admin.id,
        },
      });

      await prisma.timelineEvent.create({
        data: {
          transactionId: params.id,
          event: 'FUNDS_RELEASED',
          description: 'Funds released to seller by HoldVera',
        },
      });

      // Determine who is seller
      const sellerId = transaction.creatorRole === 'seller' ? transaction.creatorId : transaction.counterpartyId;
      const seller = transaction.creatorRole === 'seller' ? transaction.creator : transaction.counterparty;
      const buyer = transaction.creatorRole === 'buyer' ? transaction.creator : transaction.counterparty;

      // Notify seller
      if (seller) {
        await sendEmail({
          to: seller.email,
          subject: `Funds Released: ${transaction.title} - HoldVera`,
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
                .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
                .amount { font-size: 32px; font-weight: bold; color: #155724; }
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
                    <h2 style="color: #155724; margin: 0 0 10px 0;">🎉 Payment Released!</h2>
                    <p class="amount">$${transaction.amount.toLocaleString()}</p>
                  </div>
                  <p>Hello ${seller.firstName},</p>
                  <p>Congratulations! The funds for <strong>"${transaction.title}"</strong> have been released to you.</p>
                  <p>The payment will be processed according to your payout settings. If you have questions, contact us at support@holdvera.site.</p>
                  <p>Thank you for using HoldVera!</p>
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

      // Notify buyer
      if (buyer) {
        await sendEmail({
          to: buyer.email,
          subject: `Transaction Complete: ${transaction.title} - HoldVera`,
          html: `
            <h2>🎉 Transaction Complete!</h2>
            <p>Hello ${buyer.firstName},</p>
            <p>The transaction "<strong>${transaction.title}</strong>" has been completed and funds have been released to the seller.</p>
            <p>Thank you for using HoldVera for your secure transaction!</p>
          `,
        });
      }

      return NextResponse.json({ success: true, status: 'COMPLETED' });
    }

    // Open dispute
    if (action === 'open_dispute') {
      await prisma.transaction.update({
        where: { id: params.id },
        data: {
          status: 'DISPUTED',
        },
      });

      await prisma.timelineEvent.create({
        data: {
          transactionId: params.id,
          event: 'DISPUTED',
          description: `Dispute opened: ${reason || 'Under review'}`,
        },
      });

      // Notify both parties
      const recipients = [transaction.creator];
      if (transaction.counterparty) recipients.push(transaction.counterparty);

      for (const recipient of recipients) {
        await sendEmail({
          to: recipient.email,
          subject: `Dispute Opened: ${transaction.title} - HoldVera`,
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
                .warning-box { background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 8px; margin: 20px 0; }
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
                  <div class="warning-box">
                    <h2 style="color: #856404; margin: 0;">⚠️ Dispute Opened</h2>
                  </div>
                  <p>Hello ${recipient.firstName},</p>
                  <p>A dispute has been opened for the transaction <strong>"${transaction.title}"</strong>.</p>
                  ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                  <p>Our team will review the case and may reach out to both parties for additional information. Funds will remain in escrow until the dispute is resolved.</p>
                  <p style="text-align: center; margin: 30px 0;">
                    <a href="${APP_URL}/dashboard/transactions/${transaction.id}" class="button">View Transaction</a>
                  </p>
                  <p>If you have evidence or information to submit, please reply to this email or use the transaction chat.</p>
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

      return NextResponse.json({ success: true, status: 'DISPUTED' });
    }

    // Resolve dispute
    if (action === 'resolve_dispute') {
      const { resolution, refundBuyer } = body;

      await prisma.transaction.update({
        where: { id: params.id },
        data: {
          status: refundBuyer ? 'CANCELLED' : 'COMPLETED',
          completedAt: new Date(),
          completedBy: admin.id,
        },
      });

      await prisma.timelineEvent.create({
        data: {
          transactionId: params.id,
          event: 'DISPUTE_RESOLVED',
          description: `Dispute resolved: ${resolution || (refundBuyer ? 'Refunded to buyer' : 'Released to seller')}`,
        },
      });

      // Notify both parties
      const recipients = [transaction.creator];
      if (transaction.counterparty) recipients.push(transaction.counterparty);

      for (const recipient of recipients) {
        await sendEmail({
          to: recipient.email,
          subject: `Dispute Resolved: ${transaction.title} - HoldVera`,
          html: `
            <h2>Dispute Resolved</h2>
            <p>Hello ${recipient.firstName},</p>
            <p>The dispute for <strong>"${transaction.title}"</strong> has been resolved.</p>
            <p><strong>Resolution:</strong> ${resolution || (refundBuyer ? 'Funds refunded to buyer' : 'Funds released to seller')}</p>
            <p>If you have questions about this decision, please contact support@holdvera.site.</p>
            <p>Best regards,<br>The HoldVera Team</p>
          `,
        });
      }

      return NextResponse.json({ success: true, status: refundBuyer ? 'CANCELLED' : 'COMPLETED' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin transaction action error:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}
