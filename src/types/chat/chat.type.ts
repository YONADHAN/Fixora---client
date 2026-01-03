export type ChatMessageType = 'text' | 'image' | 'system'

export interface ChatMessage {
  messageId: string
  chatId: string

  senderId: string
  senderRole: 'customer' | 'vendor'

  content: string
  messageType: ChatMessageType

  isRead: boolean

  createdAt: string
  updatedAt?: string
}

export interface GetChatMessagesResponse {
  messages: ChatMessage[]
  currentPage: number
  totalPages: number
}
