import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

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

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
      },
    });

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HoldVera <support@holdvera.site>",
        to: email,
        subject: "Welcome to HoldVera - Account Created",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37 0%, #C9A227 50%, #B8860B 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to HoldVera</h1>
              <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Trust. Secure. Delivered.</p>
            </div>
            <div style="padding: 40px; background: #f9f9f9;">
              <h2 style="color: #1a1a1a; margin-top: 0;">Hello ${firstName},</h2>
              <p style="color: #666; line-height: 1.6;">
                Thank you for creating your HoldVera account. You're now ready to start making secure escrow transactions with confidence.
              </p>
              <p style="color: #666; line-height: 1.6;">
                With HoldVera, you can:
              </p>
              <ul style="color: #666; line-height: 2;">
                <li>Create secure escrow transactions</li>
                <li>Track your transactions in real-time</li>
                <li>Communicate with buyers and sellers safely</li>
                <li>Access 24/7 customer support</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/login"
                   style="background: linear-gradient(135deg, #D4AF37 0%, #C9A227 50%, #B8860B 100%);
                          color: white;
                          padding: 15px 40px;
                          text-decoration: none;
                          border-radius: 8px;
                          font-weight: bold;
                          display: inline-block;">
                  Access Your Dashboard
                </a>
              </div>
            </div>
            <div style="background: #1a1a1a; color: #888; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0;">Questions? Contact our support team at support@holdvera.site</p>
              <p style="margin: 0; font-size: 12px;">© ${new Date().getFullYear()} HoldVera. Arlington, Virginia, USA</p>
            </div>
          </div>
        `,
      }),
    });

    return NextResponse.json({
      success: true,
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
