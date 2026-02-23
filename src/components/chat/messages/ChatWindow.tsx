'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/providers/SocketProvider'
import { SOCKET_EVENTS } from '@/utils/constants/constants'
import { useChatUI } from '../context/ChatUIContext'
import { MessageList } from './MessageList'
import { MessageInput } from '../input/MessageInput'
import { useChat } from '@/lib/hooks/useChat'
import { ArrowLeft, Video } from 'lucide-react'

export function ChatWindow() {
  const { activeChatId, setActiveChatId } = useChatUI()
  const socket = useSocket()

  const { messages, sendMessage, loading, hasMore, loadMore } =
    useChat(activeChatId)

  const [isTyping, setIsTyping] = useState(false)

  const InitiateVideoChat = () => {
    if (!socket || !activeChatId) return

    socket.emit(SOCKET_EVENTS.CALL_INITIATE, {
      chatId: activeChatId,
      callType: 'video',
    })

    console.log('📞 Video call initiated for chat:', activeChatId)
  }
  useEffect(() => {
    if (!socket || !activeChatId) return

    const handleTypingStart = () => setIsTyping(true)
    const handleTypingStop = () => setIsTyping(false)

    socket.on(SOCKET_EVENTS.CHAT_TYPING_START, handleTypingStart)
    socket.on(SOCKET_EVENTS.CHAT_TYPING_STOP, handleTypingStop)

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_TYPING_START, handleTypingStart)
      socket.off(SOCKET_EVENTS.CHAT_TYPING_STOP, handleTypingStop)
    }
  }, [socket, activeChatId])

  if (!activeChatId) {
    return (
      <div className='flex h-full items-center justify-center text-muted-foreground'>
        Select a chat to start messaging
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full bg-background'>
      <div className='flex items-center gap-3 p-3 border-b bg-card '>
        <button
          onClick={() => setActiveChatId(null)}
          className='md:hidden p-2 hover:bg-muted rounded-full'
        >
          <ArrowLeft className='w-5 h-5' />
        </button>
        <div className='flex flex-1 items-center justify-between'>
          <div className='font-semibold'>Chat</div>
          <div className='cursor-pointer' onClick={InitiateVideoChat}>
            <Video className=' text-muted-foreground hover:text-primary' />
          </div>
        </div>
      </div>

      <MessageList
        messages={messages}
        loading={loading}
        isTyping={isTyping}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />

      <MessageInput onSend={sendMessage} />
    </div>
  )
}
