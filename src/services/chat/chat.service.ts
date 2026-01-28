import { axiosInstance } from '@/api/interceptor'
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

  async getChatMessages(role: Role, chatId: string, page = 1, limit = 20) {
    const baseUrl =
      role === 'customer'
        ? CUSTOMER_ROUTES.GET_CHAT_MESSAGES
        : VENDOR_ROUTES.GET_CHAT_MESSAGES

    const res = await axiosInstance.get(`${baseUrl}/${chatId}/messages`, {
      params: { page, limit },
    })
    return res.data.data
  },
}
