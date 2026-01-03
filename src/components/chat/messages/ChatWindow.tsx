'use client'
import { useChatUI } from '../context/ChatUIContext'
import { MessageList } from './MessageList'
import { MessageInput } from '../input/MessageInput'
import { useChat } from '@/lib/hooks/useChat'

export function ChatWindow() {
  const { activeChatId } = useChatUI()
  const { messages, sendMessage, loading } = useChat(activeChatId)

  if (!activeChatId) {
    return (
      <div className='flex h-full items-center justify-center text-muted-foreground'>
        Select a chat to start messaging
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full'>
      <MessageList messages={messages} loading={loading} />
      <MessageInput onSend={sendMessage} />
    </div>
  )
}
