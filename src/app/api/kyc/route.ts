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
        dateOfBirth: true,
        address: true,
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
      dateOfBirth,
      ssn,
      address,
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
    if (!dateOfBirth || !ssn || !address || !city || !state || !zipCode || !idType || !idFrontUrl || !idBackUrl || !selfieUrl) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: tokenData.userId },
      data: {
        dateOfBirth,
        ssn, // In production, encrypt this
        address,
        city,
        state,
        zipCode,
        country: country || 'USA',
        idType,
        idFrontUrl,
        idBackUrl,
        selfieUrl,
        kycStatus: 'SUBMITTED',
        kycSubmittedAt: new Date(),
      },
    });

    // Notify admin
    await sendEmail({
      to: 'ceo@holdvera.site',
      subject: `[KYC REVIEW] New submission from ${user.firstName} ${user.lastName}`,
      html: `
        <h2>New KYC Submission</h2>
        <p>A user has submitted their identity verification documents for review.</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${user.firstName} ${user.lastName}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${user.email}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>DOB:</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${dateOfBirth}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Address:</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${address}, ${city}, ${state} ${zipCode}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>ID Type:</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${idType}</td></tr>
        </table>
        <p style="margin-top: 20px;"><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users/${user.id}" style="background: #d4af37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review in Admin Panel</a></p>
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
