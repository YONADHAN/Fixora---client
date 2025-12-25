'use client'

import { useParams } from 'next/navigation'
import { useVendorBookingDetails } from '@/lib/hooks/useBooking'
import { Card } from '@/components/ui/card'

export default function VendorBookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const { data, isLoading } = useVendorBookingDetails(bookingId)

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>No booking found</div>

  return (
    <div className='space-y-6'>
      {/* Booking */}
      <Card className='p-6'>
        <h2 className='text-lg font-semibold'>Booking</h2>
        <p>ID: {data.booking.bookingId}</p>
        <p>Status: {data.booking.serviceStatus}</p>
        <p>Payment: {data.booking.paymentStatus}</p>
      </Card>

      {/* Service */}
      <Card className='p-6'>
        <h2 className='text-lg font-semibold'>Service</h2>
        <p>{data.service.name}</p>
        <p>Advance: ₹{data.service.pricing.advanceAmountPerSlot}</p>
      </Card>

      {/* Customer */}
      <Card className='p-6'>
        <h2 className='text-lg font-semibold'>Customer</h2>
        <p>{data.customer.name}</p>
        <p>{data.customer.email}</p>
        <p>{data.customer.phone}</p>
      </Card>
    </div>
  )
}
