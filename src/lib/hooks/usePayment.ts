import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query'
import { createPaymentIntent, getPayments } from '@/services/payment/payment.service'
import { CreatePaymentIntentResponseDTO, GetPaymentHistoryResponseDTO } from '@/dtos/payment_dto'

export const useCreatePaymentIntent = () => {
  return useMutation<CreatePaymentIntentResponseDTO, Error, string>({
    mutationFn: (holdId: string) => createPaymentIntent(holdId),
  })
}

export const usePaymentHistory = (
  page: number,
  limit: number,
  search: string
) => {
  return useQuery<GetPaymentHistoryResponseDTO>({
    queryKey: ['payments', page, limit, search],
    queryFn: () => getPayments(page, limit, search),
    placeholderData: keepPreviousData,
  })
}
