import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import {
  GetRatingAndReviewForServiceResponseDTO,
  ReviewRatingService,
} from '../../services/review_rating/review_rating.service'
import {
  ICreateReviewRequest,
  IEditReviewRequest,
  IDeleteReviewRequest,
  IGetBookedServicesResponse,
  IGetBookedServicesApiResponse,
} from '../../services/review_rating/review_rating.service'
import { toast } from 'sonner'

export const useReviewRating = (page: number = 1) => {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading: isServicesLoading,
    error: servicesError,
  } = useQuery<
    AxiosResponse<IGetBookedServicesApiResponse>,
    Error,
    IGetBookedServicesResponse
  >({
    queryKey: ['booked-services', page],
    queryFn: () => ReviewRatingService.getBookedServices({ page }),
    select: (response) => response.data.data,
  })

  const createReviewMutation = useMutation({
    mutationFn: (payload: ICreateReviewRequest) =>
      ReviewRatingService.createReview(payload),
    onSuccess: () => {
      toast.success('Review added successfully')
      queryClient.invalidateQueries({ queryKey: ['booked-services'] })
    },
  })

  const editReviewMutation = useMutation({
    mutationFn: (payload: IEditReviewRequest) =>
      ReviewRatingService.editReview(payload),
    onSuccess: () => {
      toast.success('Review updated successfully')
      queryClient.invalidateQueries({ queryKey: ['booked-services'] })
    },
  })

  const deleteReviewMutation = useMutation({
    mutationFn: (payload: IDeleteReviewRequest) =>
      ReviewRatingService.deleteReview(payload),
    onSuccess: () => {
      toast.success('Review deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['booked-services'] })
    },
  })

  return {
    bookedServices: data,
    isServicesLoading,
    servicesError,
    createReview: createReviewMutation.mutate,
    editReview: editReviewMutation.mutate,
    deleteReview: deleteReviewMutation.mutate,
    isCreating: createReviewMutation.isPending,
    isEditing: editReviewMutation.isPending,
    isDeleting: deleteReviewMutation.isPending,
  }
}

export const useServiceReviews = (serviceId: string, limit: number = 5) => {
  return useInfiniteQuery<
    GetRatingAndReviewForServiceResponseDTO,
    Error,
    GetRatingAndReviewForServiceResponseDTO,
    ['service-reviews', string],
    string | null
  >({
    queryKey: ['service-reviews', serviceId],
    queryFn: async ({ pageParam }) => {
      const res = await ReviewRatingService.getReviewsForService({
        serviceId,
        limit,
        cursor: pageParam ?? undefined,
      })

      return res.data.data
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor
    },
    enabled: !!serviceId,
  })
}
