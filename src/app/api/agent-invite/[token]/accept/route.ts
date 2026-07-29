import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://holdvera.site';

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const agent = await prisma.user.findUnique({
      where: { agentInviteToken: params.token },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    if (agent.verified) {
      return NextResponse.json(
        { error: 'This invitation has already been used' },
        { status: 400 }
      );
    }

    // Hash password and activate account
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: agent.id },
      data: {
        password: hashedPassword,
        verified: true,
        agentStatus: 'ACTIVE',
        agentInviteToken: null, // Clear the token
      },
    });

    // Send welcome email
    await sendEmail({
      to: agent.email,
      subject: 'Welcome to HoldVera Agent Portal!',
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
              <h2>Your Account is Active!</h2>
              <p>Hello ${agent.firstName},</p>
              <p>Your HoldVera agent account has been activated. You can now access the agent panel to:</p>
              <ul>
                <li>View user accounts and transactions</li>
                <li>Participate in transaction chats</li>
                <li>Assist with customer support</li>
              </ul>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${APP_URL}/admin-login" class="button">Access Agent Panel</a>
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

    // Notify CEO
    await sendEmail({
      to: 'ceo@holdvera.site',
      subject: `[ADMIN] Agent Activated: ${agent.firstName} ${agent.lastName}`,
      html: `
        <h2>Agent Account Activated</h2>
        <p>The agent <strong>${agent.firstName} ${agent.lastName}</strong> (${agent.email}) has activated their account and can now access the agent panel.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Accept agent invite error:', error);
    return NextResponse.json(
      { error: 'Failed to activate account' },
      { status: 500 }
    );
  }
}
