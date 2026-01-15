import { useEffect } from 'react'
import { useSocket } from '@/providers/SocketProvider'
import { SOCKET_EVENTS } from '@/utils/constants/constants'
import { NotificationPayload } from '@/utils/constants/constants'
import { useQueryClient } from '@tanstack/react-query'

interface NotificationsCache {
  data: NotificationPayload[]
  currentPage: number
  totalPages: number
  unreadCount: number
}
export const useNotificationsSocket = (enabled: boolean) => {
  const socket = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled || !socket) return

    const handler = (notification: NotificationPayload) => {
      queryClient.setQueryData<NotificationsCache>(['notifications'], (old) => {
        if (!old) return old

        return {
          ...old,
          data: [notification, ...old.data],
          unreadCount: old.unreadCount + 1,
        }
      })
    }

    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handler)

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, handler)
    }
  }, [enabled, socket, queryClient])
}

// export const useNotificationsSocket = () => {
//   const socket = useSocket()
//   const queryClient = useQueryClient()

//   useEffect(() => {
//     if (!socket) return

//     const handler = (notification: NotificationPayload) => {
//       queryClient.setQueryData<NotificationsCache>(['notifications'], (old) => {
//         if (!old) return old

//         return {
//           ...old,
//           data: [notification, ...old.data],
//           unreadCount: old.unreadCount + 1,
//         }
//       })
//     }

//     socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handler)

//     return () => {
//       socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, handler)
//     }
//   }, [socket, queryClient])
// }
