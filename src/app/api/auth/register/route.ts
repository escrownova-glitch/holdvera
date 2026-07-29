import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://holdvera.site';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        emailVerified: false,
        otpCode: otp,
        otpExpiresAt: otpExpiresAt,
        otpLastSentAt: new Date(),
        otpAttempts: 1,
      },
    });

    // Send OTP verification email
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HoldVera <support@holdvera.site>",
        to: email,
        subject: `Your HoldVera Verification Code: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37 0%, #C9A227 50%, #B8860B 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to HoldVera</h1>
              <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Trust. Secure. Delivered.</p>
            </div>
            <div style="padding: 40px; background: #f9f9f9;">
              <h2 style="color: #1a1a1a; margin-top: 0;">Hello ${firstName},</h2>
              <p style="color: #666; line-height: 1.6;">
                Thank you for creating your HoldVera account. Please verify your email address using the code below:
              </p>
              <div style="font-size: 36px; font-weight: bold; color: #d4af37; letter-spacing: 8px; text-align: center; padding: 20px; background: #fff; border: 2px dashed #d4af37; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #888; font-size: 14px; text-align: center;">This code expires in 10 minutes.</p>
              <p style="color: #666; line-height: 1.6; margin-top: 20px;">
                After verification, you'll need to complete your KYC (Know Your Customer) verification before you can start using our escrow services.
              </p>
            </div>
            <div style="background: #1a1a1a; color: #888; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0;">Questions? Contact our support team at support@holdvera.site</p>
              <p style="margin: 0; font-size: 12px;">© ${new Date().getFullYear()} HoldVera. Arlington, Virginia, USA</p>
            </div>
          </div>
        `,
      }),
    });

    // Notify admin of new signup
    await sendEmail({
      to: 'ceo@holdvera.site',
      subject: `[NEW SIGNUP] ${firstName} ${lastName} registered`,
      html: `
        <h2>New User Registration</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><a href="${APP_URL}/admin/users">View in Admin Panel</a></p>
      `,
    });

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
