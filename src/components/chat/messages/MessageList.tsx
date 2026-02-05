'use client'

import { useRef, useLayoutEffect, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import { ChatMessage } from '@/types/chat/chat.type'

interface Props {
  messages: ChatMessage[]
  loading: boolean
  isTyping: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export function MessageList({
  messages,
  loading,
  isTyping,
  hasMore,
  onLoadMore,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const shouldStickToBottom = useRef(true)
  const prevScrollHeight = useRef(0)

  const firstMessageId = useRef<string | null>(null)


  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return

    shouldStickToBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 50

    if (loading) return

    if (el.scrollTop < 20 && hasMore) {
      console.log('Fetching more messages...', { scrollTop: el.scrollTop, hasMore })
      prevScrollHeight.current = el.scrollHeight
      onLoadMore()
    }
  }


  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const currentFirstId = messages.length > 0 ? messages[0].messageId : null
    const isPrepended =
      currentFirstId !== firstMessageId.current &&
      prevScrollHeight.current > 0 &&
      el.scrollHeight > prevScrollHeight.current

    // 1. If we loaded older messages (height increased AND first item changed)
    if (isPrepended) {
      el.scrollTop = el.scrollHeight - prevScrollHeight.current
      prevScrollHeight.current = 0
    }
    // 2. If user was near bottom
    else if (shouldStickToBottom.current) {
      el.scrollTop = el.scrollHeight
    }

    firstMessageId.current = currentFirstId
  }, [messages])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || loading || !hasMore) return

    if (el.scrollHeight <= el.clientHeight) {
      console.log('Content too short, auto-loading more...')
      onLoadMore()
    }
  }, [messages, loading, hasMore, onLoadMore])

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className='flex-1 overflow-y-auto relative p-4'
    >
      {loading && (
        <div className='text-center text-sm text-muted-foreground mb-2'>
          Loading...
        </div>
      )}

      <div className='space-y-3 pb-6'>
        {messages.map((msg) => (
          <MessageBubble key={msg.messageId} message={msg} />
        ))}
      </div>

      {isTyping && (
        <div className='sticky bottom-0 bg-background text-sm text-muted-foreground italic px-2 py-1'>
          Typing…
        </div>
      )}
    </div>
  )
}


