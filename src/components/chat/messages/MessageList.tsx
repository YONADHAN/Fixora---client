'use client'

import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { ChatMessage } from '@/types/chat/chat.type'

interface Props {
  messages: ChatMessage[]
  loading: boolean
}

export function MessageList({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-3'>
      {loading && <div>Loading...</div>}

      {messages.map((msg) => (
        <MessageBubble key={msg.messageId} message={msg} />
      ))}

      <div ref={bottomRef} />
    </div>
  )
}
