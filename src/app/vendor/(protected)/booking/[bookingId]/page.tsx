'use client'

import { useParams } from 'next/navigation'
import { useVendorBookingDetails } from '@/lib/hooks/useBooking'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Building2,
  Phone,
  Mail,
  User,
  ArrowLeft
} from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(
  () => import('@/components/shared-ui/map/MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className='h-48 w-full bg-muted animate-pulse rounded-md' />
    ),
  }
)

export default function VendorBookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const router = useRouter()
  const { data, isLoading } = useVendorBookingDetails(bookingId)

  if (isLoading) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    )
  }

  if (!data) {
    return (
      <div className='flex flex-col items-center justify-center h-[50vh] gap-4 text-muted-foreground'>
        <h2 className='text-xl font-semibold'>Booking not found</h2>
        <Button variant='outline' onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  const { booking, service, customer } = data
  console.log('Booking Data:', data)
  const serviceStatus = booking.serviceStatus || 'pending'
  const paymentStatus = booking.paymentStatus || 'pending'

  const isCompleted = serviceStatus === 'completed'
  const isCancelled = serviceStatus === 'cancelled'

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'fully-paid':
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'cancelled':
      case 'failed':
      case 'refunded':
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'advance-paid':
      case 'confirmed':
      case 'accepted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
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
    <div className='max-w-6xl mx-auto space-y-6 pb-10 p-4 md:p-6'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground'>Booking Details</h1>
          </div>
          <p className='text-muted-foreground ml-10'>
            ID: <span className='font-mono font-medium text-foreground'>{booking.bookingId}</span>
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-3 ml-10 md:ml-0'>
          <Badge className={`px-3 py-1 text-sm font-medium border ${getStatusColor(serviceStatus)}`}>
            {serviceStatus.charAt(0).toUpperCase() + serviceStatus.slice(1)}
          </Badge>
          <Badge variant='outline' className={`px-3 py-1 text-sm font-medium border ${getStatusColor(paymentStatus)}`}>
            Payment: {paymentStatus.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        <div className='lg:col-span-2 space-y-6'>
          {/* Service Info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Building2 className='h-5 w-5 text-primary' />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <h3 className='text-xl font-semibold'>{service.name}</h3>
                  <div className='flex items-center text-muted-foreground mt-2'>
                    <Calendar className='h-4 w-4 mr-2' />
                    <span>
                      {booking.date ? format(new Date(booking.date), 'EEEE, d MMMM yyyy') : 'Date not set'}
                    </span>
                  </div>
                </div>
                {service.mainImage ? (
                  <img
                    src={service.mainImage}
                    alt={service.name}
                    className='h-20 w-20 object-cover rounded-md border bg-muted'
                  />
                ) : (
                  <div className='h-20 w-20 bg-muted rounded-md flex items-center justify-center border'>
                    <Building2 className='h-8 w-8 text-muted-foreground/30' />
                  </div>
                )}
              </div>

              <Separator />

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground mb-1'>Total Rate</p>
                  <p className='text-lg font-medium'>
                    {formatCurrency(service.pricing?.pricePerSlot || 0)}
                    <span className='text-sm text-muted-foreground font-normal ml-1'>/ slot</span>
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground mb-1'>Advance Amount</p>
                  <p className='text-lg font-medium'>
                    {formatCurrency(service.pricing?.advanceAmountPerSlot || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Clock className='h-5 w-5 text-primary' />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.slotStart && booking.slotEnd ? (
                <div className='inline-flex flex-col items-center justify-center p-4 bg-secondary/50 rounded-lg border text-center min-w-[150px]'>
                  <span className='text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold'>Time Slot</span>
                  <span className='font-semibold text-base'>
                    {format(new Date(booking.slotStart), 'hh:mm a')} - {format(new Date(booking.slotEnd), 'hh:mm a')}
                  </span>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No time slot details available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer & Location */}
        <div className='space-y-6'>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <User className='h-5 w-5 text-primary' />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-4'>
                <Avatar className='h-12 w-12 border'>
                  <AvatarImage src={customer.profileImage} />
                  <AvatarFallback>{customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-semibold text-lg'>{customer.name || 'Unknown User'}</p>
                  <p className='text-sm text-muted-foreground'>Customer</p>
                </div>
              </div>

              <Separator />

              <div className='space-y-3'>
                {customer.email && (
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='h-8 w-8 rounded-md bg-secondary flex items-center justify-center shrink-0'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                    </div>
                    <span className='break-all'>{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='h-8 w-8 rounded-md bg-secondary flex items-center justify-center shrink-0'>
                      <Phone className='h-4 w-4 text-muted-foreground' />
                    </div>
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Map */}

          {customer.location && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <MapPin className='h-5 w-5 text-primary' />
                  Service Location
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Address Text */}
                {(customer.location?.displayName || customer.location?.name) && (
                  <p className="text-sm text-balance">
                    {customer.location?.displayName || customer.location?.name}
                    {customer.location?.zipCode ? ` - ${customer.location.zipCode}` : ''}
                  </p>
                )}



                {customer.geoLocation?.coordinates && customer.geoLocation.coordinates.length === 2 && (
                  <div className='aspect-video w-full rounded-md overflow-hidden border'>
                    <MapComponent
                      lat={customer.geoLocation.coordinates[1]}
                      lng={customer.geoLocation.coordinates[0]}
                      popupText={customer.name}
                    />
                  </div>
                )}

                {customer.geoLocation?.coordinates && customer.geoLocation.coordinates.length === 2 && (
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${customer.geoLocation.coordinates[1]},${customer.geoLocation.coordinates[0]}`,
                        '_blank'
                      )
                    }
                  >
                    <MapPin className='h-4 w-4 mr-2' />
                    Open in Google Maps
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
