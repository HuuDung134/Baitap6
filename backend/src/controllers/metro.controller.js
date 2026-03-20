import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { Ticket } from '../models/Ticket.js'

const validateSchema = Joi.object({
  stationCode: Joi.string().min(1).max(50).required(),
})

function computeResult(ticket) {
  if (!ticket) return 'DENY'
  const now = new Date()
  if (ticket.expiresAt && ticket.expiresAt.getTime() <= now.getTime()) return 'EXPIRED'
  if (ticket.status === 'expired') return 'EXPIRED'
  if (ticket.status === 'used') return 'DENY'
  if (ticket.status === 'active') return 'ALLOW'
  return 'DENY'
}

export async function validateEntry(req, res) {
  const { value, error } = validateSchema.validate(req.body)
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })

  const code = req.params.code
  const ticket = await Ticket.findOne({ code })
  const result = computeResult(ticket)

  if (ticket && result === 'ALLOW') {
    ticket.status = 'used'
    ticket.usedAt = new Date()
    ticket.entryStationCode = value.stationCode
    await ticket.save()
  }

  res.json({
    result,
    ticket: ticket
      ? {
          code: ticket.code,
          type: ticket.type,
          status: ticket.status,
          expiresAt: ticket.expiresAt,
          usedAt: ticket.usedAt,
          entryStationCode: ticket.entryStationCode,
        }
      : null,
  })
}

export async function manualInspection(req, res) {
  const code = req.params.code
  const ticket = await Ticket.findOne({ code })
  if (!ticket) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Ticket not found' })

  const now = new Date()
  let status = ticket.status
  if (ticket.expiresAt && ticket.expiresAt.getTime() <= now.getTime() && status !== 'expired') {
    status = 'expired'
  }

  res.json({
    ticket: {
      code: ticket.code,
      type: ticket.type,
      status,
      purchasedAt: ticket.purchasedAt,
      expiresAt: ticket.expiresAt,
      usedAt: ticket.usedAt,
      entryStationCode: ticket.entryStationCode,
      ownerUserId: ticket.ownerUserId,
    },
  })
}

