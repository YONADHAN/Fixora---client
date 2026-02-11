'use client'

import React, { useEffect, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { getSocket } from '@/lib/socket/socket.client'
import { SOCKET_EVENTS } from '@/utils/constants/constants'
import {
  CallManager,
  MediaManager,
  registerSignaling,
} from '@/lib/socket/webrtc'

const VideoCallPage = () => {
  const { chatId } = useParams()
  const searchParams = useSearchParams()
  const mode = (searchParams.get('mode') as 'caller' | 'receiver') || 'caller'

  const socket = getSocket()
  const router = useRouter()

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const callRef = useRef<CallManager | null>(null)

  useEffect(() => {
    let localStream: MediaStream

    const start = async () => {
      localStream = await MediaManager.camera()

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream
      }

      const call = new CallManager((candidate) => {
        socket.emit(SOCKET_EVENTS.WEBRTC_ICE, { chatId, candidate })
      })

      callRef.current = call

      call.addStream(localStream)

      call.onRemoteSteam((stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream
          remoteVideoRef.current.play().catch(() => {})
        }
      })

      registerSignaling(call, chatId as string, mode)

      // Only caller creates offer
      if (mode === 'caller') {
        const offer = await call.createOffer()
        socket.emit(SOCKET_EVENTS.WEBRTC_OFFER, { chatId, offer })
      }
    }

    start()

    return () => {
      callRef.current?.close()
      localStream?.getTracks().forEach((t) => t.stop())
    }
  }, [chatId, mode])

  const endCall = () => {
    callRef.current?.close()
    socket.emit(SOCKET_EVENTS.CALL_END, { chatId })
    router.back()
  }

  return (
    <div className='h-screen w-screen bg-black flex flex-col text-white'>
      <div className='h-14 flex items-center px-4 border-b border-gray-800'>
        <button onClick={endCall}>← Back</button>
        <span className='ml-4 text-xs'>Mode: {mode}</span>
      </div>

      <div className='flex-1 relative'>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className='w-full h-full object-cover'
        />

        <div className='absolute bottom-4 right-4 w-40 h-28'>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className='w-full h-full object-cover'
          />
        </div>
      </div>

      <div className='h-20 flex justify-center items-center'>
        <button onClick={endCall} className='bg-red-600 rounded-full w-14 h-14'>
          📞
        </button>
      </div>
    </div>
  )
}

export default VideoCallPage
