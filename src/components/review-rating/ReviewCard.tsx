import React from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RatingStars } from './RatingStars'
import { IBookedServiceReviewData } from '@/services/review_rating/review_rating.service'
import { Trash2, Edit, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useReviewRating } from '@/lib/hooks/useReviewRating'

interface ReviewCardProps {
  data: IBookedServiceReviewData
  onEdit: (data: IBookedServiceReviewData) => void
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ data, onEdit }) => {
  const { deleteReview, isDeleting } = useReviewRating()
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  const handleDelete = () => {
    if (data.ratingReviewId) {
      deleteReview(
        { ratingsReviewId: data.ratingReviewId },
        { onSuccess: () => setIsDeleteOpen(false) },
      )
    }
  }

  return (
    <Card className='flex flex-col h-full overflow-hidden transition-shadow hover:shadow-md'>
      {/* Service Image */}
      {data.mainImage && (
        <div className='relative w-full h-40'>
          <Image
            src={data.mainImage}
            alt={data.serviceName}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw,
                   (max-width: 1200px) 50vw,
                   25vw'
            priority={false}
          />
        </div>
      )}

      <CardHeader className='pb-2'>
        <CardTitle
          className='text-lg font-semibold truncate'
          title={data.serviceName}
        >
          {data.serviceName}
        </CardTitle>
      </CardHeader>

      <CardContent className='flex-1 flex flex-col gap-3'>
        {data.isReviewed ? (
          <>
            <div className='flex items-center gap-2'>
              <RatingStars rating={data.rating || 0} />
              <span className='text-sm text-muted-foreground font-medium'>
                {data.rating}.0
              </span>
            </div>

            {data.review ? (
              <p className='text-sm text-gray-600 line-clamp-3 italic'>
                &ldquo;{data.review}&rdquo;
              </p>
            ) : (
              <p className='text-sm text-gray-400 italic'>No written review</p>
            )}
          </>
        ) : (
          <div className='flex flex-col items-center justify-center flex-1 py-4 text-center text-muted-foreground'>
            <p className='text-sm mb-2'>Not reviewed yet</p>
            <RatingStars rating={0} className='opacity-50' />
          </div>
        )}
      </CardContent>

      <CardFooter className='pt-2'>
        {data.isReviewed ? (
          <div className='flex gap-2 w-full'>
            <Button
              variant='outline'
              className='flex-1 gap-2'
              onClick={() => onEdit(data)}
            >
              <Edit size={16} /> Edit
            </Button>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant='destructive' size='icon' className='shrink-0'>
                  <Trash2 size={16} />
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This will permanently delete your review for{' '}
                    <strong>{data.serviceName}</strong>.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='destructive'
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Button className='w-full gap-2' onClick={() => onEdit(data)}>
            <Plus size={16} /> Add Review
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
