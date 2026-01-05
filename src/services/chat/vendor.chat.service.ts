import { axiosInstance } from '@/api/interceptor'
import { VENDOR_ROUTES } from '@/utils/constants/api.routes'

export const vendorChatService = {
  async getMyChats() {
    const res = await axiosInstance.get(VENDOR_ROUTES.GET_MY_CHATS)
    return res.data.data
  },

  async getChatMessages(chatId: string, page = 1, limit = 20) {
    const res = await axiosInstance.get(
      `${VENDOR_ROUTES.GET_CHAT_MESSAGES}/${chatId}/messages`,
      { params: { page, limit } }
    )
    return res.data.data
  },
}
