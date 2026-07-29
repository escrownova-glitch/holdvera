import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    name: "welcome",
    subject: "Welcome to HoldVera - Your Trusted Escrow Partner",
    body: `Hello {{firstName}},

Welcome to HoldVera! We're excited to have you join our community of secure escrow users.

Your account has been created successfully. Here's what you can do next:
- Complete your KYC verification to unlock all features
- Create your first escrow transaction
- Explore our secure messaging system

If you have any questions, our support team is here to help.

Best regards,
The HoldVera Team`,
    category: "general"
  },
  {
    name: "kyc_reminder",
    subject: "Complete Your KYC Verification - HoldVera",
    body: `Hello {{firstName}},

We noticed you haven't completed your identity verification yet. Completing KYC is required to:
- Create escrow transactions
- Access higher transaction limits
- Enjoy full platform features

It only takes a few minutes to complete. Please have your government-issued ID ready.

Best regards,
The HoldVera Team`,
    category: "kyc"
  },
  {
    name: "transaction_reminder",
    subject: "Action Required: Pending Transaction - HoldVera",
    body: `Hello {{firstName}},

You have a pending action on your escrow transaction "{{transactionTitle}}".

Transaction Details:
- Amount: {{amount}}
- Status: {{status}}
- Other Party: {{counterpartyName}}

Please log in to your dashboard to review and take action.

Best regards,
The HoldVera Team`,
    category: "transaction"
  },
  {
    name: "support_response",
    subject: "Re: {{originalSubject}} - HoldVera Support",
    body: `Hello {{firstName}},

Thank you for contacting HoldVera Support. We have received your inquiry and our team is reviewing it.

{{customMessage}}

If you have any additional questions, please reply to this email.

Best regards,
HoldVera Support Team`,
    category: "support"
  },
  {
    name: "payment_reminder",
    subject: "Payment Pending - HoldVera Escrow",
    body: `Hello {{firstName}},

This is a friendly reminder that payment is pending for your escrow transaction.

Transaction: {{transactionTitle}}
Amount Due: {{amount}}
Due By: {{dueDate}}

Please log in to complete your payment to proceed with the transaction.

Best regards,
The HoldVera Team`,
    category: "transaction"
  },
  {
    name: "general_announcement",
    subject: "{{subject}}",
    body: `Hello {{firstName}},

{{customMessage}}

If you have any questions, please contact our support team.

Best regards,
The HoldVera Team`,
    category: "general"
  }
];

async function main() {
  for (const template of templates) {
    await prisma.emailTemplate.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    });
    console.log(`Created/updated template: ${template.name}`);
  }
  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
