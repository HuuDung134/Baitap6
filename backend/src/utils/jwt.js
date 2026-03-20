import jwt from 'jsonwebtoken'

export function signAccessToken(payload) {
  const secret = process.env.JWT_ACCESS_SECRET || 'dev-access'
  const expiresIn = process.env.ACCESS_TOKEN_TTL || '15m'
  return jwt.sign(payload, secret, { expiresIn })
}

export function signRefreshToken(payload) {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev-refresh'
  const expiresIn = process.env.REFRESH_TOKEN_TTL || '7d'
  return jwt.sign(payload, secret, { expiresIn })
}

export function verifyAccessToken(token) {
  const secret = process.env.JWT_ACCESS_SECRET || 'dev-access'
  return jwt.verify(token, secret)
}

export function verifyRefreshToken(token) {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev-refresh'
  return jwt.verify(token, secret)
}

