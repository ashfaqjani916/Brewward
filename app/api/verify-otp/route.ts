import { PrismaClient } from '@prisma/client/extension';
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

interface VerifyOtpRequestBody {
  phoneNumber: string;
  code: string;
}

interface VerifyOtpResponse {
  message?: string;
  error?: string;
}

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const serviceSid = process.env.serviceSid;
const jwtSecret = process.env.JWT_SECRET;


if (!accountSid || !authToken || !serviceSid) {
  throw new Error('Twilio environment variables are not set');
}

const client = twilio(accountSid, authToken);
export async function POST(req: NextRequest) {
  try {
    const body: VerifyOtpRequestBody = await req.json();
    const { phoneNumber, code } = body;

    if (!phoneNumber || !code) {
      return NextResponse.json({ error: 'Phone number and OTP code are required' }, { status: 400 });
    }

    const verificationCheck = await client.verify.v2
      .services(serviceSid as string)
      .verificationChecks.create({ to: phoneNumber, code });

    if (verificationCheck.status !== 'approved') {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) {
      user = await prisma.user.create({
        data: { phoneNumber },
      });
    }

    // Create JWT (expires in 10 minutes)
    const token = jwt.sign({ phoneNumber, userId: user.id }, jwtSecret as string, { expiresIn: '10m' });

    return NextResponse.json({ message: 'OTP verified successfully', token }, { status: 200 });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
