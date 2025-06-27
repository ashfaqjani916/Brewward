'use client'

import { signIn } from 'next-auth/react'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#4A2C2A]">Welcome to Brewwards</h2>
          <p className="mt-2 text-center text-sm text-[#8B5A2B]">Sign in to your account</p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn('google')}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8B5A2B] hover:bg-[#6B4423] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5A2B]"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import { FormEvent, useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuthStore } from '../../lib/store/authStore'

// export default function LoginPage() {
//   const [phoneNumber, setPhoneNumber] = useState('')
//   const [otp, setOtp] = useState('')
//   const [error, setError] = useState('')
//   const [otpSent, setOtpSent] = useState(false)
//   const [message, setMessage] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()
//   const { login, isAuthenticated } = useAuthStore()

//   useEffect(() => {
//     if (isAuthenticated) {
//       router.push('/dashboard')
//     }
//   }, [isAuthenticated, router])

//   interface ApiResponse {
//     message?: string
//     error?: string
//     verification?: any
//     token?: string
//   }

//   const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setMessage('')
//     setIsLoading(true)

//     try {
//       const response = await fetch('/api/send-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phoneNumber }),
//       })
//       const data: ApiResponse = await response.json()

//       if (response.ok) {
//         setOtpSent(true)
//         setMessage('OTP sent to your phone!')
//       } else {
//         setMessage(data.error || 'Failed to send OTP')
//       }
//     } catch (error) {
//       setMessage('An error occurred while sending OTP')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setMessage('')
//     setIsLoading(true)

//     try {
//       const response = await fetch('/api/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phoneNumber, code: otp }),
//       })
//       const data: ApiResponse = await response.json()

//       if (response.ok && data.token) {
//         setMessage('Login successful!')
//         login(phoneNumber, data.token) // <-- Save to Zustand, assuming login(phone, token)
//         router.push('/dashboard') // Optional immediate redirect
//       } else {
//         setMessage(data.error || 'Invalid OTP')
//       }
//     } catch (error) {
//       setMessage('An error occurred while verifying OTP')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F5F0E6] py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-[#4A2C2A]">Welcome to Brewwards</h2>
//           <p className="mt-2 text-center text-sm text-[#8B5A2B]">Sign in to your account</p>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
//           <div className="rounded-md shadow-sm space-y-2">
//             <div>
//               <label htmlFor="phone-number" className="sr-only">
//                 Phone Number
//               </label>
//               <input
//                 id="phone-number"
//                 name="phone"
//                 type="tel"
//                 required
//                 className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-[#D2B48C] placeholder-[#8B5A2B] text-[#4A2C2A] focus:outline-none focus:ring-[#8B5A2B] focus:border-[#8B5A2B] focus:z-10 sm:text-sm"
//                 placeholder="Phone Number"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 disabled={otpSent || isLoading}
//               />
//             </div>
//             {otpSent && (
//               <div>
//                 <label htmlFor="otp" className="sr-only">
//                   OTP
//                 </label>
//                 <input
//                   id="otp"
//                   name="otp"
//                   type="text"
//                   required
//                   className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-[#D2B48C] placeholder-[#8B5A2B] text-[#4A2C2A] focus:outline-none focus:ring-[#8B5A2B] focus:border-[#8B5A2B] focus:z-10 sm:text-sm"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </div>
//             )}
//           </div>

//           {error && <div className="text-[#8B0000] text-sm text-center">{error}</div>}
//           {message && <div className="text-[#4A2C2A] text-sm text-center">{message}</div>}

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8B5A2B] hover:bg-[#6B4423] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5A2B] disabled:opacity-70"
//             >
//               {isLoading ? (
//                 <div className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   {otpSent ? 'Verifying...' : 'Sending...'}
//                 </div>
//               ) : otpSent ? (
//                 'Verify OTP'
//               ) : (
//                 'Send OTP'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
