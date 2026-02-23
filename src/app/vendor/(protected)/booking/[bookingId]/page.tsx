// 'use client'

// import { useParams } from 'next/navigation'
// import { useVendorBookingDetails } from '@/lib/hooks/useBooking'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
// import { Button } from '@/components/ui/button'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import {
//   Calendar,
//   Clock,
//   IndianRupee,
//   MapPin,
//   Building2,
//   Phone,
//   Mail,
//   User,
//   ArrowLeft,
// } from 'lucide-react'
// import { format } from 'date-fns'
// import { useRouter } from 'next/navigation'
// import dynamic from 'next/dynamic'

// const MapComponent = dynamic(
//   () => import('@/components/shared-ui/map/MapComponent'),
//   {
//     ssr: false,
//     loading: () => (
//       <div className='h-48 w-full bg-muted animate-pulse rounded-md' />
//     ),
//   },
// )

// export default function VendorBookingDetailsPage() {
//   const { bookingId } = useParams<{ bookingId: string }>()
//   const router = useRouter()
//   const { data, isLoading } = useVendorBookingDetails(bookingId)

//   if (isLoading) {
//     return (
//       <div className='flex h-[50vh] items-center justify-center'>
//         <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
//       </div>
//     )
//   }

//   if (!data) {
//     return (
//       <div className='flex flex-col items-center justify-center h-[50vh] gap-4 text-muted-foreground'>
//         <h2 className='text-xl font-semibold'>Booking not found</h2>
//         <Button variant='outline' onClick={() => router.back()}>
//           Go Back
//         </Button>
//       </div>
//     )
//   }

//   const { booking, service, customer } = data
//   const locationCoordinates =
//     customer.bookingAddress?.geoLocation?.coordinates ??
//     customer.geoLocation?.coordinates
//   console.log('Booking Data:', data)
//   const serviceStatus = booking.serviceStatus || 'pending'
//   const paymentStatus = booking.paymentStatus || 'pending'

//   const isCompleted = serviceStatus === 'completed'
//   const isCancelled = serviceStatus === 'cancelled'

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed':
//       case 'fully-paid':
//       case 'paid':
//         return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
//       case 'cancelled':
//       case 'failed':
//       case 'refunded':
//       case 'rejected':
//         return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
//       case 'advance-paid':
//       case 'confirmed':
//       case 'accepted':
//         return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
//       default:
//         return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
//     }
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0,
//     }).format(amount)
//   }

//   return (
//     <div className='max-w-6xl mx-auto space-y-6 pb-10 p-4 md:p-6'>
//       {/* Header Section */}
//       <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
//         <div>
//           <div className='flex items-center gap-2 mb-2'>
//             <Button
//               variant='ghost'
//               size='sm'
//               className='h-8 w-8 p-0'
//               onClick={() => router.back()}
//             >
//               <ArrowLeft className='h-4 w-4' />
//             </Button>
//             <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground'>
//               Booking Details
//             </h1>
//           </div>
//           <p className='text-muted-foreground ml-10'>
//             ID:{' '}
//             <span className='font-mono font-medium text-foreground'>
//               {booking.bookingId}
//             </span>
//           </p>
//         </div>

//         <div className='flex flex-wrap items-center gap-3 ml-10 md:ml-0'>
//           <Badge
//             className={`px-3 py-1 text-sm font-medium border ${getStatusColor(serviceStatus)}`}
//           >
//             {serviceStatus.charAt(0).toUpperCase() + serviceStatus.slice(1)}
//           </Badge>
//           <Badge
//             variant='outline'
//             className={`px-3 py-1 text-sm font-medium border ${getStatusColor(paymentStatus)}`}
//           >
//             Payment: {paymentStatus.replace('-', ' ').toUpperCase()}
//           </Badge>
//         </div>
//       </div>

//       <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
//         <div className='lg:col-span-2 space-y-6'>
//           {/* Service Info */}
//           <Card>
//             <CardHeader>
//               <CardTitle className='flex items-center gap-2 text-lg'>
//                 <Building2 className='h-5 w-5 text-primary' />
//                 Service Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className='space-y-6'>
//               <div className='flex items-start justify-between gap-4'>
//                 <div>
//                   <h3 className='text-xl font-semibold'>{service.name}</h3>
//                   <div className='flex items-center text-muted-foreground mt-2'>
//                     <Calendar className='h-4 w-4 mr-2' />
//                     <span>
//                       {booking.date
//                         ? format(new Date(booking.date), 'EEEE, d MMMM yyyy')
//                         : 'Date not set'}
//                     </span>
//                   </div>
//                 </div>
//                 {service.mainImage ? (
//                   <img
//                     src={service.mainImage}
//                     alt={service.name}
//                     className='h-20 w-20 object-cover rounded-md border bg-muted'
//                   />
//                 ) : (
//                   <div className='h-20 w-20 bg-muted rounded-md flex items-center justify-center border'>
//                     <Building2 className='h-8 w-8 text-muted-foreground/30' />
//                   </div>
//                 )}
//               </div>

//               <Separator />

//               <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
//                 <div>
//                   <p className='text-sm font-medium text-muted-foreground mb-1'>
//                     Total Rate
//                   </p>
//                   <p className='text-lg font-medium'>
//                     {formatCurrency(service.pricing?.pricePerSlot || 0)}
//                     <span className='text-sm text-muted-foreground font-normal ml-1'>
//                       / slot
//                     </span>
//                   </p>
//                 </div>
//                 <div>
//                   <p className='text-sm font-medium text-muted-foreground mb-1'>
//                     Advance Amount
//                   </p>
//                   <p className='text-lg font-medium'>
//                     {formatCurrency(service.pricing?.advanceAmountPerSlot || 0)}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Schedule */}
//           <Card>
//             <CardHeader>
//               <CardTitle className='flex items-center gap-2 text-lg'>
//                 <Clock className='h-5 w-5 text-primary' />
//                 Schedule
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {booking.slotStart && booking.slotEnd ? (
//                 <div className='inline-flex flex-col items-center justify-center p-4 bg-secondary/50 rounded-lg border text-center min-w-[150px]'>
//                   <span className='text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold'>
//                     Time Slot
//                   </span>
//                   <span className='font-semibold text-base'>
//                     {format(new Date(booking.slotStart), 'hh:mm a')} -{' '}
//                     {format(new Date(booking.slotEnd), 'hh:mm a')}
//                   </span>
//                 </div>
//               ) : (
//                 <p className='text-muted-foreground italic'>
//                   No time slot details available.
//                 </p>
//               )}
//             </CardContent>
//           </Card>

//           {/* Location Map */}
//           {(customer.bookingAddress || customer.location) && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className='flex items-center gap-2 text-lg'>
//                   <MapPin className='h-5 w-5 text-primary' />
//                   Service Location
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className='space-y-4'>
//                 {(customer.bookingAddress || customer.location) && (
//                   <div className='text-sm text-balance bg-muted/30 p-4 rounded-lg border'>
//                     {customer.bookingAddress ? (
//                       <>
//                         <div className='flex items-center gap-2 mb-2'>
//                           <Badge
//                             variant='secondary'
//                             className='uppercase tracking-wider font-semibold text-xs rounded-sm'
//                           >
//                             {customer.bookingAddress.name}
//                           </Badge>
//                         </div>
//                         <div className='text-base font-medium mb-1'>
//                           {customer.bookingAddress.addressLine1}
//                           {customer.bookingAddress.addressLine2 &&
//                             `, ${customer.bookingAddress.addressLine2}`}
//                         </div>
//                         <div className='text-muted-foreground'>
//                           {customer.bookingAddress.city},{' '}
//                           {customer.bookingAddress.state} -{' '}
//                           {customer.bookingAddress.zipCode}
//                         </div>
//                       </>
//                     ) : (
//                       <div className='flex items-center gap-2'>
//                         <MapPin className='h-4 w-4 text-muted-foreground' />
//                         <span>
//                           {customer.location?.displayName ||
//                             customer.location?.name}
//                           {customer.location?.zipCode
//                             ? ` - ${customer.location.zipCode}`
//                             : ''}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {locationCoordinates && (
//                   <div className='aspect-video w-full rounded-md overflow-hidden border mt-4'>
//                     <MapComponent
//                       lat={locationCoordinates[1]!}
//                       lng={locationCoordinates[0]!}
//                       popupText={customer.bookingAddress?.name || customer.name}
//                     />
//                   </div>
//                 )}

//                 {locationCoordinates && (
//                   <Button
//                     variant='outline'
//                     className='w-full mt-2'
//                     onClick={() => {
//                       const lat = locationCoordinates[1]
//                       const lng = locationCoordinates[0]
//                       window.open(
//                         `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
//                         '_blank',
//                       )
//                     }}
//                   >
//                     <MapPin className='h-4 w-4 mr-2' />
//                     Open in Google Maps
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Right Column - Customer Details */}
//         <div className='space-y-6'>
//           <Card>
//             <CardHeader>
//               <CardTitle className='flex items-center gap-2 text-lg'>
//                 <User className='h-5 w-5 text-primary' />
//                 Customer Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className='space-y-4'>
//               <div className='flex items-center gap-4'>
//                 <Avatar className='h-12 w-12 border'>
//                   <AvatarImage src={customer.profileImage} />
//                   <AvatarFallback>
//                     {customer.name
//                       ? customer.name.charAt(0).toUpperCase()
//                       : 'C'}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className='font-semibold text-lg'>
//                     {customer.name || 'Unknown User'}
//                   </p>
//                   <p className='text-sm text-muted-foreground'>Customer</p>
//                 </div>
//               </div>

//               <Separator />

//               <div className='space-y-3'>
//                 {customer.email && (
//                   <div className='flex items-center gap-3 text-sm'>
//                     <div className='h-8 w-8 rounded-md bg-secondary flex items-center justify-center shrink-0'>
//                       <Mail className='h-4 w-4 text-muted-foreground' />
//                     </div>
//                     <span className='break-all'>{customer.email}</span>
//                   </div>
//                 )}
//                 {customer.phone && (
//                   <div className='flex items-center gap-3 text-sm'>
//                     <div className='h-8 w-8 rounded-md bg-secondary flex items-center justify-center shrink-0'>
//                       <Phone className='h-4 w-4 text-muted-foreground' />
//                     </div>
//                     <span>{customer.phone}</span>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
// //====================================================================================================================================

'use client'

import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'

import {
  useVendorBookingDetails,
  useCancelVendorBooking,
  useBookingServiceStatus,
} from '@/lib/hooks/useBooking'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Phone,
  Mail,
  User,
  ArrowLeft,
} from 'lucide-react'

const MapComponent = dynamic(
  () => import('@/components/shared-ui/map/MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className='h-48 w-full bg-muted animate-pulse rounded-md' />
    ),
  },
)

export default function VendorBookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const router = useRouter()

  const { data, isLoading } = useVendorBookingDetails(bookingId)

  const bookingIdSafe = data?.booking?.bookingId ?? ''
  const bookingGroupId = data?.booking?.bookingGroupId ?? ''

  const { mutate: cancelBooking, isPending: isCancelling } =
    useCancelVendorBooking(bookingIdSafe)

  const { mutate: markCompleted, isPending: isMarkingCompleted } =
    useBookingServiceStatus(bookingGroupId)

  const [reason, setReason] = useState('')

  if (isLoading) {
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
        <Button variant='outline' onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  const { booking, service, customer } = data

  const serviceStatus = booking.serviceStatus || 'pending'
  const paymentStatus = booking.paymentStatus || 'pending'

  const isCompleted = serviceStatus === 'completed'
  const isCancelled = serviceStatus === 'cancelled'
  const cancellation = booking?.cancelInfo
  const locationCoordinates =
    customer.bookingAddress?.geoLocation?.coordinates ??
    customer.geoLocation?.coordinates
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

  const handleMarkCompleted = () => {
    if (!bookingGroupId) return
    markCompleted()
  }

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

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div className='max-w-6xl mx-auto space-y-6 pb-10 p-4 md:p-6'>
      {/* HEADER */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0'
              onClick={() => router.back()}
            >
              <ArrowLeft className='h-4 w-4' />
            </Button>
            <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground'>
              Booking Details
            </h1>
          </div>
          <p className='text-muted-foreground ml-10'>
            ID:{' '}
            <span className='font-mono font-medium text-foreground'>
              {booking.bookingId}
            </span>
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-3 ml-10 md:ml-0'>
          <Badge
            className={`px-3 py-1 text-sm font-medium border ${getStatusColor(serviceStatus)}`}
          >
            {serviceStatus.charAt(0).toUpperCase() + serviceStatus.slice(1)}
          </Badge>
          <Badge
            variant='outline'
            className={`px-3 py-1 text-sm font-medium border ${getStatusColor(paymentStatus)}`}
          >
            Payment: {paymentStatus.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* LEFT COLUMN */}
        <div className='lg:col-span-2 space-y-6'>
          {/* SERVICE INFO */}
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
                      {booking.date
                        ? format(new Date(booking.date), 'EEEE, d MMMM yyyy')
                        : 'Date not set'}
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
                  <p className='text-sm font-medium text-muted-foreground mb-1'>
                    Total Rate
                  </p>
                  <p className='text-lg font-medium'>
                    {formatCurrency(service.pricing?.pricePerSlot || 0)}
                    <span className='text-sm text-muted-foreground font-normal ml-1'>
                      / slot
                    </span>
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground mb-1'>
                    Advance Amount
                  </p>
                  <p className='text-lg font-medium'>
                    {formatCurrency(service.pricing?.advanceAmountPerSlot || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SCHEDULE */}
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
                  <span className='text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold'>
                    Time Slot
                  </span>
                  <span className='font-semibold text-base'>
                    {format(new Date(booking.slotStart), 'hh:mm a')} -{' '}
                    {format(new Date(booking.slotEnd), 'hh:mm a')}
                  </span>
                </div>
              ) : (
                <p className='text-muted-foreground italic'>
                  No time slot details available.
                </p>
              )}
            </CardContent>
          </Card>

          {/* LOCATION MAP */}
          {(customer.bookingAddress || customer.location) && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <MapPin className='h-5 w-5 text-primary' />
                  Service Location
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {(customer.bookingAddress || customer.location) && (
                  <div className='text-sm text-balance bg-muted/30 p-4 rounded-lg border'>
                    {customer.bookingAddress ? (
                      <>
                        <div className='flex items-center gap-2 mb-2'>
                          <Badge
                            variant='secondary'
                            className='uppercase tracking-wider font-semibold text-xs rounded-sm'
                          >
                            {customer.bookingAddress.name}
                          </Badge>
                        </div>
                        <div className='text-base font-medium mb-1'>
                          {customer.bookingAddress.addressLine1}
                          {customer.bookingAddress.addressLine2 &&
                            `, ${customer.bookingAddress.addressLine2}`}
                        </div>
                        <div className='text-muted-foreground'>
                          {customer.bookingAddress.city},{' '}
                          {customer.bookingAddress.state} -{' '}
                          {customer.bookingAddress.zipCode}
                        </div>
                      </>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <MapPin className='h-4 w-4 text-muted-foreground' />
                        <span>
                          {customer.location?.displayName ||
                            customer.location?.name}
                          {customer.location?.zipCode
                            ? ` - ${customer.location.zipCode}`
                            : ''}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {locationCoordinates && (
                  <div className='aspect-video w-full rounded-md overflow-hidden border mt-4'>
                    <MapComponent
                      lat={locationCoordinates[1]!}
                      lng={locationCoordinates[0]!}
                      popupText={customer.bookingAddress?.name || customer.name}
                    />
                  </div>
                )}

                {locationCoordinates && (
                  <Button
                    variant='outline'
                    className='w-full mt-2'
                    onClick={() => {
                      const lat = locationCoordinates[1]
                      const lng = locationCoordinates[0]
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
                        '_blank',
                      )
                    }}
                  >
                    <MapPin className='h-4 w-4 mr-2' />
                    Open in Google Maps
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className='space-y-6'>
          {/* CUSTOMER DETAILS */}
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
                  <AvatarFallback>
                    {customer.name
                      ? customer.name.charAt(0).toUpperCase()
                      : 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-semibold text-lg'>
                    {customer.name || 'Unknown User'}
                  </p>
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

          {/* VENDOR ACTIONS */}
          {!isCancelled && !isCompleted && (
            <Card>
              <CardHeader>
                <CardTitle>Vendor Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button
                  className='w-full'
                  onClick={handleMarkCompleted}
                  disabled={isMarkingCompleted}
                >
                  {isMarkingCompleted
                    ? 'Updating...'
                    : 'Mark Work as Completed'}
                </Button>

                <Separator />

                <Textarea
                  placeholder='Reason for cancellation...'
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />

                {!isPastCancellationDate && (
                  <Button
                    variant='destructive'
                    className='w-full'
                    disabled={isCancelling}
                    onClick={handleCancelBooking}
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {isCancelled && (
            <div className='p-4 rounded-2xl border-2 border-red-900 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'>
              <h1>Cancellation Reason: {cancellation?.reason}</h1>
              <h2>Cancelled by: {cancellation?.cancelledByRole}</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
