// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react'
import api, { setAuthToken } from '../api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = async (data) => {
    const res = await api.post('/accounts/login', data)
    const { token, user } = res.data

    localStorage.setItem('token', token)
    setAuthToken(token)

    setUser(user)

    return user
  }

  const adminLogin = async (data) => {
    const res = await api.post('/admin/login', data) // <-- admin route
    const { token, user } = res.data

    localStorage.setItem('token', token)
    setAuthToken(token)

    setUser(user)
    return user
  }

  const signup = async (data) => {
    const res = await api.post('/accounts/signup', data)

    localStorage.setItem('token', res.data.token)
    setAuthToken(res.data.token)

    setUser(res.data.user)
  }

  const logout = async () => {
    await api.post('/accounts/logout')
    localStorage.removeItem('token')
    setAuthToken(null)
    setUser(null)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
      api
        .post('/accounts/authentication')
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token')
          setAuthToken(null)
        })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, adminLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
