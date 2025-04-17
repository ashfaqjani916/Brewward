'use client'

import React, { useState, useEffect } from 'react'
import { IconCoffee, IconMilk, IconSquareRounded, IconCookie, IconDroplet, IconLink } from '@tabler/icons-react'
import { motion } from 'framer-motion'

interface Ingredient {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  available: number
}

const Page = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'espresso', name: 'Espresso', icon: <IconCoffee size={32} />, color: '#6F4E37', available: 5 },
    { id: 'milk', name: 'Milk', icon: <IconMilk size={32} />, color: '#F5F5F5', available: 5 },
    { id: 'sugar', name: 'Sugar', icon: <IconSquareRounded size={32} />, color: '#FFFFFF', available: 5 },
    { id: 'chocolate', name: 'Chocolate', icon: <IconCookie size={32} />, color: '#7B3F00', available: 5 },
    { id: 'cream', name: 'Cream', icon: <IconDroplet size={32} />, color: '#FFFDD0', available: 5 },
  ])

  const [offer, setOffer] = useState<{ [key: string]: number }>({})
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleOfferChange = (id: string, delta: number) => {
    setOffer((prev) => {
      const nextAmount = Math.max(0, (prev[id] || 0) + delta)
      return { ...prev, [id]: nextAmount }
    })
  }

  const generateTradeLink = () => {
    const query = new URLSearchParams()
    Object.entries(offer).forEach(([key, amount]) => {
      if (amount > 0) query.append(key, String(amount))
    })
    setGeneratedLink(`${window.location.origin}/trade?${query.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12">🔁 Trade Your Ingredients</h1>

        {/* Offer Ingredients */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 sm:mb-12">
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
              {React.cloneElement(ingredient.icon as React.ReactElement, {
                size: isMobile ? 24 : 32,
                color: '#6F4E37',
              })}
              <p className="text-sm font-medium text-gray-700 mt-2">{ingredient.name}</p>
              <p className="text-xs text-gray-500">Available: {ingredient.available}</p>

              <div className="flex items-center mt-3 space-x-2">
                <button
                  onClick={() => handleOfferChange(ingredient.id, -1)}
                  className="bg-gray-200 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-300"
                  disabled={(offer[ingredient.id] || 0) <= 0}
                >
                  -
                </button>
                <span className="font-semibold">{offer[ingredient.id] || 0}</span>
                <button
                  onClick={() => {
                    if ((offer[ingredient.id] || 0) < ingredient.available) handleOfferChange(ingredient.id, 1)
                  }}
                  className="bg-amber-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-amber-600"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Generate Link */}
        {!generatedLink ? (
          <div className="text-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={generateTradeLink}
              className="bg-amber-500 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-amber-600 transition"
            >
              Generate Trade Link
            </motion.button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Trade Link Generated!</h2>
            <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-lg p-2 mb-4">
              <IconLink className="text-amber-500" />
              <a
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 font-mono break-all underline"
              >
                {generatedLink}
              </a>
            </div>
            <p className="text-sm text-gray-600">Share this link with your friend to complete the trade.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
