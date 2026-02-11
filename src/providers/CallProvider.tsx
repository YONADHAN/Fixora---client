'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSocket } from './SocketProvider'
import { SOCKET_EVENTS } from '@/utils/constants/constants'
import { IncomingCallModal } from '@/components/call/IncomingCallModal'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

type IncomingCall = {
  chatId: string
  from: string
  role: 'customer' | 'vendor'
}

type CallContextType = {
  incomingCall: IncomingCall | null
  clearIncomingCall: () => void
}

const CallContext = createContext<CallContextType | null>(null)

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocket()
  const router = useRouter()

  const customer = useSelector((s: RootState) => s.customer.customer)
  const vendor = useSelector((s: RootState) => s.vendor.vendor)
  const myRole = customer ? 'customer' : vendor ? 'vendor' : null

  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null)

  useEffect(() => {
    if (!socket || !myRole) return

    // Incoming call
    socket.on(SOCKET_EVENTS.CALL_INCOMING, (payload: IncomingCall) => {
      setIncomingCall(payload)
    })

    // Caller side: receiver accepted
    socket.on(SOCKET_EVENTS.CALL_ACCEPT, ({ chatId }) => {
      if (myRole === 'customer') {
        router.push(`/customer/video-chat/${chatId}?mode=caller`)
      } else {
        router.push(`/vendor/chat-video/${chatId}?mode=caller`)
      }
    })

    // Call rejected
    socket.on(SOCKET_EVENTS.CALL_REJECT, () => {
      setIncomingCall(null)
      alert('Call rejected')
    })

    // Call ended
    socket.on(SOCKET_EVENTS.CALL_END, () => {
      setIncomingCall(null)
    })

    return () => {
      socket.off(SOCKET_EVENTS.CALL_INCOMING)
      socket.off(SOCKET_EVENTS.CALL_ACCEPT)
      socket.off(SOCKET_EVENTS.CALL_REJECT)
      socket.off(SOCKET_EVENTS.CALL_END)
    }
  }, [socket, myRole, router])

  const clearIncomingCall = () => setIncomingCall(null)

  return (
    <CallContext.Provider value={{ incomingCall, clearIncomingCall }}>
      {children}

      {incomingCall && (
        <IncomingCallModal
          call={incomingCall}
          onAccept={() => {
            socket?.emit(SOCKET_EVENTS.CALL_ACCEPT, {
              chatId: incomingCall.chatId,
            })

            if (myRole === 'customer') {
              router.push(
                `/customer/video-chat/${incomingCall.chatId}?mode=receiver`,
              )
            } else {
              router.push(
                `/vendor/chat-video/${incomingCall.chatId}?mode=receiver`,
              )
            }

            clearIncomingCall()
          }}
          onReject={() => {
            socket?.emit(SOCKET_EVENTS.CALL_REJECT, {
              chatId: incomingCall.chatId,
            })
            clearIncomingCall()
          }}
        />
      )}
    </CallContext.Provider>
  )
}

export const useCall = () => {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error('useCall must be used inside CallProvider')
  return ctx
}
