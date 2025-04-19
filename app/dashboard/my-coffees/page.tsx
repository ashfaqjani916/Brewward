'use client'

import React, { useState, useEffect } from 'react'
import { IconCoffee } from '@tabler/icons-react'
import axios from 'axios'

interface Coffee {
  id: number
  type: string
  createdAt: string
}

const MyCoffees: React.FC = () => {
  const [coffees, setCoffees] = useState<Coffee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const response = await axios.get('/api/coffee', {
          params: { userId: 1 }, // Replace with actual user ID
        })
        setCoffees(response.data.data)
      } catch (err) {
        setError('Failed to load coffee history')
        console.error('Error fetching coffees:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCoffees()
  }, [])

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coffees.map((coffee) => (
            <div key={coffee.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <IconCoffee className="w-6 h-6 text-amber-600" />
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
  )
}

export default MyCoffees
