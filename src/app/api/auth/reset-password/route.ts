import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, password } = body;

    if (!email || !code || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      return NextResponse.json({ error: 'No OTP requested' }, { status: 400 });
    }

    if (new Date() > user.otpExpiresAt) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    if (user.otpCode !== code) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0,
      },
    });

    await sendEmail({
      to: email,
      subject: 'Password Changed - HoldVera',
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
            .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">HOLD<span style="color:#fff">VERA</span></div>
            </div>
            <div class="content">
              <h2>Password Changed Successfully</h2>
              <p>Hello ${user.firstName},</p>
              <p>Your HoldVera account password has been successfully changed.</p>
              <p style="color: #888; font-size: 14px;">If you didn't make this change, please contact us immediately at support@holdvera.site</p>
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

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
