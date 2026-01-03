import { axiosInstance } from '@/api/interceptor'

export const chatService = {
  async getChatMessages(chatId: string, page = 1, limit = 20) {
    const res = await axiosInstance.get(`/chats/${chatId}/messages`, {
      params: { page, limit },
    })

    return res.data.data
  },

  async initiateChat(bookingId: string) {
    const res = await axiosInstance.post('/chats/initiate', { bookingId })
    return res.data.data
  },
}
