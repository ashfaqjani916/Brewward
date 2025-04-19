import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId);

  // Validate the userId
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    // Fetch all coffees for the user
    const coffees = await prisma.coffee.findMany({
      where: {
        userId,
      },
      include: {
        user: true, // Optionally include user data in the result
      },
      orderBy: {
        createdAt: 'desc', // Return most recent coffees first
      },
    });

    // If no coffees are found for the user, return a message
    if (coffees.length === 0) {
      return NextResponse.json({ message: 'No coffees found for this user' });
    }

    // Return the list of coffees
    return NextResponse.json(coffees);
  } catch (error) {
    console.error('Error fetching coffees:', error);
    return NextResponse.json({ error: 'Failed to fetch coffees' }, { status: 500 });
  }
}
