'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  getToken: () => string | null;
  updateUserFromToken: () => void; // Nuevo método
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getToken = () => {
    return Cookies.get('auth-token') || null
  }

  // Nuevo método para actualizar el usuario desde el token
  const updateUserFromToken = () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      if (Date.now() >= payload.exp * 1000) {
        logout()
        return
      }

      setUser({
        id: payload.user_id,
        username: payload.username,
        email: payload.email
      })
      setLoading(false)
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    }
  }

  useEffect(() => {
    updateUserFromToken()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logout = () => {
    Cookies.remove('auth-token')
    Cookies.remove('refresh-token')
    setUser(null)
    setLoading(false)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, getToken, updateUserFromToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}