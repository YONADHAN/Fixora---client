'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  ColumnDefinition,
  ResponsiveTable,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import { useVendorBookings } from '@/lib/hooks/useBooking'

import { Button } from '@/components/ui/button'

interface BookingTableItem {
  id: string
  bookingId: string
  paymentStatus: string
  serviceStatus: string
  status: 'Active' | 'Cancelled'
}

export default function VendorBookingListPage() {
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useVendorBookings({
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

  const columns: ColumnDefinition<BookingTableItem>[] = [
    {
      key: 'bookingId',
      header: 'Booking ID',
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (item) => (
        <span className='capitalize'>{item.paymentStatus}</span>
      ),
    },
    {
      key: 'serviceStatus',
      header: 'Service Status',
      render: (item) => (
        <span className='capitalize'>{item.serviceStatus}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
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
  ]

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
        <Button
          size='sm'
          variant='outline'
          onClick={() => router.push(`/vendor/booking/${item.bookingId}`)}
        >
          View Details
        </Button>
      )}
    />
  )
}
