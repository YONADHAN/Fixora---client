'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterOption, SortOption } from '@/dtos/booking_dto'
import {
  ColumnDefinition,
  ResponsiveTable,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import { useVendorBookings } from '@/lib/hooks/useBooking'

import { Button } from '@/components/ui/button'

interface BookingTableItem {
  id: string
  bookingId: string
  bookingGroupCode: string
  paymentStatus: string
  serviceStatus: string
  status: 'Active' | 'Cancelled'
  serviceName?: string
  date: string
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

export default function VendorBookingListPage() {
  const router = useRouter()

  const [sort, setSort] = useState<SortOption>('latest')
  const [filter, setFilter] = useState<FilterOption>('all')

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useVendorBookings({
    page,
    limit: 3,
    search,
    sortOption: sort,
    filterOption: filter,
  })

  const tableData: BookingTableItem[] =
    data?.data.map((booking) => ({
      id: booking.bookingId,
      bookingId: booking.bookingId,
      bookingGroupCode: booking.bookingGroupCode||"",
      paymentStatus: booking.paymentStatus,
      serviceStatus: booking.serviceStatus,
      status: booking.cancelInfo ? 'Cancelled' : 'Active',
      serviceName: booking.serviceName,
      date: booking.date,
    })) ?? []

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
      header: 'Booking Code',
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
