'use client'
import { useEffect, useState } from 'react'
import { customerChatService } from '@/services/chat/customer.chat.service'
import { useSocket } from '@/providers/SocketProvider'
import { SOCKET_EVENTS } from '@/utils/constants/constants'
import { ChatMessage } from '@/types/chat/chat.type'

export function useChat(chatId: string | null) {
  const socket = useSocket()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  /* Load history */
  const loadMessages = async (): Promise<void> => {
    if (!chatId) return

    setLoading(true)
    const data = await customerChatService.getChatMessages(chatId)
    setMessages(data.messages)
    setLoading(false)
  }

  /* Join / Leave */
  useEffect(() => {
    if (!socket || !chatId) return

    socket.emit(SOCKET_EVENTS.CHAT_JOIN, chatId)
    loadMessages()
    socket.emit(SOCKET_EVENTS.CHAT_READ, chatId)

    return () => {
      socket.emit(SOCKET_EVENTS.CHAT_LEAVE, chatId)
    }
  }, [chatId, socket])

  /* Listen */
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

  /* Send */
  const sendMessage = (content: string): void => {
    console.log('[useChat] sendMessage called:', { chatId, hasSocket: !!socket })

    if (!chatId || !socket) {
      console.warn('[useChat] Aborted: Missing chatId or socket')
      return
    }

    /* emit with Ack callback */
    socket.emit(SOCKET_EVENTS.CHAT_SEND, {
      chatId,
      content,
    }, (res: any) => {
      console.log('[useChat] CHAT_SEND ack:', res)
      if (!res.success) {
        console.error('[useChat] Send failed:', res.message)
        // Optional: show toast
      }
    })
  }

  return {
    messages,
    loading,
    sendMessage,
  }
}
