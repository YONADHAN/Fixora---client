import { axiosInstance } from '@/api/interceptor'
import {
  CreatePaymentIntentResponseDTO,
  GetPaymentHistoryResponseDTO,
} from '@/dtos/payment_dto'
import { CUSTOMER_ROUTES } from '@/utils/constants/api.routes'

export const createPaymentIntent = async (
  holdId: string
): Promise<CreatePaymentIntentResponseDTO> => {
  const response = await axiosInstance.post(
    `${CUSTOMER_ROUTES.CREATE_PAYMENT_INTEND}/${holdId}/payment-intent`
  )
  return response.data.data
}

export const getPayments = async (
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<GetPaymentHistoryResponseDTO> => {
  const response = await axiosInstance.get(CUSTOMER_ROUTES.GET_PAYMENTS, {
    params: { page, limit, search },
  })
  return response.data.data
}
