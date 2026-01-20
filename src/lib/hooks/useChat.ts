'use client'
import { useEffect, useState } from 'react'
import { chatService } from '@/services/chat/chat.service'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useSocket } from '@/providers/SocketProvider'
import { SOCKET_EVENTS } from '@/utils/constants/constants'
import { ChatMessage } from '@/types/chat/chat.type'

export function useChat(chatId: string | null) {
  const socket = useSocket()

  const customer = useSelector((state: RootState) => state.customer.customer)
  const vendor = useSelector((state: RootState) => state.vendor.vendor)
  const role = customer ? 'customer' : vendor ? 'vendor' : null

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  /* Load history */
  const loadMessages = async (): Promise<void> => {
    if (!chatId || !role) return

    setLoading(true)
    try {
      const data = await chatService.getChatMessages(role, chatId)
      setMessages(data.messages)
    } catch (err) {
      console.error("Failed to load messages", err)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    if (!socket || !chatId) return

    socket.emit(SOCKET_EVENTS.CHAT_JOIN, chatId)
    loadMessages()
    socket.emit(SOCKET_EVENTS.CHAT_READ, chatId)

    return () => {
      socket.emit(SOCKET_EVENTS.CHAT_LEAVE, chatId)
    }
  }, [chatId, socket])


  useEffect(() => {
    if (!socket) return

    const onNewMessage = (message: ChatMessage): void => {
      setMessages((prev) => [...prev, message])
    }

    socket.on(SOCKET_EVENTS.CHAT_NEW, onNewMessage)

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_NEW, onNewMessage)
    }
  }, [socket])


  const sendMessage = (content: string): void => {
    console.log('[useChat] sendMessage called:', { chatId, hasSocket: !!socket })

    if (!chatId || !socket) {
      console.warn('[useChat] Aborted: Missing chatId or socket')
      return
    }


    socket.emit(SOCKET_EVENTS.CHAT_SEND, {
      chatId,
      content,
    }, (res: any) => {
      console.log('[useChat] CHAT_SEND ack:', res)
      if (!res.success) {
        console.error('[useChat] Send failed:', res.message)

      }
    })
  }

  return {
    messages,
    loading,
    sendMessage,
  }
}
