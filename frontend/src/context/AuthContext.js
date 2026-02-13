// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react'
import api, { setAuthToken } from '../api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // ✅ loading state

  // Login function
  const login = async (data) => {
    try {
      const res = await api.post('/accounts/login', data)
      const { token, user } = res.data

      localStorage.setItem('token', token)
      setAuthToken(token)
      setUser(user)

      return user
    } catch (err) {
      throw err
    }
  }

  // Admin login function
  const adminLogin = async (data) => {
    try {
      const res = await api.post('/admin/login', data)
      const { token, user } = res.data

      localStorage.setItem('token', token)
      setAuthToken(token)
      setUser(user)

      return user
    } catch (err) {
      throw err
    }
  }

  // Signup function
  const signup = async (data) => {
    try {
      const res = await api.post('/accounts/signup', data)
      const { token, user } = res.data

      localStorage.setItem('token', token)
      setAuthToken(token)
      setUser(user)
    } catch (err) {
      throw err
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await api.post('/accounts/logout')
    } catch (err) {
      console.error(err)
    }
    localStorage.removeItem('token')
    setAuthToken(null)
    setUser(null)
  }

  // Check token on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        setAuthToken(token)
        try {
          const res = await api.post('/accounts/authentication')
          setUser(res.data.user)
        } catch (err) {
          console.error('Token invalid, logging out')
          localStorage.removeItem('token')
          setAuthToken(null)
          setUser(null)
        }
      }
      setLoading(false) // ✅ auth check done
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, adminLogin, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
