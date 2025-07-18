import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthProvider from './context/sessionWrapper'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Coffee Rewards',
  description: 'Your favorite coffee rewards program',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
