import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null
let isConnecting = false

export const getSocket = (): Socket => {
  if (socket || isConnecting) {
    return socket!
  }

  isConnecting = true

  socket = io(process.env.NEXT_PUBLIC_API_URL!, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id)
    isConnecting = false
  })

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connect error:', err.message)
    isConnecting = false
  })

  return socket
}

export const disconnectSocket = () => {
  socket?.disconnect()
  socket = null
  isConnecting = false
}
