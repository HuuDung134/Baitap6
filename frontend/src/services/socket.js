import { io } from 'socket.io-client'

const baseURL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

let socket = null

export function connectSocket({ token } = {}) {
  if (socket) return socket
  socket = io(baseURL, {
    transports: ['websocket'],
    auth: token ? { token } : undefined,
    autoConnect: true,
    reconnection: true,
  })
  return socket
}

export function disconnectSocket() {
  if (!socket) return
  socket.disconnect()
  socket = null
}

export function getSocket() {
  return socket
}

