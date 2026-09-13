'use client'

import {
  useCustomerBookingDetails,
  useCustomerBookingDetailsByPaymentId,
  useCustomerBookings,
} from '@/lib/hooks/useBooking'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CheckCircle2,
  Calendar,
  Clock,

  AlertTriangle,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()


  const rawBookingId = searchParams.get('bookingId')
  const groupId = searchParams.get('groupId') || searchParams.get('holdId')
  const bookingId =
    rawBookingId && rawBookingId !== 'null' && rawBookingId !== 'undefined'
      ? rawBookingId
      : null

  const paymentIntentId = searchParams.get('payment_intent')


  const {
    data: groupBookingsData,
    isLoading: isLoadingGroup,
    error: errorGroup,
  } = useCustomerBookings(
    groupId
      ? {
        page: 1,
        limit: 50,
        search: groupId,
      }
      : { page: 1, limit: 1, search: '____' },
    true
  )

  const groupBookings = groupId ? groupBookingsData?.data : null


  const targetBookingId =
    bookingId ||
    (groupBookings && groupBookings.length > 0
      ? groupBookings[0].bookingId
      : null)


  const {
    data: bookingDetails,
    isLoading: isLoadingDetails,
    error: errorDetails,
  } = useCustomerBookingDetails(targetBookingId)


  const {
    data: bookingByPayment,
    isLoading: isLoadingByPayment,
    error: errorByPayment,
  } = useCustomerBookingDetailsByPaymentId(
    !targetBookingId ? paymentIntentId : null
  )

  const finalBookingDetails = bookingDetails || bookingByPayment
  const isLoading =
    (groupId ? isLoadingGroup : false) || isLoadingDetails || isLoadingByPayment
  const error = errorGroup || errorDetails || errorByPayment

  if (isLoading) {
    return (
      <div className='min-h-[70vh] flex items-center justify-center px-4 py-16'>
        <div className='flex flex-col items-center gap-4'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-primary'></div>
          <p className='text-muted-foreground text-sm'>
            Payment successful. Finalizing your booking...
          </p>
        </div>
      </div>
    )
  }

  //Failure
  if (error || !finalBookingDetails) {
    return (
      <div className='min-h-[70vh] flex items-center justify-center px-4 py-16'>
        <Card className='w-full max-w-lg shadow-lg border-zinc-200 bg-white'>
          <CardHeader className='text-center pb-6 border-b border-zinc-100'>
            <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100'>
              <Clock className='h-10 w-10 text-zinc-800 animate-pulse' />
            </div>
            <CardTitle className='text-2xl font-bold tracking-tight text-zinc-900'>
              Finalizing Booking
            </CardTitle>
            <p className='text-zinc-500 mt-2 text-sm px-4'>
              Your payment was successful. We are completing the final steps of your booking.
            </p>
          </CardHeader>

          <CardContent className='pt-8 pb-8 px-8 flex flex-col gap-4'>
            <Button 
              onClick={() => router.refresh()} 
              variant='outline' 
              className="w-full border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              size="lg"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => router.push('/customer/booking/list')}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow transition-all"
              size="lg"
            >
              Go to My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { service, booking: mainBooking } = finalBookingDetails


  const slotsToShow =
    groupBookings && groupBookings.length > 0
      ? groupBookings
      : [{ ...mainBooking }]


  return (
    <div className='min-h-[70vh] flex justify-center px-4 py-16'>
      <Card className='w-full max-w-2xl border-green-200 shadow-xl'>
        <CardHeader className='text-center pb-8 border-b bg-green-50/40'>
          <div className='flex justify-center mb-4'>
            <CheckCircle2 className='h-16 w-16 text-green-600' />
          </div>
          <CardTitle className='text-2xl text-green-700'>
            Payment Successful!
          </CardTitle>
          <p className='text-muted-foreground mt-2'>
            Your booking has been confirmed.
          </p>
        </CardHeader>

        <CardContent className='pt-8 space-y-6'>
          {/* Booking Reference */}
          <div className='text-center pb-6 border-b space-y-2'>
            {(mainBooking.bookingGroupCode ||
              groupBookings?.[0]?.bookingGroupCode) && (
                <div>
                  <p className='text-xs text-muted-foreground uppercase tracking-wider mb-1'>
                    Booking Reference
                  </p>
                  <p className='font-mono font-bold text-2xl text-green-700 tracking-widest'>
                    {mainBooking.bookingGroupCode ||
                      groupBookings?.[0]?.bookingGroupCode}
                  </p>
                </div>
              )}
            {/* <div>
              <p className='text-xs text-muted-foreground uppercase tracking-wider mb-1'>
                Booking Group ID
              </p>
              <p className='font-mono text-xs text-muted-foreground break-all'>
                {mainBooking.bookingGroupId}
              </p>
            </div> */}
          </div>

          {/* Service Details */}
          <div className='grid gap-6'>
            <div className='flex items-start gap-4'>
              <div>
                <h3 className='font-semibold text-lg'>{service.name}</h3>
              </div>
            </div>

            {/* Slots List */}
            <div className='space-y-3'>
              <h4 className='font-medium text-sm text-muted-foreground'>
                Booked Slots ({slotsToShow.length})
              </h4>
              {slotsToShow.map((slot, idx) => (
                <div
                  key={idx}
                  className='grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/40 text-sm'
                >
                  <div className='flex items-center gap-3'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-xs text-muted-foreground'>Date</p>
                      <p className='font-medium'>
                        {slot.date
                          ? format(new Date(slot.date), 'dd MMM yyyy')
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Clock className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-xs text-muted-foreground'>Time</p>
                      <p className='font-medium'>
                        {slot.slotStart && slot.slotEnd
                          ? `${format(
                            new Date(slot.slotStart),
                            'hh:mm a'
                          )} – ${format(
                            new Date(slot.slotEnd),
                            'hh:mm a'
                          )}`
                          : 'Time not available'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Details */}
            <div className='flex items-center justify-between p-4 rounded-lg border bg-card'>
              <span className='text-muted-foreground'>Payment Status</span>
              <span className='capitalize font-bold text-green-600'>
                {mainBooking.paymentStatus}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className='pt-4'>
            <Link href='/customer/booking/list' className='w-full'>
              <Button className='w-full' size='lg'>
                View My Bookings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
