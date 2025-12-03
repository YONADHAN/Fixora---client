import {
  RequestGetAllServicesDTO,
  RequestGetServiceByIdDTO,
  ResponseGetAllServicesDTO,
  ResponseGetServiceByIdDTO,
} from '@/dtos/service_dto'
import {
  createService,
  getAllServices,
  getServiceById,
} from '@/services/service/service.service'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateService = () => {
  return useMutation({
    mutationFn: (payload: FormData) => createService(payload),
  })
}

export const useGetAllServices = (payload: RequestGetAllServicesDTO) => {
  return useQuery<ResponseGetAllServicesDTO>({
    queryKey: ['getAllServices', payload],
    queryFn: () => getAllServices(payload),
  })
}

export const useGetServicesById = (payload: RequestGetServiceByIdDTO) => {
  return useQuery<ResponseGetServiceByIdDTO>({
    queryKey: ['getServiceById', payload],
    queryFn: () => getServiceById(payload),
  })
}
