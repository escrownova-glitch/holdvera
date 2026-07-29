import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'holdvera-secret';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        lastActiveAt: true,
        kycStatus: true,
        emailVerified: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check session timeout (only for regular users)
    if (user.role === 'USER' && user.lastActiveAt) {
      const timeSinceActive = Date.now() - user.lastActiveAt.getTime();
      if (timeSinceActive > SESSION_TIMEOUT) {
        return NextResponse.json({
          error: 'Session expired',
          sessionExpired: true,
        }, { status: 401 });
      }
    }

    // Update last active
    await db.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    return NextResponse.json({
      valid: true,
      user: {
        kycStatus: user.kycStatus,
        emailVerified: user.emailVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
