import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, purpose } = body; // purpose: 'verify', 'password-reset', 'password-change'

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Rate limiting: max 3 OTPs per 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (user.otpLastSentAt && user.otpLastSentAt > tenMinutesAgo && user.otpAttempts >= 3) {
      const waitTime = Math.ceil((user.otpLastSentAt.getTime() + 10 * 60 * 1000 - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Too many OTP requests. Please wait ${waitTime} minutes.` },
        { status: 429 }
      );
    }

    // Reset attempts if more than 10 minutes have passed
    const newAttempts = user.otpLastSentAt && user.otpLastSentAt > tenMinutesAgo
      ? user.otpAttempts + 1
      : 1;

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiresAt: expiresAt,
        otpAttempts: newAttempts,
        otpLastSentAt: new Date(),
      },
    });

    // Send OTP email
    const purposeText = {
      'verify': 'verify your email address',
      'password-reset': 'reset your password',
      'password-change': 'change your password',
    }[purpose] || 'complete your request';

    await sendEmail({
      to: email,
      subject: `Your HoldVera Verification Code: ${otp}`,
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
            .otp-code { font-size: 36px; font-weight: bold; color: #d4af37; letter-spacing: 8px; text-align: center; padding: 20px; background: #fff; border: 2px dashed #d4af37; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">HOLD<span style="color:#fff">VERA</span></div>
            </div>
            <div class="content">
              <h2>Verification Code</h2>
              <p>Hello ${user.firstName},</p>
              <p>Use this code to ${purposeText}:</p>
              <div class="otp-code">${otp}</div>
              <p style="color: #888; font-size: 14px;">This code expires in 10 minutes.</p>
              <p style="color: #888; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
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
      message: 'OTP sent to your email',
      expiresIn: 600, // 10 minutes in seconds
    });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
