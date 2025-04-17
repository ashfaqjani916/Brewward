import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio'


interface SendOtpRequestBody {
  phoneNumber: string;
}

interface SendOtpResponse {
  message?: string;
  verification?: any; // Adjust type based on Twilio's verification response
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
  res: NextApiResponse<SendOtpResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber } = req.body as SendOtpRequestBody;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const verification = await client.verify.v2
      .services(serviceSid as string)
      .verifications.create({ to: phoneNumber, channel: 'sms' });

    return res.status(200).json({ message: 'OTP sent successfully', verification });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
}
