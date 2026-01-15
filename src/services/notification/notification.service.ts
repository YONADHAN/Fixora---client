import { axiosInstance } from '@/api/interceptor'
import { CUSTOMER_ROUTES } from '@/utils/constants/api.routes'
import { NotificationPayload } from '@/utils/constants/constants'

export const getMyNotifications = async (
  limit = 10,
  cursor?: string,
  filter: 'all' | 'unread' = 'all',
  search?: string
): Promise<{
  data: NotificationPayload[]
  nextCursor: string | null
  unreadCount: number
}> => {
  const response = await axiosInstance.get(
    CUSTOMER_ROUTES.GET_MY_NOTIFICATION,
    {
      params: { limit, cursor, filter, search },
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

// export const testingOnlyApi = async (): Promise<void> => {
//   await axiosInstance.post('/api/v1/customer/notification/test')
// }
