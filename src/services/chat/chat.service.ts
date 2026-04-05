import { axiosInstance } from '@/api/interceptor'
import { ChatMessage } from '@/types/chat/chat.type'
import { CUSTOMER_ROUTES, VENDOR_ROUTES } from '@/utils/constants/api.routes'

type Role = 'customer' | 'vendor'

export const chatService = {
  async getMyChats(role: Role) {
    const route =
      role === 'customer'
        ? CUSTOMER_ROUTES.GET_MY_CHATS
        : VENDOR_ROUTES.GET_MY_CHATS

    const res = await axiosInstance.get(route)
    return res.data.data
  },

  async getChatMessages(
    role: Role,
    chatId: string,
    before?: string,
    limit = 5,
  ) {
    const baseUrl =
      role === 'customer'
        ? CUSTOMER_ROUTES.GET_CHAT_MESSAGES
        : VENDOR_ROUTES.GET_CHAT_MESSAGES

    const res = await axiosInstance.get(`${baseUrl}/${chatId}/messages`, {
      params: {
        before,
        limit,
      },
    })

    return res.data.data as {
      messages: ChatMessage[]
      hasMore: boolean
      nextCursor?: string
    }
  },

  async uploadChatFile(role: Role, file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const route = role === 'customer' ? CUSTOMER_ROUTES.POST_CHAT_IMAGE : VENDOR_ROUTES.POST_CHAT_IMAGE

    const res = await axiosInstance.post(route, formData)
    return res.data.data.fileUrl as string
  },
}
