'use client'

import React, { useState, useEffect } from 'react'
import { IconCoffee } from '@tabler/icons-react'
import axios from 'axios'
import { useAuthStore } from '@/lib/store/authStore'

interface Coffee {
  id: number
  type: string
  createdAt: string
}

const MyCoffees: React.FC = () => {
  const [coffees, setCoffees] = useState<Coffee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const phoneNumber = useAuthStore((state) => state.phoneNumber)

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        // First, fetch the user by phone number
        const userResponse = await axios.get(`/api/user/${phoneNumber}`)
        const userId = userResponse.data.user.id

        // Now, use the userId to fetch the coffees
        const coffeeResponse = await axios.get(`/api/coffee/${userId}`)

        // Update the state with fetched coffee data
        setCoffees(coffeeResponse.data) // assuming response.data contains an array of coffees
      } catch (err) {
        setError('Failed to load coffee history')
        console.error('Error fetching coffees:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCoffees()
  }, [phoneNumber])

  return (
    <div className="container mx-auto px-6 py-12">
      {/* User Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex items-center space-x-6">
        {/* <img
          src="/profile.jpg" // Placeholder image
          alt="User Avatar"
          className="w-16 h-16 rounded-full border-2 border-amber-600"
        /> */}
        {/* <div>
          <h2 className="text-2xl font-semibold text-amber-900">John Doe</h2>
          <p className="text-sm text-amber-600">Phone: {phoneNumber}</p>
        </div> */}
      </div>

      {/* Coffee Stats Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-amber-900 mb-4">Coffee Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-amber-600">{coffees.length}</p>
            <p className="text-sm text-amber-600">Coffees Ordered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-amber-600">Latte</p>
            <p className="text-sm text-amber-600">Most Ordered</p>
          </div>
        </div>
      </div>

      {/* Coffee List Section */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 text-center py-4 px-6 rounded-md shadow-md">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coffees.map((coffee) => (
              <div key={coffee.id} className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <IconCoffee className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-900">{coffee.type}</h3>
                    <p className="text-sm text-amber-600">{new Date(coffee.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyCoffees
