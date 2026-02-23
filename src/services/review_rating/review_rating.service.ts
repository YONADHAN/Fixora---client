import { axiosInstance } from '@/api/interceptor'
import { CUSTOMER_ROUTES } from '@/utils/constants/api.routes'

export interface IBookedServiceReviewData {
  serviceRef: string
  serviceId: string
  serviceName: string
  mainImage: string
  isReviewed: boolean
  rating?: number
  review?: string
  ratingReviewId?: string
}

export interface IGetBookedServicesResponse {
  data: IBookedServiceReviewData[]
  currentPage: number
  totalPages: number
}

export interface IGetBookedServicesApiResponse {
  message: string
  data: IGetBookedServicesResponse
}

export interface ICreateReviewRequest {
  serviceId: string
  rating: number
  review?: string
}

export interface IEditReviewRequest {
  ratingsReviewId: string
  rating: number
  review?: string
}

export interface IDeleteReviewRequest {
  ratingsReviewId: string
}

export interface ReviewWithUserDTO {
  _id: string
  rating: number
  review: string
  serviceRef: string
  customer: {
    name?: string
    profileImage?: string
  }
  createdAt: Date
}

export interface GetRatingAndReviewForServiceResponseDTO {
  ratingsReviews: ReviewWithUserDTO[]
  nextCursor: string | null
}

export interface GetRatingAndReviewForServiceApiResponse {
  message: string
  data: GetRatingAndReviewForServiceResponseDTO
}

export const ReviewRatingService = {
  getBookedServices: (
    params: {
      page?: number
      limit?: number
      search?: string
      sortBy?: 'createdAt' | 'serviceName'
      sortOrder?: 'asc' | 'desc'
    } = {},
  ) =>
    axiosInstance.get<IGetBookedServicesApiResponse>(
      CUSTOMER_ROUTES.BOOKED_REVIEWS,
      {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          search: params.search,
          sortBy: params.sortBy ?? 'createdAt',
          sortOrder: params.sortOrder ?? 'desc',
        },
      },
    ),

  createReview: (payload: ICreateReviewRequest) =>
    axiosInstance.post(CUSTOMER_ROUTES.REVIEWS, payload),

  editReview: (payload: IEditReviewRequest) =>
    axiosInstance.patch(CUSTOMER_ROUTES.REVIEWS, payload),

  deleteReview: (payload: IDeleteReviewRequest) =>
    axiosInstance.delete(CUSTOMER_ROUTES.REVIEWS, {
      data: payload,
    }),

  getReviewsForService: (params: {
    serviceId: string
    limit?: number
    cursor?: string
  }) =>
    axiosInstance.get<GetRatingAndReviewForServiceApiResponse>(
      CUSTOMER_ROUTES.REVIEWS,
      {
        params: {
          serviceId: params.serviceId,
          limit: params.limit ?? 5,
          cursor: params.cursor,
        },
      },
    ),
}
