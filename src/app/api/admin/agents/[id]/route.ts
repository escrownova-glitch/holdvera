import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

// GET single agent
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const agent = await prisma.user.findUnique({
      where: { id: params.id, role: 'AGENT' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
        agentPermissions: true,
        agentStatus: true,
        agentInvitedBy: true,
        verified: true,
      },
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({
      agent: {
        ...agent,
        permissions: agent.agentPermissions ? JSON.parse(agent.agentPermissions) : {},
      },
    });
  } catch (error) {
    console.error('Get agent error:', error);
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
  }
}

// PATCH - Update agent permissions or status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only CEO can modify agents
    if (admin.role !== 'CEO') {
      return NextResponse.json({ error: 'Only CEO can modify agents' }, { status: 403 });
    }

    const body = await request.json();
    const { permissions, status } = body;

    const agent = await prisma.user.findUnique({
      where: { id: params.id, role: 'AGENT' },
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const updateData: any = {};

    if (permissions) {
      updateData.agentPermissions = JSON.stringify(permissions);
    }

    if (status) {
      updateData.agentStatus = status;

      // Send notification email about status change
      if (status === 'SUSPENDED') {
        await sendEmail({
          to: agent.email,
          subject: 'Your HoldVera Agent Account has been Suspended',
          html: `
            <h2>Account Suspended</h2>
            <p>Hello ${agent.firstName},</p>
            <p>Your HoldVera agent account has been temporarily suspended. Please contact support for more information.</p>
          `,
        });
      } else if (status === 'REVOKED') {
        await sendEmail({
          to: agent.email,
          subject: 'Your HoldVera Agent Account has been Revoked',
          html: `
            <h2>Account Revoked</h2>
            <p>Hello ${agent.firstName},</p>
            <p>Your HoldVera agent account has been revoked and you no longer have access to the agent panel.</p>
          `,
        });
      } else if (status === 'ACTIVE') {
        await sendEmail({
          to: agent.email,
          subject: 'Your HoldVera Agent Account has been Reactivated',
          html: `
            <h2>Account Reactivated</h2>
            <p>Hello ${agent.firstName},</p>
            <p>Your HoldVera agent account has been reactivated. You can now access the agent panel.</p>
          `,
        });
      }
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      agent: {
        id: updated.id,
        email: updated.email,
        agentStatus: updated.agentStatus,
        permissions: updated.agentPermissions ? JSON.parse(updated.agentPermissions) : {},
      },
    });
  } catch (error) {
    console.error('Update agent error:', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}

// DELETE - Remove agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only CEO can delete agents
    if (admin.role !== 'CEO') {
      return NextResponse.json({ error: 'Only CEO can delete agents' }, { status: 403 });
    }

    const agent = await prisma.user.findUnique({
      where: { id: params.id, role: 'AGENT' },
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete agent error:', error);
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }
}
