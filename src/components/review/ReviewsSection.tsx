import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Star, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { reviewService } from '@/services/review/review.service'
import { IReview } from '@/types/review/review.type'
import { toast } from 'sonner'
import Link from 'next/link'

interface ReviewsSectionProps {
    serviceId: string
}

export function ReviewsSection({ serviceId }: ReviewsSectionProps) {
    const customer = useSelector((state: RootState) => state.customer.customer)
    const isLoggedIn = !!customer

    const [reviews, setReviews] = useState<IReview[]>([])
    const [avgRating, setAvgRating] = useState(0)
    const [totalRatings, setTotalRatings] = useState(0)
    const [loading, setLoading] = useState(true)

    const [canReview, setCanReview] = useState(false)
    const [eligibilityMessage, setEligibilityMessage] = useState('')
    const [checkingEligibility, setCheckingEligibility] = useState(false)

    // Form State
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const fetchReviews = async () => {
        try {
            const data = await reviewService.getServiceReviews(serviceId)
            setReviews(data.reviews)
            setAvgRating(data.avgRating)
            setTotalRatings(data.totalRatings)
        } catch (error) {
            console.error('Failed to fetch reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const [bookingId, setBookingId] = useState<string | null>(null)

    const checkEligibility = async () => {
        if (!customer) return
        setCheckingEligibility(true)
        try {
            const res = await reviewService.checkEligibility(serviceId)
            setCanReview(res.canReview)
            if (res.canReview && res.bookingId) {
                setBookingId(res.bookingId)
            }
            if (!res.canReview) {
                setEligibilityMessage(res.message || 'You cannot review this service.')
            }
        } catch (error: any) {
            console.error('Failed to check eligibility:', error)
            setCanReview(false)
            setEligibilityMessage(error.response?.data?.message || 'Failed to check eligibility.')
        } finally {
            setCheckingEligibility(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [serviceId])

    useEffect(() => {
        if (isLoggedIn) {
            checkEligibility()
        }
    }, [serviceId, isLoggedIn])

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }
        if (!comment.trim()) {
            toast.error('Please write a comment')
            return
        }
        if (!bookingId) {
            toast.error('Booking ID not found. Something went wrong.')
            return
        }

        setSubmitting(true)
        try {
            await reviewService.createReview({
                serviceId,
                bookingId,
                rating,
                comment
            })
            toast.success('Review submitted successfully!')
            setRating(0)
            setComment('')
            setCanReview(false) // Hide form after success
            fetchReviews() // Refresh reviews
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit review')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Reviews & Ratings</h2>

            {/* Stats */}
            <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-yellow-500">{avgRating}</div>
                <div className="space-y-1">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={20} className={star <= Math.round(avgRating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500">{totalRatings} ratings</p>
                </div>
            </div>

            {/* Review Form / Eligibility Message */}
            <div className="bg-muted/30 p-6 rounded-xl border">
                {!isLoggedIn ? (
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">Please login to write a review</p>
                        <Link href="/auth/login"><Button variant="outline">Login</Button></Link>
                    </div>
                ) : checkingEligibility ? (
                    <p className="text-sm text-gray-500">Checking eligibility...</p>
                ) : canReview ? (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Write a Review</h3>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setRating(star)} type="button">
                                    <Star size={24} className={star <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                                </button>
                            ))}
                        </div>
                        <Textarea
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p>{eligibilityMessage}</p>
                    </div>
                )}
            </div>

            {/* Review List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.reviewId} className="border-b pb-6 last:border-0">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                                    {review.customerImage ? (
                                        <img src={review.customerImage} alt={review.customerName} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} className="text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{review.customerName || 'Customer'}</p>
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="fill-yellow-500 text-yellow-500" />
                                        <span className="text-xs font-bold">{review.rating}</span>
                                        <span className="text-xs text-gray-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm mt-2">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
