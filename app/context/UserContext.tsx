'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

interface User {
  userId: number
  email: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  setUser: () => { },
})

export const useUser = () => useContext(UserContext)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        const response = await axios.get('/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success) {
          setUser(response.data.data)
        } else {
          setError(response.data.message || 'Failed to fetch user details')
        }
      } catch (err) {
        setError('Failed to fetch user details')
        console.error('Error fetching user details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [])

  return <UserContext.Provider value={{ user, loading, error, setUser }}>{children}</UserContext.Provider>
}
