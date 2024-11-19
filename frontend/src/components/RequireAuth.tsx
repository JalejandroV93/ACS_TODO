// components/RequireAuth.tsx
'use client'
import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/auth'

interface RequireAuthProps {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      // Prevent infinite redirects by checking current path
      if (window.location.pathname !== '/') {
        router.push('/')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, router, window.location.pathname])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return user ? <>{children}</> : null
}