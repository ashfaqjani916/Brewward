// app/api/verify-otp/route.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import jwt from 'jsonwebtoken'

// Create a singleton Prisma client to avoid too many connections
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}
const prisma = global.prisma ?? new PrismaClient({ log: ['query'] })
if (process.env.NODE_ENV !== 'production') global.prisma = prisma

// Load and validate env vars
const TWILIO_ACCOUNT_SID = process.env.accountSid;
const TWILIO_AUTH_TOKEN = process.env.authToken;
const TWILIO_SERVICE_SID = process.env.serviceSid;
const JWT_SECRET = process.env.JWT_SECRET;
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_SERVICE_SID || !JWT_SECRET) {
  throw new Error('Missing required environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID, or JWT_SECRET')
}

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

interface VerifyOtpRequestBody {
  phoneNumber: string
  code: string
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code } = (await request.json()) as VerifyOtpRequestBody

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and OTP code are required' },
        { status: 400 }
      )
    }

    // Verify OTP via Twilio
    const verification = await twilioClient.verify.v2
      .services(TWILIO_SERVICE_SID as string)
      .verificationChecks.create({ to: phoneNumber, code })

    if (verification.status !== 'approved') {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    // Upsert user in the database
    const user = await prisma.user.upsert({
      where: { phoneNumber },
      update: {},
      create: { phoneNumber },
    })

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, phoneNumber: user.phoneNumber },
      JWT_SECRET as string,
      { expiresIn: '10m' }
    )

    return NextResponse.json(
      { message: 'OTP verified successfully', token },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error verifying OTP:', err)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
