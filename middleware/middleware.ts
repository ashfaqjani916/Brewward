'use client'
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');


  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, jwtSecret) as { phoneNumber: string; userId: number };

    // Check session in database
    const session = await prisma.session.findFirst({
      where: {
        token,
        userId: decoded.userId,
        expiresAt: { gte: new Date() },
      },
    });

    if (!session) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
