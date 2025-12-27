import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/services/notification/notification.service'

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => getMyNotifications(),
  })
}

export const useMarkNotificationRead = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}
