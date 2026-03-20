import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/auth.service.js'
import { getAccessToken } from '../services/tokens.js'
import { connectSocket, disconnectSocket } from '../services/socket.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const boot = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const me = await authService.getMe()
      setUser(me?.user ?? me)
      connectSocket({ token })
    } catch {
      setUser(null)
      disconnectSocket()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    boot()
  }, [boot])

  const login = useCallback(async ({ email, password }) => {
    const data = await authService.login({ email, password })
    const me = await authService.getMe()
    setUser(me?.user ?? me)
    connectSocket({ token: data?.accessToken || getAccessToken() })
    return data
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    return await authService.register({ name, email, password })
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
    disconnectSocket()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      role: user?.role ?? null,
      login,
      register,
      logout,
      refreshMe: boot,
    }),
    [user, loading, login, register, logout, boot],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

