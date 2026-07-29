import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;

    // Simple protection
    if (secret !== 'holdvera-seed-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if CEO exists
    const existingCEO = await prisma.user.findUnique({
      where: { email: 'ceo@holdvera.site' },
    });

    if (existingCEO) {
      return NextResponse.json({
        message: 'CEO user already exists',
        user: {
          email: existingCEO.email,
          role: existingCEO.role,
        },
      });
    }

    // Create CEO user
    const hashedPassword = await bcrypt.hash('Mobolajokobrain@123', 12);

    const ceo = await prisma.user.create({
      data: {
        email: 'ceo@holdvera.site',
        password: hashedPassword,
        firstName: 'HoldVera',
        lastName: 'CEO',
        role: 'CEO',
        verified: true,
        kycStatus: 'APPROVED',
        signupMethod: 'SYSTEM',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'CEO user created successfully',
      user: {
        email: ceo.email,
        role: ceo.role,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Seed failed', details: String(error) },
      { status: 500 }
    );
  }
}
