import { createContext, useContext, useState, useCallback } from 'react'
import { loginUser, registerUser } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(localStorage.getItem('nexova_user') || null)
  const [token, setToken] = useState(localStorage.getItem('nexova_token') || null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async ({ userName, password }) => {
    setLoading(true); setError(null)
    try {
      const { data } = await loginUser({ userName, password })
      // Response is plain string: "Bearer eyJ..."
      const tokenStr = typeof data === 'string' ? data : data.toString()
      localStorage.setItem('nexova_token', tokenStr)
      localStorage.setItem('nexova_user', userName)
      setToken(tokenStr)
      setUser(userName)
      setLoading(false)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data || 'Login failed. Check credentials.'
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  const register = useCallback(async ({ userName, email, password }) => {
    setLoading(true); setError(null)
    try {
      const { data } = await registerUser({ userName, email: email, password })
      setLoading(false)
      return { success: true, message: data }
    } catch (err) {
      const msg = err.response?.data || 'Registration failed.'
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('nexova_token')
    localStorage.removeItem('nexova_user')
    setToken(null)
    setUser(null)