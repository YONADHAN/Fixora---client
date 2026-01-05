'use client'

import { useChatUI } from '../context/ChatUIContext'
import { ChatListItem } from './ChatListItem'
import { useQuery } from '@tanstack/react-query'
import { customerChatService } from '@/services/chat/customer.chat.service'
import { IChatEntity } from '@/types/chat/chat.type'

export function ChatSidebar() {
  const { setActiveChatId } = useChatUI()

  const { data: chats, isLoading } = useQuery({
    queryKey: ['my-chats'],
    queryFn: customerChatService.getMyChats,
  })

  if (isLoading) {
    return <div className='p-4 text-center text-sm text-neutral-500'>Loading chats...</div>
  }

  return (
    <div className='h-full overflow-y-auto'>
      {chats?.length === 0 ? (
        <div className='p-4 text-center text-sm text-neutral-500'>No chats found</div>
      ) : (
        chats?.map((chat: IChatEntity) => (
          <div key={chat.chatId} onClick={() => setActiveChatId(chat.chatId)}>
            {/* Map IChatEntity to ChatListItemData structure if needed, or update ChatListItem */}
            <ChatListItem
              chat={{
                chatId: chat.chatId,
                name: 'Vendor', // TODO: Need to fetch vendor name
                lastMessage: chat.lastMessage?.content,
                unreadCount: chat.unreadCount.customer
              }}
            />
          </div>
        ))
      )}
    </div>
  )
}
