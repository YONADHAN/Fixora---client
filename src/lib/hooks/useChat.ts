'use client'

import { useEffect, useState } from 'react'
import { chatService } from '@/services/chat/chat.service'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useSocket } from '@/providers/SocketProvider'
import { SOCKET_EVENTS } from '@/utils/constants/constants'
import { ChatMessage } from '@/types/chat/chat.type'
interface SocketAckResponse {
  success: boolean
  message?: string
}

export function useChat(chatId: string | null) {
  const socket = useSocket()

  const customer = useSelector((state: RootState) => state.customer.customer)
  const vendor = useSelector((state: RootState) => state.vendor.vendor)
  const role = customer ? 'customer' : vendor ? 'vendor' : null

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | undefined>(undefined)

  const loadMessages = async (reset = false): Promise<void> => {
    if (!chatId || !role || loading) return
    if (!hasMore && !reset) return

    setLoading(true)

    try {
      const data = await chatService.getChatMessages(
        role,
        chatId,
        reset ? undefined : cursor,
        5,
      )

      const fetched = data.messages.reverse()

      setMessages((prev) => {
        const newMessages = reset ? fetched : [...fetched, ...prev]

        const unique = Array.from(
          new Map(newMessages.map((m) => [m.messageId, m])).values(),
        )

        return unique.sort(
          (a, b) =>
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
        )
      })

      setHasMore(data.hasMore)
      setCursor(data.nextCursor)
    } catch (err) {
      console.error('Failed to load messages', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!chatId) return

    setMessages([])
    setCursor(undefined)
    setHasMore(true)
    loadMessages(true)
  }, [chatId])

  useEffect(() => {
    if (!socket || !chatId) return

    socket.emit(SOCKET_EVENTS.CHAT_JOIN, chatId)
    socket.emit(SOCKET_EVENTS.CHAT_READ, chatId)

    return () => {
      socket.emit(SOCKET_EVENTS.CHAT_LEAVE, chatId)
    }
  }, [chatId, socket])

  useEffect(() => {
    if (!socket) return

    const onNewMessage = (message: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.messageId === message.messageId)) return prev
        return [...prev, message]
      })
    }

    socket.on(SOCKET_EVENTS.CHAT_NEW, onNewMessage)

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_NEW, onNewMessage)
    }
  }, [socket])

  const sendMessage = (content: string): void => {
    if (!chatId || !socket) return

    socket.emit(
      SOCKET_EVENTS.CHAT_SEND,
      { chatId, content },
      (res: SocketAckResponse) => {
        if (!res.success) {
          console.error('[useChat] Send failed:', res.message)
        }
      },
    )
  }

  return {
    messages,
    loading,
    hasMore,
    loadMore: () => loadMessages(false),
    sendMessage,
  }
}
