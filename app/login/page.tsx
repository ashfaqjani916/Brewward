'use client'


import { signIn } from 'next-auth/react'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FormEvent, useState} from 'react'
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

