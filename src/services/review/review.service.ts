import { axiosInstance } from '@/api/interceptor'
import {
    CreateReviewPayload,
    ReviewEligibilityResponse,
    ServiceReviewsResponse,
    IReview,
} from '../../types/review/review.type'
import { CUSTOMER_ROUTES } from '@/utils/constants/api.routes'

export const reviewService = {
    createReview: async (data: CreateReviewPayload): Promise<IReview> => {
        const response = await axiosInstance.post(`${CUSTOMER_ROUTES.REVIEWS}/reviews`, data)
        return response.data.data
    },

    getServiceReviews: async (
        serviceId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<ServiceReviewsResponse> => {
        const response = await axiosInstance.get(
            `${CUSTOMER_ROUTES.REVIEWS}/services/${serviceId}/reviews?page=${page}&limit=${limit}`
        )
        return response.data.data
    },

    checkEligibility: async (
        serviceId: string
    ): Promise<ReviewEligibilityResponse> => {
        const response = await axiosInstance.get(
            `${CUSTOMER_ROUTES.REVIEWS}/reviews/eligibility/${serviceId}`
        )
        return response.data.data
    },
}
