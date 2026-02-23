import { axiosInstance } from '@/api/interceptor'
import { CUSTOMER_ROUTES } from '@/utils/constants/api.routes'

export const customerChatService = {
  async initiateChat(bookingId: string) {
    const res = await axiosInstance.post(CUSTOMER_ROUTES.INITIATE_CHAT, {
      bookingId,
    })
    return res.data.data
  },

  async getMyChats() {
    const res = await axiosInstance.get(CUSTOMER_ROUTES.GET_MY_CHATS)
    return res.data.data
  },

  async getChatMessages(chatId: string, page = 1, limit = 20) {
    const res = await axiosInstance.get(
      `${CUSTOMER_ROUTES.GET_CHAT_MESSAGES}/${chatId}/messages`,
      { params: { page, limit } }
    )
    return res.data.data
  },
}
