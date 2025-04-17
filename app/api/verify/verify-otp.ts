import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

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
const phoneNumber = process.env.phoneNumber;


if (!accountSid || !authToken || !serviceSid) {
  throw new Error('Twilio environment variables are not set');
}

const client = twilio(accountSid, authToken);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyOtpResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber, code } = req.body as VerifyOtpRequestBody;

  if (!phoneNumber || !code) {
    return res.status(400).json({ error: 'Phone number and OTP code are required' });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid as string)
      .verificationChecks.create({ to: phoneNumber, code });

    if (verificationCheck.status === 'approved') {
      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
}
