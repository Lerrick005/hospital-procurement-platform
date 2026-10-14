'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedRoute(props: any) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/auth/login')
      }
    }, [isLoading, user, router])

    if (isLoading) {
      return React.createElement('div', {
        className: 'flex min-h-screen items-center justify-center',
        children: React.createElement(Loader2, {
          className: 'h-8 w-8 animate-spin text-healthcare-primary'
        })
      })
    }

    if (!user) {
      return null
    }

    return React.createElement(Component, props)
  }
}
