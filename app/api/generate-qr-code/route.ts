



import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Replace with your production URL

export async function GET() {
  try {
    const qrCodes = await prisma.qrCode.findMany();
    const qrCodeUrls = qrCodes.map((qrCode: { id: string }) => `${baseUrl}/ingredient/${qrCode.id}`);

    return NextResponse.json({
      qrCodeUrls: qrCodeUrls
    }, { status: 200 });
  } catch (error) {
    console.error('Error generating QR code URLs:', error);
    return NextResponse.json({ error: 'Failed to generate QR code URLs' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
