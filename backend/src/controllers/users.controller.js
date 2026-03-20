import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { User } from '../models/User.js'

export async function me(req, res) {
  res.json({ user: req.user })
}

export async function list(req, res) {
  const users = await User.find({}).sort({ createdAt: -1 }).select('-passwordHash -refreshTokens')
  res.json(users)
}

const roleSchema = Joi.object({
  role: Joi.string().valid('passenger', 'staff', 'inspector', 'admin').required(),
})

export async function updateRole(req, res) {
  const { value, error } = roleSchema.validate(req.body)
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: value.role },
    { new: true, runValidators: true, projection: '-passwordHash -refreshTokens' },
  )
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  res.json({ user })
}

