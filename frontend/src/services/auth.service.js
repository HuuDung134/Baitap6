import { api } from './api.js'
import { clearTokens, setTokens } from './tokens.js'

export async function register({ name, email, password }) {
  const res = await api.post('/api/auth/register', { name, email, password })
  return res.data
}

export async function login({ email, password }) {
  const res = await api.post('/api/auth/login', { email, password })
  const accessToken = res?.data?.accessToken
  const refreshToken = res?.data?.refreshToken
  if (accessToken || refreshToken) setTokens({ accessToken, refreshToken })
  return res.data
}

export async function logout() {
  try {
    await api.post('/api/auth/logout')
  } finally {
    clearTokens()
  }
}

export async function getMe() {
  const res = await api.get('/api/users/me')
  return res.data
}

