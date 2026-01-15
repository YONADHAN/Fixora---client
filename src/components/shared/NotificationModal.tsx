import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Check, Bell, Loader2 } from 'lucide-react'
import { useNotifications } from '@/lib/hooks/useNotification'

export const NotificationModal = () => {
    const [filter, setFilter] = useState<'all' | 'unread'>('all')
    const {
        notifications,
        unreadCount,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        markAsRead,
        markAllAsRead
    } = useNotifications(filter)

    const router = useRouter()

    const observerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage()
                }
            },
            { threshold: 1.0 }
        )
        if (observerRef.current) observer.observe(observerRef.current)
        return () => observer.disconnect()
    }, [hasNextPage, fetchNextPage])

    const handleClick = (notification: any) => {
        if (!notification.isRead) markAsRead(notification.notificationId)
        if (notification.metadata?.redirectUrl) {
            router.push(notification.metadata.redirectUrl)
        }
    }

    return (
        <div className="w-[400px] h-[500px] bg-white dark:bg-zinc-900 border rounded-xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    Notifications
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </h3>
                <div className="flex gap-2 text-xs">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-full transition-colors ${filter === 'all' ? 'bg-black text-white' : 'hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-3 py-1 rounded-full transition-colors ${filter === 'unread' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700'}`}
                    >
                        Unread
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            {unreadCount > 0 && (
                <div className="px-4 py-2 border-b text-xs flex justify-end">
                    <button onClick={() => markAllAsRead()} className="text-blue-500 hover:underline">
                        Mark all as read
                    </button>
                </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                        <Bell className="w-10 h-10 mb-2 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n.notificationId}
                            onClick={() => handleClick(n)}
                            className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 relative group
                ${!n.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500' : 'bg-transparent'}
              `}
                        >
                            <div className="flex justify-between items-start">
                                <h4 className={`text-sm ${!n.isRead ? 'font-semibold text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                    {n.title}
                                </h4>
                                {!n.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                                )}
                            </div>
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2 pr-4">{n.message}</p>
                            {n.createdAt && (
                                <span className="text-[10px] text-zinc-400 mt-2 block">
                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                </span>
                            )}
                        </div>
                    ))
                )}

                {/* Loading Spinner at Bottom */}
                <div ref={observerRef} className="h-4 flex justify-center w-full py-2">
                    {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
                </div>

                {/* End of list */}
                {!hasNextPage && notifications.length > 0 && (
                    <p className="text-center text-[10px] text-zinc-300 py-2">No more notifications</p>
                )}
            </div>
        </div>
    )
}
