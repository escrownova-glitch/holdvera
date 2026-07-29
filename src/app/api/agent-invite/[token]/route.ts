import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const agent = await prisma.user.findUnique({
      where: { agentInviteToken: params.token },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        agentPermissions: true,
        agentStatus: true,
        verified: true,
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    if (agent.verified) {
      return NextResponse.json(
        { error: 'This invitation has already been used' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      agent: {
        id: agent.id,
        email: agent.email,
        firstName: agent.firstName,
        lastName: agent.lastName,
        permissions: agent.agentPermissions ? JSON.parse(agent.agentPermissions) : {},
      },
    });
  } catch (error) {
    console.error('Get agent invite error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitation' },
      { status: 500 }
    );
  }
}
