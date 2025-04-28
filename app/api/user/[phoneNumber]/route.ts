// app/api/user/[phoneNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { phoneNumber: string } }) {
  try {
    const phoneNumber = params.phoneNumber

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    // Fetch user using phone number
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
      select: {
        id: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
        // Add more fields if needed
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (err) {
    console.error('Error fetching user:', err)
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 })
  }
}
