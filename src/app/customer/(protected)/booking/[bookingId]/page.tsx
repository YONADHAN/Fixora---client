'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  useCustomerBookingDetails,
  useCancelCustomerBooking,
} from '@/lib/hooks/useBooking'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function CustomerBookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const router = useRouter()

  const { data, isPending } = useCustomerBookingDetails(bookingId)
  const { mutate: cancelBooking, isPending: isCancelling } =
    useCancelCustomerBooking(bookingId)

  const [reason, setReason] = useState('')

  if (isPending) return <div>Loading...</div>
  if (!data) return <div>No booking found</div>

  const isCancelled = data.booking.serviceStatus === 'cancelled'

  const handleCancelBooking = () => {
    if (!reason.trim()) {
      toast.error('Cancellation reason is required')
      return
    }

    cancelBooking(reason)
  }

  return (
    <div className='space-y-6'>
      <Card className='p-6 space-y-2'>
        <h2 className='text-lg font-semibold'>Booking Details</h2>

        <p>
          <span className='font-medium'>Booking ID:</span>{' '}
          {data.booking.bookingId}
        </p>

        <p>
          <span className='font-medium'>Service Status:</span>{' '}
          <span className='capitalize'>{data.booking.serviceStatus}</span>
        </p>

        <p>
          <span className='font-medium'>Payment Status:</span>{' '}
          <span className='capitalize'>{data.booking.paymentStatus}</span>
        </p>
      </Card>

      <Card className='p-6 space-y-2'>
        <h2 className='text-lg font-semibold'>Service</h2>

        <p className='font-medium'>{data.service.name}</p>

        <p>Price per slot: ₹{data.service.pricing.pricePerSlot}</p>
      </Card>

      <Card className='p-6 space-y-2'>
        <h2 className='text-lg font-semibold'>Vendor</h2>
        <p>{data.vendor.name}</p>
      </Card>

      {!isCancelled && (
        <Card className='p-6 space-y-4 border-red-200'>
          <h2 className='text-lg font-semibold text-red-600'>Cancel Booking</h2>

          <Textarea
            placeholder='Enter reason for cancellation'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />

          <Button
            variant='destructive'
            disabled={isCancelling}
            onClick={handleCancelBooking}
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </Card>
      )}

      {isCancelled && data.booking.cancelInfo && (
        <Card className='p-6 bg-red-50'>
          <h2 className='text-lg font-semibold text-red-600'>
            Booking Cancelled
          </h2>

          <p>
            <span className='font-medium'>Reason:</span>{' '}
            {data.booking.cancelInfo.reason}
          </p>
        </Card>
      )}
    </div>
  )
}
