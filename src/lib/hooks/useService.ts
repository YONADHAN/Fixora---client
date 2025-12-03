import {
  RequestEditServiceDTO,
  RequestGetAllServicesDTO,
  RequestGetServiceByIdDTO,
  RequestToggleBlockServiceDTO,
  ResponseEditServiceDTO,
  ResponseGetAllServicesDTO,
  ResponseGetServiceByIdDTO,
  ResponseToggleBlockServiceDTO,
} from '@/dtos/service_dto'
import {
  createService,
  editServiceById,
  getAllServices,
  getServiceById,
  toggleServiceById,
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

export const useEditServiceById = () => {
  return useMutation({
    mutationFn: ({
      serviceId,
      payload,
    }: {
      serviceId: string
      payload: RequestEditServiceDTO
    }) => editServiceById(serviceId, payload),
  })
}

export const useToggleServiceById = () => {
  return useMutation<
    ResponseToggleBlockServiceDTO,
    Error,
    RequestToggleBlockServiceDTO
  >({
    mutationFn: (payload) => toggleServiceById(payload),
  })
}
