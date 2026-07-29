import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const tokenData = getUserFromToken(request);
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      select: {
        kycStatus: true,
        kycSubmittedAt: true,
        kycRejectReason: true,
        kycFirstName: true,
        kycMiddleName: true,
        kycLastName: true,
        dateOfBirth: true,
        nationality: true,
        kycPhone: true,
        address: true,
        addressLine2: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        idType: true,
        idFrontUrl: true,
        idBackUrl: true,
        selfieUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ kyc: user });
  } catch (error) {
    console.error('Get KYC error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KYC status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = getUserFromToken(request);
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      nationality,
      phone,
      ssn,
      address,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      idType,
      idFrontUrl,
      idBackUrl,
      selfieUrl,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !nationality || !phone || !address || !city || !country || !idType || !idFrontUrl || !selfieUrl) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // ID back required for non-passport
    if (idType !== 'PASSPORT' && !idBackUrl) {
      return NextResponse.json(
        { error: 'Back of ID is required for this document type' },
        { status: 400 }
      );
    }

    // Check for duplicate phone number
    const existingPhone = await prisma.user.findFirst({
      where: {
        kycPhone: phone,
        id: { not: tokenData.userId },
      },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: 'This phone number is already registered to another account' },
        { status: 400 }
      );
    }

    // Check for duplicate SSN/SIN/Tax ID
    if (ssn) {
      const existingSSN = await prisma.user.findFirst({
        where: {
          ssn: ssn,
          id: { not: tokenData.userId },
        },
      });

      if (existingSSN) {
        return NextResponse.json(
          { error: 'This tax ID is already registered to another account' },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: tokenData.userId },
      data: {
        kycFirstName: firstName,
        kycMiddleName: middleName || null,
        kycLastName: lastName,
        dateOfBirth,
        nationality,
        kycPhone: phone,
        ssn: ssn || null,
        address,
        addressLine2: addressLine2 || null,
        city,
        state: state || null,
        zipCode: zipCode || null,
        country,
        idType,
        idFrontUrl,
        idBackUrl: idBackUrl || null,
        selfieUrl,
        kycStatus: 'SUBMITTED',
        kycSubmittedAt: new Date(),
      },
    });

    // Send confirmation to user
    await sendEmail({
      to: user.email,
      subject: 'KYC Documents Received - HoldVera',
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
            .pending-box { background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">HOLD<span style="color:#fff">VERA</span></div>
            </div>
            <div class="content">
              <h2>Documents Received</h2>
              <p>Hello ${user.firstName},</p>
              <p>We've received your identity verification documents and they are now under review.</p>
              <div class="pending-box">
                <h3 style="color: #856404; margin: 0;">⏳ Under Review</h3>
                <p style="margin: 10px 0 0 0; color: #856404;">Typically takes 1-2 business days</p>
              </div>
              <p>What happens next:</p>
              <ol>
                <li>Our team will verify your documents</li>
                <li>You'll receive an email once approved</li>
                <li>Then you can start using all HoldVera features</li>
              </ol>
              <p>If you have questions, contact us at support@holdvera.site</p>
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
      subject: `[KYC REVIEW] New submission from ${user.firstName} ${user.lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; padding: 20px; text-align: center; }
            .logo { color: #d4af37; font-size: 24px; font-weight: bold; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { padding: 15px; text-align: center; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">HOLDVERA ADMIN</div>
            </div>
            <div class="content">
              <h2>🔔 New KYC Submission</h2>
              <p>A user has submitted their identity verification documents for review.</p>
              <table style="border-collapse: collapse; width: 100%; background: #fff; border: 1px solid #ddd; border-radius: 8px;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${user.firstName} ${user.lastName}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${user.email}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>DOB:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${dateOfBirth}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Address:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${address}, ${city}, ${state} ${zipCode}</td></tr>
                <tr><td style="padding: 10px;"><strong>ID Type:</strong></td><td style="padding: 10px;">${idType}</td></tr>
              </table>
              <p style="text-align: center; margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users/${user.id}" class="button">Review Now</a>
              </p>
            </div>
            <div class="footer">
              <p>HoldVera Admin Notification</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      status: 'SUBMITTED',
    });
  } catch (error) {
    console.error('Submit KYC error:', error);
    return NextResponse.json(
      { error: 'Failed to submit KYC' },
      { status: 500 }
    );
  }
}
