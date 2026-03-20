import { StatusCodes } from 'http-status-codes'
import { verifyAccessToken } from '../utils/jwt.js'
import { User } from '../models/User.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [, token] = header.split(' ')
    if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing token' })

    const decoded = verifyAccessToken(token)
    const user = await User.findById(decoded.sub)
    if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found' })

    req.user = user
    next()
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' })
  }
}

export function requireRole(roles) {
  const allow = Array.isArray(roles) ? roles : [roles]
  return (req, res, next) => {
    const role = req.user?.role
    if (!role || !allow.includes(role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
    }
    next()
  }
}

