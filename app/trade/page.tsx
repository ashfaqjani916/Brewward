// 'use client'

// import React, { useState, useEffect } from 'react'
// import { IconCoffee, IconMilk, IconSquareRounded, IconCookie, IconDroplet, IconLink } from '@tabler/icons-react'
// import { motion } from 'framer-motion'

// interface Ingredient {
//   id: string
//   name: string
//   icon: React.ReactNode
//   color: string
//   available: number
// }

// const Page = () => {
//   const [ingredients, setIngredients] = useState<Ingredient[]>([
//     { id: 'espresso', name: 'Espresso', icon: <IconCoffee size={32} />, color: '#6F4E37', available: 5 },
//     { id: 'milk', name: 'Milk', icon: <IconMilk size={32} />, color: '#F5F5F5', available: 5 },
//     { id: 'sugar', name: 'Sugar', icon: <IconSquareRounded size={32} />, color: '#FFFFFF', available: 5 },
//     { id: 'chocolate', name: 'Chocolate', icon: <IconCookie size={32} />, color: '#7B3F00', available: 5 },
//     { id: 'cream', name: 'Cream', icon: <IconDroplet size={32} />, color: '#FFFDD0', available: 5 },
//   ])

//   const [offer, setOffer] = useState<{ [key: string]: number }>({})
//   const [generatedLink, setGeneratedLink] = useState<string | null>(null)
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 640)
//     }
//     handleResize()
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   const handleOfferChange = (id: string, delta: number) => {
//     setOffer((prev) => {
//       const nextAmount = Math.max(0, (prev[id] || 0) + delta)
//       return { ...prev, [id]: nextAmount }
//     })
//   }

//   const generateTradeLink = () => {
//     const query = new URLSearchParams()
//     Object.entries(offer).forEach(([key, amount]) => {
//       if (amount > 0) query.append(key, String(amount))
//     })
//     setGeneratedLink(`${window.location.origin}/trade?${query.toString()}`)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12">🔁 Trade Your Ingredients</h1>

//         {/* Offer Ingredients */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 sm:mb-12">
//           {ingredients.map((ingredient) => (
//             <div key={ingredient.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
//               {React.cloneElement(ingredient.icon as React.ReactElement, {
//                 size: isMobile ? 24 : 32,
//                 color: '#6F4E37',
//               })}
//               <p className="text-sm font-medium text-gray-700 mt-2">{ingredient.name}</p>
//               <p className="text-xs text-gray-500">Available: {ingredient.available}</p>

//               <div className="flex items-center mt-3 space-x-2">
//                 <button
//                   onClick={() => handleOfferChange(ingredient.id, -1)}
//                   className="bg-gray-200 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-300"
//                   disabled={(offer[ingredient.id] || 0) <= 0}
//                 >
//                   -
//                 </button>
//                 <span className="font-semibold">{offer[ingredient.id] || 0}</span>
//                 <button
//                   onClick={() => {
//                     if ((offer[ingredient.id] || 0) < ingredient.available) handleOfferChange(ingredient.id, 1)
//                   }}
//                   className="bg-amber-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-amber-600"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Generate Link */}
//         {!generatedLink ? (
//           <div className="text-center">
//             <motion.button
//               whileTap={{ scale: 0.95 }}
//               whileHover={{ scale: 1.03 }}
//               onClick={generateTradeLink}
//               className="bg-amber-500 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-amber-600 transition"
//             >
//               Generate Trade Link
//             </motion.button>
//           </div>
//         ) : (
//           <div className="bg-white p-6 rounded-xl shadow-md text-center">
//             <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Trade Link Generated!</h2>
//             <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-lg p-2 mb-4">
//               <IconLink className="text-amber-500" />
//               <a
//                 href={generatedLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-amber-600 font-mono break-all underline"
//               >
//                 {generatedLink}
//               </a>
//             </div>
//             <p className="text-sm text-gray-600">Share this link with your friend to complete the trade.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Page

// 'use client'

// import React, { useState, useRef, useEffect } from 'react'
// import { IconCoffee, IconMilk, IconSquareRounded, IconCookie, IconDroplet, IconRocket } from '@tabler/icons-react'
// import { motion } from 'framer-motion'

// interface Ingredient {
//   id: string
//   name: string
//   icon: React.ReactNode
//   color: string
//   inCargo: number
//   available: number
// }

// const Page = () => {
//   const [ingredients, setIngredients] = useState<Ingredient[]>([
//     { id: 'espresso', name: 'Espresso', icon: <IconCoffee size={32} />, color: '#6F4E37', inCargo: 0, available: 5 },
//     { id: 'milk', name: 'Milk', icon: <IconMilk size={32} />, color: '#F5F5F5', inCargo: 0, available: 5 },
//     { id: 'sugar', name: 'Sugar', icon: <IconSquareRounded size={32} />, color: '#FFFFFF', inCargo: 0, available: 5 },
//     { id: 'chocolate', name: 'Chocolate', icon: <IconCookie size={32} />, color: '#7B3F00', inCargo: 0, available: 5 },
//     { id: 'cream', name: 'Cream', icon: <IconDroplet size={32} />, color: '#FFFDD0', inCargo: 0, available: 5 },
//   ])

//   const rocketRef = useRef<HTMLDivElement>(null)
//   const [isMobile, setIsMobile] = useState(false)
//   const [isTravelling, setIsTravelling] = useState(false)

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 640)
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   const handleDrop = (ingredientId: string) => {
//     setIngredients(prev => prev.map(ing => ing.id === ingredientId && ing.available > 0 ? { ...ing, inCargo: ing.inCargo + 1, available: ing.available - 1 } : ing))
//   }

//   const handleDragEnd = (e: any, ingredientId: string) => {
//     const rocketBounds = rocketRef.current?.getBoundingClientRect()
//     const { clientX, clientY } = e

//     if (rocketBounds && clientX >= rocketBounds.left && clientX <= rocketBounds.right && clientY >= rocketBounds.top && clientY <= rocketBounds.bottom) {
//       handleDrop(ingredientId)
//     }
//   }

//   const handleTouchEnd = (e: React.TouchEvent, ingredientId: string) => {
//     if (!rocketRef.current) return
//     const rocketBounds = rocketRef.current.getBoundingClientRect()
//     const { clientX, clientY } = e.changedTouches[0]

//     if (clientX >= rocketBounds.left && clientX <= rocketBounds.right && clientY >= rocketBounds.top && clientY <= rocketBounds.bottom) {
//       handleDrop(ingredientId)
//     }
//   }

//   const handleGenerateLink = () => {
//     if (ingredients.some(ing => ing.inCargo > 0)) {
//       setIsTravelling(true)
//       setTimeout(() => {
//         setIsTravelling(false)
//         alert('Share this trade link: https://coffee-trade.app/trade/abc123')
//       }, 2500)
//     } else {
//       alert('Add items to the rocket before generating a link!')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-10">🚀 Trade Your Coffee Ingredients</h1>

//         <div className="flex justify-center mb-8 sm:mb-12">
//           <motion.div
//             ref={rocketRef}
//             className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gray-300 rounded-full border-4 border-gray-500 shadow-2xl flex items-center justify-center overflow-hidden"
//             animate={isTravelling ? { y: -300, opacity: 0 } : { y: 0, opacity: 1 }}
//             transition={{ type: 'spring', stiffness: 80, damping: 15 }}
//           >
//             <IconRocket size={isMobile ? 48 : 64} className="text-gray-700" />
//             {ingredients.some(ing => ing.inCargo > 0) && (
//               <div className="absolute bottom-0 left-0 right-0 text-center text-sm text-amber-600 font-semibold">{ingredients.reduce((sum, i) => sum + i.inCargo, 0)} Items</div>
//             )}
//           </motion.div>
//         </div>

//         <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-14 px-2">
//           {ingredients.map(ingredient => (
//             <motion.div
//               key={ingredient.id}
//               drag
//               dragSnapToOrigin
//               dragElastic={0.2}
//               dragMomentum={false}
//               whileTap={{ scale: 0.95 }}
//               whileHover={{ scale: 1.05 }}
//               onDragEnd={e => handleDragEnd(e, ingredient.id)}
//               onTouchEnd={e => handleTouchEnd(e, ingredient.id)}
//               className="relative bg-white w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
//             >
//               <div className="mb-1">
//                 {React.cloneElement(ingredient.icon as React.ReactElement, {
//                   color: '#6F4E37',
//                   size: isMobile ? 24 : 32,
//                 })}
//               </div>
//               <span className="text-xs text-gray-600 font-medium">{ingredient.name}</span>
//               <span className="absolute top-0 right-0 -mt-1 -mr-1 text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">{ingredient.available}</span>
//             </motion.div>
//           ))}
//         </div>

//         <div className="text-center">
//           <button
//             onClick={handleGenerateLink}
//             className="bg-amber-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-amber-600 transition"
//           >
//             Generate Trade Link
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


// export default Page;
// 'use client'

// import React, { useState, useRef, useEffect } from 'react'
// import { IconCoffee, IconMilk, IconSquareRounded, IconCookie, IconDroplet, IconRocket } from '@tabler/icons-react'
// import { motion } from 'framer-motion'

// interface Ingredient {
//   id: string
//   name: string
//   icon: React.ReactNode
//   color: string
//   inCargo: number
//   available: number
// }

// const Page = () => {
//   const [ingredients, setIngredients] = useState<Ingredient[]>([
//     { id: 'espresso', name: 'Espresso', icon: <IconCoffee size={32} />, color: '#6F4E37', inCargo: 0, available: 5 },
//     { id: 'milk', name: 'Milk', icon: <IconMilk size={32} />, color: '#F5F5F5', inCargo: 0, available: 5 },
//     { id: 'sugar', name: 'Sugar', icon: <IconSquareRounded size={32} />, color: '#FFFFFF', inCargo: 0, available: 5 },
//     { id: 'chocolate', name: 'Chocolate', icon: <IconCookie size={32} />, color: '#7B3F00', inCargo: 0, available: 5 },
//     { id: 'cream', name: 'Cream', icon: <IconDroplet size={32} />, color: '#FFFDD0', inCargo: 0, available: 5 },
//   ])

//   const rocketRef = useRef<HTMLDivElement>(null)
//   const [isMobile, setIsMobile] = useState(false)
//   const [isTravelling, setIsTravelling] = useState(false)
//   const [tradeLink, setTradeLink] = useState<string | null>(null)

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 640)
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   const handleDrop = (ingredientId: string) => {
//     setIngredients(prev =>
//       prev.map(ing =>
//         ing.id === ingredientId && ing.available > 0
//           ? { ...ing, inCargo: ing.inCargo + 1, available: ing.available - 1 }
//           : ing
//       )
//     )
//   }

//   const handleDragEnd = (e: any, ingredientId: string) => {
//     const rocketBounds = rocketRef.current?.getBoundingClientRect()
//     const { clientX, clientY } = e

//     if (
//       rocketBounds &&
//       clientX >= rocketBounds.left &&
//       clientX <= rocketBounds.right &&
//       clientY >= rocketBounds.top &&
//       clientY <= rocketBounds.bottom
//     ) {
//       handleDrop(ingredientId)
//     }
//   }

//   const handleTouchEnd = (e: React.TouchEvent, ingredientId: string) => {
//     if (!rocketRef.current) return
//     const rocketBounds = rocketRef.current.getBoundingClientRect()
//     const { clientX, clientY } = e.changedTouches[0]

//     if (
//       clientX >= rocketBounds.left &&
//       clientX <= rocketBounds.right &&
//       clientY >= rocketBounds.top &&
//       clientY <= rocketBounds.bottom
//     ) {
//       handleDrop(ingredientId)
//     }
//   }

//   const handleGenerateLink = () => {
//     if (ingredients.some(ing => ing.inCargo > 0)) {
//       setIsTravelling(true)
//       setTradeLink(null) // Clear previous link
//       setTimeout(() => {
//         setIsTravelling(false)
//         setTradeLink('https://coffee-trade.app/trade/abc123')
//       }, 2500)
//     } else {
//       alert('Add items to the rocket before generating a link!')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-10">
//           🚀 Trade Your Coffee Ingredients
//         </h1>

//         <div className="flex justify-center mb-8 sm:mb-12">
//           <motion.div
//             ref={rocketRef}
//             className="relative w-48 h-48 sm:w-64 sm:h-64 bg-gray-300 rounded-full border-4 border-gray-500 shadow-2xl flex items-center justify-center overflow-hidden"
//             animate={isTravelling ? { x: 500, opacity: 0 } : { x: 0, opacity: 1 }}
//             transition={{ type: 'spring', stiffness: 80, damping: 15 }}
//           >
//             <IconRocket size={isMobile ? 96 : 128} className="text-gray-700" />
//             {ingredients.some(ing => ing.inCargo > 0) && (
//               <div className="absolute bottom-0 left-0 right-0 text-center text-base text-amber-600 font-semibold">
//                 {ingredients.reduce((sum, i) => sum + i.inCargo, 0)} Items
//               </div>
//             )}
//           </motion.div>
//         </div>

//         <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-14 px-2">
//           {ingredients.map(ingredient => (
//             <motion.div
//               key={ingredient.id}
//               drag
//               dragSnapToOrigin
//               dragElastic={0.2}
//               dragMomentum={false}
//               whileTap={{ scale: 0.95 }}
//               whileHover={{ scale: 1.05 }}
//               onDragEnd={e => handleDragEnd(e, ingredient.id)}
//               onTouchEnd={e => handleTouchEnd(e, ingredient.id)}
//               className="relative bg-white w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
//             >
//               <div className="mb-1">
//                 {React.cloneElement(ingredient.icon as React.ReactElement, {
//                   color: '#6F4E37',
//                   size: isMobile ? 24 : 32,
//                 })}
//               </div>
//               <span className="text-xs text-gray-600 font-medium">{ingredient.name}</span>
//               <span className="absolute top-0 right-0 -mt-1 -mr-1 text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
//                 {ingredient.available}
//               </span>
//             </motion.div>
//           ))}
//         </div>

//         <div className="text-center">
//           <button
//             onClick={handleGenerateLink}
//             className="bg-amber-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-amber-600 transition"
//           >
//             Generate Trade Link
//           </button>

//           <div className="text-center mt-4">
//             {tradeLink && (
//               <div className="inline-flex items-center space-x-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
//                 <span className="text-gray-700">{tradeLink}</span>
//                 <button
//                   onClick={() => navigator.clipboard.writeText(tradeLink)}
//                   className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
//                 >
//                   Copy
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Page;


// 'use client'

// import React, { useState, useRef, useEffect } from 'react'
// import { IconCoffee, IconMilk, IconSquareRounded, IconCookie, IconDroplet, IconRocket } from '@tabler/icons-react'
// import { motion } from 'framer-motion'

// interface Ingredient {
//   id: string
//   name: string
//   icon: React.ReactNode
//   color: string
//   inCargo: number
//   available: number
// }

// const Page = () => {
//   const [ingredients, setIngredients] = useState<Ingredient[]>([
//     { id: 'espresso', name: 'Espresso', icon: <IconCoffee size={32} />, color: '#6F4E37', inCargo: 0, available: 5 },
//     { id: 'milk', name: 'Milk', icon: <IconMilk size={32} />, color: '#F5F5F5', inCargo: 0, available: 5 },
//     { id: 'sugar', name: 'Sugar', icon: <IconSquareRounded size={32} />, color: '#FFFFFF', inCargo: 0, available: 5 },
//     { id: 'chocolate', name: 'Chocolate', icon: <IconCookie size={32} />, color: '#7B3F00', inCargo: 0, available: 5 },
//     { id: 'cream', name: 'Cream', icon: <IconDroplet size={32} />, color: '#FFFDD0', inCargo: 0, available: 5 },
//   ])

//   const rocketRef = useRef<HTMLDivElement>(null)
//   const [isMobile, setIsMobile] = useState(false)
//   const [isTravelling, setIsTravelling] = useState(false)
//   const [tradeLink, setTradeLink] = useState<string | null>(null)

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 640)
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   const handleDrop = (ingredientId: string) => {
//     // Check if the rocket is empty before adding
//     const totalInCargo = ingredients.reduce((sum, ing) => sum + ing.inCargo, 0)
//     if (totalInCargo > 0) {
//       alert('You can only load one item at a time! 🚀')
//       return
//     }

//     setIngredients(prev =>
//       prev.map(ing =>
//         ing.id === ingredientId && ing.available > 0
//           ? { ...ing, inCargo: ing.inCargo + 1, available: ing.available - 1 }
//           : ing
//       )
//     )
//   }

//   const handleDragEnd = (e: any, ingredientId: string) => {
//     const rocketBounds = rocketRef.current?.getBoundingClientRect()
//     const { clientX, clientY } = e

//     if (
//       rocketBounds &&
//       clientX >= rocketBounds.left &&
//       clientX <= rocketBounds.right &&
//       clientY >= rocketBounds.top &&
//       clientY <= rocketBounds.bottom
//     ) {
//       handleDrop(ingredientId)
//     }
//   }

//   const handleTouchEnd = (e: React.TouchEvent, ingredientId: string) => {
//     if (!rocketRef.current) return
//     const rocketBounds = rocketRef.current.getBoundingClientRect()
//     const { clientX, clientY } = e.changedTouches[0]

//     if (
//       clientX >= rocketBounds.left &&
//       clientX <= rocketBounds.right &&
//       clientY >= rocketBounds.top &&
//       clientY <= rocketBounds.bottom
//     ) {
//       handleDrop(ingredientId)
//     }
//   }

//   const handleGenerateLink = () => {
//     if (ingredients.some(ing => ing.inCargo > 0)) {
//       setIsTravelling(true)
//       setTradeLink(null) // Clear previous link
//       setTimeout(() => {
//         setIsTravelling(false)
//         setTradeLink('https://coffee-trade.app/trade/abc123')
//       }, 2500)
//     } else {
//       alert('Add an item to the rocket before generating a link!')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-10">
//           🚀 Trade Your Coffee Ingredients
//         </h1>

//         <div className="flex justify-center mb-8 sm:mb-12">
//           <motion.div
//             ref={rocketRef}
//             className="relative w-48 h-48 sm:w-64 sm:h-64 bg-gray-300 rounded-full border-4 border-gray-500 shadow-2xl flex items-center justify-center overflow-hidden"
//             animate={isTravelling ? { x: 500, opacity: 0 } : { x: 0, opacity: 1 }}
//             transition={{ type: 'spring', stiffness: 80, damping: 15 }}
//           >
//             <IconRocket size={isMobile ? 96 : 128} className="text-gray-700" />
//             {ingredients.some(ing => ing.inCargo > 0) && (
//               <div className="absolute bottom-0 left-0 right-0 text-center text-base text-amber-600 font-semibold">
//                 {ingredients.reduce((sum, i) => sum + i.inCargo, 0)} Item
//               </div>
//             )}
//           </motion.div>
//         </div>

//         <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-14 px-2">
//           {ingredients.map(ingredient => (
//             <motion.div
//               key={ingredient.id}
//               drag
//               dragSnapToOrigin
//               dragElastic={0.2}
//               dragMomentum={false}
//               whileTap={{ scale: 0.95 }}
//               whileHover={{ scale: 1.05 }}
//               onDragEnd={e => handleDragEnd(e, ingredient.id)}
//               onTouchEnd={e => handleTouchEnd(e, ingredient.id)}
//               className="relative bg-white w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
//             >
//               <div className="mb-1">
//                 {React.cloneElement(ingredient.icon as React.ReactElement, {
//                   color: '#6F4E37',
//                   size: isMobile ? 24 : 32,
//                 })}
//               </div>
//               <span className="text-xs text-gray-600 font-medium">{ingredient.name}</span>
//               <span className="absolute top-0 right-0 -mt-1 -mr-1 text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
//                 {ingredient.available}
//               </span>
//             </motion.div>
//           ))}
//         </div>

//         <div className="text-center">
//           <button
//             onClick={handleGenerateLink}
//             className="bg-amber-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-amber-600 transition"
//           >
//             Generate Trade Link
//           </button>

//           <div className="text-center mt-4">
//             {tradeLink && (
//               <div className="inline-flex items-center space-x-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
//                 <span className="text-gray-700">{tradeLink}</span>
//                 <button
//                   onClick={() => navigator.clipboard.writeText(tradeLink)}
//                   className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
//                 >
//                   Copy
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Page


'use client'

import React, { useState, useRef, useEffect } from 'react'
import { IconCoffee, IconMilk, IconSquareRounded, IconCookie, IconDroplet, IconRocket } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

interface Ingredient {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  inCargo: number
  available: number
}

const Page = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'espresso', name: 'Espresso', icon: <IconCoffee size={32} />, color: '#6F4E37', inCargo: 0, available: 5 },
    { id: 'milk', name: 'Milk', icon: <IconMilk size={32} />, color: '#F5F5F5', inCargo: 0, available: 5 },
    { id: 'sugar', name: 'Sugar', icon: <IconSquareRounded size={32} />, color: '#FFFFFF', inCargo: 0, available: 5 },
    { id: 'chocolate', name: 'Chocolate', icon: <IconCookie size={32} />, color: '#7B3F00', inCargo: 0, available: 5 },
    { id: 'cream', name: 'Cream', icon: <IconDroplet size={32} />, color: '#FFFDD0', inCargo: 0, available: 5 },
  ])

  const rocketRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTravelling, setIsTravelling] = useState(false)
  const [tradeLink, setTradeLink] = useState<string | null>(null)
  const [cargoFullAnimation, setCargoFullAnimation] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDrop = (ingredientId: string) => {
    const totalInCargo = ingredients.reduce((sum, ing) => sum + ing.inCargo, 0)
    if (totalInCargo > 0) {
      toast.error('You can only load one item at a time! 🚀')
      setCargoFullAnimation(true)  // trigger cargo full animation
      setTimeout(() => setCargoFullAnimation(false), 1500)  // reset
      return
    }

    setIngredients(prev =>
      prev.map(ing =>
        ing.id === ingredientId && ing.available > 0
          ? { ...ing, inCargo: ing.inCargo + 1, available: ing.available - 1 }
          : ing
      )
    )
  }

  const handleDragEnd = (e: any, ingredientId: string) => {
    const rocketBounds = rocketRef.current?.getBoundingClientRect()
    const { clientX, clientY } = e

    if (
      rocketBounds &&
      clientX >= rocketBounds.left &&
      clientX <= rocketBounds.right &&
      clientY >= rocketBounds.top &&
      clientY <= rocketBounds.bottom
    ) {
      handleDrop(ingredientId)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent, ingredientId: string) => {
    if (!rocketRef.current) return
    const rocketBounds = rocketRef.current.getBoundingClientRect()
    const { clientX, clientY } = e.changedTouches[0]

    if (
      clientX >= rocketBounds.left &&
      clientX <= rocketBounds.right &&
      clientY >= rocketBounds.top &&
      clientY <= rocketBounds.bottom
    ) {
      handleDrop(ingredientId)
    }
  }

  const handleGenerateLink = () => {
    if (ingredients.some(ing => ing.inCargo > 0)) {
      setIsTravelling(true)
      setTradeLink(null)

      setTimeout(() => {
        setIsTravelling(false)
        setTradeLink('https://coffee-trade.app/trade/abc123')
        toast.success('Trade link generated! ✅')

        // Reset cargo after generating the link
        setIngredients(prev =>
          prev.map(ing => (ing.inCargo > 0 ? { ...ing, inCargo: 0 } : ing))
        )
      }, 2500)

    } else {
      toast.error('Add an item to the rocket before generating a link! ☕')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-10">
          🚀 Trade Your Coffee Ingredients
        </h1>

        <div className="flex justify-center mb-8 sm:mb-12">
          <motion.div
            ref={rocketRef}
            className="relative w-48 h-48 sm:w-64 sm:h-64 bg-gray-300 rounded-full border-4 border-gray-500 shadow-2xl flex items-center justify-center overflow-hidden"
            animate={isTravelling ? { x: 500, opacity: 0 } : { x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          >
            <IconRocket size={isMobile ? 96 : 128} className="text-gray-700" />

            {ingredients.some(ing => ing.inCargo > 0) && (
              <div className="absolute bottom-0 left-0 right-0 text-center text-base text-amber-600 font-semibold">
                {ingredients.reduce((sum, i) => sum + i.inCargo, 0)} Item
              </div>
            )}

            {cargoFullAnimation && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full shadow-lg"
              >
                🚫 Cargo Full!
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-14 px-2">
          {ingredients.map(ingredient => (
            <motion.div
              key={ingredient.id}
              drag
              dragSnapToOrigin
              dragElastic={0.2}
              dragMomentum={false}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onDragEnd={e => handleDragEnd(e, ingredient.id)}
              onTouchEnd={e => handleTouchEnd(e, ingredient.id)}
              className="relative bg-white w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
            >
              <div className="mb-1">
                {React.cloneElement(ingredient.icon as React.ReactElement, {
                  color: '#6F4E37',
                  size: isMobile ? 24 : 32,
                })}
              </div>
              <span className="text-xs text-gray-600 font-medium">{ingredient.name}</span>
              <span className="absolute top-0 right-0 -mt-1 -mr-1 text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
                {ingredient.available}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleGenerateLink}
            className="bg-amber-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-amber-600 transition"
          >
            Generate Trade Link
          </button>

          <div className="text-center mt-4">
            {tradeLink && (
              <div className="inline-flex items-center space-x-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                <span className="text-gray-700">{tradeLink}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(tradeLink)}
                  className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page

