import { axiosInstance } from '@/api/interceptor'
import {
  CUSTOMER_ROUTES,
  VENDOR_ROUTES,
  ADMIN_ROUTES,
} from '@/utils/constants/api.routes'
import { NotificationPayload } from '@/utils/constants/constants'

export const getMyNotifications = async (
  limit = 10,
  cursor?: string,
  filter: 'all' | 'unread' = 'all',
  search?: string,
  role: 'customer' | 'vendor' | 'admin' = 'customer'
): Promise<{
  data: NotificationPayload[]
  nextCursor: string | null
  unreadCount: number
}> => {
  let routes: any = CUSTOMER_ROUTES
  if (role === 'vendor') routes = VENDOR_ROUTES
  if (role === 'admin') routes = ADMIN_ROUTES

  const response = await axiosInstance.get(routes.GET_MY_NOTIFICATION, {
    params: { limit, cursor, filter, search },
  })

  return response.data.data
}

export const markNotificationRead = async (
  notificationId: string,
  role: 'customer' | 'vendor' | 'admin' = 'customer'
): Promise<void> => {
  let routes: any = CUSTOMER_ROUTES
  if (role === 'vendor') routes = VENDOR_ROUTES
  if (role === 'admin') routes = ADMIN_ROUTES

  await axiosInstance.patch(
    `${routes.MARK_NOTIFICATION_READ}/${notificationId}/read`
  )
}

export const markAllNotificationsRead = async (
  role: 'customer' | 'vendor' | 'admin' = 'customer'
): Promise<void> => {
  let routes: any = CUSTOMER_ROUTES
  if (role === 'vendor') routes = VENDOR_ROUTES
  if (role === 'admin') routes = ADMIN_ROUTES

  await axiosInstance.patch(routes.MARK_ALL_NOTIFICATION_READ)
}

// export const testingOnlyApi = async (): Promise<void> => {
//   await axiosInstance.post('/api/v1/customer/notification/test')
// }
