'use client'

import { useChatUI } from '../context/ChatUIContext'
import { ChatListItem } from './ChatListItem'

interface ChatListItemData {
  chatId: string
  name: string
  lastMessage?: string
  unreadCount: number
}

export function ChatSidebar() {
  const { setActiveChatId } = useChatUI()

  // TEMP mock data (replace with API later)
  const chats: ChatListItemData[] = [
    {
      chatId: 'chat-1',
      name: 'Vendor A',
      lastMessage: 'Hello, how can I help?',
      unreadCount: 2,
    },
    {
      chatId: 'chat-2',
      name: 'Vendor B',
      lastMessage: 'Booking confirmed',
      unreadCount: 0,
    },
  ]

  return (
    <div className='h-full overflow-y-auto'>
      {chats.map((chat) => (
        <div key={chat.chatId} onClick={() => setActiveChatId(chat.chatId)}>
          <ChatListItem chat={chat} />
        </div>
      ))}
    </div>
  )
}
