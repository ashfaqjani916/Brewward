'use client'

import React, { useState, useRef, useEffect } from 'react'
import { IconCoffee, IconBottle, IconSquare, IconCookie, IconSnowflake, IconCheck, IconRocket } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuthStore } from '@/lib/store/authStore'

interface Ingredient {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  available: number
}

const TradePage: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'coffee', name: 'Coffee', icon: <IconCoffee />, color: '#6F4E37', available: 0 },
    { id: 'milk', name: 'Milk', icon: <IconBottle />, color: '#F5F5F5', available: 0 },
    { id: 'sugar', name: 'Sugar', icon: <IconSquare />, color: '#FFFFFF', available: 0 },
    { id: 'chocochips', name: 'Choco Chips', icon: <IconCookie />, color: '#7B3F00', available: 0 },
    { id: 'ice', name: 'Ice', icon: <IconSnowflake />, color: '#E0F7FA', available: 0 },
  ])

  const [rocketIngredient, setRocketIngredient] = useState<string | null>(null)
  const [isLaunching, setIsLaunching] = useState(false)
  const [launched, setLaunched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const rocketRef = useRef<HTMLDivElement>(null)

  const phoneNumber = useAuthStore((state) => state.phoneNumber)

  // Fetch ingredients inventory on component mount
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        // First get the user ID from the phone number
        const res = await axios.get(`/api/user/${phoneNumber}`)
        const data = await res.data.user

        // Then fetch the inventory for that user
        const response = await axios.get(`/api/inventory/${data.id}`)
        const fetchedData = response.data.data

        // Map the ingredient IDs from the API to our local ingredient IDs
        const idMap: { [key: number]: string } = {
          11: 'sugar',
          12: 'milk',
          13: 'ice',
          14: 'coffee',
          15: 'chocochips',
        }

        // Update the ingredients state with the fetched data
        setIngredients((prevIngredients) =>
          prevIngredients.map((ingredient) => {
            const matchedIngredient = fetchedData.find((item: { ingredientId: number; quantity: number }) => idMap[item.ingredientId] === ingredient.id)
            return {
              ...ingredient,
              available: matchedIngredient ? matchedIngredient.quantity : 0,
            }
          })
        )
      } catch (error) {
        console.error('Error fetching ingredients:', error)
        setError('Failed to load ingredients')
      }
    }

    fetchIngredients()
  }, [phoneNumber])

  const handleDrop = (id: string) => {
    if (!rocketIngredient) {
      setRocketIngredient(id)
      setIngredients((prev) => prev.map((ing) => (ing.id === id && ing.available > 0 ? { ...ing, available: ing.available - 1 } : ing)))
    }
  }

  const handleDragEnd = (e: any, id: string) => {
    const bounds = rocketRef.current?.getBoundingClientRect()
    const { clientX, clientY } = e
    if (bounds && clientX >= bounds.left && clientX <= bounds.right && clientY >= bounds.top && clientY <= bounds.bottom) {
      handleDrop(id)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent, id: string) => {
    const bounds = rocketRef.current?.getBoundingClientRect()
    const touch = e.changedTouches[0]
    if (bounds && touch.clientX >= bounds.left && touch.clientX <= bounds.right && touch.clientY >= bounds.top && touch.clientY <= bounds.bottom) {
      handleDrop(id)
    }
  }

  const handleLaunch = async () => {
    if (!rocketIngredient) return
    setIsLaunching(true)

    try {
      // Get user ID
      const res = await axios.get(`/api/user/${phoneNumber}`)
      const data = await res.data.user

      // Here you would add the API call to process the trade
      // For example:
      // await axios.post('/api/trade', {
      //   userId: data.id,
      //   ingredientId: rocketIngredient
      // })

      // Simulate the rocket launch with setTimeout
      setTimeout(() => {
        setLaunched(true)
        setTimeout(() => {
          // Refresh ingredient data after successful trade
          const fetchUpdatedIngredients = async () => {
            try {
              const response = await axios.get(`/api/inventory/${data.id}`)
              const fetchedData = response.data.data

              const idMap: { [key: number]: string } = {
                11: 'sugar',
                12: 'milk',
                13: 'ice',
                14: 'coffee',
                15: 'chocochips',
              }

              setIngredients((prevIngredients) =>
                prevIngredients.map((ingredient) => {
                  const matchedIngredient = fetchedData.find((item: { ingredientId: number; quantity: number }) => idMap[item.ingredientId] === ingredient.id)
                  return {
                    ...ingredient,
                    available: matchedIngredient ? matchedIngredient.quantity : 0,
                  }
                })
              )
            } catch (error) {
              console.error('Error refreshing ingredients:', error)
              setError('Failed to refresh ingredients')
            }
          }

          fetchUpdatedIngredients()
          setRocketIngredient(null)
          setIsLaunching(false)
          setLaunched(false)
        }, 1000)
      }, 1500)
    } catch (error) {
      console.error('Error during trade:', error)
      setError('Failed to process trade')
      setIsLaunching(false)
    }
  }

  const getIngredientData = (id: string | null) => ingredients.find((ing) => ing.id === id)

  const rocketContent = getIngredientData(rocketIngredient)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">🚀 Trade Ingredients</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="relative flex justify-center items-end min-h-[300px] sm:min-h-[360px] mb-10">
          {!launched && (
            <motion.div
              ref={rocketRef}
              initial={{ y: 0 }}
              animate={isLaunching ? { y: -600, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="flex flex-col items-center space-y-2"
            >
              <IconRocket size={96} className="text-gray-700" />
              {rocketContent ? (
                <div className="text-sm text-gray-800 flex flex-col items-center">
                  {React.cloneElement(rocketContent.icon as React.ReactElement, {
                    size: 24,
                    color: rocketContent.color,
                  })}
                  <span className="font-medium">{rocketContent.name}</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Drag an ingredient to the rocket</p>
              )}
            </motion.div>
          )}
        </div>

        <div className="text-center mb-10">
          <button
            onClick={handleLaunch}
            disabled={!rocketIngredient || isLaunching}
            className={`py-3 px-6 rounded-xl shadow-lg transition-all ${
              !rocketIngredient || isLaunching ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {isLaunching ? (
              <span className="flex items-center justify-center">
                <IconRocket className="mr-2" size={20} />
                Launching...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <IconRocket className="mr-2" size={20} />
                Launch Rocket
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {ingredients.map((ing) => (
            <motion.div
              key={ing.id}
              drag
              dragSnapToOrigin
              dragElastic={0.2}
              dragMomentum={false}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onDragEnd={(e) => handleDragEnd(e, ing.id)}
              onTouchEnd={(e) => handleTouchEnd(e, ing.id)}
              className="relative bg-white w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <div className="mb-1">
                {React.cloneElement(ing.icon as React.ReactElement, {
                  color: '#6F4E37',
                  size: 28,
                })}
              </div>
              <span className="text-xs text-gray-600 font-medium">{ing.name}</span>
              <span className="absolute top-0 right-0 -mt-1 -mr-1 text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">{ing.available}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TradePage
