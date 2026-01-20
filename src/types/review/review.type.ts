export interface IReview {
    reviewId: string
    bookingId: string
    serviceId: string
    customerId: string
    vendorId: string
    rating: number
    comment: string
    createdAt: string
    customerName?: string
    customerImage?: string
}

export interface CreateReviewPayload {
    serviceId: string
    bookingId: string
    rating: number
    comment: string
}

export interface ReviewEligibilityResponse {
    canReview: boolean
    message?: string
    bookingId?: string
}

export interface ServiceReviewsResponse {
    avgRating: number
    totalRatings: number
    reviews: IReview[]
    currentPage: number
    totalPages: number
}
