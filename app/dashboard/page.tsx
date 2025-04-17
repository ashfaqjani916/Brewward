'use client'

import React, { useState, useRef } from 'react'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">☕ Customize Your Coffee</h1>

        {/* Mug */}
        <div className="flex justify-center mb-12">
          <div ref={mugRef} className="relative w-60 h-60 bg-gray-300 rounded-b-[50%] border-4 border-gray-500 shadow-2xl overflow-hidden">
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

            {/* Handle */}
            <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-14 h-28 rounded-full border-4 border-gray-400 bg-gray-200 shadow-inner" />
          </div>
        </div>

        {/* Ingredient Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-14">
          {ingredients.map((ingredient) => (
            <motion.div
              key={`${ingredient.id}-${ingredient.inMug}-${ingredient.available}`}
              drag
              dragElastic={0.2}
              dragMomentum={false}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onDragEnd={(e) => handleDragEnd(e, ingredient.id)}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 items-center text-center border border-gray-100 cursor-grab active:cursor-grabbing"
            >
              <div style={{ color: ingredient.color }}>{ingredient.icon}</div>
              <h3 className="text-md font-semibold text-gray-700">{ingredient.name}</h3>
              <div className="text-sm text-gray-500">
                In Mug: {ingredient.inMug} | Left: {ingredient.available}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Points Section */}
        <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Your Points</h2>
            <p className="text-4xl font-bold text-amber-600 mt-1">1,250</p>
          </div>
          <div className="p-4 bg-amber-100 rounded-full shadow-inner">
            <IconCoffee size={36} className="text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
