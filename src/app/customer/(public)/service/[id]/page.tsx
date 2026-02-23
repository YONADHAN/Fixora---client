'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGetServicesById } from '@/lib/hooks/useService'
import { useServiceReviews } from '@/lib/hooks/useReviewRating'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Star, MapPin, Clock } from 'lucide-react'

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const { data, isLoading, isError } = useGetServicesById({ serviceId })
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useServiceReviews(serviceId, 5)

  if (isLoading) return <p className='p-6'>Loading service details…</p>
  if (isError || !data) return <p className='p-6'>Service not found.</p>

  const price = data.pricing.pricePerSlot
  const advance = data.pricing.advanceAmountPerSlot

  const vendor = data.populatedValues?.vendor
  const subCategory = data.populatedValues?.subServiceCategory
  const schedule = data.schedule

  const reviews =
    reviewsData?.pages.flatMap((page) => page.ratingsReviews) ?? []

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null

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
      {/* ================= SERVICE HEADER ================= */}
      <div className='grid md:grid-cols-2 gap-6'>
        <div className='w-full h-80 rounded-xl overflow-hidden bg-muted'>
          <img
            src={data.mainImage}
            alt={data.name}
            className='w-full h-full object-cover'
          />
        </div>

        <div className='space-y-4'>
          {subCategory?.name && (
            <span className='inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600'>
              {subCategory.name}
            </span>
          )}

          <h1 className='text-3xl font-bold leading-tight'>{data.name}</h1>

          <div className='flex items-center gap-2 text-yellow-500'>
            <Star size={18} />
            <span className='text-sm text-gray-600'>
              {avgRating ?? 'New'}{' '}
              {reviews.length > 0 && `(${reviews.length} reviews)`}
            </span>
          </div>

          <p className='text-gray-600 text-sm leading-relaxed'>
            {data.description}
          </p>

          <div className='w-full flex justify-between place-items-center'>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Starting from</p>
              <p className='text-4xl font-bold text-primary'>₹{price}</p>
              <p className='text-xs text-gray-500'>
                Advance payment: ₹{advance}
              </p>
            </div>

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

      {/* ================= AVAILABILITY ================= */}
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

        <div className='flex items-center gap-2'>
          <Clock size={20} className='text-primary' />
          <p className='text-sm text-gray-700'>
            Duration per slot: {schedule.slotDurationMinutes} minutes
          </p>
        </div>

        {schedule.dailyWorkingWindows?.map((win, idx) => (
          <p key={idx} className='text-sm'>
            <span className='font-medium'>Working Hours:</span> {win.startTime}{' '}
            – {win.endTime}
          </p>
        ))}
      </Card>

      {/* ================= REVIEWS SECTION ================= */}
      <Card className='p-6 space-y-6'>
        <h2 className='text-xl font-semibold'>Customer Reviews</h2>

        {isReviewsLoading ? (
          <p className='text-sm text-muted-foreground'>Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className='text-sm text-muted-foreground'>
            No reviews yet. Be the first to review this service.
          </p>
        ) : (
          <div className='space-y-4'>
            {reviews.map((review) => (
              <div
                key={review._id}
                className='flex gap-4 border-b pb-4 last:border-none'
              >
                <div className='w-10 h-10 rounded-full bg-muted overflow-hidden'>
                  <img
                    src={review.customer.profileImage || '/placeholder.svg'}
                    className='w-full h-full object-cover'
                  />
                </div>

                <div className='flex-1 space-y-1'>
                  <div className='flex items-center justify-between'>
                    <p className='font-medium'>{review.customer.name}</p>
                    <span className='text-xs text-muted-foreground'>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  <div className='flex items-center gap-1 text-yellow-500'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>

                  <p className='text-sm text-gray-600'>{review.review}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {hasNextPage && (
          <div className='pt-4 flex justify-center'>
            <Button
              variant='outline'
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? 'Loading…' : 'Load more reviews'}
            </Button>
          </div>
        )}
      </Card>

      {/* ================= VENDOR ================= */}
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

      {/* ================= STICKY CTA ================= */}
      <div className='fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden'>
        <Button
          className='w-full py-6 text-lg font-semibold'
          onClick={() => router.push(`/customer/service/${serviceId}/book`)}
        >
          Book This Service
        </Button>
      </div>

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
