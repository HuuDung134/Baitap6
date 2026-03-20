import axios from 'axios'
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokens.js'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL,
  withCredentials: false,
})

let refreshPromise = null

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config
    const status = error?.response?.status

    if (!original || status !== 401 || original.__isRetry) {
      throw error
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearTokens()
      throw error
    }

    original.__isRetry = true

    refreshPromise =
      refreshPromise ??
      api
        .post('/api/auth/refresh-token', { refreshToken })
        .then((res) => {
          const accessToken = res?.data?.accessToken
          const newRefresh = res?.data?.refreshToken
          if (accessToken) setTokens({ accessToken, refreshToken: newRefresh })
          return accessToken
        })
        .catch((e) => {
          clearTokens()
          throw e
        })
        .finally(() => {
          refreshPromise = null
        })

    const newAccessToken = await refreshPromise
    original.headers = original.headers ?? {}
    original.headers.Authorization = `Bearer ${newAccessToken}`
    return api.request(original)
  },
)

