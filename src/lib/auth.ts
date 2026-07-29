import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { db as prisma } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'holdvera-secret';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function getUserFromToken(request: NextRequest): TokenPayload | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const tokenData = getUserFromToken(request);
  if (!tokenData) return null;

  const user = await prisma.user.findUnique({
    where: { id: tokenData.userId },
  });

  return user;
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return null;
  if (user.role !== 'ADMIN' && user.role !== 'CEO') return null;
  return user;
}

export async function requireCEO(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return null;
  if (user.role !== 'CEO') return null;
  return user;
}

export async function requireAdminOrAgent(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return null;
  if (user.role !== 'ADMIN' && user.role !== 'CEO' && user.role !== 'AGENT') return null;
  if (user.role === 'AGENT' && user.agentStatus !== 'ACTIVE') return null;
  return user;
}

export async function requireAdminOrCEO(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return null;
  if (user.role !== 'ADMIN' && user.role !== 'CEO') return null;
  return user;
}

// Safe JSON parse for agent permissions
export function parseAgentPermissions(permissions: string | null): Record<string, boolean> {
  if (!permissions) return {};
  try {
    return JSON.parse(permissions);
  } catch {
    console.error('Invalid agent permissions JSON:', permissions);
    return {};
  }
}
