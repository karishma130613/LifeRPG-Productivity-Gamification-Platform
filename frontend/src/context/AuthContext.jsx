import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/services'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('liferpg_token')
    const storedUser  = localStorage.getItem('liferpg_user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('liferpg_token')
        localStorage.removeItem('liferpg_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials)
    setToken(data.accessToken)
    setUser({ id: data.userId, username: data.username, email: data.email })
    localStorage.setItem('liferpg_token', data.accessToken)
    localStorage.setItem('liferpg_user', JSON.stringify({ id: data.userId, username: data.username, email: data.email }))
    return data
  }, [])

  const register = useCallback(async (credentials) => {
    const data = await authService.register(credentials)
    setToken(data.accessToken)
    setUser({ id: data.userId, username: data.username, email: data.email })
    localStorage.setItem('liferpg_token', data.accessToken)
    localStorage.setItem('liferpg_user', JSON.stringify({ id: data.userId, username: data.username, email: data.email }))
    return data
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('liferpg_token')
    localStorage.removeItem('liferpg_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
