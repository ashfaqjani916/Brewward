'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { IconCoffee, IconCoffeeOff, IconExchange, IconHistory, IconShoppingCart } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
// import { useAuthStore } from '@/lib/store/authStore'

interface Coffee {
  id: string
  name: string
  image: string
  description: string
  ingredients: string[]
}

const Dashboard: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()

  // const { isAuthenticated, isSessionValid, phoneNumber, logout } = useAuthStore()

  // useEffect(() => {
  //   if (!isAuthenticated || !isSessionValid()) {
  //     router.push('/login')
  //   }
  // }, [isAuthenticated, isSessionValid, router])

  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status])

  const coffees: Coffee[] = [
    {
      id: 'latte',
      name: 'Latte',
      image: '/images/latte.jpeg',
      description: 'Smooth espresso with steamed milk',
      ingredients: ['milk', 'coffee', 'sugar'],
    },
    {
      id: 'mocha',
      name: 'Mocha',
      image: '/images/mocha.jpg',
      description: 'Rich chocolate with espresso and milk',
      ingredients: ['milk', 'coffee', 'chocochips', 'sugar'],
    },
    {
      id: 'iced-coffee',
      name: 'Iced Coffee',
      image: '/images/iced-coffee.jpg',
      description: 'Refreshing cold coffee with ice',
      ingredients: ['ice', 'coffee', 'milk', 'sugar'],
    },
  ]

  const menuItems = [
    { name: 'Coffee Menu', icon: <IconCoffee />, path: '/dashboard' },
    { name: 'Redeem', icon: <IconCoffeeOff />, path: '/dashboard/redeem' },
    { name: 'My Coffees', icon: <IconHistory />, path: '/dashboard/my-coffees' },
    { name: 'Trade Coffee', icon: <IconExchange />, path: '/dashboard/trade' },
  ]

  const handleCoffeeClick = (coffeeId: string) => {
    router.push(`/dashboard/redeem?type=${coffeeId}`)
  }

  // if (!isAuthenticated || !isSessionValid()) {
  //   return null // Optionally show a loading state or splash screen
  // }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-amber-900 text-amber-50 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Coffee Rewards</h1>
            {/* <p className="text-amber-200 text-sm mt-1">{phoneNumber}</p> */}
          </div>
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${pathname === item.path ? 'bg-amber-800 text-amber-50' : 'hover:bg-amber-800/50 text-amber-100'}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul>
              <li>
                <button onClick={() => signOut()} className="flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-amber-800/50 text-amber-100">
                  <IconShoppingCart />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {pathname === '/dashboard' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-amber-900 mb-8">Our Coffee Menu</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coffees.map((coffee) => (
                  <motion.div key={coffee.id} whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative h-48">
                      <Image src={coffee.image} alt={coffee.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white">{coffee.name}</h3>
                        <p className="text-amber-100 text-sm">{coffee.description}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {coffee.ingredients.map((ingredient) => (
                          <span key={ingredient} className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCoffeeClick(coffee.id)}
                        className="w-full flex items-center justify-center space-x-2 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        <IconShoppingCart className="w-5 h-5" />
                        <span>Order Now</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {pathname === '/dashboard/my-coffees' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-amber-900 mb-8">My Coffee History</h2>
              {/* Add coffee history component here */}
            </div>
          )}

          {pathname === '/dashboard/trade' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-amber-900 mb-8">Trade Your Coffee</h2>
              {/* Add trade component here */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
