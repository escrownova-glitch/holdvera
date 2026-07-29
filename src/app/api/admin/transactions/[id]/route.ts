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

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin transaction action error:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}
