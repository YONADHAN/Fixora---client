'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGetServicesById } from '@/lib/hooks/useService'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Star, MapPin, Clock } from 'lucide-react'

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const { data, isLoading, isError } = useGetServicesById({ serviceId })

  if (isLoading) return <p className='p-6'>Loading service details…</p>
  if (isError || !data) return <p className='p-6'>Service not found.</p>

  const price = data.pricing.pricePerSlot
  const advance = data.pricing.advanceAmountPerSlot

  const vendor = data.populatedValues?.vendor
  const subCategory = data.populatedValues?.subServiceCategory
  const schedule = data.schedule

  // Format date safely
  const formatDate = (date?: string | Date) => {
    if (!date) return '-'

    const d = date instanceof Date ? date : new Date(date)

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-10 pb-28'>
      {/* -------------------------------------- */}
      {/* HERO SECTION */}
      {/* -------------------------------------- */}

      <div className='grid md:grid-cols-2 gap-6'>
        <div className='w-full h-80 rounded-xl overflow-hidden bg-muted'>
          <img
            src={data.mainImage}
            alt={data.name}
            className='w-full h-full object-cover'
          />
        </div>

        <div className='space-y-4'>
          {/* CATEGORY */}
          {subCategory?.name && (
            <span className='inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600'>
              {subCategory.name}
            </span>
          )}

          {/* TITLE */}
          <h1 className='text-3xl font-bold leading-tight'>{data.name}</h1>

          {/* RATING - STATIC FOR NOW */}
          <div className='flex items-center gap-2 text-yellow-500'>
            <Star size={18} />
            <span className='text-sm text-gray-600'>4.8 (42 reviews)</span>
          </div>

          {/* DESCRIPTION */}
          <p className='text-gray-600 text-sm leading-relaxed'>
            {data.description}
          </p>

          <div className='w-full flex justify-between place-items-center'>
            {/* PRICING */}
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Starting from</p>
              <p className='text-4xl font-bold text-primary'>₹{price}</p>
              <p className='text-xs text-gray-500'>
                Advance payment: ₹{advance}
              </p>
            </div>

            {/* Desktop button */}
            <div className='hidden md:flex justify-end'>
              <Button
                size='lg'
                className='px-10 py-6 text-lg'
                onClick={() =>
                  router.push(`/customer/service/${serviceId}/book`)
                }
              >
                Book This Service
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* SERVICE AVAILABILITY */}
      {/* -------------------------------------- */}

      <Card className='p-6 space-y-4'>
        <h2 className='text-xl font-semibold'>Service Availability</h2>

        <div className='space-y-2 text-sm text-gray-700'>
          <p>
            <span className='font-medium'>Available From:</span>{' '}
            {formatDate(schedule.visibilityStartDate)}
          </p>

          <p>
            <span className='font-medium'>Available Until:</span>{' '}
            {formatDate(schedule.visibilityEndDate)}
          </p>
        </div>

        {/* Slot duration */}
        <div className='flex items-center gap-2'>
          <Clock size={20} className='text-primary' />
          <p className='text-sm text-gray-700'>
            Duration per slot: {schedule.slotDurationMinutes} minutes
          </p>
        </div>

        {/* Working hours */}
        {schedule.dailyWorkingWindows?.map((win, idx) => (
          <p key={idx} className='text-sm'>
            <span className='font-medium'>Working Hours:</span> {win.startTime}{' '}
            – {win.endTime}
          </p>
        ))}

        {/* Recurrence */}
        {schedule.recurrenceType && (
          <p className='text-sm'>
            <span className='font-medium'>Recurrence:</span>{' '}
            {schedule.recurrenceType}
          </p>
        )}
      </Card>

      {/* -------------------------------------- */}
      {/* PROVIDER INFO */}
      {/* -------------------------------------- */}

      {vendor && (
        <Card className='p-6 space-y-4'>
          <h2 className='text-xl font-semibold'>Provided By</h2>

          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 rounded-full bg-muted overflow-hidden'>
              <img
                src={vendor.profileImage || '/placeholder.svg'}
                className='w-full h-full object-cover'
              />
            </div>

            <div>
              <p className='font-semibold text-lg'>{vendor.name}</p>

              <p className='text-xs text-gray-500'>Verified Professional</p>

              {vendor.location?.displayName && (
                <p className='text-sm text-gray-600 flex items-center gap-1'>
                  <MapPin size={16} /> {vendor.location.displayName}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* -------------------------------------- */}
      {/* BOOKING BUTTONS */}
      {/* -------------------------------------- */}

      {/* Mobile sticky */}
      <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden'>
        <Button
          className='w-full py-6 text-lg font-semibold'
          onClick={() => router.push(`/customer/service/${serviceId}/book`)}
        >
          Book This Service
        </Button>
      </div>

      {/* Desktop button */}
      <div className='hidden md:flex justify-end'>
        <Button
          size='lg'
          className='px-10 py-6 text-lg'
          onClick={() => router.push(`/customer/service/${serviceId}/book`)}
        >
          Book This Service
        </Button>
      </div>
    </div>
  )
}
