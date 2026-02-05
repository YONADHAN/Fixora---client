// 'use client'
// import { useState } from 'react'
// import { useSocket } from '@/providers/SocketProvider'
// import { useDebounce } from '@/lib/hooks/useDebounce'
// interface Props {
//   onSend: (content: string) => void
// }

// export function MessageInput({ onSend }: Props) {
//   const [value, setValue] = useState('')
//   const debounce = useDebounce(value.trim(), 300)
//   const socket = useSocket()

//   const handleSend = () => {
//     if (!debounce) return
//     onSend(debounce)
//     setValue('')
//   }

//   const handleTyping = (e) => {
//     setValue(e.target.value)
//   }

//   return (
//     <div className='border-t p-3 flex gap-2'>
//       <input
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         className='flex-1 border rounded px-3 py-2'
//         placeholder='Type a message...'
//       />
//       <button
//         onClick={handleSend}
//         className='px-4 py-2 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors'
//       >
//         Send
//       </button>
//     </div>
//   )
// }
'use client'

import { useEffect, useRef, useState } from 'react'
import { useSocket } from '@/providers/SocketProvider'
import { SOCKET_EVENTS } from '@/utils/constants/constants'
import { useChatUI } from '../context/ChatUIContext'

interface Props {
  onSend: (content: string) => void
}

export function MessageInput({ onSend }: Props) {
  const [value, setValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const socket = useSocket()
  const { activeChatId } = useChatUI()
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const emitTypingStop = () => {
    if (!isTyping || !activeChatId) return
    socket?.emit(SOCKET_EVENTS.CHAT_TYPING_STOP, { chatId: activeChatId })
    setIsTyping(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setValue(text)

    if (!socket || !activeChatId) return

    // Start typing
    if (!isTyping && text.trim()) {
      socket.emit(SOCKET_EVENTS.CHAT_TYPING_START, { chatId: activeChatId })
      setIsTyping(true)
    }

    // Reset stop-typing timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTypingStop()
    }, 1000)
  }

  const handleSend = () => {
    if (!value.trim()) return

    onSend(value.trim())
    setValue('')

    emitTypingStop()
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      emitTypingStop()
    }
  }, [activeChatId])

  return (
    <div className='border-t p-3 flex gap-2'>
      <input
        value={value}
        onChange={handleChange}
        className='flex-1 border rounded px-3 py-2'
        placeholder='Type a message...'
      />

      <button
        onClick={handleSend}
        className='px-4 py-2 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors'
      >
        Send
      </button>
    </div>
  )
}
