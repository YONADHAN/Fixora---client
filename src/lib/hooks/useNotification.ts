import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/services/notification/notification.service'
import { NotificationPayload } from '@/utils/constants/constants'

export const useNotifications = (
  filter: 'all' | 'unread',
  enabled: boolean = true,
  search: string = ''
) => {
  const queryClient = useQueryClient()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['notifications', filter, search],
    queryFn: ({ pageParam }) =>
      getMyNotifications(10, pageParam as string | undefined, filter, search),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
  })

  // Optimistic update for single read
  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousData = queryClient.getQueryData(['notifications', filter])

      queryClient.setQueryData(['notifications', filter], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((n: NotificationPayload) =>
              n.notificationId === notificationId
                ? { ...n, isRead: true }
                : n
            ),
            unreadCount: Math.max(0, page.unreadCount - 1),
          })),
        }
      })

      return { previousData }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ['notifications', filter],
        context?.previousData
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  // Optimistic update for ALL read
  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previousData = queryClient.getQueryData(['notifications', filter])

      queryClient.setQueryData(['notifications', filter], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((n: NotificationPayload) => ({
              ...n,
              isRead: true,
            })),
            unreadCount: 0,
          })),
        }
      })

      return { previousData }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['notifications', filter],
        context?.previousData
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  return {
    notifications: data?.pages.flatMap((page) => page.data) || [],
    unreadCount: data?.pages[0]?.unreadCount || 0,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    markAsRead: markReadMutation.mutate,
    markAllAsRead: markAllReadMutation.mutate,
  }
}
