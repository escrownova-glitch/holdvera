import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://holdvera.site';
const SUPPORT_EMAIL = 'support@holdvera.site';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string; // Optional custom from address
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: from || `HoldVera <${SUPPORT_EMAIL}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send exception:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; padding: 30px; text-align: center; }
        .logo { color: #d4af37; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; background: #f9f9f9; }
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
          <h2>Welcome to HoldVera, ${firstName}!</h2>
          <p>Thank you for creating your account. You're now ready to start secure escrow transactions.</p>
          <p>With HoldVera, you can:</p>
          <ul>
            <li>Create secure escrow transactions for property sales</li>
            <li>Upload property images and documentation</li>
            <li>Communicate safely with counterparties</li>
            <li>Track transaction progress in real-time</li>
          </ul>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/dashboard" class="button">Go to Dashboard</a>
          </p>
          <p>If you have any questions, our support team is here to help.</p>
          <p>Best regards,<br>The HoldVera Team</p>
        </div>
        <div class="footer">
          <p>© 2026 HoldVera. All rights reserved.</p>
          <p>Arlington, Virginia, USA</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to HoldVera - Your Account is Ready',
    html,
  });
}

export async function sendEscrowInviteEmail(
  counterpartyEmail: string,
  counterpartyName: string,
  creatorName: string,
  transactionTitle: string,
  amount: string,
  inviteCode: string
) {
  const inviteLink = `${APP_URL}/invite/${inviteCode}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; padding: 30px; text-align: center; }
        .logo { color: #d4af37; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; background: #f9f9f9; }
        .transaction-box { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .amount { font-size: 24px; font-weight: bold; color: #1a1a1a; }
        .button { display: inline-block; padding: 14px 35px; background: #d4af37; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
        .security-note { background: #fff8e6; border: 1px solid #d4af37; border-radius: 6px; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">HOLD<span style="color:#fff">VERA</span></div>
        </div>
        <div class="content">
          <h2>You've Been Invited to an Escrow Transaction</h2>
          <p>Hello ${counterpartyName},</p>
          <p><strong>${creatorName}</strong> has initiated a secure escrow transaction with you on HoldVera.</p>

          <div class="transaction-box">
            <h3 style="margin-top: 0;">${transactionTitle}</h3>
            <p class="amount">${amount}</p>
            <p style="color: #666; margin-bottom: 0;">Protected by HoldVera Escrow</p>
          </div>

          <div class="security-note">
            <strong>🔒 What is Escrow?</strong>
            <p style="margin-bottom: 0;">Your funds are held securely by HoldVera until both parties confirm the transaction is complete. This protects both buyer and seller.</p>
          </div>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" class="button">View & Accept Transaction</a>
          </p>

          <p style="font-size: 13px; color: #666;">
            Or copy this link: <br>
            <code style="background: #eee; padding: 5px 10px; border-radius: 4px; word-break: break-all;">${inviteLink}</code>
          </p>

          <p>If you have questions or didn't expect this invitation, please contact us at ${SUPPORT_EMAIL}.</p>

          <p>Best regards,<br>The HoldVera Team</p>
        </div>
        <div class="footer">
          <p>© 2026 HoldVera. All rights reserved.</p>
          <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: counterpartyEmail,
    subject: `${creatorName} invited you to an escrow transaction - HoldVera`,
    html,
  });
}

export async function sendTransactionCreatedEmail(
  creatorEmail: string,
  creatorName: string,
  transactionId: string,
  transactionTitle: string,
  counterpartyName: string,
  amount: string,
  inviteLink: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; padding: 30px; text-align: center; }
        .logo { color: #d4af37; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; background: #f9f9f9; }
        .transaction-box { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .amount { font-size: 24px; font-weight: bold; color: #1a1a1a; }
        .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px; }
        .button-outline { display: inline-block; padding: 12px 30px; background: #fff; color: #d4af37; text-decoration: none; border-radius: 6px; font-weight: bold; border: 2px solid #d4af37; margin: 5px; }
        .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
        .status { display: inline-block; background: #fef3cd; color: #856404; padding: 5px 15px; border-radius: 20px; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">HOLD<span style="color:#fff">VERA</span></div>
        </div>
        <div class="content">
          <h2>Escrow Transaction Created Successfully</h2>
          <p>Hello ${creatorName},</p>
          <p>Your escrow transaction has been created. An invitation has been sent to <strong>${counterpartyName}</strong>.</p>

          <div class="transaction-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <span style="color: #666; font-size: 13px;">Transaction ID: ${transactionId}</span>
              <span class="status">Pending Acceptance</span>
            </div>
            <h3 style="margin: 0 0 10px 0;">${transactionTitle}</h3>
            <p class="amount">${amount}</p>
          </div>

          <p><strong>What's next?</strong></p>
          <ol>
            <li>Wait for ${counterpartyName} to accept the invitation</li>
            <li>Once accepted, the escrow will become active</li>
            <li>You'll receive a notification when they respond</li>
          </ol>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Dashboard</a>
          </p>

          <p style="font-size: 13px; color: #666;">
            <strong>Share invite link manually:</strong><br>
            <code style="background: #eee; padding: 5px 10px; border-radius: 4px; word-break: break-all; display: block; margin-top: 5px;">${inviteLink}</code>
          </p>

          <p>Best regards,<br>The HoldVera Team</p>
        </div>
        <div class="footer">
          <p>© 2026 HoldVera. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: creatorEmail,
    subject: `Escrow Created: ${transactionTitle} - HoldVera`,
    html,
  });
}

export async function sendAdminNotificationEmail(
  transactionId: string,
  transactionTitle: string,
  creatorName: string,
  creatorEmail: string,
  counterpartyName: string,
  counterpartyEmail: string,
  amount: string
) {
  const adminEmail = 'ceo@holdvera.site'; // or pull from settings

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; padding: 20px; text-align: center; }
        .logo { color: #d4af37; font-size: 24px; font-weight: bold; }
        .content { padding: 20px; background: #f9f9f9; }
        .info-row { display: flex; border-bottom: 1px solid #ddd; padding: 10px 0; }
        .info-label { width: 150px; font-weight: bold; color: #666; }
        .footer { padding: 15px; text-align: center; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">HOLDVERA ADMIN</div>
        </div>
        <div class="content">
          <h2>🔔 New Escrow Transaction Created</h2>

          <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <div class="info-row">
              <span class="info-label">Transaction ID:</span>
              <span>${transactionId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Title:</span>
              <span>${transactionTitle}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Amount:</span>
              <span style="font-weight: bold; font-size: 18px;">${amount}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Creator:</span>
              <span>${creatorName} (${creatorEmail})</span>
            </div>
            <div class="info-row" style="border-bottom: none;">
              <span class="info-label">Counterparty:</span>
              <span>${counterpartyName} (${counterpartyEmail})</span>
            </div>
          </div>

          <p style="text-align: center;">
            <a href="${APP_URL}/admin/transactions" style="display: inline-block; padding: 12px 30px; background: #d4af37; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Admin Panel</a>
          </p>
        </div>
        <div class="footer">
          <p>HoldVera Admin Notification</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `[ADMIN] New Escrow: ${transactionTitle} - $${amount}`,
    html,
  });
}
