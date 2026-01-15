'use client'

import React, { useState, useEffect } from 'react'
import { useNotifications } from '@/lib/hooks/useNotification'
import { formatDistanceToNow } from 'date-fns'
import { Loader2, Search, Bell, CheckCheck, X, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const router = useRouter()

  const {
    notifications,
    unreadCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications(filter, true, debouncedSearch)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) markAsRead(notification.notificationId)
    setSelectedNotification(notification)
  }

  const handleRedirect = () => {
    if (selectedNotification?.metadata?.redirectUrl) {
      router.push(selectedNotification.metadata.redirectUrl)
      setSelectedNotification(null) // Close modal after redirect
    }
  }

  // Infinite scroll observer
  const observerTarget = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <div className='flex flex-col space-y-6'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Notifications</h1>
            <p className='text-muted-foreground mt-1'>
              Manage your notifications and alerts
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant='outline'
              onClick={() => markAllAsRead()}
              className='w-full md:w-auto'
            >
              <CheckCheck className='mr-2 h-4 w-4' />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Controls Section */}
        <div className='flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm'>
          <Tabs
            defaultValue='all'
            onValueChange={(val) => setFilter(val as 'all' | 'unread')}
            className='w-full md:w-auto'
          >
            <TabsList className='grid w-full md:w-[200px] grid-cols-2'>
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='unread' className='relative'>
                Unread
                {unreadCount > 0 && filter === 'all' && (
                  <Badge
                    variant='destructive'
                    className='ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]'
                  >
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className='relative w-full md:w-72'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search notifications...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-8'
            />
          </div>
        </div>

        {/* List Section */}
        <div className='border rounded-xl bg-card shadow-sm min-h-[400px] flex flex-col'>
          {isLoading ? (
            <div className='flex-1 flex items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : notifications.length === 0 ? (
            <div className='flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 space-y-4'>
              <div className='p-4 bg-muted rounded-full'>
                <Bell className='h-8 w-8 opacity-50' />
              </div>
              <p className='text-lg font-medium'>
                {debouncedSearch
                  ? 'No matching notifications found'
                  : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <div className='divide-y'>
              {notifications.map((n) => (
                <div
                  key={n.notificationId}
                  onClick={() => handleNotificationClick(n)}
                  className={`
                    group p-4 flex gap-4 transition-colors cursor-pointer hover:bg-accent/50
                    ${!n.isRead ? 'bg-primary/5 dark:bg-primary/10' : ''}
                  `}
                >
                  <div className={`
                    mt-1 h-3 w-3 rounded-full flex-shrink-0
                    ${!n.isRead ? 'bg-blue-500 ring-2 ring-blue-500/20' : 'bg-transparent'}
                  `} />

                  <div className='flex-1 space-y-1'>
                    <div className='flex items-start justify-between gap-2'>
                      <h4 className={`text-base ${!n.isRead ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>
                        {n.title}
                      </h4>
                      <span className='text-xs text-muted-foreground whitespace-nowrap'>
                        {n.createdAt && formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {/* Keep line-clamp here to keep the list compact */}
                    <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
                      {n.message}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loader for infinite scroll */}
              <div ref={observerTarget} className='h-10 flex items-center justify-center w-full'>
                {isFetchingNextPage && (
                  <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedNotification?.title}
            </DialogTitle>
            <DialogDescription className="text-sm pt-1">
              {selectedNotification?.createdAt && formatDistanceToNow(new Date(selectedNotification.createdAt), { addSuffix: true })}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="text-base leading-relaxed whitespace-pre-wrap text-foreground">
              {selectedNotification?.message}
            </div>
          </div>

          <DialogFooter className="sm:justify-between gap-2 flex-col-reverse sm:flex-row">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="w-full sm:w-auto">
                Close
              </Button>
            </DialogClose>

            {selectedNotification?.metadata?.redirectUrl && (
              <Button type="button" onClick={handleRedirect} className="w-full sm:w-auto">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Details
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
