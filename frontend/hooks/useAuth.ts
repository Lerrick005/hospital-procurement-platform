'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/api/auth'
import { AuthUser } from '@/types/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = authService.getToken()
        if (token) {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth error:', error)
        authService.removeToken()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    authService.setToken(response.token)
    setUser(response.user)
    return response
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    router.push('/auth/login')
  }

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }
}
