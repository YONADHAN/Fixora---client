'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
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
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-500 space-y-10'>
      
      <div className='space-y-6'>
        <div className='relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-muted border border-border/50'>
          <Image
            src={data.mainImage}
            alt={data.name || 'Main service image'}
            fill
            className='w-full h-full object-cover'
          />
        </div>
        
        <div className='space-y-3'>
          {subCategory?.name && (
            <span className='inline-flex text-xs font-semibold uppercase tracking-wider text-primary'>
              {subCategory.name}
            </span>
          )}
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight'>
            {data.name}
          </h1>
          
          <div className='flex items-center gap-4 text-sm'>
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <Star size={16} className="text-yellow-500" fill="currentColor" />
              <span>{avgRating ?? 'New'}</span>
              {reviews.length > 0 && (
                <span className="text-muted-foreground underline decoration-dotted underline-offset-4 cursor-pointer hover:text-foreground transition-colors">
                  ({reviews.length} reviews)
                </span>
              )}
            </div>
            {vendor?.location?.displayName && (
              <>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin size={16} />
                  <span>{vendor.location.displayName}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className='p-6 sm:p-8 rounded-2xl border border-border/50 bg-card shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div className='space-y-2'>
          <p className='text-4xl font-bold text-foreground'>
            ₹{price}
          </p>
          <div className='flex items-center gap-2 text-sm'>
            <span className='text-muted-foreground font-medium'>Starting price per slot</span>
            <span className='text-border'>•</span>
            <span className='text-muted-foreground font-medium'>Advance: ₹{advance}</span>
          </div>
        </div>

        <div className="w-full md:w-auto space-y-3 shrink-0">
          <Button
            size='lg'
            className='w-full md:w-auto px-10 py-6 text-base font-semibold shadow-md active:scale-95 transition-all'
            onClick={() => router.push(`/customer/service/${serviceId}/book`)}
          >
            Book This Service
          </Button>
          <p className="text-xs text-center text-muted-foreground font-medium">
            You won't be charged yet
          </p>
        </div>
      </div>

      <hr className="border-border/50" />

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold tracking-tight'>Description</h2>
        <p className='text-muted-foreground text-[15px] leading-relaxed whitespace-pre-wrap'>
          {data.description}
        </p>
      </section>

      <hr className="border-border/50" />

      <section className='space-y-6'>
        <h2 className='text-xl font-semibold tracking-tight'>Service Details</h2>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className='flex gap-4 p-5 rounded-xl border border-border/50 bg-card'>
            <Clock size={24} className="text-muted-foreground shrink-0" />
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Duration</h3>
              <p className='text-sm text-muted-foreground'>
                {schedule.slotDurationMinutes} minutes per slot
              </p>
            </div>
          </div>

          <div className='flex gap-4 p-5 rounded-xl border border-border/50 bg-card'>
            <MapPin size={24} className="text-muted-foreground shrink-0" />
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Availability</h3>
              <div className='text-sm text-muted-foreground space-y-1'>
                <p>{formatDate(schedule.visibilityStartDate)} – {formatDate(schedule.visibilityEndDate)}</p>
                {schedule.dailyWorkingWindows?.map((win, idx) => (
                  <p key={idx}>{win.startTime} to {win.endTime}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-border/50" />

      {vendor && (
        <section className='space-y-6'>
          <h2 className='text-xl font-semibold tracking-tight'>Provided By</h2>
          <div className='flex items-center gap-5'>
            <Image
              src={vendor.profileImage || '/placeholder.svg'}
              alt={vendor.name || 'Vendor avatar'}
              width={64}
              height={64}
              className='rounded-full object-cover ring-1 ring-border/50'
            />
            <div>
              <p className='font-semibold text-lg text-foreground'>{vendor.name}</p>
              <p className='text-sm text-muted-foreground mt-0.5'>Verified Professional</p>
            </div>
          </div>
        </section>
      )}

      <hr className="border-border/50" />

      <section className='space-y-6'>
        <h2 className='text-xl font-semibold tracking-tight'>
          <Star size={20} className="inline-block mr-2 mb-1 text-yellow-500" fill="currentColor" />
          {avgRating ?? 'No'} Rating {reviews.length > 0 && <span className="text-muted-foreground text-lg font-normal">· {reviews.length} reviews</span>}
        </h2>

        {isReviewsLoading ? (
          <p className='text-sm text-muted-foreground'>Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className='text-muted-foreground'>No reviews yet. Be the first to review!</p>
        ) : (
          <div className='grid sm:grid-cols-2 gap-6'>
            {reviews.map((review) => (
              <div key={review._id} className='space-y-4 p-5 rounded-xl border border-border/50 bg-card'>
                <div className='flex items-center gap-3'>
                  <Image
                    src={review.customer.profileImage || '/placeholder.svg'}
                    alt={review.customer.name || 'User avatar'}
                    width={40}
                    height={40}
                    className='rounded-full object-cover'
                  />
                  <div>
                    <p className='font-medium text-sm text-foreground'>{review.customer.name}</p>
                    <p className='text-xs text-muted-foreground'>{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className='flex items-center gap-1 text-yellow-500'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <p className='text-sm text-foreground leading-relaxed line-clamp-4'>{review.review}</p>
              </div>
            ))}
          </div>
        )}
        {hasNextPage && (
          <div className='pt-4'>
            <Button variant='outline' disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? 'Loading…' : 'Show more reviews'}
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
