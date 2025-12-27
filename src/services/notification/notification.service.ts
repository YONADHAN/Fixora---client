import { axiosInstance } from '@/api/interceptor'
import { CUSTOMER_ROUTES } from '@/utils/constants/api.routes'
import { NotificationPayload } from '@/utils/constants/constants'

export const getMyNotifications = async (
  page = 1,
  limit = 10
): Promise<{
  data: NotificationPayload[]
  currentPage: number
  totalPages: number
  unreadCount: number
}> => {
  const response = await axiosInstance.get(
    CUSTOMER_ROUTES.GET_MY_NOTIFICATION,
    {
      params: { page, limit },
    }
  )

  return response.data.data
}

export const markNotificationRead = async (
  notificationId: string
): Promise<void> => {
  await axiosInstance.patch(
    `${CUSTOMER_ROUTES.MARK_NOTIFICATION_READ}/${notificationId}/read`
  )
}

export const markAllNotificationsRead = async (): Promise<void> => {
  await axiosInstance.patch(CUSTOMER_ROUTES.MARK_ALL_NOTIFICATION_READ)
}

export const testingOnlyApi = async (): Promise<void> => {
  await axiosInstance.post('/api/v1/customer/notification/test')
}
