import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import QrCode from 'qrcode';

const prisma = new PrismaClient();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Replace with your production URL

export async function GET() {
  try {
    const qrCode = await prisma.qrCode.findFirst(
      {
        where: { usedByUser: null }
      }
    );

    const qrCodeUrl = `${baseUrl}/ingredients/${qrCode?.id}`
    const QRpng = await QrCode.toBuffer(qrCodeUrl, { type: 'png' });

    return new NextResponse(new Uint8Array(QRpng), {
      headers: {
        'Content-type': 'image/png'
      }
    });
  } catch (error) {
    console.error('Error generating QR code URLs:', error);
    return NextResponse.json({ error: 'Failed to generate QR code URLs' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
