'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check authentication status and redirect accordingly
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Return a simple loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E6]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#4A2C2A]">Redirecting...</h2>
        <p className="mt-2 text-[#8B5A2B]">Please wait while we check your authentication status.</p>
      </div>
    </div>
  );
}
