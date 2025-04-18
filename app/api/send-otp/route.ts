import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import twilio from 'twilio'


interface SendOtpRequestBody {
  phoneNumber: string;
}

// interface SendOtpResponse {
//   message?: string;
//   verification?: any;
//   error?: string;
// }


const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const serviceSid = process.env.serviceSid;


if (!accountSid || !authToken || !serviceSid) {
  throw new Error('Twilio environment variables are not set');
}

const client = twilio(accountSid, authToken);


export async function POST(req: NextRequest) {
  try {
    const body: SendOtpRequestBody = await req.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const verification = await client.verify.v2
      .services(serviceSid as string)
      .verifications.create({ to: phoneNumber, channel: 'sms' });

    return NextResponse.json({ message: 'OTP sent successfully', verification }, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
