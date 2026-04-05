'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterOption, SortOption } from '@/dtos/booking_dto'
import {
  ColumnDefinition,
  ResponsiveTable,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import { useCustomerBookings } from '@/lib/hooks/useBooking'

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { customerChatService } from '@/services/chat/customer.chat.service'
import { toast } from 'sonner'

interface BookingTableItem {
  id: string
  bookingId: string
  bookingGroupCode?: string
  bookingCode?: string
  paymentStatus: string
  serviceStatus: string
  status: 'Active' | 'Cancelled'
  date: string
  serviceName?: string
  slotCount: number
  slots: {
    start?: string
    end?: string
    status: string
  }[]
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const formatTime = (isoString?: string) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export default function BookingListPage() {
  const [sort, setSort] = useState<SortOption>('latest')
  const [filter, setFilter] = useState<FilterOption>('all')

  const router = useRouter()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useCustomerBookings({
    page,
    limit: 4,
    search,
    sortOption: sort,
    filterOption: filter,
  })

  const tableData: BookingTableItem[] =
    data?.data.map((booking) => ({
      id: booking.bookingGroupId || booking.bookingId,
      bookingId: booking.bookingId,
      bookingCode: booking.bookingCode,
      bookingGroupCode: booking.bookingGroupCode,
      paymentStatus: booking.paymentStatus,
      serviceStatus: booking.serviceStatus,
      status: booking.cancelInfo ? 'Cancelled' : 'Active',
      date: booking.date,
      serviceName: booking.serviceName,
      slotCount: booking.slots?.length || 1,
      slots: booking.slots?.map((s) => ({
        start: s.slotStart,
        end: s.slotEnd,
        status: s.serviceStatus,
      })) || [
          {
            start: booking.slotStart,
            end: booking.slotEnd,
            status: booking.serviceStatus,
          },
        ],
    })) ?? []

  const handleChat = async (bookingId: string) => {
    try {
      const { chatId } = await customerChatService.initiateChat(bookingId)
      router.push(`/customer/chat/${chatId}`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to initiate chat')
    }
  }

  const columns: ColumnDefinition<BookingTableItem>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (item) => <span>{formatDate(item.date)}</span>,
    },
    {
      key: 'serviceName',
      header: 'Service',
      render: (item) => (
        <span className='font-medium'>{item.serviceName || 'N/A'}</span>
      ),
    },
    {
      key: 'bookingGroupCode',
      header: "Booking Code",
      render: (item) => (
        <span className='font-medium'>{item.bookingGroupCode}</span>
      )
    },
    {
      key: 'slots',
      header: 'Slots',
      render: (item) => (
        <div className='flex flex-col gap-1'>
          {item.slots.slice(0, 2).map((s, i) => (
            <span
              key={i}
              className='text-xs border px-1 rounded bg-muted whitespace-nowrap'
            >
              {formatTime(s.start)} - {formatTime(s.end)}
            </span>
          ))}
          {item.slots.length > 2 && (
            <span className='text-xs text-muted-foreground'>
              +{item.slots.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (item: BookingTableItem) => (
        <span className='capitalize text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800'>
          {item.paymentStatus}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: BookingTableItem) => (
        <span
          className={
            item.status === 'Cancelled'
              ? 'text-red-600 font-medium text-sm'
              : 'text-green-600 font-medium text-sm'
          }
        >
          {item.status}
        </span>
      ),
    },
  ] as const

  return (

    <ResponsiveTable<BookingTableItem>
      title='My Bookings'
      data={tableData}
      loading={isLoading}
      columns={columns}
      currentPage={data?.currentPage ?? 1}
      totalPages={data?.totalPages ?? 1}
      onPageChange={(p) => setPage(p)}
      searchTerm={search}
      onSearchTermChange={(e) => setSearch(e.target.value)}
      onSearchClick={() => setPage(1)}
      actions={(item) => (
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => router.push(`/customer/booking/${item.bookingId}`)}
          >
            View Details
          </Button>
          {item.status !== 'Cancelled' && (
            <Button
              size='sm'
              variant='outline'
              onClick={() => handleChat(item.bookingId)}
            >
              <MessageCircle className='w-4 h-4 mr-2' />
              Chat
            </Button>
          )}
        </div>
      )}

      headerActions={
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="service_name_asc">Service Name (A-Z)</SelectItem>
              <SelectItem value="service_name_desc">Service Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filter} onValueChange={(value) => setFilter(value as FilterOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active Bookings</SelectItem>
              <SelectItem value="cancelled">Cancelled Bookings</SelectItem>
              <SelectItem value="fully_paid">Fully Paid Bookings</SelectItem>
              <SelectItem value="adv_paid">Advance Paid Bookings</SelectItem>
              <SelectItem value="refunded">Refunded Bookings</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    />
  )
}
