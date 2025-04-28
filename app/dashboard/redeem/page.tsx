'use client'

import React, { useState, useRef, useEffect } from 'react'
import { IconCoffee, IconMilk, IconSquareRounded, IconCookie, IconSnowflake, IconCheck } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuthStore } from '@/lib/store/authStore'

interface Ingredient {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  inMug: number
  available: number
}

const coffeeRecipes: Record<string, string[]> = {
  Latte: ['milk', 'coffee', 'sugar'],
  Mocha: ['milk', 'coffee', 'chocochips', 'sugar'],
  IcedCoffee: ['ice', 'coffee', 'milk', 'sugar'],
}

const Dashboard: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'coffee', name: 'Coffee', icon: <IconCoffee />, color: '#6F4E37', inMug: 0, available: 0 },
    { id: 'milk', name: 'Milk', icon: <IconMilk />, color: '#F5F5F5', inMug: 0, available: 0 },
    { id: 'sugar', name: 'Sugar', icon: <IconSquareRounded />, color: '#FFFFFF', inMug: 0, available: 0 },
    { id: 'chocochips', name: 'Choco Chips', icon: <IconCookie />, color: '#7B3F00', inMug: 0, available: 0 },
    { id: 'ice', name: 'Ice', icon: <IconSnowflake />, color: '#E0F7FA', inMug: 0, available: 0 },
  ])
  const [coffeeType, setCoffeeType] = useState<'Latte' | 'Mocha' | 'IcedCoffee' | null>(null)
  const [redeemable, setRedeemable] = useState<boolean>(false)
  const [redeeming, setRedeeming] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const mugRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  const phoneNumber = useAuthStore((state) => state.phoneNumber)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        // const token = useAuthStore.getState().token

        // console.log(phoneNumber)
        const res = await axios.get(`/api/user/${phoneNumber}`)
        const data = await res.data.user

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
              inMug: 0,
            }
          })
        )
      } catch (error) {
        console.error('Error fetching ingredients:', error)
        setError('Failed to load ingredients')
      }
    }

    fetchIngredients()
  }, [])

  // ✅ Updated redeemable logic (based on what's added to mug)
  useEffect(() => {
    if (coffeeType) {
      const requiredIngredients = coffeeRecipes[coffeeType]
      const hasCorrectIngredients = requiredIngredients.every((ingId) => {
        const ingredient = ingredients.find((i) => i.id === ingId)
        return ingredient && ingredient.inMug >= 1
      })
      setRedeemable(hasCorrectIngredients)
    } else {
      setRedeemable(false)
    }
  }, [coffeeType, ingredients])

  const calculateCoffeeColor = (): string => {
    const total = ingredients.reduce((sum, ing) => sum + ing.inMug, 0)
    if (total === 0) return '#6F4E37'
    const mix = ingredients.reduce(
      (acc, ing) => {
        const ratio = ing.inMug / total
        const r = parseInt(ing.color.slice(1, 3), 16)
        const g = parseInt(ing.color.slice(3, 5), 16)
        const b = parseInt(ing.color.slice(5, 7), 16)
        return {
          r: acc.r + r * ratio,
          g: acc.g + g * ratio,
          b: acc.b + b * ratio,
        }
      },
      { r: 0, g: 0, b: 0 }
    )
    return `rgb(${Math.round(mix.r)}, ${Math.round(mix.g)}, ${Math.round(mix.b)})`
  }

  const totalAmount = ingredients.reduce((sum, ing) => sum + ing.inMug, 0)
  const coffeeColor = calculateCoffeeColor()
  const coffeeHeight = `${Math.min(90, totalAmount * 12)}%`
  const coffeeOpacity = 0.5 + Math.min(1, totalAmount / 10)

  const handleDrop = (id: string): void => {
    setIngredients((prev) => prev.map((ing) => (ing.id === id && ing.available > 0 ? { ...ing, inMug: ing.inMug + 1, available: ing.available - 1 } : ing)))
  }

  const handleDragEnd = (e: any, id: string): void => {
    const bounds = mugRef.current?.getBoundingClientRect()
    const { clientX, clientY } = e
    if (bounds && clientX >= bounds.left && clientX <= bounds.right && clientY >= bounds.top && clientY <= bounds.bottom) {
      handleDrop(id)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent, id: string): void => {
    if (!mugRef.current) return
    const bounds = mugRef.current.getBoundingClientRect()
    const touch = e.changedTouches[0]
    if (touch.clientX >= bounds.left && touch.clientX <= bounds.right && touch.clientY >= bounds.top && touch.clientY <= bounds.bottom) {
      handleDrop(id)
    }
  }

  const handleRedeem = async (): Promise<void> => {
    if (!redeemable || !coffeeType) return
    setRedeeming(true)
    setError(null)

    try {
      const res = await axios.get(`/api/user/${phoneNumber}`)
      const data = await res.data.user

      const makeCoffee = await axios.post('/api/coffee', {
        type: coffeeType,
        userId: data.id,
      })

      // Reload ingredient data
      const response = await axios.get('/api/inventory/1')
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
            inMug: 0,
          }
        })
      )

      setCoffeeType(null)
    } catch (error: any) {
      console.error('Error redeeming coffee:', error)
      setError(error.response?.data?.error || 'Failed to redeem coffee')
    } finally {
      setRedeeming(false)
    }
  }

  // ✅ Your existing UI rendering stays unchanged
  // ✅ Just add the above logic in correct places

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-10">Redeem Your Coffee</h1>

        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setCoffeeType('Latte')} className={`py-2 px-4 rounded-lg ${coffeeType === 'Latte' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-800'} transition-all`}>
            Latte
          </button>
          <button onClick={() => setCoffeeType('Mocha')} className={`py-2 px-4 rounded-lg ${coffeeType === 'Mocha' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-800'} transition-all`}>
            Mocha
          </button>
          <button
            onClick={() => setCoffeeType('IcedCoffee')}
            className={`py-2 px-4 rounded-lg ${coffeeType === 'IcedCoffee' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-800'} transition-all`}
          >
            Iced Coffee
          </button>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="relative flex justify-center items-center mb-4 sm:mb-8 min-h-[220px]">
          {redeemable && !isMobile ? (
            <motion.div className="flex items-center space-x-4 sm:space-x-6" initial={{ x: 0 }} animate={{ x: -50 }} transition={{ type: 'spring', stiffness: 100, damping: 14 }}>
              <div className="relative w-40 sm:w-60 flex justify-center">
                <div ref={mugRef} className="relative w-40 h-40 sm:w-60 sm:h-60 bg-gray-300 rounded-b-[50%] border-4 border-gray-500 shadow-2xl overflow-hidden">
                  <motion.div
                    className="absolute bottom-0 left-0 w-full rounded-t-sm"
                    style={{
                      height: coffeeHeight,
                      backgroundColor: coffeeColor,
                      opacity: coffeeOpacity,
                      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.1), transparent 60%)',
                      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
                    }}
                    animate={{ height: coffeeHeight, backgroundColor: coffeeColor, opacity: coffeeOpacity }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-5 bg-white/20 rounded-t-full blur-sm" />
                  </motion.div>
                  <div className="absolute -right-8 sm:-right-10 top-1/2 transform -translate-y-1/2 w-10 sm:w-14 h-20 sm:h-28 rounded-full border-4 border-gray-400 bg-gray-200 shadow-inner" />
                  {redeemable && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-full p-1"
                    >
                      <IconCheck size={isMobile ? 16 : 20} />
                    </motion.div>
                  )}
                </div>
              </div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <button
                  onClick={handleRedeem}
                  disabled={!redeemable || redeeming}
                  className={`py-3 px-5 rounded-xl shadow-lg flex items-center justify-start transition-all ${redeeming ? 'bg-green-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}
                >
                  {redeeming ? (
                    <span className="flex items-center">
                      <IconCheck className="mr-2" size={20} />
                      Ordered!
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <IconCoffee className="mr-2" size={20} />
                      Redeem
                    </span>
                  )}
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div className="relative w-40 sm:w-60 flex justify-center" initial={{ x: 0 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 14 }}>
              <div ref={mugRef} className="relative w-40 h-40 sm:w-60 sm:h-60 bg-gray-300 rounded-b-[50%] border-4 border-gray-500 shadow-2xl overflow-hidden">
                <motion.div
                  className="absolute bottom-0 left-0 w-full rounded-t-sm"
                  style={{
                    height: coffeeHeight,
                    backgroundColor: coffeeColor,
                    opacity: coffeeOpacity,
                    backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.1), transparent 60%)',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
                  }}
                  animate={{ height: coffeeHeight, backgroundColor: coffeeColor, opacity: coffeeOpacity }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-5 bg-white/20 rounded-t-full blur-sm" />
                </motion.div>
                <div className="absolute -right-8 sm:-right-10 top-1/2 transform -translate-y-1/2 w-10 sm:w-14 h-20 sm:h-28 rounded-full border-4 border-gray-400 bg-gray-200 shadow-inner" />
                {redeemable && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-full p-1"
                  >
                    <IconCheck size={isMobile ? 16 : 20} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: redeemable ? 1 : 0, y: redeemable ? 0 : 20, pointerEvents: redeemable ? 'auto' : 'none' }}
          transition={{ duration: 0.3 }}
          className="sm:hidden w-full mb-6"
        >
          <button
            onClick={handleRedeem}
            disabled={!redeemable || redeeming}
            className={`w-full py-4 rounded-xl shadow-lg flex items-center justify-center transition-all ${redeeming ? 'bg-green-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}
          >
            {redeeming ? (
              <span className="flex items-center">
                <IconCheck className="mr-2" size={24} />
                Coffee Ordered!
              </span>
            ) : (
              <span className="flex items-center">
                <IconCoffee className="mr-2" size={24} />
                Redeem Coffee
              </span>
            )}
          </button>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-12 px-2">
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
              className="relative bg-white w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
            >
              <div className="mb-1">
                {React.cloneElement(ing.icon as React.ReactElement, {
                  color: '#6F4E37',
                  size: isMobile ? 24 : 32,
                })}
              </div>
              <span className="text-xs text-gray-600 font-medium">{ing.name}</span>
              <span className="absolute top-0 right-0 -mt-1 -mr-1 text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">{ing.available}</span>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Your Coffee Mixture</h2>
          <div className="space-y-2">
            {coffeeType && (
              <div className="mb-4">
                <h3 className="text-md font-medium text-gray-700">Required for {coffeeType}:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {coffeeRecipes[coffeeType].map((ing) => (
                    <li key={ing}>{ing.charAt(0).toUpperCase() + ing.slice(1)}</li>
                  ))}
                </ul>
              </div>
            )}
            {ingredients
              .filter((ing) => ing.inMug > 0)
              .map((ing) => (
                <div key={ing.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {React.cloneElement(ing.icon as React.ReactElement, {
                      color: '#6F4E37',
                      size: isMobile ? 20 : 24,
                      className: 'mr-2',
                    })}
                    <span className="text-sm sm:text-base">{ing.name}</span>
                  </div>
                  <span className="text-sm sm:text-base font-medium">
                    {ing.inMug} {ing.inMug === 1 ? 'unit' : 'units'}
                  </span>
                </div>
              ))}

            {ingredients.every((i) => i.inMug === 0) && !coffeeType && <p className="text-sm text-gray-500 italic">Drag ingredients to the mug to start customizing your coffee.</p>}

            {redeemable && !redeeming && <p className="text-sm text-green-600 font-medium mt-3">Your coffee is ready to be redeemed!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
