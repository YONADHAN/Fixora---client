'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  Calendar,
  Clock,

  MapPin,
  AlertCircle,
 
  Building2,
  Phone,
  Mail,
} from 'lucide-react'

import {
  useCustomerBookingDetails,
  useCancelCustomerBooking,
} from '@/lib/hooks/useBooking'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(
  () => import('@/components/shared-ui/map/MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className='h-full w-full bg-muted animate-pulse rounded-md' />
    ),
  },
)

export default function CustomerBookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>()

  const { data, isPending } = useCustomerBookingDetails(bookingId)
  const { mutate: cancelBooking, isPending: isCancelling } =
    useCancelCustomerBooking(bookingId)

  const [reason, setReason] = useState('')
  const [isPayingBalance, setIsPayingBalance] = useState(false)

  if (isPending) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    )
  }

  if (!data) {
    return (
      <div className='flex flex-col items-center justify-center h-[50vh] gap-4'>
        <h2 className='text-xl font-semibold'>Booking not found</h2>
        <Button variant='outline' onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  const { booking, service, vendor } = data
  const isCancelled = booking.serviceStatus === 'cancelled'
  const isCompleted = booking.serviceStatus === 'completed'
  const isAdvancePaid = booking.paymentStatus === 'advance-paid'
  const isFullyPaid =
    booking.paymentStatus === 'fully-paid' || booking.paymentStatus === 'paid'

  const serviceDate = booking.slotEnd
    ? new Date(booking.slotEnd)
    : new Date(booking.date)

  if (!booking.slotEnd) {
    serviceDate.setHours(23, 59, 59, 999)
  }
  const isPastCancellationDate = new Date() > serviceDate

  const handleCancelBooking = () => {
    if (!reason.trim()) {
      toast.error('Cancellation reason is required')
      return
    }
    cancelBooking(reason)
  }

  const handlePayBalance = async () => {
    try {
      setIsPayingBalance(true)
      const { payBalance } = await import('@/services/booking/booking.service')
      const response = await payBalance(bookingId)
      if (response && response.checkoutUrl) {
        window.location.href = response.checkoutUrl
      } else {
        toast.error('Failed to initiate payment')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsPayingBalance(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'fully-paid':
      case 'paid':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'cancelled':
      case 'failed':
      case 'refunded':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      case 'advance-paid':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className='max-w-5xl mx-auto space-y-8 pb-10'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Booking Details</h1>
          <p className='text-muted-foreground mt-1'>
            Order ID:{' '}
            <span className='font-mono text-foreground'>
              {booking.bookingId}
            </span>
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Badge
            className={`px-3 py-1 text-sm font-medium ${getStatusColor(
              booking.serviceStatus,
            )}`}
          >
            {booking.serviceStatus.charAt(0).toUpperCase() +
              booking.serviceStatus.slice(1)}
          </Badge>
          <Badge
            variant='outline'
            className={`px-3 py-1 text-sm font-medium ${getStatusColor(
              booking.paymentStatus,
            )} border-0`}
          >
            Payment: {booking.paymentStatus.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column - Main Details */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Service Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Building2 className='h-5 w-5 text-primary' />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start justify-between'>
                <div>
                  <h3 className='text-xl font-semibold'>{service.name}</h3>
                  <div className='flex items-center text-muted-foreground mt-2'>
                    <Calendar className='h-4 w-4 mr-2' />
                    <span>
                      {format(new Date(booking.date), 'EEEE, d MMMM yyyy')}
                    </span>
                  </div>
                </div>
                {service.mainImage ? (
                  <img
                    src={service.mainImage}
                    alt={service.name}
                    className='h-16 w-16 object-cover rounded-md border'
                  />
                ) : (
                  <div className='h-16 w-16 bg-muted rounded-md flex items-center justify-center'>
                    <Building2 className='h-8 w-8 text-muted-foreground/30' />
                  </div>
                )}
              </div>

              <Separator />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Rate
                  </p>
                  <p className='flex items-center font-medium'>
                    {formatCurrency(service.pricing.pricePerSlot)}{' '}
                    <span className='text-muted-foreground text-sm font-normal ml-1'>
                      / slot
                    </span>
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Advance Required
                  </p>
                  <p className='font-medium'>
                    {formatCurrency(service.pricing.advanceAmountPerSlot)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='h-5 w-5 text-primary' />
                Schedule & Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                {booking.slotStart && booking.slotEnd && (
                  <div className='flex flex-col items-center justify-center p-3 bg-secondary rounded-lg border text-center'>
                    <span className='text-xs text-muted-foreground mb-1'>
                      Time Slot
                    </span>
                    <span className='font-semibold text-sm'>
                      {format(new Date(booking.slotStart), 'hh:mm a')} -{' '}
                      {format(new Date(booking.slotEnd), 'hh:mm a')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Details */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={vendor.profileImage} />
                  <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                Provider Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Name
                  </p>
                  <p className='font-medium'>{vendor.name}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Location
                  </p>
                  <div className='flex items-center'>
                    <MapPin className='h-4 w-4 mr-1 text-muted-foreground' />
                    <p className='font-medium'>
                      {vendor.location?.displayName ||
                        vendor.location?.name ||
                        'Clt'}
                    </p>
                  </div>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Contact
                  </p>
                  <div className='flex items-center gap-2'>
                    {vendor.email && (
                      <Badge variant='secondary' className='font-normal'>
                        <Mail className='h-3 w-3 mr-1' /> {vendor.email}
                      </Badge>
                    )}
                    {vendor.phone && (
                      <Badge variant='secondary' className='font-normal'>
                        <Phone className='h-3 w-3 mr-1' /> {vendor.phone}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Map Section */}
              {vendor.geoLocation &&
                vendor.geoLocation.coordinates &&
                vendor.geoLocation.coordinates.length === 2 && (
                  <div className='mt-4'>
                    <p className='text-sm font-medium text-muted-foreground mb-2'>
                      Location Map
                    </p>
                    <div className='h-48 w-full rounded-md overflow-hidden border'>
                      <MapComponent
                        lat={vendor.geoLocation.coordinates[1]}
                        lng={vendor.geoLocation.coordinates[0]}
                        popupText={vendor.name}
                      />
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full mt-2'
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${vendor.geoLocation?.coordinates[1]},${vendor.geoLocation?.coordinates[0]}`,
                          '_blank',
                        )
                      }
                    >
                      <MapPin className='h-3 w-3 mr-2' />
                      Open in Google Maps
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className='space-y-6'>
          {/* Payment Summary */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 pb-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Total Amount</span>
                <span className='font-medium'>
                  {formatCurrency(service.pricing.pricePerSlot)}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Advance Paid</span>
                <span className='font-medium text-green-600'>
                  -{formatCurrency(service.pricing.advanceAmountPerSlot)}
                </span>
              </div>
              {isFullyPaid && (
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Balance Paid</span>
                  <span className='font-medium text-green-600'>
                    -
                    {formatCurrency(
                      service.pricing.pricePerSlot -
                        service.pricing.advanceAmountPerSlot,
                    )}
                  </span>
                </div>
              )}
              <Separator />
              <div className='flex justify-between font-semibold'>
                <span>{isFullyPaid ? 'Total Due' : 'Balance Due'}</span>
                <span>
                  {isFullyPaid
                    ? formatCurrency(0)
                    : formatCurrency(
                        service.pricing.pricePerSlot -
                          service.pricing.advanceAmountPerSlot,
                      )}
                </span>
              </div>
            </CardContent>
            {isAdvancePaid && !isCancelled && isCompleted && (
              <CardFooter className='pt-0'>
                <Button
                  className='w-full'
                  onClick={() => handlePayBalance()}
                  disabled={isPayingBalance}
                >
                  {isPayingBalance ? 'Processing...' : 'Pay Balance Now'}
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Cancellation */}
          {isCancelled && booking.cancelInfo ? (
            <Card className='border-red-200 bg-red-50'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-red-700 flex items-center gap-2 text-base'>
                  <AlertCircle className='h-4 w-4' />
                  Booking Cancelled
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-red-600'>
                  <span className='font-medium'>Reason:</span>{' '}
                  {booking.cancelInfo.reason}
                </p>
                {booking.cancelInfo.cancelledByRole && (
                  <p className='text-xs text-red-500 mt-1 capitalize'>
                    Cancelled by: {booking.cancelInfo.cancelledByRole}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            !isCompleted &&
            !isPastCancellationDate && (
              <Card className='border-red-100'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base text-red-600'>
                    Cancel Booking
                  </CardTitle>
                  <CardDescription>
                    Need to cancel? Please provide a reason below.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Textarea
                    placeholder='Reason for cancellation...'
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className='resize-none'
                  />
                  <Button
                    variant='destructive'
                    className='w-full'
                    disabled={isCancelling}
                    onClick={handleCancelBooking}
                  >
                    {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </Button>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  )
}
