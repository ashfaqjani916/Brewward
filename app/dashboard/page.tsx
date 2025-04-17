'use client'

import React, { useState, useRef, useEffect } from 'react'
import { IconCoffee, IconMilk, IconSquareRounded, IconCookie, IconDroplet } from '@tabler/icons-react'
import { motion } from 'framer-motion'

interface Ingredient {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  inMug: number
  available: number
}

const Dashboard = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: 'espresso',
      name: 'Espresso',
      icon: <IconCoffee size={32} />,
      color: '#6F4E37',
      inMug: 0,
      available: 5,
    },
    {
      id: 'milk',
      name: 'Milk',
      icon: <IconMilk size={32} />,
      color: '#F5F5F5',
      inMug: 0,
      available: 5,
    },
    {
      id: 'sugar',
      name: 'Sugar',
      icon: <IconSquareRounded size={32} />,
      color: '#FFFFFF',
      inMug: 0,
      available: 5,
    },
    {
      id: 'chocolate',
      name: 'Chocolate',
      icon: <IconCookie size={32} />,
      color: '#7B3F00',
      inMug: 0,
      available: 5,
    },
    {
      id: 'cream',
      name: 'Cream',
      icon: <IconDroplet size={32} />,
      color: '#FFFDD0',
      inMug: 0,
      available: 5,
    },
  ])

  const mugRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Handle window resize and setup isMobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    // Set initial value
    checkMobile()

    // Add event listener
    window.addEventListener('resize', checkMobile)

    // Clean up
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const calculateCoffeeColor = () => {
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

  const handleDrop = (ingredientId: string) => {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === ingredientId && ing.available > 0
          ? {
              ...ing,
              inMug: ing.inMug + 1,
              available: ing.available - 1,
            }
          : ing
      )
    )
  }

  const handleDragEnd = (e: any, ingredientId: string) => {
    const mugBounds = mugRef.current?.getBoundingClientRect()
    const pointerX = e.clientX
    const pointerY = e.clientY

    if (mugBounds && pointerX >= mugBounds.left && pointerX <= mugBounds.right && pointerY >= mugBounds.top && pointerY <= mugBounds.bottom) {
      handleDrop(ingredientId)
    }
  }

  // Function to handle touch events for mobile
  const handleTouchEnd = (e: React.TouchEvent, ingredientId: string) => {
    if (!mugRef.current) return

    const mugBounds = mugRef.current.getBoundingClientRect()
    const touch = e.changedTouches[0]
    const touchX = touch.clientX
    const touchY = touch.clientY

    if (touchX >= mugBounds.left && touchX <= mugBounds.right && touchY >= mugBounds.top && touchY <= mugBounds.bottom) {
      handleDrop(ingredientId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-10">☕ Customize Your Coffee</h1>

        {/* Mug - Responsive sizing */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div ref={mugRef} className="relative w-40 h-40 sm:w-60 sm:h-60 bg-gray-300 rounded-b-[50%] border-4 border-gray-500 shadow-2xl overflow-hidden">
            {/* Coffee Liquid */}
            <motion.div
              className="absolute bottom-0 left-0 w-full rounded-t-sm"
              style={{
                height: coffeeHeight,
                backgroundColor: coffeeColor,
                opacity: coffeeOpacity,
                backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.1), transparent 60%)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
              }}
              animate={{
                height: coffeeHeight,
                backgroundColor: coffeeColor,
                opacity: coffeeOpacity,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute top-0 left-0 right-0 h-5 bg-white/20 rounded-t-full blur-sm" />
            </motion.div>

            {/* Handle - Adjusted for smaller screens */}
            <div className="absolute -right-8 sm:-right-10 top-1/2 transform -translate-y-1/2 w-10 sm:w-14 h-20 sm:h-28 rounded-full border-4 border-gray-400 bg-gray-200 shadow-inner" />
          </div>
        </div>

        {/* Ingredient Cards - Made scrollable on small screens with better sizing */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-14 px-2">
          {ingredients.map((ingredient) => (
            <motion.div
              key={ingredient.id}
              drag
              dragSnapToOrigin
              dragElastic={0.2}
              dragMomentum={false}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onDragEnd={(e) => handleDragEnd(e, ingredient.id)}
              onTouchEnd={(e) => handleTouchEnd(e, ingredient.id)}
              className="relative bg-white w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
            >
              <div className="mb-1">
                {/* Fixed the SSR issue by using a state variable instead of directly accessing window */}
                {React.cloneElement(ingredient.icon as React.ReactElement, {
                  color: '#6F4E37',
                  size: isMobile ? 24 : 32,
                })}
              </div>
              <span className="text-xs text-gray-600 font-medium">{ingredient.name}</span>
              <span className="absolute top-0 right-0 -mt-1 -mr-1 text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">{ingredient.available}</span>
            </motion.div>
          ))}
        </div>

        {/* Points Section - Made responsive */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Your Points</h2>
            <p className="text-3xl sm:text-4xl font-bold text-amber-600 mt-1">1,250</p>
          </div>
          <div className="p-3 sm:p-4 bg-amber-100 rounded-full shadow-inner">
            <IconCoffee size={isMobile ? 28 : 36} className="text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
