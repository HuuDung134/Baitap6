import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['passenger', 'staff', 'inspector', 'admin'],
      default: 'passenger',
      index: true,
    },
    refreshTokens: { type: [String], default: [] },
  },
  { timestamps: true },
)

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash
    delete ret.refreshTokens
    return ret
  },
})

export const User = mongoose.model('User', userSchema)

