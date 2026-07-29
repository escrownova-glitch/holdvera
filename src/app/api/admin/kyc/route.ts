import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdminOrAgent } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://holdvera.site';

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminOrAgent(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action, reason } = body;

    // Check agent permissions for KYC actions
    if (admin.role === 'AGENT') {
      const permissions = admin.agentPermissions ? JSON.parse(admin.agentPermissions) : {};
      if (action === 'approve' && !permissions.canApproveKYC) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
      if (action === 'reject' && !permissions.canRejectKYC) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
    }

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'approve') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          kycStatus: 'APPROVED',
          kycReviewedAt: new Date(),
          kycReviewedBy: admin.id,
          verified: true,
        },
      });

      // Send approval email
      await sendEmail({
        to: user.email,
        subject: 'Your HoldVera Account is Verified!',
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
              .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">HOLD<span style="color:#fff">VERA</span></div>
              </div>
              <div class="content">
                <div class="success-box">
                  <h2 style="color: #155724; margin: 0;">✓ Account Verified!</h2>
                </div>
                <p>Hello ${user.firstName},</p>
                <p>Great news! Your identity verification has been approved. You now have full access to all HoldVera features including:</p>
                <ul>
                  <li>Create and participate in escrow transactions</li>
                  <li>Higher transaction limits</li>
                  <li>Priority customer support</li>
                </ul>
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${APP_URL}/dashboard" class="button">Go to Dashboard</a>
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

      return NextResponse.json({ success: true, status: 'APPROVED' });
    }

    if (action === 'reject') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          kycStatus: 'REJECTED',
          kycReviewedAt: new Date(),
          kycReviewedBy: admin.id,
          kycRejectReason: reason || 'Documents could not be verified',
        },
      });

      // Send rejection email
      await sendEmail({
        to: user.email,
        subject: 'HoldVera Verification Update',
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
              .alert-box { background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">HOLD<span style="color:#fff">VERA</span></div>
              </div>
              <div class="content">
                <h2>Verification Declined</h2>
                <p>Hello ${user.firstName},</p>
                <p>Unfortunately, we were unable to verify your identity documents.</p>
                <div class="alert-box">
                  <strong>Reason:</strong> ${reason || 'Documents could not be verified'}
                </div>
                <p>Common issues include:</p>
                <ul>
                  <li>Blurry or unclear photos</li>
                  <li>Expired identification documents</li>
                  <li>Information mismatch</li>
                  <li>Document partially visible</li>
                </ul>
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${APP_URL}/dashboard/kyc" class="button">Resubmit Verification</a>
                </p>
                <p>If you have questions, please contact support@holdvera.site</p>
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

      return NextResponse.json({ success: true, status: 'REJECTED' });
    }

    if (action === 'request_info') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          kycStatus: 'PENDING',
          kycRejectReason: reason || 'Additional information required',
        },
      });

      // Send request info email
      await sendEmail({
        to: user.email,
        subject: 'Additional Information Required - HoldVera KYC',
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
              .info-box { background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">HOLD<span style="color:#fff">VERA</span></div>
              </div>
              <div class="content">
                <h2>Additional Information Needed</h2>
                <p>Hello ${user.firstName},</p>
                <p>Our team has reviewed your verification submission and we need some additional information to complete the process.</p>
                <div class="info-box">
                  <strong>What we need:</strong><br>
                  ${reason || 'Please provide additional documentation'}
                </div>
                <p>Please update your verification with the requested information as soon as possible.</p>
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${APP_URL}/dashboard/kyc" class="button">Update Verification</a>
                </p>
                <p>If you have questions, please contact support@holdvera.site</p>
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

      return NextResponse.json({ success: true, status: 'PENDING' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin KYC error:', error);
    return NextResponse.json(
      { error: 'Failed to process KYC' },
      { status: 500 }
    );
  }
}
