// 'use client'

// import { createContext, useContext, useEffect, useState } from 'react'
// import { Socket } from 'socket.io-client'
// import { getSocket, disconnectSocket } from '@/lib/socket/socket.client'
// import { useSelector } from 'react-redux'
// import { RootState } from '@/store/store'

// const SocketContext = createContext<Socket | null>(null)

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//   const customer = useSelector((state: RootState) => state.customer.customer)
//   const vendor = useSelector((state: RootState) => state.vendor.vendor)
//   const admin = useSelector((state: RootState) => state.admin.admin)

//   const isAuthenticated = !!customer || !!vendor || !!admin
//   const [socket, setSocket] = useState<Socket | null>(null)

//   useEffect(() => {
//     if (isAuthenticated) {
//       const socketInstance = getSocket()
//       setSocket(socketInstance)

//       return () => {
//         disconnectSocket()
//       }
//     }
//   }, [isAuthenticated])

//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   )
// }

// export const useSocket = () => useContext(SocketContext)

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { getSocket, disconnectSocket } from '@/lib/socket/socket.client'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const SocketContext = createContext<Socket | null>(null)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const customer = useSelector((state: RootState) => state.customer.customer)
  const vendor = useSelector((state: RootState) => state.vendor.vendor)
  const admin = useSelector((state: RootState) => state.admin.admin)

  const isAuthenticated = !!customer || !!vendor || !!admin
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      const socketInstance = getSocket()
      setSocket(socketInstance)
    }

    return () => {
      disconnectSocket()
      setSocket(null)
    }
  }, [isAuthenticated, customer, vendor, admin])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
