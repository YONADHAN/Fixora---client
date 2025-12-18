import { axiosInstance } from '@/api/interceptor'
import { CreatePaymentIntentResponseDTO } from '@/dtos/payment_dto'
import { CUSTOMER_ROUTES } from '@/utils/constants/api.routes'

export const createPaymentIntent = async (
  holdId: string
): Promise<CreatePaymentIntentResponseDTO> => {
  const response = await axiosInstance.post(
    `${CUSTOMER_ROUTES.CREATE_PAYMENT_INTEND}/${holdId}/payment-intent`
  )
  return response.data.data
}
