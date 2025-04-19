'use client'

import React, { useState, useEffect } from 'react'
import { IconExchange, IconCoffee } from '@tabler/icons-react'
import axios from 'axios'

interface Trade {
  id: number
  senderId: number
  receiverId: number
  status: string
  createdAt: string
  offeredItems: { name: string; quantity: number }[]
  requestedItems: { name: string; quantity: number }[]
}

const TradeCoffee: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await axios.get('/api/trade', {
          params: { userId: 1 }, // Replace with actual user ID
        })
        setTrades(response.data.data)
      } catch (err) {
        setError('Failed to load trades')
        console.error('Error fetching trades:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [])

  const handleAcceptTrade = async (tradeId: number) => {
    try {
      await axios.post('/api/trade/accept', { tradeId })
      // Refresh trades after accepting
      const response = await axios.get('/api/trade', {
        params: { userId: 1 },
      })
      setTrades(response.data.data)
    } catch (err) {
      setError('Failed to accept trade')
      console.error('Error accepting trade:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-amber-900">Trade Coffee</h2>
        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">Create New Trade</button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {trades.map((trade) => (
            <div key={trade.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <IconExchange className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-900">Trade #{trade.id}</h3>
                    <p className="text-sm text-amber-600">{new Date(trade.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${trade.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{trade.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Offered Items</h4>
                  <ul className="space-y-2">
                    {trade.offeredItems.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <IconCoffee className="w-4 h-4 text-amber-600" />
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Requested Items</h4>
                  <ul className="space-y-2">
                    {trade.requestedItems.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <IconCoffee className="w-4 h-4 text-amber-600" />
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {trade.status === 'PENDING' && (
                <div className="mt-4 flex justify-end">
                  <button onClick={() => handleAcceptTrade(trade.id)} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    Accept Trade
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TradeCoffee
