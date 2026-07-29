import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'holdvera-secret';

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

// GET - List documents for a transaction
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        creatorId: true,
        counterpartyId: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Check if user is part of this transaction or admin
    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true },
    });

    const isCreator = transaction.creatorId === user.userId;
    const isCounterparty = transaction.counterpartyId === user.userId;
    const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'CEO';

    if (!isCreator && !isCounterparty && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Build visibility filter based on user role
    let visibilityFilter: string[] = [];

    if (isAdmin) {
      // Admin can see all documents
      visibilityFilter = ['ADMIN_ONLY', 'CREATOR_ONLY', 'COUNTERPARTY_ONLY', 'BOTH_PARTIES', 'ALL'];
    } else if (isCreator) {
      visibilityFilter = ['CREATOR_ONLY', 'BOTH_PARTIES', 'ALL'];
    } else if (isCounterparty) {
      visibilityFilter = ['COUNTERPARTY_ONLY', 'BOTH_PARTIES', 'ALL'];
    }

    const documents = await prisma.document.findMany({
      where: {
        transactionId: params.id,
        visibility: { in: visibilityFilter },
      },
      orderBy: { uploadedAt: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST - Upload a document
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, url, type, visibility } = body;

    if (!name || !url || !type) {
      return NextResponse.json({ error: 'Name, URL, and type are required' }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        creatorId: true,
        counterpartyId: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Check if user is part of this transaction or admin
    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true },
    });

    const isCreator = transaction.creatorId === user.userId;
    const isCounterparty = transaction.counterpartyId === user.userId;
    const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'CEO';

    if (!isCreator && !isCounterparty && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Determine visibility based on who uploaded
    // Regular users: documents go to ADMIN_ONLY (only admin can see)
    // Admin: can choose visibility
    let docVisibility = 'ADMIN_ONLY';

    if (isAdmin && visibility) {
      // Admin can set any visibility
      docVisibility = visibility;
    }

    const document = await prisma.document.create({
      data: {
        transactionId: params.id,
        name,
        url,
        type,
        uploadedBy: user.userId,
        uploadedByRole: isAdmin ? 'ADMIN' : 'USER',
        visibility: docVisibility,
      },
    });

    // Create timeline event
    await prisma.timelineEvent.create({
      data: {
        transactionId: params.id,
        event: 'DOCUMENT_UPLOADED',
        description: `${isAdmin ? 'Admin' : 'A party'} uploaded a document: ${name}`,
      },
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Upload document error:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}
