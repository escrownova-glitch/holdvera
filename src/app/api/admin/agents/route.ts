import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://holdvera.site';

// GET all agents
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const agents = await prisma.user.findMany({
      where: { role: 'AGENT' },
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
        _count: {
          select: {
            sentMessages: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse permissions JSON
    const agentsWithParsedPermissions = agents.map(agent => ({
      ...agent,
      permissions: agent.agentPermissions ? JSON.parse(agent.agentPermissions) : {},
    }));

    return NextResponse.json({ agents: agentsWithParsedPermissions });
  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

// POST - Invite new agent
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only CEO can create agents
    if (admin.role !== 'CEO') {
      return NextResponse.json({ error: 'Only CEO can invite agents' }, { status: 403 });
    }

    const body = await request.json();
    const { email, firstName, lastName, permissions } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Email, first name, and last name are required' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');

    // Default permissions
    const defaultPermissions = {
      canViewUsers: true,
      canViewTransactions: true,
      canApproveKYC: false,
      canRejectKYC: false,
      canCompleteTransactions: false,
      canCancelTransactions: false,
      canSendMessages: true,
      canViewChat: true,
      ...permissions,
    };

    // Create agent user (without password - they'll set it when accepting invite)
    const agent = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: '', // Will be set when they accept
        firstName,
        lastName,
        role: 'AGENT',
        signupMethod: 'AGENT_INVITE',
        agentInvitedBy: admin.id,
        agentInviteToken: inviteToken,
        agentPermissions: JSON.stringify(defaultPermissions),
        agentStatus: 'PENDING',
        verified: false,
        kycStatus: 'APPROVED', // Agents don't need KYC
      },
    });

    const inviteLink = `${APP_URL}/agent-invite/${inviteToken}`;

    // Send invite email
    await sendEmail({
      to: email,
      subject: 'You have been invited as a HoldVera Agent',
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
            .button { display: inline-block; padding: 14px 35px; background: #d4af37; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .permissions { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0; }
            .perm-item { display: flex; align-items: center; gap: 8px; padding: 5px 0; }
            .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">HOLD<span style="color:#fff">VERA</span></div>
              <p style="color: #888; margin: 10px 0 0 0;">Agent Portal</p>
            </div>
            <div class="content">
              <h2>Welcome to the Team, ${firstName}!</h2>
              <p>You have been invited to join HoldVera as an <strong>Agent</strong> by the CEO.</p>

              <div class="permissions">
                <h4 style="margin-top: 0;">Your Permissions:</h4>
                ${defaultPermissions.canViewUsers ? '<div class="perm-item">✓ View Users</div>' : ''}
                ${defaultPermissions.canViewTransactions ? '<div class="perm-item">✓ View Transactions</div>' : ''}
                ${defaultPermissions.canApproveKYC ? '<div class="perm-item">✓ Approve KYC</div>' : ''}
                ${defaultPermissions.canSendMessages ? '<div class="perm-item">✓ Send Messages</div>' : ''}
                ${defaultPermissions.canViewChat ? '<div class="perm-item">✓ View Chat</div>' : ''}
              </div>

              <p style="text-align: center; margin: 30px 0;">
                <a href="${inviteLink}" class="button">Accept Invitation & Set Password</a>
              </p>

              <p style="font-size: 13px; color: #666;">
                Or copy this link:<br>
                <code style="background: #eee; padding: 5px 10px; border-radius: 4px; word-break: break-all;">${inviteLink}</code>
              </p>

              <p style="color: #888; font-size: 12px;">This invitation expires in 7 days.</p>
            </div>
            <div class="footer">
              <p>© 2026 HoldVera. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        email: agent.email,
        inviteLink,
      },
    });
  } catch (error) {
    console.error('Create agent error:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
