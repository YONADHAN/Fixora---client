import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RatingStars } from './RatingStars'
import { IBookedServiceReviewData } from '@/services/review_rating/review_rating.service'
import { useReviewRating } from '@/lib/hooks/useReviewRating'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  service: IBookedServiceReviewData | null
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const { createReview, editReview, isCreating, isEditing } = useReviewRating()

  useEffect(() => {
    if (service) {
      setRating(service.rating || 0)
      setReview(service.review || '')
    } else {
      setRating(0)
      setReview('')
    }
  }, [service, isOpen])

  const handleSubmit = () => {
    if (!service) return

    if (service.isReviewed && service.ratingReviewId) {
      editReview(
        {
          ratingsReviewId: service.ratingReviewId,
          rating,
          review,
        },
        {
          onSuccess: () => {
            onClose()
          },
        },
      )
    } else {
      createReview(
        {
          serviceId: service.serviceId,
          rating,
          review,
        },
        {
          onSuccess: () => {
            onClose()
          },
        },
      )
    }
  }

  const isLoading = isCreating || isEditing

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {service?.isReviewed ? 'Edit Review' : 'Rate & Review'}
          </DialogTitle>
          <DialogDescription>
            Share your experience with {service?.serviceName}
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium'>Rating</span>
            <RatingStars
              rating={rating}
              onChange={setRating}
              interactive={true}
              size={32}
              className='justify-center'
            />
            {rating === 0 && (
              <span className='text-xs text-red-500 text-center'>
                Please select a rating
              </span>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium'>Review (Optional)</span>
            <Textarea
              placeholder='Write your review here...'
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className='min-h-[100px]'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0 || isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
