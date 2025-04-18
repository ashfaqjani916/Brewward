import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const inventory = await prisma.inventory.findMany({
      where: { userId: 1 },
      select: {
        ingredientId: true,
        quantity: true,
      },
    });

    return NextResponse.json({ success: true, data: inventory });
  } catch (error) {
    console.error('Error fetching user inventory:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user inventory' }, { status: 500 });
  }
}
