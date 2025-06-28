import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: NextRequest, { params }: { params: { uuid: string } }) {
  // const token = req.headers.get('authorization')?.replace('Bearer ', '');
  // if (!token) {
  //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  // }

  try {
    // Verify JWT
    // const decoded = jwt.verify(token, jwtSecret) as { email: string; userId: number };

    // Find QR code
    const qrCode = await prisma.qrCode.findUnique({
      where: { id: params.uuid },
      include: { ingredient: true },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'Invalid QR code' }, { status: 404 });
    }

    if (qrCode.usedByUserId) {
      return NextResponse.json({ error: 'QR code already used' }, { status: 400 });
    }

    // Mark QR code as used and add ingredient to user's inventory
    await prisma.$transaction([
      prisma.qrCode.update({
        where: { id: params.uuid },
        data: { usedByUserId: 1 },
      }),
      prisma.inventory.upsert({
        where: { userId_ingredientId: { userId: 1, ingredientId: qrCode.ingredientId } },
        update: { quantity: { increment: 1 } },
        create: {
          userId: 1,
          ingredientId: qrCode.ingredientId,
          quantity: 1,
        },
      }),
    ]);

    return NextResponse.json({
      message: 'Ingredient collected',
      ingredient: qrCode.ingredient.name,
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing QR code:', error);
    return NextResponse.json({ error: 'Failed to process QR code' }, { status: 500 });
  }
}
