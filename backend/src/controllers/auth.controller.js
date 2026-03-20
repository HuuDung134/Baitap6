import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { User } from '../models/User.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js'

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(200).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
})

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
})

export async function register(req, res) {
  const { value, error } = registerSchema.validate(req.body)
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })

  const exists = await User.findOne({ email: value.email.toLowerCase() })
  if (exists) return res.status(StatusCodes.CONFLICT).json({ message: 'Email already exists' })

  const passwordHash = await bcrypt.hash(value.password, 10)
  const user = await User.create({
    name: value.name,
    email: value.email.toLowerCase(),
    passwordHash,
    role: 'passenger',
  })

  res.status(StatusCodes.CREATED).json({ user })
}

export async function login(req, res) {
  const { value, error } = loginSchema.validate(req.body)
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })

  const user = await User.findOne({ email: value.email.toLowerCase() })
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' })

  const ok = await bcrypt.compare(value.password, user.passwordHash)
  if (!ok) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' })

  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role })
  const refreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role })

  user.refreshTokens = Array.from(new Set([refreshToken, ...(user.refreshTokens || [])])).slice(0, 5)
  await user.save()

  res.json({ accessToken, refreshToken })
}

export async function refreshToken(req, res) {
  const { value, error } = refreshSchema.validate(req.body)
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })

  try {
    const decoded = verifyRefreshToken(value.refreshToken)
    const user = await User.findById(decoded.sub)
    if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid refresh token' })

    const has = (user.refreshTokens || []).includes(value.refreshToken)
    if (!has) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Refresh token revoked' })

    const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role })
    const newRefreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role })

    user.refreshTokens = [newRefreshToken, ...(user.refreshTokens || []).filter((t) => t !== value.refreshToken)].slice(0, 5)
    await user.save()

    res.json({ accessToken, refreshToken: newRefreshToken })
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid refresh token' })
  }
}

export async function logout(req, res) {
  // Optional: revoke all refresh tokens for current user if authenticated
  // Frontend always clears local tokens anyway.
  res.json({ ok: true })
}

