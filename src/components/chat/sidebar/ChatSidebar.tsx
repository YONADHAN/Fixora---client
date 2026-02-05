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

  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [chats, setChats] = useState<IChatEntity[]>([])
  const [loading, setLoading] = useState(true)

  const customer = useSelector((state: RootState) => state.customer.customer)
  const vendor = useSelector((state: RootState) => state.vendor.vendor)

  const role = customer ? 'customer' : vendor ? 'vendor' : null
  const userId = customer?.userId || vendor?.userId

  //listening to the presence
  useEffect(() => {
    if (!socket) return

    const handleOnline = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId))
    }

    const handleOffline = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }

    socket.on(SOCKET_EVENTS.USER_ONLINE, handleOnline)
    socket.on(SOCKET_EVENTS.USER_OFFLINE, handleOffline)

    return () => {
      socket.off(SOCKET_EVENTS.USER_ONLINE, handleOnline)
      socket.off(SOCKET_EVENTS.USER_OFFLINE, handleOffline)
    }
  }, [socket])

  //fetch chats
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

  //chat list update
  useEffect(() => {
    if (!socket || !userId) return

    const handleListUpdate = (updatedChat: any) => {
      setChats((prev) => {
        const filtered = prev.filter((c) => c.chatId !== updatedChat.chatId)
        const existing = prev.find((c) => c.chatId === updatedChat.chatId)

        return [
          {
            ...(existing || updatedChat),
            ...updatedChat,
            lastMessage: updatedChat.lastMessage,
            unreadCount: updatedChat.unreadCount,
          },
          ...filtered,
        ]
      })
    }

    socket.on(SOCKET_EVENTS.CHAT_LIST_UPDATE, handleListUpdate)

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_LIST_UPDATE, handleListUpdate)
    }
  }, [socket, userId])

  //ui
  if (loading) {
    return (
      <div className='p-4 text-center text-sm text-neutral-500'>
        Loading chats...
      </div>
    )
  }

  if (!role) {
    return (
      <div className='p-4 text-center text-sm text-neutral-500'>
        Please log in
      </div>
    )
  }

  return (
    <div className='h-full overflow-y-auto'>
      {chats.length === 0 ? (
        <div className='p-4 text-center text-sm text-neutral-500'>
          No chats found
        </div>
      ) : (
        chats.map((chat) => {
          const unread =
            role === 'vendor'
              ? chat.unreadCount.vendor
              : chat.unreadCount.customer

          const otherUserId =
            role === 'customer' ? chat.vendor?.userId : chat.customer?.userId

          const isOnline = otherUserId ? onlineUsers.has(otherUserId) : false

          const name =
            role === 'customer'
              ? chat.service?.name || 'Service'
              : `${chat.customer?.name || 'Customer'} • ${
                  chat.service?.name || 'Service'
                }`

          const image =
            role === 'customer'
              ? chat.service?.mainImage || ''
              : chat.customer?.profileImage || ''

          return (
            <div key={chat.chatId} onClick={() => setActiveChatId(chat.chatId)}>
              <ChatListItem
                chat={{
                  chatId: chat.chatId,
                  name,
                  image,
                  lastMessage: chat.lastMessage?.content,
                  unreadCount: unread,
                  isOnline,
                }}
              />
            </div>
          )
        })
      )}
    </div>
  )
}
