import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdminOrCEO } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://holdvera.site';

function renderEmailTemplate(htmlTemplate: string, body: string, toName?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px; text-align: center; }
    .logo { color: #d4af37; font-size: 28px; font-weight: bold; font-family: Georgia, serif; }
    .logo span { color: #ffffff; }
    .content { padding: 40px 30px; background: #ffffff; }
    .content p { margin: 0 0 16px; color: #333; }
    .content ul, .content ol { margin: 0 0 16px; padding-left: 24px; }
    .content li { margin-bottom: 8px; }
    .footer { background: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eee; }
    .footer p { margin: 0 0 8px; color: #888; font-size: 12px; }
    .social { margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">HOLD<span>VERA</span></div>
      <p style="color: rgba(255,255,255,0.7); margin: 10px 0 0; font-size: 14px;">Trust. Secure. Delivered.</p>
    </div>
    <div class="content">
      ${body.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('\n')}
    </div>
    <div class="footer">
      <p><strong>HoldVera</strong></p>
      <p>Arlington, Virginia, USA</p>
      <p>support@holdvera.site | +1 (703) 555-0100</p>
      <p style="margin-top: 20px;">© 2026 HoldVera. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

// GET: List emails and templates
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdminOrCEO(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'templates') {
      const templates = await prisma.emailTemplate.findMany({
        where: { isActive: true },
        orderBy: { category: 'asc' },
      });
      return NextResponse.json({ templates });
    }

    // Get sent emails
    const emails = await prisma.adminEmail.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Get emails error:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}

// POST: Send email
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminOrCEO(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { toEmail, toName, subject, message, fromEmail, templateId } = body;

    if (!toEmail || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const senderEmail = fromEmail || 'support@holdvera.site';

    // Render HTML with template
    const htmlBody = renderEmailTemplate('default', message, toName);

    // Save to database
    const emailRecord = await prisma.adminEmail.create({
      data: {
        fromEmail: senderEmail,
        toEmail,
        toName,
        subject,
        body: message,
        htmlBody,
        status: 'SENT',
        direction: 'OUTBOUND',
        templateId,
        sentBy: admin.id,
        sentAt: new Date(),
      },
    });

    // Send via Resend
    await sendEmail({
      to: toEmail,
      subject,
      html: htmlBody,
      from: senderEmail === 'ceo@holdvera.site'
        ? 'Dennis Miller <ceo@holdvera.site>'
        : 'HoldVera Support <support@holdvera.site>',
    });

    return NextResponse.json({ success: true, emailId: emailRecord.id });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
