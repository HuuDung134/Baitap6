import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true, trim: true },
    type: { type: String, enum: ['one-way', 'daily', 'weekly', 'monthly'], default: 'one-way' },
    status: { type: String, enum: ['active', 'used', 'expired'], default: 'active', index: true },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    purchasedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    usedAt: { type: Date },
    entryStationCode: { type: String, trim: true },
  },
  { timestamps: true },
)

export const Ticket = mongoose.model('Ticket', ticketSchema)

