'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../lib/store/authStore'

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { login, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  interface ApiResponse {
    message?: string;
    error?: string;
    verification?: any; // Adjust type based on Twilio's verification response
  }

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      const data: ApiResponse = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setMessage('OTP sent to your phone!');
      } else {
        setMessage(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      setMessage('An error occurred');
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code: otp }),
      });
      const data: ApiResponse = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
        // Use Zustand store to set authentication state
        login(phoneNumber);
        // Router will redirect based on the useEffect above
      } else {
        setMessage(data.error || 'Invalid OTP');
      }
    } catch (error) {
      setMessage('An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#4A2C2A]">Welcome to #####</h2>
          <p className="mt-2 text-center text-sm text-[#8B5A2B]">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <div className="rounded-md shadow-sm space-y-2">
            <div>
              <label htmlFor="phone-number" className="sr-only">
                Phone Number
              </label>
              <input
                id="phone-number"
                name="phone"
                type="tel"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-[#D2B48C] placeholder-[#8B5A2B] text-[#4A2C2A] focus:outline-none focus:ring-[#8B5A2B] focus:border-[#8B5A2B] focus:z-10 sm:text-sm"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={otpSent}
              />
            </div>
            {otpSent && (
              <div>
                <label htmlFor="otp" className="sr-only">
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-[#D2B48C] placeholder-[#8B5A2B] text-[#4A2C2A] focus:outline-none focus:ring-[#8B5A2B] focus:border-[#8B5A2B] focus:z-10 sm:text-sm"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}
          </div>

          {error && <div className="text-[#8B0000] text-sm text-center">{error}</div>}
          {message && <div className="text-[#4A2C2A] text-sm text-center">{message}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8B5A2B] hover:bg-[#6B4423] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5A2B]"
            >
              {otpSent ? 'Verify OTP' : 'Send OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
