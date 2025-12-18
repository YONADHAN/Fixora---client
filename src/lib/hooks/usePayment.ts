import { useMutation } from '@tanstack/react-query'
import { createPaymentIntent } from '@/services/payment/payment.service'
import { CreatePaymentIntentResponseDTO } from '@/dtos/payment_dto'

export const useCreatePaymentIntent = () => {
  return useMutation<CreatePaymentIntentResponseDTO, Error, string>({
    mutationFn: (holdId: string) => createPaymentIntent(holdId),
  })
}
