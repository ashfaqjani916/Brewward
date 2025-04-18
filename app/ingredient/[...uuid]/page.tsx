'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

function Page() {
  const params = useParams()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    const collectIngredient = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Please login first')
          setLoading(false)
          router.push('/')
          return
        }

        const uuid = params.uuid[0] // Get first param from catch-all route
        const response = await fetch(`/api/ingredient/${uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to collect ingredient')
        }

        setMessage(`Successfully collected ${data.ingredient}!`)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to collect ingredient')
      } finally {
        setLoading(false)
      }
    }

    collectIngredient()
  }, [params.uuid])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return <div className="flex flex-col items-center justify-center min-h-screen p-4">{error ? <div className="text-red-500">{error}</div> : <div className="text-green-500">{message}</div>}</div>
}

export default Page
