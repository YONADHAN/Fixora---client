import { RequestCreateServiceDTO } from '@/dtos/service_dto'
import { createService } from '@/services/service/service.service'
import { useMutation } from '@tanstack/react-query'

export const useCreateService = () => {
  return useMutation({
    mutationFn: (payload: FormData) => createService(payload),
  })
}
