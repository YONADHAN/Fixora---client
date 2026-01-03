'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  ColumnDefinition,
  ResponsiveTable,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import { useCustomerBookings } from '@/lib/hooks/useBooking'

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { chatService } from '@/services/chat/chat.service'
import { toast } from 'sonner'

interface BookingTableItem {
  id: string
  bookingId: string
  paymentStatus: string
  serviceStatus: string
  status: 'Active' | 'Cancelled'
}

export default function BookingListPage() {
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useCustomerBookings({
    page,
    limit: 3,
    search,
  })

  const tableData: BookingTableItem[] =
    data?.data.map((booking) => ({
      id: booking.bookingId,
      bookingId: booking.bookingId,
      paymentStatus: booking.paymentStatus,
      serviceStatus: booking.serviceStatus,
      status: booking.cancelInfo ? 'Cancelled' : 'Active',
    })) ?? []

  const handleChat = async (bookingId: string) => {
    try {
      const { chatId } = await chatService.initiateChat(bookingId)
      router.push(`/customer/chat/${chatId}`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to initiate chat')
    }
  }

  const columns: ColumnDefinition<BookingTableItem>[] = [
    {
      key: 'bookingId',
      header: 'Booking ID',
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (item: BookingTableItem) => (
        <span className='capitalize'>{item.paymentStatus}</span>
      ),
    },
    {
      key: 'serviceStatus',
      header: 'Service Status',
      render: (item: BookingTableItem) => (
        <span className='capitalize'>{item.serviceStatus}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: BookingTableItem) => (
        <span
          className={
            item.status === 'Cancelled'
              ? 'text-red-600 font-medium'
              : 'text-green-600 font-medium'
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
    />
  )
}
