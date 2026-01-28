'use client'
import { useChatUI } from '../context/ChatUIContext'
import { MessageList } from './MessageList'
import { MessageInput } from '../input/MessageInput'
import { useChat } from '@/lib/hooks/useChat'
import { ArrowLeft } from 'lucide-react'

export function ChatWindow() {
  const { activeChatId, setActiveChatId } = useChatUI()
  const { messages, sendMessage, loading } = useChat(activeChatId)

  if (!activeChatId) {
    return (
      <div className='flex h-full items-center justify-center text-muted-foreground'>
        Select a chat to start messaging
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full bg-background'>
      <div className='flex items-center gap-3 p-3 border-b bg-card'>
        <button
          onClick={() => setActiveChatId(null)}
          className='md:hidden p-2 hover:bg-muted rounded-full'
        >
          <ArrowLeft className='w-5 h-5' />
        </button>
        <div className='font-semibold'>Chat</div>
      </div>

      <MessageList messages={messages} loading={loading} />
      <MessageInput onSend={sendMessage} />
    </div>
  )
}
