'use client'

import { useChatUI } from '../context/ChatUIContext'
import { ChatListItem } from './ChatListItem'
import { useEffect, useState } from 'react'
import { chatService } from '@/services/chat/chat.service'
import { IChatEntity } from '@/types/chat/chat.type'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useSocket } from '@/providers/SocketProvider'
import { SOCKET_EVENTS } from '@/utils/constants/constants'

export function ChatSidebar() {
  const { setActiveChatId } = useChatUI()
  const socket = useSocket()

  const customer = useSelector((state: RootState) => state.customer.customer)
  const vendor = useSelector((state: RootState) => state.vendor.vendor)

  const role = customer ? 'customer' : vendor ? 'vendor' : null
  const userId = customer?.userId || vendor?.userId

  const [chats, setChats] = useState<IChatEntity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!role) return

    const fetchChats = async () => {
      try {
        setLoading(true)
        const data = await chatService.getMyChats(role)
        setChats(data)
      } catch (error) {
        console.error('Failed to fetch chats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [role])

  useEffect(() => {
    if (!socket || !userId) return

    const handleListUpdate = (updatedChat: any) => {
      setChats((prev) => {
        // Remove existing instance of this chat if present
        const filtered = prev.filter((c) => c.chatId !== updatedChat.chatId)
        // Add updated chat to top
        // Note: We might need to merge with existing chat data (names/avatars) if the update payload is partial across the app
        // For now, assuming payload has enough info or we preserve existing metadata

        const existing = prev.find(c => c.chatId === updatedChat.chatId)

        const merged: IChatEntity = {
          ...(existing || updatedChat),
          ...updatedChat,
          lastMessage: updatedChat.lastMessage,
          unreadCount: updatedChat.unreadCount
        }

        return [merged, ...filtered]
      })
    }

    socket.on(SOCKET_EVENTS.CHAT_LIST_UPDATE, handleListUpdate)
    // We also need to listen for CHAT_NEW to update the list if we are the SENDER (optional, usually sender sees it in window)
    // But mostly CHAT_LIST_UPDATE is emitted to receiver. 
    // If we want to move chat to top for sender too, we might need to handle CHAT_NEW or similar.
    // For now, focusing on the receiver update as requested.

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_LIST_UPDATE, handleListUpdate)
    }
  }, [socket, userId])

  if (loading) {
    return <div className='p-4 text-center text-sm text-neutral-500'>Loading chats...</div>
  }

  if (!role) {
    return <div className='p-4 text-center text-sm text-neutral-500'>Please log in</div>
  }

  return (
    <div className='h-full overflow-y-auto'>
      {chats.length === 0 ? (
        <div className='p-4 text-center text-sm text-neutral-500'>No chats found</div>
      ) : (
        chats.map((chat: IChatEntity) => {
          const unread = role === 'vendor' ? chat.unreadCount.vendor : chat.unreadCount.customer

          let name = 'Unknown User'
          let image = ''

          if (role === 'customer') {
            name = chat.service?.name || chat.vendor?.name || 'Service'
            image = chat.service?.mainImage || chat.vendor?.profileImage || ''
          } else {
            name = chat.customer?.name || 'Customer'
            image = chat.customer?.profileImage || ''
          }

          return (
            <div key={chat.chatId} onClick={() => setActiveChatId(chat.chatId)}>
              <ChatListItem
                chat={{
                  chatId: chat.chatId,
                  name: name, // In a real app, this should be part of the chat object (e.g., participants)
                  lastMessage: chat.lastMessage?.content,
                  unreadCount: unread
                }}
              />
            </div>
          )
        })
      )}
    </div>
  )
}
