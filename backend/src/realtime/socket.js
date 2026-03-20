import { Server } from 'socket.io'
import { verifyAccessToken } from '../utils/jwt.js'

export function initRealtime(httpServer) {
  const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

  const io = new Server(httpServer, {
    cors: { origin, credentials: false },
  })

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      if (!token) return next()
      const decoded = verifyAccessToken(token)
      socket.data.userId = decoded.sub
      socket.data.role = decoded.role
      next()
    } catch {
      next()
    }
  })

  io.on('connection', (socket) => {
    // Minimal realtime wiring for the assignment
    socket.emit('connected', { ok: true, role: socket.data.role || null })
  })

  return io
}

