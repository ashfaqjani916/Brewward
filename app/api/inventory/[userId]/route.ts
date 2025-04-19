// app/api/inventory/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId)
    console.log(userId)
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 })
    }

    const inventory = await prisma.inventory.findMany({
      where: { userId },
      select: {
        ingredientId: true,
        quantity: true,
      },
    })

    return NextResponse.json({ success: true, data: inventory })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch inventory' }, { status: 500 })
  }
}
